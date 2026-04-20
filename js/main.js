/* =============================================
   SCROLL PROGRESS BAR
   ============================================= */
const progressBar = document.getElementById('progressBar');

function updateProgress() {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : '0%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

/* =============================================
   NAV — scroll behaviour + active link
   ============================================= */
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  /* scrolled class */
  nav.classList.toggle('scrolled', window.scrollY > 50);

  /* active nav link */
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });

/* =============================================
   MOBILE MENU
   ============================================= */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* close menu when clicking outside */
document.addEventListener('click', e => {
  if (navLinksEl.classList.contains('open') &&
      !navLinksEl.contains(e.target) &&
      !hamburger.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* =============================================
   SMOOTH SCROLL
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 64, behavior: 'smooth' });
  });
});

/* =============================================
   TYPING EFFECT
   ============================================= */
const phrases = [
  'build precision systems.',
  'design CAD assemblies.',
  'turn concepts into prototypes.',
  'engineer solutions.',
  'validate with data.',
];

let pIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function tick() {
  const phrase = phrases[pIdx];

  if (deleting) {
    typedEl.textContent = phrase.slice(0, --cIdx);
  } else {
    typedEl.textContent = phrase.slice(0, ++cIdx);
  }

  let delay = deleting ? 45 : 75;

  if (!deleting && cIdx === phrase.length) {
    delay = 2200;
    deleting = true;
  } else if (deleting && cIdx === 0) {
    deleting = false;
    pIdx = (pIdx + 1) % phrases.length;
    delay = 350;
  }

  setTimeout(tick, delay);
}

setTimeout(tick, 900);

/* =============================================
   SCROLL-REVEAL (Intersection Observer)
   ============================================= */
const revealEls = [
  ...document.querySelectorAll(
    '.section__title, .about__grid, .about__photo, ' +
    '.skills__card, .project, ' +
    '.timeline__item, .contact, .footer__inner'
  ),
];

/* stagger siblings inside grid parents */
const staggerParents = document.querySelectorAll('.skills__grid, .projects__list');
staggerParents.forEach(parent => {
  Array.from(parent.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.07}s`;
  });
});

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

/* =============================================
   IMAGE LIGHTBOX
   ============================================= */
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  /* clear src after transition */
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}

/* wire up all clickable images */
function initLightboxImages() {
  document.querySelectorAll('.img-wrap.clickable img').forEach(img => {
    img.addEventListener('click', e => {
      e.stopPropagation();
      if (img.complete && img.naturalWidth > 0) openLightbox(img.src, img.alt);
    });
  });
  /* also allow clicking main project images */
  document.querySelectorAll('.project__img-main img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', e => {
      e.stopPropagation();
      if (img.complete && img.naturalWidth > 0) openLightbox(img.src, img.alt);
    });
  });
  /* timeline images */
  document.querySelectorAll('.timeline__imgs .img-wrap img').forEach(img => {
    img.addEventListener('click', e => {
      e.stopPropagation();
      if (img.complete && img.naturalWidth > 0) openLightbox(img.src, img.alt);
    });
  });
}

initLightboxImages();

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});

/* =============================================
   SKILLS CARD — hover tilt (subtle)
   ============================================= */
document.querySelectorAll('.skills__card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-5px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
