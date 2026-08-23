import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Queue to process git commands sequentially and avoid index.lock conflicts
let gitQueue = Promise.resolve();

function runGitCommand(commands) {
  return new Promise((resolve) => {
    gitQueue = gitQueue.then(() => {
      return new Promise((innerResolve) => {
        console.log(`[Git Sync] Running: ${commands}`);
        exec(commands, (err, stdout, stderr) => {
          if (err) {
            console.error(`[Git Sync] Error: ${err.message}`);
            innerResolve({ success: false, error: err.message, stderr });
          } else {
            console.log(`[Git Sync] Success: ${stdout}`);
            innerResolve({ success: true, stdout });
          }
        });
      });
    }).then(resolve);
  });
}

function gitSyncPlugin() {
  return {
    name: 'git-sync',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlPath = req.url.split('?')[0];

        // 1. Resume management endpoint
        if (urlPath === '/api/admin/resume' || urlPath.endsWith('/api/admin/resume')) {
          if (req.method === 'POST') {
            const assetsDir = path.resolve(__dirname, 'public/assets');
            if (!fs.existsSync(assetsDir)) {
              fs.mkdirSync(assetsDir, { recursive: true });
            }
            const filePath = path.join(assetsDir, 'resume.pdf');
            const writeStream = fs.createWriteStream(filePath);
            req.pipe(writeStream);

            writeStream.on('finish', async () => {
              try {
                // Copy to public root as fallback
                const publicRootPath = path.resolve(__dirname, 'public/resume.pdf');
                fs.copyFileSync(filePath, publicRootPath);

                // Run git commands
                const gitRes = await runGitCommand(
                  'git add public/assets/resume.pdf public/resume.pdf && git commit -m "chore: update resume" && git push origin main'
                );

                if (gitRes.success) {
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true, message: 'Resume updated and pushed to Git', stdout: gitRes.stdout }));
                } else {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: gitRes.error, stderr: gitRes.stderr }));
                }
              } catch (copyErr) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: copyErr.message }));
              }
            });

            writeStream.on('error', (err) => {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            });

          } else if (req.method === 'DELETE') {
            try {
              let fileDeleted = false;
              const p1 = path.resolve(__dirname, 'public/assets/resume.pdf');
              const p2 = path.resolve(__dirname, 'public/resume.pdf');
              if (fs.existsSync(p1)) {
                fs.unlinkSync(p1);
                fileDeleted = true;
              }
              if (fs.existsSync(p2)) {
                fs.unlinkSync(p2);
                fileDeleted = true;
              }

              if (fileDeleted) {
                const gitRes = await runGitCommand(
                  'git rm public/assets/resume.pdf public/resume.pdf && git commit -m "chore: delete resume" && git push origin main'
                );

                if (gitRes.success) {
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true, message: 'Resume deleted and pushed to Git', stdout: gitRes.stdout }));
                } else {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: gitRes.error, stderr: gitRes.stderr }));
                }
              } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'No resume file found to delete' }));
              }
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          }

        // 2. Database backup & general Git sync endpoint
        } else if (urlPath === '/api/admin/git-sync' || urlPath.endsWith('/api/admin/git-sync')) {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk.toString();
            });

            req.on('end', async () => {
              try {
                const payload = JSON.parse(body);
                const backupDir = path.resolve(__dirname, 'supabase');
                if (!fs.existsSync(backupDir)) {
                  fs.mkdirSync(backupDir, { recursive: true });
                }

                const backupPath = path.join(backupDir, 'db_backup.json');
                fs.writeFileSync(backupPath, JSON.stringify(payload.backup, null, 2));

                const commitMsg = payload.message || 'admin: update portfolio database';
                const gitRes = await runGitCommand(
                  `git add supabase/db_backup.json && git commit -m "${commitMsg.replace(/"/g, '\\"')}" && git push origin main`
                );

                if (gitRes.success) {
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true, message: 'Database state synced to Git', stdout: gitRes.stdout }));
                } else {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: gitRes.error, stderr: gitRes.stderr }));
                }
              } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
              }
            });
          } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          }
        } else {
          next();
        }
      });
    }
  };
}

// Vite plugin to copy dist/index.html to dist/404.html for GitHub Pages SPA routing
function copy404Plugin() {
  return {
    name: 'copy-404',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexPath = path.join(distDir, 'index.html');
      const path404 = path.join(distDir, '404.html');
      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, path404);
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), gitSyncPlugin(), copy404Plugin()],
  base: process.env.VITE_BASE_PATH || (process.env.GITHUB_ACTIONS ? '/Portfolio/' : '/'),
  server: {
    port: 3000,
    open: false,
  },
});

