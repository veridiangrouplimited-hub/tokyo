/* ============================================================
   NIGERIAN MISSION ABROAD — MAIN JAVASCRIPT
   Version: 1.0 | Embassy of Nigeria
   ============================================================ */

'use strict';

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initNavSearch();
  initDropdowns();
  initSearch();
  initFAQ();
  initTabs();
  initBackToTop();
  initCookieBanner();
  initAlertDismiss();
  initFormValidation();
  initActiveNav();
  initLangSwitch();
  initStickyHeader();
  initCounters();
  initSearchModal();
  initPrintFriendly();
});

/* ── MOBILE NAVIGATION ── */
function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const nav    = document.getElementById('mainNav') || document.querySelector('.nav-bar, .main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
    document.body.style.overflow = expanded ? '' : 'hidden';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
      document.body.style.overflow = '';
    }
  });
}

/* ── NAV SEARCH PANEL ── */
function initNavSearch() {
  const btn   = document.getElementById('navSearchToggle');
  const panel = document.getElementById('navSearchPanel');
  const nav   = document.getElementById('mainNav');
  if (!btn || !panel) return;

  // Set CSS variable for fixed-position search panel top offset
  function syncNavSearchPos() {
    if (nav) {
      const h = nav.getBoundingClientRect().bottom;
      document.documentElement.style.setProperty('--nav-search-top', h + 'px');
    }
  }
  syncNavSearchPos();
  window.addEventListener('scroll', syncNavSearchPos, { passive: true });
  window.addEventListener('resize', syncNavSearchPos, { passive: true });

  btn.addEventListener('click', () => {
    syncNavSearchPos();
    const open = panel.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    if (open) {
      const input = panel.querySelector('input');
      if (input) setTimeout(() => input.focus(), 80);
    }
  });

  const searchBtn = panel.querySelector('button');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const q = panel.querySelector('input')?.value?.trim();
      if (q) alert(`Search: "${q}"\n(Connect to CMS search endpoint)`);
    });
  }

  document.addEventListener('click', e => {
    if (panel.classList.contains('open') && !panel.contains(e.target) && !btn.contains(e.target)) {
      panel.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      panel.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      panel.setAttribute('aria-hidden', 'true');
      btn.focus();
    }
  });
}

/* ── DROPDOWNS (keyboard + click on mobile) ── */
function initDropdowns() {
  const items = document.querySelectorAll('.nav-item');

  // Flip a dropdown to hug the right edge of its trigger if it would
  // otherwise overflow past the viewport edge (causes horizontal scroll).
  function positionDropdown(item) {
    const drop = item.querySelector('.dropdown');
    if (!drop) return;
    drop.classList.remove('dropdown--right');
    const rect = item.getBoundingClientRect();
    const dropWidth = drop.offsetWidth || 240;
    if (rect.left + dropWidth > window.innerWidth - 8) {
      drop.classList.add('dropdown--right');
    }
  }

  items.forEach(item => {
    const link = item.querySelector('.nav-link');
    const drop = item.querySelector('.dropdown');
    if (!drop) return;

    item.addEventListener('mouseenter', () => positionDropdown(item));

    // Toggle on click for mobile / touch
    link.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const open = item.classList.contains('open');
        // Close siblings
        items.forEach(i => i.classList.remove('open'));
        if (!open) item.classList.add('open');
      } else {
        positionDropdown(item);
      }
    });

    // Keyboard: open dropdown with Enter/Space
    link.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.classList.toggle('open');
        positionDropdown(item);
      }
      if (e.key === 'Escape') {
        item.classList.remove('open');
        link.focus();
      }
    });

    // Focus trap within dropdown
    const dropLinks = drop.querySelectorAll('a');
    dropLinks.forEach((dl, i) => {
      dl.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); dropLinks[Math.min(i + 1, dropLinks.length - 1)].focus(); }
        if (e.key === 'ArrowUp')   { e.preventDefault(); if (i === 0) { link.focus(); item.classList.remove('open'); } else dropLinks[i - 1].focus(); }
        if (e.key === 'Escape')    { item.classList.remove('open'); link.focus(); }
        if (e.key === 'Tab' && i === dropLinks.length - 1) { item.classList.remove('open'); }
      });
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    items.forEach(item => {
      if (!item.contains(e.target)) item.classList.remove('open');
    });
  });

  // Re-check alignment on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => items.forEach(positionDropdown), 120);
  });
}

/* ── SEARCH (inline header) ── */
function initSearch() {
  const form = document.querySelector('.header-search-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = form.querySelector('input').value.trim();
    if (q) {
      // In production, replace with real search endpoint
      alert(`Search for: "${q}"\n(Connect to your CMS search endpoint)`);
    }
  });
}

/* ── SEARCH MODAL ── */
function initSearchModal() {
  const openBtn  = document.querySelector('[data-search-open]');
  const modal    = document.getElementById('searchModal');
  const closeBtn = document.querySelector('[data-search-close]');
  const input    = modal ? modal.querySelector('.modal-search-input') : null;
  if (!openBtn || !modal) return;

  openBtn.addEventListener('click', () => {
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    if (input) input.focus();
  });

  const close = () => {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('open');
    openBtn.focus();
  };

  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
}

/* ── FAQ ACCORDION ── */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const answerId = btn.getAttribute('aria-controls');
      const answer   = document.getElementById(answerId);

      // Close all in same list
      const list = btn.closest('.faq-list');
      list.querySelectorAll('.faq-question').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        const a = document.getElementById(b.getAttribute('aria-controls'));
        if (a) a.classList.remove('open');
      });

      if (!expanded && answer) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });
}

/* ── TABS ── */
function initTabs() {
  document.querySelectorAll('.tabs-nav').forEach(nav => {
    const buttons = nav.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target  = btn.dataset.tab;
        const section = btn.closest('section') || btn.closest('.tabs-container') || document;

        buttons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        section.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const panel = section.querySelector(`#${target}`) || document.getElementById(target);
        if (panel) panel.classList.add('active');
      });

      // Keyboard arrow navigation
      btn.addEventListener('keydown', e => {
        const all = [...buttons];
        const idx = all.indexOf(btn);
        if (e.key === 'ArrowRight') { e.preventDefault(); all[Math.min(idx + 1, all.length - 1)].click(); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); all[Math.max(idx - 1, 0)].click(); }
      });
    });
  });
}

/* ── BACK TO TOP ── */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── COOKIE BANNER ── */
function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  if (localStorage.getItem('nm_cookies_accepted')) {
    banner.remove();
    return;
  }
  banner.style.display = 'block';

  const accept = document.getElementById('cookieAccept');
  const decline = document.getElementById('cookieDecline');
  if (accept) accept.addEventListener('click', () => {
    localStorage.setItem('nm_cookies_accepted', '1');
    banner.remove();
  });
  if (decline) decline.addEventListener('click', () => {
    banner.remove();
  });
}

/* ── ALERT DISMISS ── */
function initAlertDismiss() {
  document.querySelectorAll('.alert-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const banner = btn.closest('.alert-banner');
      if (banner) {
        banner.style.opacity = '0';
        setTimeout(() => banner.remove(), 300);
      }
    });
  });
}

/* ── FORM VALIDATION ── */
function initFormValidation() {
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', e => {
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        const err = form.querySelector(`[data-error="${field.name}"]`);
        field.classList.remove('error');
        if (err) err.style.display = 'none';

        if (!field.value.trim()) {
          valid = false;
          field.classList.add('error');
          if (err) { err.style.display = 'flex'; err.textContent = 'This field is required.'; }
        } else if (field.type === 'email' && !validateEmail(field.value)) {
          valid = false;
          field.classList.add('error');
          if (err) { err.style.display = 'flex'; err.textContent = 'Please enter a valid email address.'; }
        }
      });
      if (!valid) {
        e.preventDefault();
        const firstErr = form.querySelector('.error');
        if (firstErr) firstErr.focus();
      }
    });

    // Live validation
    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('blur', () => {
        const err = form.querySelector(`[data-error="${field.name}"]`);
        if (!field.value.trim()) {
          field.classList.add('error');
          if (err) { err.style.display = 'flex'; err.textContent = 'This field is required.'; }
        } else {
          field.classList.remove('error');
          if (err) err.style.display = 'none';
        }
      });
    });
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── ACTIVE NAV LINK ── */
function initActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ── LANGUAGE SWITCH ── */
function initLangSwitch() {
  const buttons = document.querySelectorAll('.lang-switch button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lang = btn.dataset.lang;
      document.documentElement.setAttribute('lang', lang);
      localStorage.setItem('nm_lang', lang);
      // In production: reload with locale param or fetch translated content
    });
  });
  // Restore preference
  const saved = localStorage.getItem('nm_lang');
  if (saved) {
    buttons.forEach(b => { b.classList.toggle('active', b.dataset.lang === saved); });
  }
}

/* ── STICKY HEADER SHADOW ── */
function initStickyHeader() {
  const navBar = document.querySelector('.nav-bar, .site-header');
  if (!navBar) return;
  window.addEventListener('scroll', () => {
    navBar.style.boxShadow = window.scrollY > 80
      ? '0 3px 16px rgba(0,0,0,.25)'
      : '';
  });
}

/* ── ANIMATED COUNTERS ── */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.counter, 10);
      const dur = 1500;
      const step = end / (dur / 16);
      let cur = 0;
      const tick = () => {
        cur = Math.min(cur + step, end);
        el.textContent = Math.floor(cur).toLocaleString();
        if (cur < end) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ── PRINT FRIENDLY ── */
function initPrintFriendly() {
  document.querySelectorAll('[data-print]').forEach(btn => {
    btn.addEventListener('click', () => window.print());
  });
}

/* ── CONTACT FORM HANDLER ── */
function handleContactForm(form) {
  const honeypot = form.querySelector('[name="website"]');
  if (honeypot && honeypot.value) return; // Spam guard

  const data = Object.fromEntries(new FormData(form));
  const submit = form.querySelector('[type="submit"]');
  const status = form.querySelector('.form-status');

  submit.disabled = true;
  submit.textContent = 'Sending…';

  // Simulated submission — replace with real endpoint
  setTimeout(() => {
    if (status) {
      status.className = 'form-status info-box success';
      status.innerHTML = '<span class="ico">✅</span><p>Thank you for your message. A member of our team will respond within 2–3 working days.</p>';
      status.style.display = 'flex';
    }
    submit.disabled = false;
    submit.textContent = 'Send Message';
    form.reset();
  }, 1200);
}

// Expose globally for inline onclick or module usage
window.handleContactForm = handleContactForm;

/* ── SEARCH FILTER (News / Notices listing) ── */
function initListFilter() {
  const input  = document.getElementById('listSearch');
  const select = document.getElementById('listCategory');
  const items  = document.querySelectorAll('[data-filterable]');
  if (!input && !select) return;

  const filter = () => {
    const q   = input ? input.value.toLowerCase() : '';
    const cat = select ? select.value : '';
    items.forEach(item => {
      const text     = item.textContent.toLowerCase();
      const itemCat  = item.dataset.category || '';
      const matchQ   = !q || text.includes(q);
      const matchCat = !cat || itemCat === cat;
      item.style.display = matchQ && matchCat ? '' : 'none';
    });
  };

  if (input)  input.addEventListener('input', filter);
  if (select) select.addEventListener('change', filter);
}

document.addEventListener('DOMContentLoaded', initListFilter);

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    const offset = 90; // header height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── LIVE CLOCK ── */
function startClock() {
  const el = document.getElementById('liveClock');
  if (!el) return;
  const tz  = el.dataset.tz || 'UTC';
  const tick = () => {
    el.textContent = new Date().toLocaleString('en-GB', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit',
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };
  tick();
  setInterval(tick, 1000);
}
document.addEventListener('DOMContentLoaded', startClock);
