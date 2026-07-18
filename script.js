/* ============================================
   ADITHYA PRASAD — PORTFOLIO
   Interactivity & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initCinematicLoader();
  initParticles();
  initScrollReveal();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initScrollProgress();
  initCardTilt();
  initSkillPillStagger();
  initCardStack();
});

/* ============================================
   PARTICLE CANVAS ANIMATION
   ============================================ */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let particles = [];
  let mouse = { x: null, y: null };
  let animationId;
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles();
  }

  window.addEventListener('resize', resize, { passive: true });

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.7 
        ? `rgba(100, 255, 218, ${this.opacity})` 
        : `rgba(136, 146, 176, ${this.opacity * 0.5})`;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0 && dist < 120) {
          const force = (120 - dist) / 120;
          this.x += (dx / dist) * force * 2;
          this.y += (dy / dist) * force * 2;
        }
      }

      // Wrap around edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    const density = prefersReducedMotion ? 36000 : 12000;
    const maxParticles = prefersReducedMotion ? 30 : 100;
    const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / density), maxParticles);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  resize();

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const opacity = (1 - dist / 150) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(100, 255, 218, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    connectParticles();
    animationId = requestAnimationFrame(animate);
  }

  animate();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationId);
  });
}

/* ============================================
   TYPING ANIMATION
   ============================================ */
function initTypingAnimation() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const roles = [
    'AI Engineer.',
    'ML Engineer.',
    'Full Stack Developer.',
    'Data Analyst.',
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const currentRole = roles[roleIndex];

    if (isPaused) {
      isPaused = false;
      setTimeout(type, 1500);
      return;
    }

    if (!isDeleting) {
      // Typing forward
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        isDeleting = true;
        isPaused = true;
        setTimeout(type, 50);
        return;
      }

      setTimeout(type, 60 + Math.random() * 40);
    } else {
      // Deleting
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 400);
        return;
      }

      setTimeout(type, 30 + Math.random() * 20);
    }
  }

  // Start after hero animation
  setTimeout(type, 1800);
}

/* ============================================
   SCROLL REVEAL ANIMATION
   ============================================ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optionally stop observing after reveal
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;
  let ticking = false;

  // Scroll spy — highlight active section
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveLink() {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href.substring(1) === current) {
        link.classList.add('active');
      }
    });
  }

  function handleScroll() {
    const currentScroll = window.scrollY;

    // Add scrolled class for shadow
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide/show navbar on scroll direction
    if (currentScroll > lastScroll && currentScroll > 200) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }

    lastScroll = currentScroll;
    updateActiveLink();
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  });

  // Initial state
  updateActiveLink();
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('mobile-backdrop');
  let backdropTimer;

  if (!hamburger || !mobileMenu) return;

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains('open');

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    if (backdropTimer) clearTimeout(backdropTimer);
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (backdrop) {
      backdrop.style.display = 'block';
      backdrop.setAttribute('aria-hidden', 'false');
      // Force reflow
      backdrop.offsetHeight;
      backdrop.classList.add('visible');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (backdropTimer) clearTimeout(backdropTimer);
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (backdrop) {
      backdrop.classList.remove('visible');
      backdrop.setAttribute('aria-hidden', 'true');
      backdropTimer = setTimeout(() => {
        backdrop.style.display = 'none';
      }, 400);
    }
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  // Close menu on link click
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');

      if (targetId === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.getElementById(targetId.slice(1));
      if (target) {
        const navHeight = document.getElementById('navbar')?.offsetHeight || 70;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ============================================
   STAGGERED TEXT ANIMATION (HERO)
   ============================================ */
// The hero animations are handled via CSS @keyframes
// This adds a subtle parallax to floating elements

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const hero = document.querySelector('.hero-content');
  
  if (hero && scrolled < window.innerHeight) {
    const opacity = 1 - (scrolled / (window.innerHeight * 0.8));
    const translateY = scrolled * 0.3;
    hero.style.opacity = Math.max(opacity, 0);
    hero.style.transform = `translateY(${translateY}px)`;
  }
}, { passive: true });

/* ============================================
   MATRIX LOADER WITH RAIN
   ============================================ */
function initCinematicLoader() {
  const wrap = document.getElementById('loader-wrap');
  const fill = document.getElementById('loader-line-fill');
  const canvas = document.getElementById('matrix-rain');
  if (!wrap || !fill) return;

  // ---- Matrix rain on canvas ----
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
      const fontSize = 14;
      const columns = Math.floor(canvas.width / fontSize);
      const drops = Array(columns).fill(1);

      function drawRain() {
        ctx.fillStyle = 'rgba(2, 12, 27, 0.06)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < drops.length; i++) {
          const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          // Alternate teal and purple columns
          if (i % 3 === 0) {
            ctx.fillStyle = 'rgba(100, 255, 218, 0.35)';
          } else if (i % 3 === 1) {
            ctx.fillStyle = 'rgba(123, 97, 255, 0.25)';
          } else {
            ctx.fillStyle = 'rgba(100, 255, 218, 0.15)';
          }
          ctx.font = fontSize + 'px monospace';
          ctx.fillText(char, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

      const rainInterval = setInterval(drawRain, 45);

      // Stop rain when loader goes away
      setTimeout(() => clearInterval(rainInterval), 4000);
    }
  }

  // ---- Animate progress bar ----
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 12 + 4;
    if (progress > 100) progress = 100;
    fill.style.width = progress + '%';

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        wrap.classList.add('loader-reveal');
        setTimeout(() => {
          initTextScramble();
          initTypingAnimation();
          wrap.classList.add('done');
          wrap.setAttribute('aria-hidden', 'true');
        }, 900);
      }, 500);
    }
  }, 80);
}

/* ============================================
   MATRIX TEXT SCRAMBLE
   ============================================ */
function initTextScramble() {
  const el = document.getElementById('hero-name');
  if (!el) return;

  const finalText = el.getAttribute('data-text') || 'Adithya Prasad.';
  const chars = '!@#$%^&*_+-=|;:<>?~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const totalDuration = 1600;
  const perCharDelay = totalDuration / finalText.length;

  // Start with random characters
  let currentChars = finalText.split('').map(c =>
    c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]
  );

  function render(revealed) {
    let html = '';
    for (let i = 0; i < finalText.length; i++) {
      if (finalText[i] === ' ') {
        html += '<span class="scramble-char space"> </span>';
      } else if (i < revealed) {
        html += '<span class="scramble-char">' + finalText[i] + '</span>';
      } else {
        html += '<span class="scramble-char decoding">' + currentChars[i] + '</span>';
      }
    }
    el.innerHTML = html;
  }

  let revealed = 0;
  render(0);

  // Rapidly cycle random chars
  const scrambleInterval = setInterval(() => {
    for (let i = revealed; i < finalText.length; i++) {
      if (finalText[i] !== ' ') {
        currentChars[i] = chars[Math.floor(Math.random() * chars.length)];
      }
    }
    render(revealed);
  }, 40);

  // Reveal one character at a time
  let charIndex = 0;
  const revealInterval = setInterval(() => {
    charIndex++;
    revealed = charIndex;

    if (charIndex >= finalText.length) {
      clearInterval(revealInterval);
      clearInterval(scrambleInterval);
      // Set final text as plain content and ensure it stays visible
      el.textContent = finalText;
      el.style.color = 'var(--text-heading)';
      el.style.opacity = '1';
      // Activate shimmer after a brief pause
      setTimeout(() => {
        el.classList.add('shimmer-active');
      }, 500);
    }
  }, perCharDelay);
}

/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = scrollPercent + '%';
  }, { passive: true });
}

/* ============================================
   3D CARD TILT EFFECT
   ============================================ */
function initCardTilt() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `translateY(-10px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      card.style.setProperty('--mouse-x', percentX + '%');
      card.style.setProperty('--mouse-y', percentY + '%');
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* ============================================
   SKILL PILL STAGGER ANIMATION
   ============================================ */
function initSkillPillStagger() {
  const grids = document.querySelectorAll('.skills-grid');
  if (!('IntersectionObserver' in window)) {
    grids.forEach(grid => grid.classList.add('animate-pills'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pills = entry.target.querySelectorAll('.skill-pill');
        pills.forEach((pill, i) => {
          pill.style.transitionDelay = (i * 0.06) + 's';
        });
        entry.target.classList.add('animate-pills');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  grids.forEach(grid => observer.observe(grid));
}

/* ============================================
   FLASHCARD STACK CAROUSEL
   ============================================ */
function initCardStack() {
  const cards = document.querySelectorAll('.flash-card');
  const dots = document.querySelectorAll('.card-dot');
  const prevBtn = document.getElementById('card-prev');
  const nextBtn = document.getElementById('card-next');
  if (!cards.length) return;

  let current = 0;
  const total = cards.length;
  let isAnimating = false;
  let autoTimer = null;

  function updateCards(direction) {
    if (isAnimating) return;
    isAnimating = true;

    const oldCard = cards[current];

    // Determine exit direction
    if (direction === 'next') {
      oldCard.className = 'flash-card exit-left';
    } else {
      oldCard.className = 'flash-card exit-right';
    }

    // Update current index
    if (direction === 'next') {
      current = (current + 1) % total;
    } else {
      current = (current - 1 + total) % total;
    }

    // Update all cards
    cards.forEach((card, i) => {
      if (i === current) return; // handled below
      const diff = (i - current + total) % total;
      if (diff === 1) {
        card.className = 'flash-card behind-1';
      } else if (diff === 2) {
        card.className = 'flash-card behind-2';
      } else {
        card.className = 'flash-card';
      }
    });

    // Activate new card
    cards[current].className = 'flash-card active';

    // Update dots
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });

    // Reset animation lock
    setTimeout(() => { isAnimating = false; }, 600);

    // Reset auto-advance
    resetAutoAdvance();
  }

  function goTo(index) {
    if (!Number.isInteger(index) || index < 0 || index >= total || index === current || isAnimating) return;
    const direction = index > current ? 'next' : 'prev';
    // Set current to one before target so updateCards lands on target
    current = direction === 'next' ? (index - 1 + total) % total : (index + 1) % total;
    updateCards(direction);
  }

  // Initialize stack positions
  cards.forEach((card, i) => {
    if (i === 0) {
      card.className = 'flash-card active';
    } else if (i === 1) {
      card.className = 'flash-card behind-1';
    } else if (i === 2) {
      card.className = 'flash-card behind-2';
    } else {
      card.className = 'flash-card';
    }
  });

  // Click on active card to advance
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't advance if clicking a link
      if (e.target.closest('a')) return;
      if (card.classList.contains('active')) {
        updateCards('next');
      }
    });
  });

  // Arrow buttons
  if (nextBtn) nextBtn.addEventListener('click', () => updateCards('next'));
  if (prevBtn) prevBtn.addEventListener('click', () => updateCards('prev'));

  // Dot navigation
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.getAttribute('data-dot'), 10));
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // Only if the about section is visible
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;
    const rect = aboutSection.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      updateCards('next');
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      updateCards('prev');
    }
  });

  // Auto-advance every 8 seconds
  function resetAutoAdvance() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => updateCards('next'), 8000);
  }
  resetAutoAdvance();

  // Pause auto-advance on hover
  const stackWrap = document.querySelector('.card-stack-wrap');
  if (stackWrap) {
    stackWrap.addEventListener('mouseenter', () => {
      if (autoTimer) clearInterval(autoTimer);
    });
    stackWrap.addEventListener('mouseleave', () => {
      resetAutoAdvance();
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && autoTimer) {
      clearInterval(autoTimer);
    } else if (!document.hidden) {
      resetAutoAdvance();
    }
  });
}
