import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { createClient } from '@supabase/supabase-js';

// Custom lightweight environment file parser
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.error('Error: .env file not found in current working directory.');
    process.exit(1);
  }
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const firstEquals = trimmed.indexOf('=');
    if (firstEquals !== -1) {
      const key = trimmed.substring(0, firstEquals).trim();
      let val = trimmed.substring(firstEquals + 1).trim();
      // Remove wrapping single or double quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      env[key] = val;
    }
  });
  return env;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('====================================================');
  console.log('   Supabase Database Restore Utility from Backup    ');
  console.log('====================================================\n');

  const env = loadEnv();
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env file.');
    rl.close();
    process.exit(1);
  }

  console.log(`Connecting to Supabase at: ${supabaseUrl}`);
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Read backup file
  const backupPath = path.resolve(process.cwd(), 'supabase', 'db_backup.json');
  if (!fs.existsSync(backupPath)) {
    console.error(`Error: Backup file not found at ${backupPath}`);
    rl.close();
    process.exit(1);
  }

  const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
  console.log('Successfully loaded local db_backup.json file.');

  // Authenticate Admin
  console.log('\n--- Admin Authentication Required ---');
  const email = process.env.ADMIN_EMAIL || await question('Enter Admin Email: ');
  const password = process.env.ADMIN_PASSWORD || await question('Enter Admin Password: ');

  if (!email || !password) {
    console.error('Error: Email and password are required.');
    rl.close();
    process.exit(1);
  }

  console.log('\nAuthenticating administrative user...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    console.error(`Authentication Failed: ${authError.message}`);
    rl.close();
    process.exit(1);
  }

  console.log(`Successfully authenticated as: ${authData.user.email}`);

  // Confirming restore action
  console.log('\n================== WARNING ==================');
  console.log('This will delete all existing data in the following tables:');
  console.log('profiles, projects, skills, experience, education, certifications, social_links');
  console.log('And overwrite them with data from your local db_backup.json.');
  console.log('=============================================');
  const confirm = process.env.AUTO_CONFIRM === 'true' 
    ? 'RESTORE' 
    : await question('\nType "RESTORE" to confirm this action: ');

  if (confirm !== 'RESTORE') {
    console.log('Action cancelled.');
    rl.close();
    process.exit(0);
  }

  try {
    // 1. Restore Profile
    console.log('\nUpdating profile...');
    if (backup.profile) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(backup.profile);
      if (profileError) throw new Error(`Profile upsert error: ${profileError.message}`);
      console.log('✓ Profile updated successfully.');
    }

    // Helper table restoration function
    const restoreTable = async (tableName, records) => {
      console.log(`Restoring table "${tableName}" (${records.length} records)...`);
      
      // Delete existing records
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all records safely
      
      if (deleteError) {
        throw new Error(`Failed to clean table ${tableName}: ${deleteError.message}`);
      }

      if (records.length > 0) {
        // Remove DB-generated fields or format if necessary
        const cleanedRecords = records.map(rec => {
          const clean = { ...rec };
          delete clean.created_at; // Allow Supabase default timestamp
          delete clean.updated_at;
          delete clean.metrics;    // Ensure compatibility with tables without metrics column
          delete clean.secondary_category; // Ensure compatibility with tables without secondary_category column
          delete clean.secondaryCategory;  // Ensure compatibility with tables without secondaryCategory column
          if (clean.id && !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(clean.id)) {
            delete clean.id; // Let Supabase auto-generate standard UUIDs
          }
          return clean;
        });

        const { error: insertError } = await supabase
          .from(tableName)
          .insert(cleanedRecords);

        if (insertError) {
          throw new Error(`Failed to insert into ${tableName}: ${insertError.message}`);
        }
      }
      console.log(`✓ Table "${tableName}" restored successfully.`);
    };

    // 2. Restore Projects
    await restoreTable('projects', backup.projects || []);

    // 3. Restore Skills
    await restoreTable('skills', backup.skills || []);

    // 4. Restore Experience
    await restoreTable('experience', backup.experience || []);

    // 5. Restore Education
    await restoreTable('education', backup.education || []);

    // 6. Restore Certifications
    await restoreTable('certifications', backup.certifications || []);

    // 7. Restore Social Links
    await restoreTable('social_links', backup.social_links || []);

    console.log('\n=============================================');
    console.log('✓ DATABASE RESTORE AND SYNC COMPLETED SUCCESSFULLY!');
    console.log('=============================================');

  } catch (err) {
    console.error(`\nRestore failed with error:\n${err.message}`);
  } finally {
    rl.close();
  }
}

main();
