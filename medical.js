/**
 * ============================================================
 * SANTÉVIA TUNIS - JAVASCRIPT COMPLET (module)
 * ============================================================
 */

// ----- 1. CONFIGURATION -----
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_votre_id',
    TEMPLATE_ID: 'template_votre_id',
    PUBLIC_KEY: 'user_votre_cle'
};

const WHATSAPP_CONFIG = {
    PHONE: '21651555603',
    MESSAGE: 'Bonjour%2C%20je%20souhaite%20obtenir%20des%20informations%20concernant%20Sant%C3%A9via%20Tunis.'
};

// ----- 2. NAVIGATION -----
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', this.classList.contains('active'));
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }
});

// ----- 3. FADE-IN AU SCROLL -----
const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-in').forEach(el => {
    fadeInObserver.observe(el);
});

// ----- 4. COMPTEUR ANIMÉ -----
class CounterAnimator {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number[data-count]');
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        this.init();
    }

    init() {
        this.counters.forEach(counter => this.observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();
        const hasPercent = element.textContent.includes('%');

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(easeOutQuart * target);

            if (hasPercent) {
                element.textContent = currentValue + '%';
            } else {
                element.textContent = currentValue + '+';
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = hasPercent ? target + '%' : target + '+';
            }
        };

        requestAnimationFrame(updateCounter);
    }
}

const counterAnimator = new CounterAnimator();

// ----- 5. SLIDER DES TÉMOIGNAGES -----
class TestimonialSlider {
    constructor() {
        this.track = document.getElementById('testimonialsTrack');
        this.slider = document.getElementById('testimonialsSlider');
        this.cards = this.track ? this.track.querySelectorAll('.testimonial-card') : [];
        this.dotsContainer = document.getElementById('sliderDots');
        this.currentIndex = 0;
        this.totalCards = this.cards.length;
        this.cardsPerView = this.getCardsPerView();
        this.autoSlideInterval = null;
        this.isAutoSliding = true;
        this.slideDelay = 5000;
        this.init();
    }

    getCardsPerView() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }

    init() {
        if (!this.track || this.totalCards === 0) return;
        this.createDots();
        this.updateSlider();
        this.startAutoSlide();
        this.bindEvents();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.cardsPerView = this.getCardsPerView();
                this.updateSlider();
            }, 250);
        });
    }

    createDots() {
        if (!this.dotsContainer) return;
        this.dotsContainer.innerHTML = '';
        const totalDots = Math.ceil(this.totalCards / this.cardsPerView);

        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Témoignage ${i + 1}`);
            dot.classList.toggle('active', i === 0);
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    updateSlider() {
        const totalSlides = Math.ceil(this.totalCards / this.cardsPerView);
        const maxIndex = totalSlides - 1;
        if (this.currentIndex > maxIndex) this.currentIndex = 0;

        const offset = this.currentIndex * (100 / totalSlides);
        this.track.style.transform = `translateX(-${offset}%)`;

        if (this.dotsContainer) {
            const dots = this.dotsContainer.querySelectorAll('button');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === this.currentIndex);
            });
        }
    }

    goToSlide(index) {
        const totalSlides = Math.ceil(this.totalCards / this.cardsPerView);
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        this.currentIndex = index;
        this.updateSlider();
        this.resetAutoSlide();
    }

    nextSlide() {
        const totalSlides = Math.ceil(this.totalCards / this.cardsPerView);
        this.goToSlide((this.currentIndex + 1) % totalSlides);
    }

    prevSlide() {
        const totalSlides = Math.ceil(this.totalCards / this.cardsPerView);
        this.goToSlide((this.currentIndex - 1 + totalSlides) % totalSlides);
    }

    startAutoSlide() {
        if (this.autoSlideInterval) clearInterval(this.autoSlideInterval);
        if (this.isAutoSliding) {
            this.autoSlideInterval = setInterval(() => this.nextSlide(), this.slideDelay);
        }
    }

    resetAutoSlide() {
        if (this.isAutoSliding) this.startAutoSlide();
    }

    stopAutoSlide() {
        this.isAutoSliding = false;
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    bindEvents() {
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');

        if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

        if (this.slider) {
            this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.slider.addEventListener('mouseleave', () => {
                this.isAutoSliding = true;
                this.startAutoSlide();
            });
            this.slider.addEventListener('touchstart', () => this.stopAutoSlide());
            this.slider.addEventListener('touchend', () => {
                this.isAutoSliding = true;
                this.startAutoSlide();
            });
        }
    }
}

const testimonialSlider = new TestimonialSlider();

// ----- 6. FAQ ACCORDÉON -----
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    if (faqItems.length > 0) faqItems[0].classList.add('active');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) otherItem.classList.remove('active');
                });
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });

            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }
    });
});

// ----- 7. FORMULAIRE DE CONTACT -----
class ContactForm {
    constructor() {
        this.form = document.querySelector('#contactForm');
        this.successMessage = document.getElementById('successMessage');
        this.submitButton = this.form ? this.form.querySelector('button[type="submit"]') : null;
        this.init();
    }

    init() {
        if (!this.form) return;
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) this.validateField(field);
            });
        });
    }

    validateField(field) {
        const errorElement = field.parentElement.querySelector('.error-message');
        let isValid = true;
        let errorMessage = '';

        if (field.type === 'text' || field.tagName === 'TEXTAREA') {
            field.value = this.sanitizeInput(field.value);
        }

        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Ce champ est obligatoire.';
        } else if (field.type === 'email' && field.value.trim()) {
            if (!this.isValidEmail(field.value)) {
                isValid = false;
                errorMessage = 'Veuillez entrer une adresse email valide.';
            }
        } else if (field.type === 'tel' && field.value.trim()) {
            if (!this.isValidPhone(field.value)) {
                isValid = false;
                errorMessage = 'Veuillez entrer un numéro de téléphone valide.';
            }
        }

        if (errorElement) {
            if (!isValid) {
                field.classList.add('error');
                errorElement.textContent = errorMessage;
                errorElement.classList.add('show');
            } else {
                field.classList.remove('error');
                errorElement.classList.remove('show');
            }
        }

        return isValid;
    }

    validateForm() {
        const fields = this.form.querySelectorAll('input, select, textarea');
        let isValid = true;
        fields.forEach(field => {
            if (!this.validateField(field)) isValid = false;
        });
        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();
        if (!this.validateForm()) {
            const firstError = this.form.querySelector('.error');
            if (firstError) firstError.focus();
            return;
        }

        if (this.submitButton) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        }

        try {
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());
            await this.sendEmail(data);

            if (this.successMessage) {
                this.successMessage.classList.add('show');
                this.successMessage.textContent = '✅ Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.';
                this.successMessage.style.background = '#D4EDDA';
                this.successMessage.style.color = '#155724';
                this.successMessage.style.borderColor = '#C3E6CB';
            }

            this.form.reset();
            this.form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            this.form.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));

        } catch (error) {
            console.error('Erreur d\'envoi:', error);
            if (this.successMessage) {
                this.successMessage.classList.add('show');
                this.successMessage.style.background = '#F8D7DA';
                this.successMessage.style.color = '#721C24';
                this.successMessage.style.borderColor = '#F5C6CB';
                this.successMessage.textContent = '❌ Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou nous contacter directement.';
            }
        } finally {
            if (this.submitButton) {
                this.submitButton.disabled = false;
                this.submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer';
            }
        }
    }

    async sendEmail(data) {
        if (typeof emailjs === 'undefined') {
            console.warn('EmailJS non chargé. Simulation...');
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Données:', data);
            return;
        }

        if (EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== 'user_votre_cle') {
            emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        }

        const templateParams = {
            from_name: data.prenom + ' ' + data.nom,
            from_email: data.email,
            phone: data.telephone,
            country: data.pays,
            treatment: data.traitement,
            message: data.message + ' (Santévia Tunis)',
            to_name: 'Santévia Tunis'
        };

        if (EMAILJS_CONFIG.SERVICE_ID !== 'service_votre_id' &&
            EMAILJS_CONFIG.TEMPLATE_ID !== 'template_votre_id') {
            return emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams
            );
        } else {
            console.warn('EmailJS non configuré. Simulation...');
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Template params:', templateParams);
        }
    }

    sanitizeInput(value) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;' };
        return value.replace(/[&<>"'/]/ig, (match) => map[match]);
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPhone(phone) {
        return /^[\+\d\s\-\(\)]{8,20}$/.test(phone);
    }
}

const contactForm = new ContactForm();

// ----- 8. NEWSLETTER -----
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input[type="email"]');
            const email = input.value.trim();

            if (!email) {
                alert('Veuillez entrer votre adresse email.');
                return;
            }

            if (!contactForm.isValidEmail(email)) {
                alert('Veuillez entrer une adresse email valide.');
                return;
            }

            const button = this.querySelector('button');
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.disabled = true;

            setTimeout(() => {
                alert('✅ Merci pour votre inscription à la newsletter Santévia Tunis !');
                input.value = '';
                button.innerHTML = originalHTML;
                button.disabled = false;
            }, 1500);
        });
    }
});

// ----- 9. BACK TO TOP -----
document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', function() {
        backToTopBtn.classList.toggle('visible', window.scrollY > 400);
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ----- 10. WHATSAPP -----
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.whatsapp-float').forEach(link => {
        const phone = WHATSAPP_CONFIG.PHONE.replace(/[^0-9]/g, '');
        link.href = `https://wa.me/${phone}?text=${WHATSAPP_CONFIG.MESSAGE}`;
    });
});

// ----- 11. NAVIGATION FLUIDE -----
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });
});

// ============================================================
// FORMULAIRE DE DEVIS (MISE EN RELATION)
// ============================================================
class DevisForm {
    constructor() {
        this.form = document.querySelector('#devisForm');
        this.successMessage = document.getElementById('devisSuccess');
        this.init();
    }

    init() {
        if (!this.form) return;
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Validation en temps réel
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) this.validateField(field);
            });
        });
    }

    validateField(field) {
        const errorElement = field.parentElement.querySelector('.error-message');
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Ce champ est obligatoire.';
        } else if (field.type === 'email' && field.value.trim()) {
            if (!this.isValidEmail(field.value)) {
                isValid = false;
                errorMessage = 'Veuillez entrer une adresse email valide.';
            }
        } else if (field.type === 'tel' && field.value.trim()) {
            if (!this.isValidPhone(field.value)) {
                isValid = false;
                errorMessage = 'Veuillez entrer un numéro de téléphone valide.';
            }
        }

        if (errorElement) {
            if (!isValid) {
                field.classList.add('error');
                errorElement.textContent = errorMessage;
                errorElement.classList.add('show');
            } else {
                field.classList.remove('error');
                errorElement.classList.remove('show');
            }
        }

        return isValid;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPhone(phone) {
        return /^[\+\d\s\-\(\)]{8,20}$/.test(phone);
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Valider tous les champs
        const fields = this.form.querySelectorAll('input, select, textarea');
        let isValid = true;
        fields.forEach(field => {
            if (!this.validateField(field)) isValid = false;
        });

        if (!isValid) {
            const firstError = this.form.querySelector('.error');
            if (firstError) firstError.focus();
            return;
        }

        const accept = document.getElementById('devis_accept');
        if (!accept || !accept.checked) {
            alert('Veuillez accepter les conditions de transmission des données.');
            return;
        }

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

        try {
            // Simulation d'envoi (remplacez par EmailJS ou autre)
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (this.successMessage) {
                this.successMessage.classList.add('show');
                this.successMessage.style.background = '#D4EDDA';
                this.successMessage.style.color = '#155724';
                this.successMessage.style.borderColor = '#C3E6CB';
                this.successMessage.textContent = '✅ Votre demande a été envoyée ! Nous vous mettons en relation avec nos cliniques partenaires dans les 24h.';
            }

            this.form.reset();
            this.form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
            this.form.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));

            // Redirection après 2 secondes
            setTimeout(() => {
                window.location.href = 'merci.html';
            }, 2000);

        } catch (error) {
            console.error('Erreur:', error);
            alert('❌ Une erreur est survenue. Veuillez réessayer ou nous contacter directement.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
        }
    }
}

// ----- INITIALISATION DU FORMULAIRE DE DEVIS -----
const devisForm = new DevisForm();

// ----- 12. INITIALISATION -----
console.log('🚀 Santévia Tunis - Site chargé avec succès !');
console.log('📧 EmailJS configuré:', EMAILJS_CONFIG);
console.log('📱 WhatsApp configuré:', WHATSAPP_CONFIG.PHONE);

window.SanteviaTunis = {
    EMAILJS_CONFIG,
    WHATSAPP_CONFIG,
    contactForm,
    testimonialSlider,
    counterAnimator
};