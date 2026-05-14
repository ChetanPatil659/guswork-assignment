/* ================================================================
   MEERA INDUSTRIES — Main JavaScript
   - Sticky navbar shadow on scroll
   - Image carousel with prev/next and thumbnail navigation
   - Image zoom (lens + preview window) on carousel hover
   - Thumbnail hover tooltips
   - Industries horizontal slider with prev/next navigation
   - FAQ accordion
   - Manufacturing process tabs
   - Mobile menu toggle
================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. STICKY NAVBAR SHADOW ────────────────────────────────────
     The navbar uses position:sticky. We add a stronger shadow
     class once the user has scrolled past the hero section.
  ────────────────────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const hero   = document.getElementById('hero');

  if (hero && navbar) {
    const stickyObserver = new IntersectionObserver(
      ([entry]) => {
        navbar.classList.toggle('navbar--visible', !entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    stickyObserver.observe(hero);
  }


  /* ── 2. MOBILE HAMBURGER ────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('is-open');
      navLinks.classList.toggle('is-open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        hamburger.classList.remove('is-open');
        navLinks.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }


  /* ── 3. IMAGE CAROUSEL ──────────────────────────────────────
     Thumbnails: click to switch main image.
     Prev/Next: cycle through the list.
  ────────────────────────────────────────────────────────────── */
  const mainImg        = document.getElementById('carouselMainImg');
  const thumbsWrap     = document.getElementById('carouselThumbs');
  const prevBtn        = document.getElementById('carouselPrev');
  const nextBtn        = document.getElementById('carouselNext');
  if (mainImg && thumbsWrap) {
    const thumbBtns   = [...thumbsWrap.querySelectorAll('.thumb')];
    let currentIndex  = 0;

    function setActiveSlide(index) {
      currentIndex = (index + thumbBtns.length) % thumbBtns.length;
      const src = thumbBtns[currentIndex].dataset.src;

      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = '1';
      }, 150);

      thumbBtns.forEach((btn, i) => {
        const active = i === currentIndex;
        btn.classList.toggle('thumb--active', active);
        btn.setAttribute('aria-pressed', String(active));
      });
    }

    thumbBtns.forEach((btn, i) => btn.addEventListener('click', () => setActiveSlide(i)));
    if (prevBtn) prevBtn.addEventListener('click', () => setActiveSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => setActiveSlide(currentIndex + 1));

    thumbsWrap.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') setActiveSlide(currentIndex + 1);
      if (e.key === 'ArrowLeft')  setActiveSlide(currentIndex - 1);
    });
  }




  /* ── 5. THUMBNAIL HOVER ZOOM TOOLTIP ───────────────────────── */
  if (thumbsWrap) {
    const thumbBtns = [...thumbsWrap.querySelectorAll('.thumb')];
    thumbBtns.forEach((btn) => {
      const tooltip    = document.createElement('div');
      tooltip.className = 'thumb-zoom-tooltip';
      const tooltipImg  = document.createElement('img');
      tooltipImg.src    = btn.dataset.src;
      tooltipImg.alt    = '';
      tooltip.appendChild(tooltipImg);
      btn.appendChild(tooltip);

      btn.addEventListener('mouseenter', () => {
        const r = btn.getBoundingClientRect();
        if (r.left < 80) {
          tooltip.style.left = '0';
          tooltip.style.right = 'auto';
          tooltip.style.transform = 'none';
        } else if (window.innerWidth - r.right < 80) {
          tooltip.style.left = 'auto';
          tooltip.style.right = '0';
          tooltip.style.transform = 'none';
        } else {
          tooltip.style.left = '50%';
          tooltip.style.right = 'auto';
          tooltip.style.transform = 'translateX(-50%)';
        }
      });
    });
  }


  /* ── 6. INDUSTRIES HORIZONTAL SLIDER ───────────────────────
     Calculates cards per view based on viewport width,
     then translates the track left/right by card + gap width.
  ────────────────────────────────────────────────────────────── */
  const track   = document.getElementById('industriesTrack');
  const indPrev = document.getElementById('indPrev');
  const indNext = document.getElementById('indNext');

  if (track && indPrev && indNext) {
    const cards  = [...track.querySelectorAll('.industry-card')];
    const GAP    = 16;
    let slideIdx = 0;

    function getCardsPerView() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768)  return 2;
      return 1;
    }

    function getCardWidth() {
      /* Card width = (viewport width - 2 * card-area adjustments) based on CSS */
      return cards[0] ? cards[0].offsetWidth : 0;
    }

    function maxSlideIdx() {
      return Math.max(0, cards.length - getCardsPerView());
    }

    function goTo(idx) {
      slideIdx = Math.max(0, Math.min(idx, maxSlideIdx()));
      const cardW  = getCardWidth();
      const offset = slideIdx * (cardW + GAP);
      track.style.transform = `translateX(-${offset}px)`;

      indPrev.disabled = slideIdx === 0;
      indNext.disabled = slideIdx >= maxSlideIdx();
    }

    indPrev.addEventListener('click', () => goTo(slideIdx - 1));
    indNext.addEventListener('click', () => goTo(slideIdx + 1));

    /* Reset on resize */
    window.addEventListener('resize', () => {
      slideIdx = 0;
      track.style.transform = 'translateX(0)';
      indPrev.disabled = true;
      indNext.disabled = maxSlideIdx() === 0;
    });

    /* Touch/swipe support */
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? slideIdx + 1 : slideIdx - 1);
      }
    }, { passive: true });

    /* Initial state */
    goTo(0);
  }


  /* ── 7. TESTIMONIALS SLIDER ─────────────────────────────── */
  const testTrack = document.getElementById('testimonialsTrack');
  const testPrev  = document.getElementById('testPrev');
  const testNext  = document.getElementById('testNext');

  if (testTrack && testPrev && testNext) {
    const testCards = [...testTrack.querySelectorAll('.testimonial-card')];
    const TEST_GAP  = 20;
    let testSlideIdx = 0;

    function getTestCardsPerView() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768)  return 2;
      return 1;
    }

    function maxTestSlide() {
      return Math.max(0, testCards.length - getTestCardsPerView());
    }

    function goToTest(idx) {
      testSlideIdx = Math.max(0, Math.min(idx, maxTestSlide()));
      const cardW  = testCards[0] ? testCards[0].offsetWidth : 0;
      testTrack.style.transform = `translateX(-${testSlideIdx * (cardW + TEST_GAP)}px)`;
      testPrev.disabled = testSlideIdx === 0;
      testNext.disabled = testSlideIdx >= maxTestSlide();
    }

    testPrev.addEventListener('click', () => goToTest(testSlideIdx - 1));
    testNext.addEventListener('click', () => goToTest(testSlideIdx + 1));

    window.addEventListener('resize', () => {
      testSlideIdx = 0;
      testTrack.style.transform = 'translateX(0)';
      testPrev.disabled = true;
      testNext.disabled = maxTestSlide() === 0;
    });

    let testTouchX = 0;
    testTrack.addEventListener('touchstart', (e) => { testTouchX = e.touches[0].clientX; }, { passive: true });
    testTrack.addEventListener('touchend', (e) => {
      const diff = testTouchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goToTest(diff > 0 ? testSlideIdx + 1 : testSlideIdx - 1);
    }, { passive: true });

    goToTest(0);
  }


  /* ── 8. FAQ ACCORDION ────────────────────────────────────── */
  const faqList = document.getElementById('faqList');

  if (faqList) {
    faqList.addEventListener('click', (e) => {
      const question = e.target.closest('.faq-question');
      if (!question) return;

      const item   = question.closest('.faq-item');
      const isOpen = item.classList.contains('faq-item--open');

      faqList.querySelectorAll('.faq-item--open').forEach((openItem) => {
        openItem.classList.remove('faq-item--open');
        openItem.querySelector('.faq-toggle-icon').textContent = '+';
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('faq-item--open');
        question.querySelector('.faq-toggle-icon').textContent = '–';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  }


  /* ── 8. MANUFACTURING PROCESS TABS ──────────────────────── */
  const processTabsEl   = document.getElementById('processTabs');
  const processPanelsEl = document.getElementById('processPanels');

  if (processTabsEl && processPanelsEl) {
    const allTabs   = [...processTabsEl.querySelectorAll('.process-tab')];
    const allPanels = [...processPanelsEl.querySelectorAll('.process-panel')];

    function activateProcessStep(step) {
      const idx = ((step % allTabs.length) + allTabs.length) % allTabs.length;
      allTabs.forEach((t, i) => {
        t.classList.toggle('process-tab--active', i === idx);
        t.setAttribute('aria-selected', String(i === idx));
      });
      allPanels.forEach((p, i) => {
        p.classList.toggle('process-panel--active', i === idx);
      });
    }

    processTabsEl.addEventListener('click', (e) => {
      const tab = e.target.closest('.process-tab');
      if (!tab) return;
      activateProcessStep(parseInt(tab.dataset.step));
    });

    /* Inject prev/next arrow buttons into each process image wrap */
    processPanelsEl.querySelectorAll('.process-img-wrap').forEach((wrap) => {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'process-img-btn process-img-btn--prev';
      prevBtn.setAttribute('aria-label', 'Previous step');
      prevBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12.5 15L7.5 10L12.5 5" stroke="#262A2E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

      const nextBtn = document.createElement('button');
      nextBtn.className = 'process-img-btn process-img-btn--next';
      nextBtn.setAttribute('aria-label', 'Next step');
      nextBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7.5 5L12.5 10L7.5 15" stroke="#262A2E" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

      wrap.appendChild(prevBtn);
      wrap.appendChild(nextBtn);
    });

    /* Handle image nav button clicks via event delegation */
    processPanelsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.process-img-btn');
      if (!btn) return;
      const activeIdx = allTabs.findIndex((t) => t.classList.contains('process-tab--active'));
      activateProcessStep(btn.classList.contains('process-img-btn--prev') ? activeIdx - 1 : activeIdx + 1);
    });
  }


  /* ── 9. FORM HELPERS ──────────────────────────────────────── */
  window.handleCatalogueForm = (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input[type=email]');
    const btn   = e.target.querySelector('button[type=submit]');
    if (!input.value) return;
    btn.textContent = '✓ Request Sent!';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Request Catalogue';
      btn.disabled = false;
      input.value = '';
    }, 3000);
  };

  /* ── MODALS ─────────────────────────────────────────────────── */
  function openModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('is-open');
    el.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.modal + 'Overlay'));
  });
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.modalClose));
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.is-open').forEach(o => closeModal(o.id));
    }
  });

  window.handleModal1 = (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type=submit]');
    btn.textContent = '✓ We\'ll be in touch!';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Request Catalogue';
      btn.disabled = false;
      e.target.reset();
      closeModal('modal1Overlay');
    }, 2500);
  };

  window.handleModal2 = (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type=submit]');
    btn.textContent = '✓ Request Received!';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Submit Form';
      btn.disabled = false;
      e.target.reset();
      closeModal('modal2Overlay');
    }, 2500);
  };

  window.handleContactForm = (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type=submit]');
    btn.textContent = '✓ Quote Requested!';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Request Custom Quote';
      btn.disabled = false;
      e.target.reset();
    }, 3500);
  };

});
