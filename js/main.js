/* ============================
   REM Srl - Main JavaScript
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- HEADER SCROLL EFFECT ----
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Header background on scroll
        if (scrollY > 80) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        // Back to top button visibility
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link based on scroll position
        updateActiveNavLink();
    };

    window.addEventListener('scroll', handleScroll);

    // Back to top
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- MOBILE MENU ----
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    nav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ---- HERO SLIDER ----
    const slides = document.querySelectorAll('.hero__slide');
    const dots = document.querySelectorAll('.hero__dot');
    const prevArrow = document.querySelector('.hero__arrow--prev');
    const nextArrow = document.querySelector('.hero__arrow--next');
    let currentSlide = 0;
    let slideInterval;

    const goToSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    // Auto-advance
    const startSlideInterval = () => {
        slideInterval = setInterval(nextSlide, 5000);
    };

    const resetSlideInterval = () => {
        clearInterval(slideInterval);
        startSlideInterval();
    };

    // Event listeners
    nextArrow.addEventListener('click', () => {
        nextSlide();
        resetSlideInterval();
    });

    prevArrow.addEventListener('click', () => {
        prevSlide();
        resetSlideInterval();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.slide));
            resetSlideInterval();
        });
    });

    startSlideInterval();

    // ---- SCROLL ANIMATIONS ----
    const animateElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => animationObserver.observe(el));

    // ---- COUNT UP ANIMATION ----
    const statNumbers = document.querySelectorAll('.stat__number[data-count]');

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const counter = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(counter);
                    }
                    el.textContent = Math.floor(current);
                }, 16);

                countObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => countObserver.observe(el));

    // ---- ACTIVE NAV LINK ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    function updateActiveNavLink() {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- CONTACT FORM ----

    // Formspree endpoint - sostituisci YOUR_FORM_ID con il tuo ID Formspree
    // Esempio: https://formspree.io/f/abcd1234
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xvzbdlqe';
    window.handleSubmit = async function handleSubmit(event) {
        event.preventDefault();
        var submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) submitBtn.disabled = true;

        const name = document.getElementById('name')?.value || '';
        const company = document.getElementById('company')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const phone = document.getElementById('phone')?.value || '';
        const subject = document.getElementById('subject')?.value || '';
        const message = document.getElementById('message')?.value || '';
        try {
            const formData = new FormData();
                    formData.append('name', name);
                    formData.append('company', company);
                    formData.append('email', email);
                    formData.append('phone', phone);
                    formData.append('subject', subject);
                    formData.append('message', message);

            const resp = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: formData
            });

            if (resp.ok) {
                    showBanner('Messaggio inviato con successo. Grazie!', 'success');
                    var form = document.querySelector('form[onsubmit]');
                    if (form) form.reset();
            } else {
                    const data = await resp.json().catch(() => ({}));
                    const errMsg = data.error || data.errors?.map(e=>e.message).join(', ') || ('Errore invio: ' + resp.status);
                    console.error('Formspree error:', resp.status, data);
                    showBanner(errMsg, 'error');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            showBanner('Errore di rete. Riprova più tardi.', 'error');
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    }

    // Funzione per mostrare banner di feedback
    var bannerTimeout = null;
    function showBanner(message, type) {
        var banner = document.getElementById('formBanner');
        if (!banner) return;
        banner.textContent = message;
        banner.classList.remove('success', 'error');
        banner.classList.add(type === 'error' ? 'error' : 'success');
        banner.classList.add('show');
        if (bannerTimeout) clearTimeout(bannerTimeout);
        bannerTimeout = setTimeout(function() {
            banner.classList.remove('show');
        }, 5000);
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleSubmit);
    }

    /*const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');

        // Simple validation
        if (!name || !email) {
            alert('Per favore compila tutti i campi obbligatori.');
            return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Invio in corso...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Messaggio inviato!';
            submitBtn.style.background = '#22c55e';
            submitBtn.style.borderColor = '#22c55e';

            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.style.borderColor = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    }); */

    // ---- TOUCH SWIPE FOR SLIDER ----
    let touchStartX = 0;
    let touchEndX = 0;
    const heroSection = document.querySelector('.hero');

    heroSection.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetSlideInterval();
        }
    }, { passive: true });

});
