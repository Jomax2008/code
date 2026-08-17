/* =========================================================
   Bakona-School — script.js
   JS moderne, sans dépendance, pour index / contact / events
   ========================================================= */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initActiveNavLink();
    initScrollReveal();
    initContactForm();
    initHeaderShrinkOnScroll();
});

/* ---------------------------------------------------------
   1. Menu mobile (burger) — accessible, sans dépendance
   --------------------------------------------------------- */
function initMobileNav() {
    const nav = document.querySelector('nav.navigation, nav.navigate, nav.navi');
    if (!nav) return;

    const list = nav.querySelector('ul');
    if (!list) return;

    // Crée le bouton burger dynamiquement s'il n'existe pas déjà en HTML
    let burger = nav.querySelector('.nav-toggle');
    if (!burger) {
        burger = document.createElement('button');
        burger.className = 'nav-toggle';
        burger.setAttribute('aria-label', 'Ouvrir le menu');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-controls', 'primary-nav-list');
        burger.innerHTML = '<span></span><span></span><span></span>';
        nav.prepend(burger);
        list.id = list.id || 'primary-nav-list';
    }

    const closeMenu = () => {
        nav.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
    };

    burger.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('nav-open');
        burger.setAttribute('aria-expanded', String(isOpen));
    });

    // Ferme le menu au clic sur un lien (utile en mobile, une fois qu'on navigue)
    list.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    // Ferme le menu si on clique en dehors
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target)) closeMenu();
    });

    // Ferme le menu avec Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // Si on repasse en desktop, on nettoie l'état "ouvert"
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMenu();
    });
}

/* ---------------------------------------------------------
   2. Lien de navigation actif (mise en évidence de la page en cours)
   --------------------------------------------------------- */
function initActiveNavLink() {
    const links = document.querySelectorAll('nav.navigation ul li a, nav.navigate ul li a, nav.navi ul li a');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach((link) => {
        const linkPath = link.getAttribute('href');
        if (!linkPath) return;

        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

/* ---------------------------------------------------------
   3. Animations au scroll (IntersectionObserver, léger et fluide)
   --------------------------------------------------------- */
function initScrollReveal() {
    const targets = document.querySelectorAll(
        'section, .card, .event, .fond ul, section.fond ul'
    );
    if (!targets.length) return;

    // Respecte la préférence de l'utilisateur pour réduire les animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    targets.forEach((el) => el.classList.add('reveal-init'));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   4. Formulaire de contact — validation + feedback utilisateur
   (fonctionne même sans back-end : à adapter avec ton endpoint)
   --------------------------------------------------------- */
function initContactForm() {
    const form = document.querySelector('#contact-form, form.contact-form, form');
    if (!form) return;

    const status = document.createElement('p');
    status.className = 'form-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    form.appendChild(status);

    form.addEventListener('submit', async(e) => {
        e.preventDefault();
        status.textContent = '';
        status.classList.remove('form-status--error', 'form-status--success');

        const errors = validateForm(form);
        if (errors.length) {
            status.textContent = errors.join(' ');
            status.classList.add('form-status--error');
            return;
        }

        const submitBtn = form.querySelector('[type="submit"]');
        const originalLabel = submitBtn ? submitBtn.textContent : null;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours…';
        }

        try {
            // Remplace cette simulation par un vrai appel fetch vers ton back-end :
            // await fetch('/api/contact', { method: 'POST', body: new FormData(form) });
            await new Promise((resolve) => setTimeout(resolve, 900));

            status.textContent = 'Merci ! Votre message a bien été envoyé.';
            status.classList.add('form-status--success');
            form.reset();
        } catch (err) {
            status.textContent = "Une erreur est survenue. Merci de réessayer plus tard.";
            status.classList.add('form-status--error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalLabel;
            }
        }
    });
}

function validateForm(form) {
    const errors = [];
    const nameField = form.querySelector('[name="name"], [name="nom"], #name, #nom');
    const emailField = form.querySelector('[name="email"], [type="email"], #email');
    const messageField = form.querySelector('[name="message"], textarea, #message');

    if (nameField && !nameField.value.trim()) {
        errors.push('Merci de renseigner votre nom.');
    }

    if (emailField) {
        const emailValue = emailField.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailValue || !emailPattern.test(emailValue)) {
            errors.push('Merci de renseigner une adresse e-mail valide.');
        }
    }

    if (messageField && !messageField.value.trim()) {
        errors.push('Merci de renseigner un message.');
    }

    return errors;
}

/* ---------------------------------------------------------
   5. Nav qui se resserre légèrement au scroll (effet moderne)
   --------------------------------------------------------- */
function initHeaderShrinkOnScroll() {
    const nav = document.querySelector('nav.navigation, nav.navigate, nav.navi');
    if (!nav) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            nav.classList.toggle('nav-scrolled', window.scrollY > 24);
            ticking = false;
        });
    });
}