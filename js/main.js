(function () {
  'use strict';

  // ===== Reduced Motion Check =====
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== Particle System =====
  function initParticles() {
    if (prefersReducedMotion) return;

    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const mouse = { x: null, y: null, radius: 120 };
    const connectionDist = 150;
    let animFrameId;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
      particles.length = 0;
      const count = window.innerWidth > 768 ? 80 : 40;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    }

    function drawParticle(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 212, 255, ' + p.opacity + ')';
      ctx.fill();
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 212, 255, ' + (0.15 * (1 - dist / connectionDist)) + ')';
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        if (mouse.x !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x += dx * force * 0.02;
            p.y += dy * force * 0.02;
          }
        }

        drawParticle(p);
      });

      drawConnections();
      animFrameId = requestAnimationFrame(animate);
    }

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', function () {
      resize();
      createParticles();
    });

    canvas.parentElement.addEventListener('mousemove', function (e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', function () {
      mouse.x = null;
      mouse.y = null;
    });
  }

  // ===== Typing Effect =====
  function initTyping() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    const texts = [
      'Multimodal LLM Researcher',
      'Video Instance Segmentation',
      '3D Vision & Generation',
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const speed = 80;
    const deleteSpeed = 40;
    const pauseDuration = 2000;

    function type() {
      const currentText = texts[textIndex];
      if (isDeleting) {
        el.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        el.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }

      var delay = isDeleting ? deleteSpeed : speed;

      if (!isDeleting && charIndex === currentText.length) {
        delay = pauseDuration;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        delay = 500;
      }

      setTimeout(type, delay);
    }

    type();
  }

  // ===== Scroll Reveal =====
  function initScrollReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll('[data-reveal]').forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(function (el, i) {
      if (el.classList.contains('project-card')) {
        el.style.transitionDelay = (i % 3) * 0.1 + 's';
      }
      observer.observe(el);
    });
  }

  // ===== Navigation =====
  function initNavigation() {
    var navbar = document.getElementById('navbar');
    var navLinks = document.querySelectorAll('.nav-links a:not(.nav-resume-btn)');
    var sections = document.querySelectorAll('section[id]');
    var navToggle = document.querySelector('.nav-toggle');
    var mobileMenu = document.querySelector('.mobile-menu');

    // Scroll background
    function handleScroll() {
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Scroll indicator
      var indicator = document.querySelector('.scroll-indicator');
      if (indicator) {
        if (window.scrollY > 200) {
          indicator.classList.add('hidden');
        } else {
          indicator.classList.remove('hidden');
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Active section tracking
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });

    // Mobile menu toggle
    if (navToggle && mobileMenu) {
      navToggle.addEventListener('click', function () {
        var isOpen = mobileMenu.classList.contains('open');
        mobileMenu.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', !isOpen);

        var svg = navToggle.querySelector('svg');
        if (isOpen) {
          svg.innerHTML = '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>';
        } else {
          svg.innerHTML = '<line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/>';
        }
      });

      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          mobileMenu.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
          var svg = navToggle.querySelector('svg');
          svg.innerHTML = '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>';
        });
      });
    }
  }

  // ===== Initialize =====
  window.addEventListener('DOMContentLoaded', function () {
    initParticles();
    initTyping();
    initScrollReveal();
    initNavigation();
  });
})();
