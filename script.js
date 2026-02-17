/**
 * AquaFlow Lanes - Main JavaScript
 * Handles interactivity, animations, and form submission
 */

// ============================================
// DOCUMENT READY - Initialize on load
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollButton();
    initializeFormHandling();
    initializeSmoothScroll();
    initializeObserverAnimations();
});

// ============================================
// NAVIGATION HANDLING
// ============================================

function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');

            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('nav') && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Update active link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = '';

    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================

function initializeScrollButton() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

function initializeObserverAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe impact cards
    document.querySelectorAll('.impact-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe spec cards
    document.querySelectorAll('.spec-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe metric boxes
    document.querySelectorAll('.metric-box').forEach((box, index) => {
        box.style.opacity = '0';
        box.style.animationDelay = `${index * 0.1}s`;
        observer.observe(box);
    });
}

// Add fadeInUp animation to stylesheet dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .scroll-smooth {
        scroll-behavior: smooth;
    }
`;
document.head.appendChild(style);

// ============================================
// FORM HANDLING
// ============================================

function initializeFormHandling() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const interest = document.getElementById('interest').value;
            const message = document.getElementById('message').value.trim();

            // Validate form
            if (!name || !email || !interest || !message) {
                showFormAlert('Please fill in all fields', 'error');
                return;
            }

            // Validate email
            if (!isValidEmail(email)) {
                showFormAlert('Please enter a valid email address', 'error');
                return;
            }

            // Validate message length
            if (message.length < 10) {
                showFormAlert('Message must be at least 10 characters long', 'error');
                return;
            }

            // Simulate form submission
            submitForm(name, email, interest, message);
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitForm(name, email, interest, message) {
    // Disable submit button
    const submitBtn = document.querySelector('.contact-form button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Simulate API call
    setTimeout(function() {
        // Show success message
        showFormAlert('Thank you! Your message has been sent successfully. We will contact you soon.', 'success');

        // Reset form
        document.getElementById('contactForm').reset();

        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Log form data (in real application, this would be sent to a server)
        console.log('Form submitted:', {
            name: name,
            email: email,
            interest: interest,
            message: message,
            timestamp: new Date().toISOString()
        });
    }, 1500);
}

function showFormAlert(message, type) {
    // Remove existing alert if any
    const existingAlert = document.querySelector('.form-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create alert element
    const alert = document.createElement('div');
    alert.className = `form-alert form-alert-${type}`;
    alert.textContent = message;

    // Add styles
    const alertStyle = document.createElement('style');
    alertStyle.textContent = `
        .form-alert {
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            font-weight: 500;
            animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .form-alert-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .form-alert-error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    `;
    document.head.appendChild(alertStyle);

    // Insert alert at the top of the form
    const form = document.getElementById('contactForm');
    form.insertBefore(alert, form.firstChild);

    // Auto-remove alert after 5 seconds
    setTimeout(function() {
        alert.style.animation = 'slideUp 0.3s ease-out forwards';
        setTimeout(function() {
            alert.remove();
        }, 300);
    }, 5000);

    // Add slideUp animation
    const slideUpStyle = document.createElement('style');
    slideUpStyle.textContent = `
        @keyframes slideUp {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-10px);
            }
        }
    `;
    document.head.appendChild(slideUpStyle);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function to optimize scroll and resize events
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Throttle function for better performance
 */
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall >= delay) {
            lastCall = now;
            return func(...args);
        }
    };
}

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

// Optimize scroll events with throttle
window.addEventListener('scroll', throttle(function() {
    updateActiveNavLink();
}, 100), { passive: true });

// Optimize resize events with debounce
window.addEventListener('resize', debounce(function() {
    // Handle any resize-related logic
}, 250));

// ============================================
// ERROR HANDLING
// ============================================

window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

// ============================================
// INITIALIZATION COMPLETE
// ============================================

console.log('AquaFlow Lanes - Website initialized successfully');
console.log('Version: 1.0.0');
console.log('Last updated: 2026-02-17');
