/**
 * Sattvic Soul Foundation - Main JavaScript
 * Handles navigation, scroll interactions, counter animations, and form validation
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Sticky Navigation & Scroll State
    // ----------------------------------------------------------------------
    const header = document.querySelector('.header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // ----------------------------------------------------------------------
    // 2. Mobile Navigation Toggle
    // ----------------------------------------------------------------------
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    let backdrop = document.querySelector('.mobile-backdrop');

    if (!backdrop && navMenu) {
        backdrop = document.createElement('div');
        backdrop.className = 'mobile-backdrop';
        document.body.appendChild(backdrop);
    }

    const toggleNav = (show) => {
        if (!navMenu || !mobileToggle) return;
        const isActive = typeof show === 'boolean' ? show : !navMenu.classList.contains('active');
        navMenu.classList.toggle('active', isActive);
        if (backdrop) backdrop.classList.toggle('active', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
        mobileToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    };

    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleNav();
        });
    }

    if (backdrop) {
        backdrop.addEventListener('click', () => toggleNav(false));
    }

    // Close mobile nav on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            toggleNav(false);
        }
    });

    // ----------------------------------------------------------------------
    // 3. Scroll Reveal Animations (IntersectionObserver)
    // ----------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for browsers without IntersectionObserver
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // ----------------------------------------------------------------------
    // 4. Animated Number Counters
    // ----------------------------------------------------------------------
    const counterElements = document.querySelectorAll('.impact-number[data-count]');
    
    const animateCounter = (el) => {
        const targetStr = el.getAttribute('data-count');
        const target = parseInt(targetStr.replace(/[^0-9]/g, ''), 10);
        const prefix = targetStr.match(/^[^\d]*/) ? targetStr.match(/^[^\d]*/)[0] : '';
        const suffix = targetStr.match(/[^\d]*$/) ? targetStr.match(/[^\d]*$/)[0] : '';
        
        if (isNaN(target)) return;

        let start = 0;
        const duration = 1800; // ms
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
                clearInterval(timer);
            } else {
                el.textContent = `${prefix}${Math.floor(start).toLocaleString()}${suffix}`;
            }
        }, stepTime);
    };

    if (counterElements.length > 0 && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        counterElements.forEach(el => counterObserver.observe(el));
    } else {
        counterElements.forEach(el => animateCounter(el));
    }

    // ----------------------------------------------------------------------
    // 5. Gallery Filter Logic
    // ----------------------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-card');

    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-filter');

                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                galleryItems.forEach(item => {
                    const itemCat = item.getAttribute('data-category');
                    if (category === 'all' || itemCat === category) {
                        item.style.display = 'flex';
                        setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.95)';
                        setTimeout(() => { item.style.display = 'none'; }, 200);
                    }
                });
            });
        });
    }

    // ----------------------------------------------------------------------
    // 6. Generic Form Validation & Intercept
    // ----------------------------------------------------------------------
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const alertBox = form.querySelector('.form-alert');
            const submitBtn = form.querySelector('button[type="submit"]');
            const emailInput = form.querySelector('input[type="email"]');
            
            // Basic check
            if (emailInput && !emailInput.value.includes('@')) {
                if (alertBox) {
                    alertBox.className = 'form-alert error';
                    alertBox.textContent = 'Please enter a valid email address.';
                }
                return;
            }

            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Submitting...';

                setTimeout(() => {
                    if (alertBox) {
                        alertBox.className = 'form-alert success';
                        alertBox.textContent = 'Thank you! Your submission has been received. Our team will get in touch shortly.';
                    }
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }, 800);
            }
        });
    });

    // ----------------------------------------------------------------------
    // 7. Smooth Scroll for Anchor Links
    // ----------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                toggleNav(false); // Close mobile nav if open
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ----------------------------------------------------------------------
    // 8. Hero Image Carousel / Slider
    // ----------------------------------------------------------------------
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        const slides = heroSlider.querySelectorAll('.hero-slide');
        const dots = heroSlider.querySelectorAll('.hero-slider-dot');
        const prevBtn = heroSlider.querySelector('.hero-slider-prev');
        const nextBtn = heroSlider.querySelector('.hero-slider-next');
        let currentIndex = 0;
        let slideInterval = null;

        const showSlide = (index) => {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            currentIndex = index;

            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentIndex);
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
                dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
            });
        };

        const startAutoplay = () => {
            stopAutoplay();
            slideInterval = setInterval(() => {
                showSlide(currentIndex + 1);
            }, 4500);
        };

        const stopAutoplay = () => {
            if (slideInterval) clearInterval(slideInterval);
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showSlide(currentIndex + 1);
                startAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showSlide(currentIndex - 1);
                startAutoplay();
            });
        }

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                showSlide(i);
                startAutoplay();
            });
        });

        heroSlider.addEventListener('mouseenter', stopAutoplay);
        heroSlider.addEventListener('mouseleave', startAutoplay);

        // Touch swipe support
        let startX = 0;
        heroSlider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        heroSlider.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) {
                    showSlide(currentIndex + 1);
                } else {
                    showSlide(currentIndex - 1);
                }
                startAutoplay();
            }
        }, { passive: true });

        showSlide(0);
        startAutoplay();
    }

    // ----------------------------------------------------------------------
    // 9. Interactive Donation Widget Controller
    // ----------------------------------------------------------------------
    const donateWidget = document.querySelector('.mosaic-card-donate');
    if (donateWidget) {
        const freqBtns = donateWidget.querySelectorAll('.freq-btn');
        const amountBtns = donateWidget.querySelectorAll('.amount-btn');
        const customWrap = donateWidget.querySelector('#customAmountWrap');
        const customInput = donateWidget.querySelector('#customAmountInput');
        const submitBtn = donateWidget.querySelector('#donateSubmitBtn');
        const impactText = donateWidget.querySelector('#donateImpactText');

        let currentFreq = 'monthly';
        let currentAmount = 1000;

        const updateWidget = () => {
            let amountVal = currentAmount;
            if (currentAmount === 'custom') {
                amountVal = parseInt(customInput.value, 10) || 0;
            }

            const formattedAmount = amountVal > 0 ? `₹${amountVal.toLocaleString('en-IN')}` : '₹0';
            const freqLabel = currentFreq === 'monthly' ? 'Monthly' : 'One-Time';

            if (submitBtn) {
                submitBtn.textContent = `Donate ${formattedAmount} ${freqLabel}`;
            }

            if (impactText) {
                if (currentFreq === 'monthly') {
                    if (amountVal >= 2500) {
                        impactText.innerHTML = `<strong>${formattedAmount}/mo</strong> funds complete education, nutrition & medical care for 2 children.`;
                    } else if (amountVal >= 1000) {
                        impactText.innerHTML = `<strong>${formattedAmount}/mo</strong> provides educational supplies & daily nutritious meals for 1 child.`;
                    } else {
                        impactText.innerHTML = `<strong>${formattedAmount}/mo</strong> provides essential learning kits and hygienic snacks for 1 child.`;
                    }
                } else {
                    impactText.innerHTML = `<strong>${formattedAmount}</strong> one-time contribution helps deliver emergency food & hygiene supplies.`;
                }
            }
        };

        freqBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                freqBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFreq = btn.getAttribute('data-freq');
                updateWidget();
            });
        });

        amountBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                amountBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const val = btn.getAttribute('data-amount');
                if (val === 'custom') {
                    currentAmount = 'custom';
                    if (customWrap) customWrap.style.display = 'block';
                    if (customInput) customInput.focus();
                } else {
                    currentAmount = parseInt(val, 10);
                    if (customWrap) customWrap.style.display = 'none';
                }
                updateWidget();
            });
        });

        if (customInput) {
            customInput.addEventListener('input', () => {
                if (currentAmount === 'custom') {
                    updateWidget();
                }
            });
        }

        updateWidget();
    }

    // ----------------------------------------------------------------------
    // 10. UNICEF Hero Full-Width Background Carousel Controller
    // ----------------------------------------------------------------------
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 1) {
        let currentSlideIndex = 0;
        setInterval(() => {
            heroSlides[currentSlideIndex].classList.remove('active');
            currentSlideIndex = (currentSlideIndex + 1) % heroSlides.length;
            heroSlides[currentSlideIndex].classList.add('active');
        }, 4000); // Cross-fade every 4 seconds
    }

    // ----------------------------------------------------------------------
    // 11. Detailed Photo Gallery Category Filter & Interactive Lightbox Modal
    // ----------------------------------------------------------------------
    const filterTabs = document.querySelectorAll('.gallery-tab-btn');
    const galleryCards = document.querySelectorAll('.detailed-photo-card');

    if (filterTabs.length > 0 && galleryCards.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const targetFilter = tab.getAttribute('data-filter');

                galleryCards.forEach(card => {
                    const cardCat = card.getAttribute('data-category');
                    if (targetFilter === 'all' || cardCat === targetFilter) {
                        card.classList.remove('is-hidden');
                    } else {
                        card.classList.add('is-hidden');
                    }
                });
            });
        });
    }

    // Lightbox Modal Controller
    const lightbox = document.getElementById('galleryLightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxCategory = document.getElementById('lightboxCategory');
        const lightboxLocation = document.getElementById('lightboxLocation');
        const lightboxDate = document.getElementById('lightboxDate');
        const lightboxTitle = document.getElementById('lightboxTitle');
        const lightboxDesc = document.getElementById('lightboxDesc');
        const closeBtn = document.getElementById('lightboxClose');
        const backdrop = document.getElementById('lightboxBackdrop');
        const prevBtn = document.getElementById('lightboxPrev');
        const nextBtn = document.getElementById('lightboxNext');

        let visibleCards = [];
        let currentPhotoIndex = 0;

        const updateVisibleCards = () => {
            visibleCards = Array.from(document.querySelectorAll('.detailed-photo-card:not(.is-hidden)'));
        };

        const renderLightboxContent = (index) => {
            if (visibleCards.length === 0) return;
            if (index < 0) index = visibleCards.length - 1;
            if (index >= visibleCards.length) index = 0;
            currentPhotoIndex = index;

            const card = visibleCards[currentPhotoIndex];
            const imgSrc = card.getAttribute('data-img');
            const title = card.getAttribute('data-title');
            const catLabel = card.getAttribute('data-category-label');
            const loc = card.getAttribute('data-location');
            const date = card.getAttribute('data-date');
            const desc = card.getAttribute('data-desc');

            if (lightboxImg) lightboxImg.src = imgSrc;
            if (lightboxTitle) lightboxTitle.textContent = title;
            if (lightboxCategory) lightboxCategory.textContent = catLabel;
            if (lightboxLocation) lightboxLocation.textContent = loc;
            if (lightboxDate) lightboxDate.textContent = date;
            if (lightboxDesc) lightboxDesc.textContent = desc;
        };

        const openLightbox = (cardElement) => {
            updateVisibleCards();
            const index = visibleCards.indexOf(cardElement);
            renderLightboxContent(index >= 0 ? index : 0);
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        document.addEventListener('click', (e) => {
            const cardMedia = e.target.closest('.photo-card-media');
            const openBtn = e.target.closest('.open-lightbox-btn');
            if (cardMedia || openBtn) {
                const card = e.target.closest('.detailed-photo-card');
                if (card) openLightbox(card);
            }
        });

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (backdrop) backdrop.addEventListener('click', closeLightbox);

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                renderLightboxContent(currentPhotoIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                renderLightboxContent(currentPhotoIndex + 1);
            });
        }

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') renderLightboxContent(currentPhotoIndex - 1);
            if (e.key === 'ArrowRight') renderLightboxContent(currentPhotoIndex + 1);
        });
    }

    // ----------------------------------------------------------------------
    // 12. Hero Impact Level Selector
    // ----------------------------------------------------------------------
    const impactPills = document.querySelectorAll('.hero-impact-selector .impact-pill');
    const heroDonateCta = document.getElementById('hero-donate-cta');
    
    if (impactPills.length > 0 && heroDonateCta) {
        impactPills.forEach(pill => {
            pill.addEventListener('click', () => {
                impactPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const amt = pill.getAttribute('data-amount');
                if (amt) {
                    heroDonateCta.href = `get-involved.html?amount=${amt}#donate`;
                }
            });
        });
    }
});

