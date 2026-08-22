/* ==========================================================================
   Abhay Kharat - Personal Portfolio Interactive Engine (ES Module)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Particle Canvas Background Animation ---
  initParticleCanvas();

  // --- 2. Typewriter Effect ---
  initTypewriter();

  // --- 3. Header & Navigation Logic ---
  initNavigation();

  // --- 4. Skills & Projects Category Filtering ---
  initCategoryFilters();

  // --- 5. Project Modals Data & Handler ---
  initProjectModals();

  // --- 6. Interactive Developer CLI Terminal ---
  initTerminal();

  // --- 7. Theme Accent Switcher ---
  initThemeSwitcher();

  // --- 8. Contact Form & Clipboard ---
  initContactForm();

  // --- 9. Live Clock Widget ---
  initLiveClock();
});

/* ==========================================================================
   Particle Canvas Background
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = Math.min(window.innerWidth < 768 ? 35 : 75, 90);
  const mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.size = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse collision repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= Math.cos(angle) * force * 3;
          this.y -= Math.sin(angle) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Get current primary color from computed CSS variable
    const computedAccent = getComputedStyle(document.documentElement).getPropertyValue('--primary-accent-rgb').trim() || '0, 242, 254';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / 120) * 0.25;
          ctx.strokeStyle = `rgba(${computedAccent}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   Typewriter Subtitle Animation
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const roles = [
    'Full-Stack Software Engineer',
    'Web Application Developer',
    'Cloud & Backend Architect',
    'Computer Science Student'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typeSpeed = 40;
    } else {
      target.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      typeSpeed = 2200; // Pause at full word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 400; // Pause before typing next
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ==========================================================================
   Navigation Bar & Scroll Spy
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-links');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy active nav link
    const sections = document.querySelectorAll('section');
    let currentSectionId = '';

    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (mobileToggle.querySelector('i')) {
          mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
        }
      });
    });
  }
}

/* ==========================================================================
   Category Filtering (Skills & Projects)
   ========================================================================== */
function initCategoryFilters() {
  // Skills Tab Filtering
  const skillBtns = document.querySelectorAll('#skills-tabs .tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-category');
      skillCards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Projects Filtering
  const filterBtns = document.querySelectorAll('#projects-filter .filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || (cat && cat.includes(filter))) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   Project Detail Modals
   ========================================================================== */
const projectData = {
  "1": {
    title: "AI Predictive Analytics Dashboard",
    category: "AI & Cloud Telemetry Platform",
    image: "assets/images/project-ai-analytics.jpg",
    tags: ["Node.js", "Express", "Python / PyTorch API", "Chart.js", "WebSockets"],
    overview: "A modern analytics engine monitoring real-time AI model performance, prediction accuracy, and automated system anomaly events with high frequency telemetry charts.",
    features: [
      "Real-time WebSocket streaming of latency metrics and inference throughput",
      "Interactive code panel for executing custom Python analytical models",
      "Automated anomaly detection alerts and system health status monitoring",
      "Custom dark-theme glassmorphism UI dashboard controls"
    ],
    architecture: "Node.js REST API server communicating with Python machine learning inference services, sending real-time push metrics to an HTML5/CSS3 client dashboard.",
    github: "https://github.com/iam-abhay",
    demo: "#"
  },
  "2": {
    title: "AXON Cloud Developer Gateway",
    category: "Full-Stack Microservices Workspace",
    image: "assets/images/project-dev-platform.jpg",
    tags: ["TypeScript", "Node.js", "Express", "Microservices", "Docker"],
    overview: "A developer workflow workspace featuring live deployment pipeline status, microservice node topology map, and REST API route gateway monitoring.",
    features: [
      "Visual microservice node connection graph displaying service health & latency",
      "Automated multi-stage build, test, and deploy status workflow status",
      "Integrated code editor pane with syntax highlighting",
      "API request throughput and route health indicator metrics"
    ],
    architecture: "Built with Express.js microservices architecture, Docker container management, and a high-performance modular JavaScript frontend interface.",
    github: "https://github.com/iam-abhay",
    demo: "#"
  },
  "3": {
    title: "Cyberformer 3D E-Commerce Hub",
    category: "Interactive 3D Web Store",
    image: "assets/images/project-cyber-shop.jpg",
    tags: ["WebGL", "Vanilla JS", "HTML5", "CSS3 Grid", "LocalStorage"],
    overview: "An immersive 3D web showcase for cybernetic hardware gadgets with dynamic viewport interactive controls and glowing customizer UI.",
    features: [
      "3D viewport camera rotation and interactive zoom controls",
      "Dynamic hardware color customizer and status indicator updates",
      "Interactive cart builder with persistent local state",
      "Responsive glassmorphic UI layout tailored for high-end digital storefronts"
    ],
    architecture: "WebGL canvas rendering powered by HTML5 custom data attributes and CSS Grid layouts for optimal 60fps performance across desktop & mobile.",
    github: "https://github.com/iam-abhay",
    demo: "#"
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close-btn');

  if (!modal || !modalContent) return;

  document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pId = btn.getAttribute('data-project');
      const data = projectData[pId];
      if (!data) return;

      modalContent.innerHTML = `
        <div style="margin-bottom:1.5rem;">
          <span style="color:var(--primary-accent); font-family:var(--font-code); font-size:0.85rem;">${data.category}</span>
          <h2 style="font-size:2rem; margin-top:0.4rem; margin-bottom:1rem;">${data.title}</h2>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.5rem;">
            ${data.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        </div>

        <div style="width:100%; height:320px; border-radius:var(--radius-md); overflow:hidden; margin-bottom:1.5rem; border:1px solid var(--border-color);">
          <img src="${data.image}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover;">
        </div>

        <div style="display:flex; flex-direction:column; gap:1.2rem; color:var(--text-muted); line-height:1.7;">
          <div>
            <h4 style="color:var(--text-main); font-size:1.1rem; margin-bottom:0.4rem;">Overview</h4>
            <p>${data.overview}</p>
          </div>

          <div>
            <h4 style="color:var(--text-main); font-size:1.1rem; margin-bottom:0.4rem;">Key Highlights & Features</h4>
            <ul style="padding-left:1.2rem;">
              ${data.features.map(f => `<li style="margin-bottom:0.3rem;">${f}</li>`).join('')}
            </ul>
          </div>

          <div>
            <h4 style="color:var(--text-main); font-size:1.1rem; margin-bottom:0.4rem;">Architecture & Tech Stack</h4>
            <p>${data.architecture}</p>
          </div>

          <div style="display:flex; gap:1rem; margin-top:1rem;">
            <a href="${data.github}" target="_blank" rel="noopener" class="btn btn-primary">
              <i class="fa-brands fa-github"></i> View GitHub Repository
            </a>
            <button class="btn btn-secondary" onclick="document.getElementById('project-modal').classList.remove('open')">Close</button>
          </div>
        </div>
      `;

      modal.classList.add('open');
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => modal.classList.remove('open'));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });
}

/* ==========================================================================
   Interactive Developer CLI Terminal
   ========================================================================== */
function initTerminal() {
  const terminalModal = document.getElementById('terminal-modal');
  const triggerBtn = document.getElementById('terminal-trigger');
  const heroTriggerBtn = document.getElementById('hero-terminal-btn');
  const closeBtn = document.getElementById('terminal-close-btn');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');

  if (!terminalModal || !input || !output) return;

  function openTerminal() {
    terminalModal.classList.add('open');
    setTimeout(() => input.focus(), 200);
  }

  function closeTerminal() {
    terminalModal.classList.remove('open');
  }

  if (triggerBtn) triggerBtn.addEventListener('click', openTerminal);
  if (heroTriggerBtn) heroTriggerBtn.addEventListener('click', openTerminal);
  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);

  terminalModal.addEventListener('click', (e) => {
    if (e.target === terminalModal) closeTerminal();
  });

  const commands = {
    help: `Available commands:<br>
      - <span style="color:#00f2fe">about</span>: Display Abhay's bio & background<br>
      - <span style="color:#00f2fe">skills</span>: List technical skills matrix<br>
      - <span style="color:#00f2fe">projects</span>: Show featured project portfolio<br>
      - <span style="color:#00f2fe">contact</span>: Show email & social links<br>
      - <span style="color:#00f2fe">theme &lt;cyan|violet|emerald|amber&gt;</span>: Change UI accent theme<br>
      - <span style="color:#00f2fe">clear</span>: Clear terminal console<br>
      - <span style="color:#00f2fe">whoami</span>: Display current user details<br>
      - <span style="color:#00f2fe">time</span>: View current local time<br>
      - <span style="color:#00f2fe">exit</span>: Close terminal window`,
    
    about: `<b>Abhay Kharat</b> - Full-Stack Software Engineer<br>
      Pursuing B.Tech in Computer Engineering.<br>
      Specializing in modern web applications, scalable backend microservices, and interactive UI systems.`,
    
    skills: `<b>Technical Ecosystem:</b><br>
      [Frontend] HTML5, CSS3/Grid, JavaScript ES6+, React.js<br>
      [Backend]  Node.js, Express.js, Python, REST APIs<br>
      [Databases] MongoDB, PostgreSQL, SQL, Redis<br>
      [DevOps]   Git, GitHub, Docker, Linux, Shell`,
    
    projects: `<b>Featured Software Projects:</b><br>
      1. AI Predictive Analytics Dashboard [Node.js, WebSockets, Python]<br>
      2. AXON Cloud Developer Gateway [TypeScript, Express API, Docker]<br>
      3. Cyberformer 3D E-Commerce Hub [WebGL, HTML5, Vanilla JS]`,
    
    contact: `<b>Get In Touch:</b><br>
      Email: <a href="mailto:iamabhaykharat@gmail.com" style="color:#00f2fe;">iamabhaykharat@gmail.com</a><br>
      GitHub: <a href="https://github.com/iam-abhay" target="_blank" style="color:#00f2fe;">https://github.com/iam-abhay</a>`,
    
    whoami: `guest@abhay-portfolio-terminal`,
    
    time: () => `Current local time: ${new Date().toLocaleString()}`
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const rawInput = input.value.trim();
      input.value = '';

      if (!rawInput) return;

      const printLine = (text) => {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = text;
        output.appendChild(line);
        output.parentElement.scrollTop = output.parentElement.scrollHeight;
      };

      printLine(`<span class="terminal-prompt">abhay@portfolio:~$</span> ${escapeHTML(rawInput)}`);

      const parts = rawInput.toLowerCase().split(' ');
      const cmd = parts[0];
      const arg = parts[1];

      if (cmd === 'clear') {
        output.innerHTML = '';
        return;
      }

      if (cmd === 'exit') {
        closeTerminal();
        return;
      }

      if (cmd === 'theme') {
        if (['cyan', 'violet', 'emerald', 'amber'].includes(arg)) {
          document.documentElement.setAttribute('data-theme', arg);
          printLine(`<span style="color:#10b981;">Theme updated to '${arg}' accent.</span>`);
        } else {
          printLine(`<span style="color:#ef4444;">Usage: theme &lt;cyan|violet|emerald|amber&gt;</span>`);
        }
        return;
      }

      if (commands[cmd]) {
        const res = typeof commands[cmd] === 'function' ? commands[cmd]() : commands[cmd];
        printLine(res);
      } else {
        printLine(`<span style="color:#ef4444;">Command not found: '${escapeHTML(cmd)}'. Type 'help' for command list.</span>`);
      }
    }
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/* ==========================================================================
   Theme Accent Switcher
   ========================================================================== */
function initThemeSwitcher() {
  const themeOpts = document.querySelectorAll('.theme-opt');

  themeOpts.forEach(opt => {
    opt.addEventListener('click', () => {
      const theme = opt.getAttribute('data-set-theme');
      if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const dropdown = document.getElementById('theme-dropdown');
        if (dropdown) dropdown.classList.remove('open');
      }
    });
  });
}

/* ==========================================================================
   Contact Form & Clipboard Actions
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusToast = document.getElementById('form-status');
  const copyBtn = document.getElementById('copy-email-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;

      if (statusToast) {
        statusToast.style.display = 'flex';
        statusToast.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you ${escapeHTML(name)}! Opening your mail client...`;
      }

      // Trigger Mailto link with pre-filled content
      const mailtoUrl = `mailto:iamabhaykharat@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
      
      setTimeout(() => {
        window.location.href = mailtoUrl;
        form.reset();
      }, 1000);
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('iamabhaykharat@gmail.com').then(() => {
        const icon = copyBtn.querySelector('i');
        icon.className = 'fa-solid fa-check';
        icon.style.color = '#10b981';
        setTimeout(() => {
          icon.className = 'fa-regular fa-copy';
          icon.style.color = '';
        }, 2000);
      });
    });
  }
}

/* ==========================================================================
   Footer Live Clock Widget
   ========================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `TIME ${hrs}:${mins}:${secs}`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}
