document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Set Current Year
    const yearSpan = document.getElementById('year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if(mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    // 3. Navbar Scroll Effect & Back to Top Button
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // 4. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-fade');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Stat Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let hasCounted = false;

    const countUp = () => {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000; // ms
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if(current < target) {
                    stat.innerText = `+${Math.ceil(current)}`;
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = `+${target}`;
                }
            };
            updateCounter();
        });
    };

    // Trigger counter when About section is in view
    const statsSection = document.querySelector('.stats-container');
    if(statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting && !hasCounted) {
                countUp();
                hasCounted = true;
            }
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // 6. Testimonials Carousel
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    const container = document.getElementById('testimonial-container');

    window.currentSlide = function(index) {
        currentSlideIndex = index;
        updateCarousel();
    };

    function updateCarousel() {
        if(!container) return;
        
        // Move container
        container.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
        
        // Update active class on slides
        slides.forEach((slide, i) => {
            if(i === currentSlideIndex) slide.classList.add('active');
            else slide.classList.remove('active');
        });
        
        // Update dots
        dots.forEach((dot, i) => {
            if(i === currentSlideIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }

    // Auto rotate carousel every 5 seconds
    setInterval(() => {
        if(slides.length > 0) {
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            updateCarousel();
        }
    }, 5000);

    // 7. Contact Form submission (Redirect to WhatsApp)
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const serviceSelect = document.getElementById('service');
            const service = serviceSelect.options[serviceSelect.selectedIndex].text;
            const message = document.getElementById('message').value;
            
            // Construct WhatsApp message
            let whatsappText = `Hola, mi nombre es ${name}.\nMe gustaría agendar un servicio de *${service}*.\nMi correo es: ${email}.`;
            
            if (message.trim() !== "") {
                whatsappText += `\n\nMensaje adicional:\n${message}`;
            }
            
            // Redirect to WhatsApp
            const whatsappUrl = `https://wa.me/56954196551?text=${encodeURIComponent(whatsappText)}`;
            window.open(whatsappUrl, '_blank');
            
            // Reset form
            contactForm.reset();
        });
    }
});
