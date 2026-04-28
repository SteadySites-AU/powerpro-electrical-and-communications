/* ============================================================
   VOLT ELECTRICAL SERVICES — MAIN JAVASCRIPT
   Mobile Nav · Scroll Effects · Project Filter · Form Validation
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. MOBILE NAV ──────────────────────────────────────── */
  const header    = document.querySelector('.header');
  const toggle    = document.querySelector('.nav__toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile nav on link click
    mobileNav.querySelectorAll('.mobile-nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }


  /* ── 2. HEADER SCROLL EFFECT ────────────────────────────── */
  if (header) {
    function onScroll() {
      if (window.scrollY > 60) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Run on load
  }


  /* ── 3. ACTIVE NAV LINK ─────────────────────────────────── */
  (function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link, .mobile-nav__link').forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPage = href.split('/').pop();
      const isHome = (currentPage === '' || currentPage === 'index.html') && (linkPage === 'index.html' || linkPage === '');
      const isMatch = linkPage === currentPage;
      if (isHome || isMatch) {
        link.classList.add('active');
      }
    });
  })();


  /* ── 4. PROJECT FILTER ──────────────────────────────────── */
  const filterBar      = document.querySelector('.filter-bar');
  const projectCards   = document.querySelectorAll('.project-card');

  if (filterBar && projectCards.length) {
    filterBar.addEventListener('click', function (e) {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      // Update active button
      filterBar.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(function (card) {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else {
          const category = card.dataset.category;
          if (category === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        }
      });
    });
  }


  /* ── 5. CONTACT FORM VALIDATION ─────────────────────────── */
  const contactForm = document.querySelector('.js-contact-form');

  if (contactForm) {
    const inputs = contactForm.querySelectorAll('[data-required]');

    function validateField(field) {
      const errorEl = document.getElementById(field.id + '-error');
      let valid = true;

      if (field.value.trim() === '') {
        valid = false;
        field.classList.add('error');
        if (errorEl) {
          errorEl.textContent = 'This field is required.';
          errorEl.classList.add('visible');
        }
      } else if (field.type === 'email') {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(field.value.trim())) {
          valid = false;
          field.classList.add('error');
          if (errorEl) {
            errorEl.textContent = 'Please enter a valid email address.';
            errorEl.classList.add('visible');
          }
        }
      } else if (field.type === 'tel') {
        const phoneRe = /^[\d\s\+\-\(\)]{7,20}$/;
        if (!phoneRe.test(field.value.trim())) {
          valid = false;
          field.classList.add('error');
          if (errorEl) {
            errorEl.textContent = 'Please enter a valid phone number.';
            errorEl.classList.add('visible');
          }
        }
      }

      if (valid) {
        field.classList.remove('error');
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.classList.remove('visible');
        }
      }

      return valid;
    }

    // Live validation on blur
    inputs.forEach(function (field) {
      field.addEventListener('blur', function () {
        validateField(field);
      });
      field.addEventListener('input', function () {
        if (field.classList.contains('error')) {
          validateField(field);
        }
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let allValid = true;
      inputs.forEach(function (field) {
        if (!validateField(field)) {
          allValid = false;
        }
      });

      if (!allValid) {
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
          firstError.focus();
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Build WhatsApp message from form fields
      var firstName = (contactForm.querySelector('#first-name').value || '').trim();
      var lastName  = (contactForm.querySelector('#last-name').value  || '').trim();
      var email     = (contactForm.querySelector('#email').value      || '').trim();
      var userPhone = (contactForm.querySelector('#phone').value      || '').trim();
      var service   = (contactForm.querySelector('#service').value    || '').trim();
      var message   = (contactForm.querySelector('#message').value    || '').trim();

      var text = [
        'Hi! I found you through your website and would like to enquire.',
        '',
        'Name: '    + firstName + ' ' + lastName,
        'Email: '   + email,
        'Phone: '   + userPhone,
        'Service: ' + service,
        'Message: ' + message
      ].join('\n');

      // Read business phone from page and strip to digits only
      var phoneEl = document.getElementById('contact-phone');
      var waNumber = phoneEl ? phoneEl.textContent.replace(/[^\d+]/g, '') : '';

      // Show success state
      var successEl = contactForm.querySelector('.form-success');
      var submitBtn = contactForm.querySelector('.form-submit');
      if (successEl) successEl.style.display = 'flex';
      if (submitBtn) submitBtn.style.display  = 'none';

      // Open WhatsApp in a new tab
      window.open(
        'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(text),
        '_blank',
        'noopener,noreferrer'
      );
    });
  }


  /* ── 6. SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });


  /* ── 7. ANIMATE ON SCROLL (simple fade-in) ───────────────── */
  if ('IntersectionObserver' in window) {
    const style = document.createElement('style');
    style.textContent = [
      '.anim { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease, transform 0.5s ease; }',
      '.anim.visible { opacity: 1; transform: none; }'
    ].join('');
    document.head.appendChild(style);

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.icon-card, .card, .project-card, .value-card, .benefit-card, .job-listing, .testimonial, .stat-block').forEach(function (el) {
      el.classList.add('anim');
      observer.observe(el);
    });
  }

})();
