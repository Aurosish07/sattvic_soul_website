// ===============================
// HAMBURGER MENU FUNCTIONALITY
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ===============================
    // HERO CAROUSEL FUNCTIONALITY
    // ===============================
    const carouselImages = document.querySelectorAll('.carousel-image');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    function showSlide(index) {
        // Remove active class from all images and dots
        carouselImages.forEach(img => img.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current image and dot
        carouselImages[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % carouselImages.length;
        showSlide(currentSlide);
    }

    // Auto-rotate every 4 seconds
    if (carouselImages.length > 0) {
        setInterval(nextSlide, 4000);

        // Add click functionality to dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
    }

    // ===============================
    // GALLERY FILTER FUNCTIONALITY
    // ===============================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryImages = document.querySelectorAll('.gallery-image');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filter gallery items
                galleryImages.forEach(image => {
                    if (filterValue === 'all') {
                        image.classList.remove('hidden');
                    } else {
                        if (image.getAttribute('data-category') === filterValue) {
                            image.classList.remove('hidden');
                        } else {
                            image.classList.add('hidden');
                        }
                    }
                });
            });
        });
    }

    // ===============================
    // CONTACT FORM FUNCTIONALITY
    // ===============================
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();

            // Validation
            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission
            // In a real application, this would send data to a server
            console.log('Form submitted:', {
                name: name,
                email: email,
                phone: phone,
                subject: subject,
                message: message
            });

            // Show success message
            showFormMessage('Thank you for your message! We will get back to you soon.', 'success');

            // Reset form
            contactForm.reset();

            // Clear message after 5 seconds
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.classList.remove('success', 'error');
            }, 5000);
        });
    }

    function showFormMessage(text, type) {
        if (formMessage) {
            formMessage.textContent = text;
            formMessage.classList.remove('success', 'error');
            formMessage.classList.add(type);
        }
    }

    // ===============================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ===============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===============================
    // SCROLL ANIMATION FOR ELEMENTS
    // ===============================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.mission-card, .stat-card, .gallery-item, .work-card, .story-card, .help-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });

    // ===============================
    // SCROLL TO TOP BUTTON
    // ===============================
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.id = 'scrollToTop';
    scrollToTopButton.textContent = '↑';
    scrollToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 40px;
        height: 40px;
        background-color: #2d5f3f;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    document.body.appendChild(scrollToTopButton);

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopButton.style.opacity = '1';
            scrollToTopButton.style.visibility = 'visible';
        } else {
            scrollToTopButton.style.opacity = '0';
            scrollToTopButton.style.visibility = 'hidden';
        }
    });

    // Scroll to top on click
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===============================
    // HOVER EFFECTS FOR BUTTONS
    // ===============================
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // ===============================
    // ACTIVE LINK HIGHLIGHTING
    // ===============================
    const currentLocation = location.pathname;
    const navLinks_update = document.querySelectorAll('.nav-links a');
    navLinks_update.forEach(link => {
        if (link.pathname === currentLocation) {
            link.style.color = '#4a8f5e';
            link.style.fontWeight = 'bold';
        }
    });

    // ===============================
    // LAZY LOADING FOR IMAGES
    // ===============================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }

    // ===============================
    // FORM VALIDATION HELPER
    // ===============================
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    window.validateEmail = validateEmail;

    // ===============================
    // UTILITY: SCROLL LOCK (for modals if needed)
    // ===============================
    function lockScroll() {
        document.body.style.overflow = 'hidden';
    }

    function unlockScroll() {
        document.body.style.overflow = '';
    }

    window.lockScroll = lockScroll;
    window.unlockScroll = unlockScroll;

    // ===============================
    // ACCESSIBILITY: SKIP TO CONTENT LINK
    // ===============================
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #2d5f3f;
        color: white;
        padding: 8px;
        z-index: 100;
        text-decoration: none;
    `;

    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });

    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // ===============================
    // KEYBOARD NAVIGATION FOR GALLERY
    // ===============================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu
            if (hamburger && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        }
    });

    // ===============================
    // PERFORMANCE: DEBOUNCE FUNCTION
    // ===============================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    window.debounce = debounce;

    console.log('Sattvic Soul Foundation - Website initialized successfully');
});

// ===============================
// PAGE LOAD ANIMATION
// ===============================
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});

// Make sure page is visible immediately
document.body.style.opacity = '1';
