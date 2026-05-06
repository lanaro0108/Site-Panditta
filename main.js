/* =============================================
   PANDITTA STORE — main.js
============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------
     1. MOBILE NAV TOGGLE (Drawer + Overlay)
  ------------------------------------------ */
  const toggle   = document.getElementById('navToggle');
  const navList  = document.getElementById('navLinks');
  const overlay  = document.getElementById('navOverlay');

  function openNav() {
    navList.classList.add('open');
    overlay.classList.add('visible');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    navList.classList.remove('open');
    overlay.classList.remove('visible');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = navList.classList.contains('open');
    isOpen ? closeNav() : openNav();
  });

  overlay.addEventListener('click', closeNav);

  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close with Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navList.classList.contains('open')) closeNav();
  });


  /* ------------------------------------------
     2. HEADER SHADOW ON SCROLL
  ------------------------------------------ */
  const header = document.querySelector('header');

  const handleHeaderScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });


  /* ------------------------------------------
     3. SCROLL PROGRESS BAR
  ------------------------------------------ */
  const progressBar = document.getElementById('scroll-progress');

  const updateProgress = () => {
    const scrollTop   = window.scrollY;
    const docHeight   = document.documentElement.scrollHeight - window.innerHeight;
    const pct         = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${pct}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });


  /* ------------------------------------------
     4. ACTIVE NAV LINK HIGHLIGHT
  ------------------------------------------ */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  const highlightNav = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${current}`);
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav(); // run on load


  /* ------------------------------------------
     5. SCROLL REVEAL (IntersectionObserver)
  ------------------------------------------ */
  const revealEls = document.querySelectorAll('.fade-in');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Stagger siblings inside same parent
      const siblings = [...entry.target.parentElement.querySelectorAll('.fade-in')];
      const idx = siblings.indexOf(entry.target);

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 100);

      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ------------------------------------------
     6. BACK-TO-TOP BUTTON
  ------------------------------------------ */
  const backToTop = document.getElementById('back-to-top');

  const toggleBackToTop = () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  };

  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ------------------------------------------
     7. TOAST NOTIFICATION
  ------------------------------------------ */
  function showToast(message, duration = 3000) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  // Expose globally (optional)
  window.showToast = showToast;


  /* ------------------------------------------
     8. CARD LINKS — show welcome toast on first click
  ------------------------------------------ */
  let firstClick = true;
  document.querySelectorAll('.card-link').forEach(link => {
    link.addEventListener('click', () => {
      if (firstClick) {
        firstClick = false;
        showToast('Você será redirecionado ao Mercado Livre ✦');
      }
    });
  });


  /* ------------------------------------------
     9. PREFETCH LINKS ON HOVER (perf boost)
  ------------------------------------------ */
  const cardLinks = document.querySelectorAll('.card-link[href]');
  cardLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      if (!document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
        const prefetch = document.createElement('link');
        prefetch.rel  = 'prefetch';
        prefetch.href = href;
        document.head.appendChild(prefetch);
      }
    }, { once: true });
  });


  /* ------------------------------------------
     10. SMOOTH SCROLL for anchor links
  ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ------------------------------------------
     11. IMAGE LAZY LOAD fallback (native attr)
  ------------------------------------------ */
  document.querySelectorAll('img[data-src]').forEach(img => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
    observer.observe(img);
  });

});
