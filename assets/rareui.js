/**
 * RARE UI (RareUI) - Modern Animated Interactive UI Engine
 * Brings Aceternity & RareUI grade visual fidelity and micro-interactions
 */

(function(window, document) {
  'use strict';

  const RareUI = {
    init: function() {
      this.initScrollReveal();
      this.initSpotlights();
      this.initTilt();
      this.initCounters();
      this.initRipples();
      this.initHeroCanvas();
      this.initConfettiTriggers();
      this.autoUpgradeElements();
    },

    // 1. SCROLL REVEAL (IntersectionObserver)
    initScrollReveal: function() {
      const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.12
      };

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('rare-visible');
            
            // Check if element has counter
            const counterEl = entry.target.querySelector('[data-counter]') || (entry.target.hasAttribute('data-counter') ? entry.target : null);
            if (counterEl && !counterEl.classList.contains('counted')) {
              RareUI.animateCounter(counterEl);
            }
            
            // observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      // Observe all tagged reveal elements
      document.querySelectorAll('.rare-reveal, .rare-reveal-left, .rare-reveal-right, .rare-reveal-scale, .stat-card, .pillar-card, .package-card, .story-card, .bank-card-box, .channel-card, .breakdown-card, .step-card, .faq-item, .impact-stat-card').forEach((el, index) => {
        if (!el.classList.contains('rare-reveal') && !el.classList.contains('rare-reveal-left') && !el.classList.contains('rare-reveal-right') && !el.classList.contains('rare-reveal-scale')) {
          el.classList.add('rare-reveal');
          // Add subtle staggered delays
          const delayClass = `rare-delay-${((index % 4) + 1) * 100}`;
          el.classList.add(delayClass);
        }
        revealObserver.observe(el);
      });
    },

    // 2. SPOTLIGHT TRACKING (Mouse glow cursor tracking)
    initSpotlights: function() {
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      const spotlightElements = document.querySelectorAll('.rare-spotlight, .stat-card, .package-card, .pillar-card, .bank-card-box, .channel-card, .breakdown-card, .story-card, .donor-card, .impact-stat-card');
      
      spotlightElements.forEach(card => {
        card.classList.add('rare-spotlight');
        
        card.addEventListener('mousemove', function(e) {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        });
      });
    },

    // 3. 3D TILT EFFECT
    initTilt: function() {
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      const tiltCards = document.querySelectorAll('.rare-tilt, .package-card, .bank-card-box, .hero-stat-card, .donor-card');
      
      tiltCards.forEach(card => {
        card.classList.add('rare-tilt');
        
        let bounds;
        function updateBounds() {
          bounds = card.getBoundingClientRect();
        }
        
        card.addEventListener('mouseenter', updateBounds);
        
        card.addEventListener('mousemove', function(e) {
          if (!bounds) updateBounds();
          const mouseX = e.clientX;
          const mouseY = e.clientY;
          const leftX = mouseX - bounds.x;
          const topY = mouseY - bounds.y;
          const center = {
            x: leftX - bounds.width / 2,
            y: topY - bounds.height / 2
          };
          
          const maxTilt = 8; // degrees
          const tiltX = (center.y / (bounds.height / 2)) * -maxTilt;
          const tiltY = (center.x / (bounds.width / 2)) * maxTilt;
          
          card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`;
        });
        
        card.addEventListener('mouseleave', function() {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
      });
    },

    // 4. ANIMATED STAT COUNTERS
    initCounters: function() {
      const counterElements = document.querySelectorAll('.stat-number, .impact-number, .counter-val, [data-counter]');
      counterElements.forEach(el => {
        const text = el.textContent.trim();
        const match = text.match(/([^\d]*)([\d,]+)(\+?%?.*)/);
        if (match) {
          const prefix = match[1] || '';
          const num = parseInt(match[2].replace(/,/g, ''), 10);
          const suffix = match[3] || '';
          
          if (!isNaN(num) && num > 0) {
            el.setAttribute('data-target', num);
            el.setAttribute('data-prefix', prefix);
            el.setAttribute('data-suffix', suffix);
            el.setAttribute('data-counter', 'true');
            el.textContent = prefix + '0' + suffix;
          }
        }
      });
    },

    animateCounter: function(el) {
      el.classList.add('counted', 'rare-counter-active');
      const target = parseInt(el.getAttribute('data-target'), 10);
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      if (isNaN(target)) return;

      const duration = 1800; // ms
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing: easeOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = Math.floor(ease * target);
        
        el.textContent = prefix + currentVal.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = prefix + target.toLocaleString() + suffix;
        }
      }

      requestAnimationFrame(update);
    },

    // 5. BUTTON RIPPLE EFFECT
    initRipples: function() {
      const buttons = document.querySelectorAll('.nav-cta, .btn, .package-btn-action, .cta-btn-primary, .modal-submit-btn, .rare-shimmer-btn, .copy-btn, .mobile-donate-btn, .desktop-donate-btn');
      
      buttons.forEach(btn => {
        btn.classList.add('rare-ripple-container');
        btn.addEventListener('click', function(e) {
          const rect = btn.getBoundingClientRect();
          const circle = document.createElement('span');
          const diameter = Math.max(rect.width, rect.height);
          const radius = diameter / 2;
          
          circle.style.width = circle.style.height = `${diameter}px`;
          circle.style.left = `${e.clientX - rect.left - radius}px`;
          circle.style.top = `${e.clientY - rect.top - radius}px`;
          circle.classList.add('rare-ripple');
          
          const ripple = btn.querySelector('.rare-ripple');
          if (ripple) ripple.remove();
          
          btn.appendChild(circle);
          setTimeout(() => circle.remove(), 600);
        });
      });
    },

    // 6. HERO PARTICLES / AMBIENT CANVAS
    initHeroCanvas: function() {
      const hero = document.querySelector('.hero, .donate-hero, .page-header');
      if (!hero) return;

      if (!hero.querySelector('.rare-particle-canvas')) {
        const canvas = document.createElement('canvas');
        canvas.className = 'rare-particle-canvas';
        hero.style.position = 'relative';
        hero.insertBefore(canvas, hero.firstChild);

        const ctx = canvas.getContext('2d');
        let width = canvas.width = hero.offsetWidth;
        let height = canvas.height = hero.offsetHeight;

        window.addEventListener('resize', () => {
          width = canvas.width = hero.offsetWidth;
          height = canvas.height = hero.offsetHeight;
        });

        const particles = [];
        const particleCount = Math.min(Math.floor(width / 25), 35);

        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.5 + 0.2,
            color: Math.random() > 0.4 ? '16, 185, 129' : '245, 158, 11'
          });
        }

        function render() {
          ctx.clearRect(0, 0, width, height);

          particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = `rgba(${p.color}, 0.6)`;
            ctx.fill();
          });

          requestAnimationFrame(render);
        }

        render();
      }
    },

    // 7. CELEBRATION CONFETTI ENGINE
    celebrate: function(x = 0.5, y = 0.6) {
      if (window.confetti) {
        window.confetti({
          particleCount: 80,
          spread: 70,
          origin: { x: x, y: y },
          colors: ['#10b981', '#059669', '#f59e0b', '#fbbf24', '#3b82f6', '#ec4899']
        });
      } else {
        // Fallback lightweight celebration
        this.fallbackConfetti();
      }
    },

    fallbackConfetti: function() {
      const colors = ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'];
      for (let i = 0; i < 40; i++) {
        const el = document.createElement('div');
        el.style.position = 'fixed';
        el.style.zIndex = '999999';
        el.style.left = (Math.random() * 80 + 10) + 'vw';
        el.style.top = '50vh';
        el.style.width = (Math.random() * 8 + 6) + 'px';
        el.style.height = (Math.random() * 8 + 6) + 'px';
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        el.style.pointerEvents = 'none';
        el.style.transform = `rotate(${Math.random() * 360}deg)`;
        el.style.transition = 'all 1.2s cubic-bezier(0.1, 0.8, 0.3, 1)';
        document.body.appendChild(el);

        setTimeout(() => {
          el.style.top = (Math.random() * 80 + 10) + 'vh';
          el.style.opacity = '0';
          el.style.transform = `scale(1.5) rotate(${Math.random() * 720}deg)`;
        }, 20);

        setTimeout(() => el.remove(), 1300);
      }
    },

    // 8. TOAST NOTIFICATION
    toast: function(message, type = 'success') {
      let container = document.querySelector('.rare-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'rare-toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = 'rare-toast';
      toast.innerHTML = `
        <span class="rare-toast-icon">✓</span>
        <span>${message}</span>
      `;
      container.appendChild(toast);

      setTimeout(() => toast.classList.add('show'), 10);

      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
      }, 3000);
    },

    // 9. EVENT LISTENERS FOR DONATION & COPY ACTIONS
    initConfettiTriggers: function() {
      // Confetti on donate clicks
      document.querySelectorAll('.nav-cta, .cta-btn-primary, .package-btn-action, .mobile-donate-btn, .desktop-donate-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          const rect = btn.getBoundingClientRect();
          const x = (rect.left + rect.width / 2) / window.innerWidth;
          const y = (rect.top + rect.height / 2) / window.innerHeight;
          RareUI.celebrate(x, y);
        });
      });

      // Confetti + Toast on copy buttons
      document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          const rect = btn.getBoundingClientRect();
          const x = (rect.left + rect.width / 2) / window.innerWidth;
          const y = (rect.top + rect.height / 2) / window.innerHeight;
          RareUI.celebrate(x, y);
          RareUI.toast('Account details copied to clipboard! 📋');
        });
      });
    },

    // 10. AUTO UPGRADE EXISTING ELEMENTS WITH RAREUI CLASSES
    autoUpgradeElements: function() {
      // Add Shimmer to CTA buttons
      document.querySelectorAll('.nav-cta, .cta-btn-primary, .mobile-donate-btn, .desktop-donate-btn').forEach(btn => {
        btn.classList.add('rare-shimmer-btn');
      });

      // Add Aurora background effect to hero sections
      document.querySelectorAll('.hero, .donate-hero, .page-header').forEach(el => {
        el.classList.add('rare-aurora-bg');
      });
    }
  };

  // Expose RareUI globally
  window.RareUI = RareUI;

  // Auto initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => RareUI.init());
  } else {
    RareUI.init();
  }

})(window, document);
