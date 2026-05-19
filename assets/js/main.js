/* ===================================================================
   AIROC Hospitals — interactions & scroll animations
   =================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Off-canvas mobile menu ---------- */
  var navToggle    = document.getElementById('navToggle');
  var mobileMenu   = document.getElementById('mobileMenu');
  var menuPanel    = document.getElementById('menuPanel');
  var menuBackdrop = document.getElementById('menuBackdrop');
  var menuClose    = document.getElementById('menuClose');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('invisible');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      menuBackdrop.classList.remove('opacity-0');
      menuPanel.classList.remove('translate-x-full');
    });
  }
  function closeMenu() {
    if (!mobileMenu) return;
    menuBackdrop.classList.add('opacity-0');
    menuPanel.classList.add('translate-x-full');
    document.body.style.overflow = '';
    setTimeout(function () { mobileMenu.classList.add('invisible'); }, 300);
  }
  if (navToggle)    navToggle.addEventListener('click', openMenu);
  if (menuClose)    menuClose.addEventListener('click', closeMenu);
  if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (l) {
      l.addEventListener('click', closeMenu);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Doctors data + render ---------- */
  var doctors = [
    { i: 'SM', n: 'Dr. Sowmya Maddireddy', r: 'Founder & Director',
      d: 'Dental surgeon with 15+ years in clinical dentistry and healthcare management, overseeing clinical quality and operations.' },
    { i: 'VM', n: 'Dr. Vinodh Maddireddy', r: 'Founder & Director',
      d: 'Distinguished Radiation Oncologist with 15+ years of experience in advanced cancer treatment and comprehensive patient care.' },
    { i: 'UK', n: 'Dr. G Uday Kiran', r: 'Director of Surgical Services',
      d: 'Meticulous, visionary surgeon with 15+ years of experience delivering painless surgeries and exceptional clinical outcomes.' },
    { i: 'MM', n: 'Dr. Manasa Mynepally', r: 'Consultant Endocrinologist',
      d: 'Research-driven endocrinologist and diabetologist with 10+ years managing diabetes, thyroid, PCOS and fertility issues.' },
    { i: 'RR', n: 'Dr. C Raghavendra Reddy', r: 'Medical & Hemato Oncology',
      d: 'Two-time gold medalist specialising in breast, lung and blood cancers, delivering personalised, evidence-based cancer care.' },
    { i: 'KH', n: 'Dr. K Harini', r: 'Nuclear Medicine Physician',
      d: 'Expertise in advanced diagnostic imaging and targeted radionuclide therapies, with specialised PET-CT imaging experience.' },
    { i: 'IV', n: 'Dr. Indu Varshini', r: 'Consultant General Medicine',
      d: 'General physician experienced in outpatient, inpatient and emergency care, including Medical Intensive Care (MICU).' },
    { i: 'SL', n: 'Dr. Sri Lekha', r: 'Consultant Anesthesiologist',
      d: 'Specialises in general and regional anesthesia, difficult airway management, pediatric anesthesia and ICU management.' },
    { i: 'SP', n: 'Dr. Sowmya P', r: 'Consultant Dermatologist',
      d: 'Skilled dermatologist (MBBS, MD DVL) with expertise in clinical dermatology, dermatosurgery, aesthetics and skin cancer care.' }
  ];
  var docGrid = document.getElementById('docGrid');
  if (docGrid) {
    docGrid.innerHTML = doctors.map(function (doc) {
      return [
        '<article class="reveal group p-7 rounded-3xl bg-white ring-1 ring-brand-100 shadow-soft hover:shadow-card hover:-translate-y-1.5 transition">',
        '  <div class="flex items-center gap-4">',
        '    <span class="w-16 h-16 shrink-0 grid place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-rose-500 text-white font-display text-lg font-bold group-hover:scale-105 transition">' + doc.i + '</span>',
        '    <div>',
        '      <h4 class="font-display font-bold text-brand-900 leading-tight">' + doc.n + '</h4>',
        '      <span class="text-sm font-semibold text-rose-500">' + doc.r + '</span>',
        '    </div>',
        '  </div>',
        '  <p class="mt-4 text-sm text-brand-800/65">' + doc.d + '</p>',
        '  <a href="#contact" class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:gap-3 transition-all">View Profile <span>&rarr;</span></a>',
        '</article>'
      ].join('');
    }).join('');
  }

  /* ---------- Micro-interaction wiring ---------- */
  /* gloss sweep on primary (horizontal-gradient) buttons */
  document.querySelectorAll('a[class*="bg-gradient-to-r"]').forEach(function (a) {
    a.classList.add('btn-fx');
  });
  /* animated underline on footer text links */
  document.querySelectorAll('footer a').forEach(function (a) {
    if (a.className.indexOf('hover:text-white') > -1) a.classList.add('lnk');
  });
  /* image hover-zoom on key photos */
  var aboutImg = document.querySelector('#about img');
  if (aboutImg && aboutImg.parentElement) aboutImg.parentElement.classList.add('zoom-wrap');
  document.querySelectorAll('#departments article img').forEach(function (im) {
    if (im.parentElement) im.parentElement.classList.add('zoom-wrap');
  });
  /* radiating pulse on the WhatsApp FAB */
  var fab = document.querySelector('a[aria-label="Chat on WhatsApp"]');
  if (fab) fab.classList.add('fab-pulse');

  /* ---------- Scroll reveal (with sibling stagger) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach(function (el) {
    var parent = el.parentElement;
    if (!parent) return;
    var group = Array.prototype.filter.call(parent.children, function (c) {
      return c.classList && c.classList.contains('reveal');
    });
    if (group.length > 1) {
      el.style.transitionDelay = Math.min(group.indexOf(el), 6) * 85 + 'ms';
    }
  });
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Animated stat counters ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = target.toLocaleString('en-IN') + suffix; return; }
    var dur = 1700, start = null;
    function step(ts) {
      if (!start) start = ts;
      var prog = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - prog, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('en-IN') + suffix;
      if (prog < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('en-IN') + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Parallax targets ---------- */
  var parallaxEls = [];
  if (!reduce) {
    document.querySelectorAll('.blob').forEach(function (b, i) {
      parallaxEls.push({ el: b, speed: 0.10 + (i % 4) * 0.05 });
    });
    var heroImg = document.querySelector('#home > img');
    if (heroImg) parallaxEls.push({ el: heroImg, hero: true });
  }

  /* ---------- Unified scroll loop (rAF-throttled) ---------- */
  var header   = document.getElementById('header');
  var progress = document.getElementById('progress');
  var sections = ['home', 'about', 'departments', 'diagnostics', 'doctors', 'contact'];
  var navLinks = document.querySelectorAll('#nav a');
  var lastY = window.scrollY, ticking = false;

  function syncNav(y) {
    var pos = y + 140, current = sections[0];
    sections.forEach(function (id) {
      var s = document.getElementById(id);
      if (s && s.offsetTop <= pos) current = id;
    });
    navLinks.forEach(function (link) {
      var on = link.getAttribute('href') === '#' + current;
      link.classList.toggle('bg-white', on);
      link.classList.toggle('text-brand-600', on);
    });
  }

  function frame() {
    var y = window.scrollY;

    /* scroll progress bar */
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
    }

    /* auto-hide header on scroll down, reveal on scroll up */
    if (header) {
      var menuOpen = mobileMenu && !mobileMenu.classList.contains('invisible');
      if (menuOpen || y < 320) header.classList.remove('head-hidden');
      else if (y > lastY + 6) header.classList.add('head-hidden');
      else if (y < lastY - 6) header.classList.remove('head-hidden');
    }

    /* parallax */
    if (parallaxEls.length) {
      var vh = window.innerHeight;
      for (var i = 0; i < parallaxEls.length; i++) {
        var p = parallaxEls[i];
        if (p.hero) {
          p.el.style.transform = 'translate3d(0,' + Math.min(y * 0.14, 55) + 'px,0) scale(1.2)';
        } else {
          var r = p.el.getBoundingClientRect();
          var d = vh / 2 - (r.top + r.height / 2);
          p.el.style.transform = 'translate3d(0,' + (d * p.speed).toFixed(1) + 'px,0)';
        }
      }
    }

    syncNav(y);
    lastY = y;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024 && mobileMenu && !mobileMenu.classList.contains('invisible')) closeMenu();
    onScroll();
  });
  frame();
})();
