/* ============================
   REM Stampi – Main JavaScript
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── BACK TO TOP ──────────────────────────────────────────────────────────
    const backToTop = document.getElementById('backToTop');
    const header    = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        updateActiveNavLink();
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ── MOBILE MENU ──────────────────────────────────────────────────────────
    const burger = document.getElementById('burger');
    const nav    = document.getElementById('nav');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('open');
            document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
        });
    }

    // Close mobile menu + immediately set active on any nav link click
    let scrollLock = false;
    let scrollLockTimer = null;

    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            // close mobile menu
            if (burger) burger.classList.remove('active');
            if (nav)    nav.classList.remove('open');
            document.body.style.overflow = '';

            // immediately highlight the clicked link
            const href = link.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // pause scroll-based updates while smooth scroll animates
                scrollLock = true;
                clearTimeout(scrollLockTimer);
                scrollLockTimer = setTimeout(() => { scrollLock = false; }, 900);
            }
        });
    });

    // ── SCROLL ANIMATIONS ────────────────────────────────────────────────────
    const animateEls = document.querySelectorAll('[data-animate]');

    if (animateEls.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        animateEls.forEach(el => observer.observe(el));
    }

    // ── ACTIVE NAV LINK ───────────────────────────────────────────────────────
    const navLinks = document.querySelectorAll('.nav__link');

    // Collect all elements whose IDs are referenced by nav links
    const sections = Array.from(navLinks)
        .map(link => link.getAttribute('href'))
        .filter(href => href && href.startsWith('#') && href.length > 1)
        .map(href => document.getElementById(href.slice(1)))
        .filter(Boolean);

    function updateActiveNavLink() {
        if (scrollLock) return;

        const headerH = header ? header.offsetHeight : 80;
        const scrollY = window.scrollY + headerH + 20;

        // Sort by actual DOM position (sections may not match nav order)
        const sorted = sections.slice().sort((a, b) => a.offsetTop - b.offsetTop);

        // Special case: if user has scrolled to the very bottom, activate last section
        const atBottom = (window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 60;
        if (atBottom) {
            const lastId = sorted[sorted.length - 1].getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + lastId);
            });
            return;
        }

        let activeId = null;
        sorted.forEach(section => {
            if (scrollY >= section.offsetTop) {
                activeId = section.getAttribute('id');
            }
        });

        if (activeId) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
            });
        }
    }

    // ── SMOOTH SCROLL ────────────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            const headerH = header ? header.offsetHeight : 0;
            window.scrollTo({
                top: target.offsetTop - headerH,
                behavior: 'smooth'
            });
        });
    });

});
