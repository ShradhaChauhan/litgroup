document.addEventListener('DOMContentLoaded', function () {
    // Modern loader functionality with exact 3-second timing
    const loader = document.getElementById('loader');

    // Show loader initially
    if (loader) {
        document.body.style.overflow = 'hidden'; // Prevent scrolling while loading

        // Ensure the circular loader is visible immediately
        const loaderSpinner = document.querySelector('.loader-spinner');
        if (loaderSpinner) {
            loaderSpinner.style.opacity = '1';
        }

        // Hide loader after exactly 3 seconds
        setTimeout(function () {
            loader.classList.add('loader-hidden');
            document.body.style.overflow = ''; // Re-enable scrolling

            // Remove loader from DOM after animation completes
            loader.addEventListener('transitionend', function (e) {
                // Only process the main container transition, not child elements
                if (e.target === loader && loader.classList.contains('loader-hidden')) {
                    loader.style.display = 'none';
                }
            });
        }, 2000); // Exactly 3 seconds
    }

    // Mobile menu functionality and other initialization code below
    // Removed the custom popup code

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Dropdown Menu Improvements
    const dropdowns = document.querySelectorAll('.dropdown');
    let dropdownTimeout;

    dropdowns.forEach(dropdown => {
        // For mouse interactions
        dropdown.addEventListener('mouseenter', function () {
            clearTimeout(dropdownTimeout);
            closeAllDropdowns();
            this.classList.add('dropdown-open');
        });

        dropdown.addEventListener('mouseleave', function () {
            const self = this;
            dropdownTimeout = setTimeout(function () {
                self.classList.remove('dropdown-open');
            }, 300); // Delay before closing
        });

        // For touch devices
        dropdown.addEventListener('touchstart', function (e) {
            if (!this.classList.contains('dropdown-open')) {
                e.preventDefault();
                closeAllDropdowns();
                this.classList.add('dropdown-open');
            }
        }, { passive: false });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    });

    function closeAllDropdowns() {
        dropdowns.forEach(d => d.classList.remove('dropdown-open'));
    }

    // Hero Slider functionality
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.pagination-dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;

    // Initialize the slider
    function initSlider() {
        if (slides.length === 0) return;

        // Make sure first slide is active
        resetSlides();
        slides[0].classList.add('active');
        dots[0].classList.add('active');

        // Start auto-sliding
        startSlideInterval();

        // Add event listeners for manual controls
        prevBtn?.addEventListener('click', goPrevSlide);
        nextBtn?.addEventListener('click', goNextSlide);

        // Add click events to dots
        dots.forEach(dot => {
            dot.addEventListener('click', function () {
                const slideIndex = parseInt(this.getAttribute('data-index'));
                goToSlide(slideIndex);
            });
        });

        // Pause auto-sliding on hover
        const sliderContainer = document.querySelector('.hero-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', stopSlideInterval);
            sliderContainer.addEventListener('mouseleave', startSlideInterval);

            // Touch swipe support for mobile
            let touchStartX = 0;
            let touchEndX = 0;

            sliderContainer.addEventListener('touchstart', function (e) {
                touchStartX = e.changedTouches[0].screenX;
                stopSlideInterval();
            }, { passive: true });

            sliderContainer.addEventListener('touchend', function (e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startSlideInterval();
            }, { passive: true });

            function handleSwipe() {
                const swipeThreshold = 50;
                if (touchEndX < touchStartX - swipeThreshold) {
                    // Swipe left - go to next slide
                    goNextSlide();
                } else if (touchEndX > touchStartX + swipeThreshold) {
                    // Swipe right - go to previous slide
                    goPrevSlide();
                }
            }
        }

        // Initialize first slide
        goToSlide(0);
    }

    // Reset all slides
    function resetSlides() {
        slides.forEach(slide => {
            slide.classList.remove('active');
            // Reset any transforms
            slide.style.transform = '';
        });
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
    }

    // Go to a specific slide
    function goToSlide(index) {
        if (index < 0) {
            index = slides.length - 1;
        } else if (index >= slides.length) {
            index = 0;
        }

        // Determine direction (1 for forward, -1 for backward)
        const direction = index > currentSlide ? 1 : -1;

        // Remove active class from all slides and dots
        resetSlides();

        // Set the incoming slide to start from the side
        slides[index].style.transform = `translateX(${100 * direction}%)`;

        // Force a reflow to ensure the transform is applied before the transition
        slides[index].offsetHeight;

        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');

        // Move the slide into view with a transition
        slides[index].style.transition = 'transform 0.8s ease-in-out';
        slides[index].style.transform = 'translateX(0)';

        // Update current slide index
        currentSlide = index;
    }

    // Go to next slide
    function goNextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }
        goToSlide(nextIndex);
    }

    // Go to previous slide
    function goPrevSlide() {
        let prevIndex = currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = slides.length - 1;
        }
        goToSlide(prevIndex);
    }

    // Start auto-sliding
    function startSlideInterval() {
        stopSlideInterval(); // Clear any existing interval
        slideInterval = setInterval(goNextSlide, 3000); // Change slide every 3 seconds
    }

    // Stop auto-sliding
    function stopSlideInterval() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    // Initialize the slider if it exists on the page
    initSlider();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                // Previously showed popup, now just return
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Updated selector for more comprehensive animations (Excluding Partners Section)
    const animateElements = document.querySelectorAll(
        '.product-card, .feature-card, .solution-card, .about-image, ' +
        'section:not(.partners) .section-header h2, section:not(.partners) .section-header p, ' +
        '.hero-content h1, .hero-content p, .hero-buttons, .hero-stats'
    );

    // Add the base class for CSS transitions
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    const animateOnScroll = function () {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 100; // Trigger a bit earlier

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');

            // Toggle body overflow using class
            if (navLinks.classList.contains('active')) {
                document.body.classList.add('no-scroll');
            } else {
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function () {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Mobile dropdown toggle
    const dropdownBtns = document.querySelectorAll('.dropdown .dropbtn');

    dropdownBtns.forEach(btn => {
        // Unified click handler for mobile dropdowns
        btn.addEventListener('click', function (e) {
            // Only trigger on mobile/tablet view
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();

                const currentDropdown = this.closest('.dropdown');
                const isCurrentlyActive = currentDropdown.classList.contains('active');

                // 1. Close ALL dropdowns first (clean slate)
                dropdownBtns.forEach(btn => {
                    const dropdown = btn.closest('.dropdown');
                    dropdown.classList.remove('active');
                    dropdown.classList.remove('dropdown-open');
                });

                // 2. If it WASN'T active, open it now
                if (!isCurrentlyActive) {
                    currentDropdown.classList.add('active');
                    currentDropdown.classList.add('dropdown-open');
                }
            }
        });

        // Removed separate touchstart listener to prevent double-firing events
    });

    // Add click handler for dropdown content links to close dropdown after clicking a link
    document.querySelectorAll('.dropdown-content a').forEach(link => {
        link.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                // Find parent dropdown and close it
                const dropdown = this.closest('.dropdown');
                if (dropdown) {
                    dropdown.classList.remove('active');
                    dropdown.classList.remove('dropdown-open'); // Remove dropdown-open to reset arrow direction
                }

                // If this is an anchor link, allow smooth scrolling
                if (this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') {
                        // Previously showed popup, now just return
                        return;
                    }

                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        // Also close the mobile menu
                        document.querySelector('.nav-links').classList.remove('active');
                        document.querySelector('.mobile-menu-btn').classList.remove('active');

                        window.scrollTo({
                            top: targetElement.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    // Close dropdowns when clicking outside in mobile view
    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 768 && !e.target.closest('.dropdown')) {
            dropdownBtns.forEach(btn => {
                btn.parentElement.classList.remove('active');
                btn.parentElement.classList.remove('dropdown-open'); // Also remove dropdown-open when clicking outside
            });
        }
    });

    // Product image hover effect enhancement
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.1)';
            }
        });

        card.addEventListener('mouseleave', function () {
            const img = this.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
    });

    // Product Navigation
    const productGrid = document.querySelector('.product-grid');
    const prevProductBtn = document.querySelector('.prev-product');
    const nextProductBtn = document.querySelector('.next-product');

    if (productGrid && prevProductBtn && nextProductBtn) {
        const productCards = document.querySelectorAll('.product-grid .product-card');
        const cardWidth = productCards[0].offsetWidth + 40; // Width + gap
        let currentPosition = 0;
        const maxPosition = (productCards.length - 2) * cardWidth; // Show 2 cards at a time

        // Check if scrolling is needed
        if (productCards.length <= 2 || window.innerWidth <= 768) {
            prevProductBtn.style.display = 'none';
            nextProductBtn.style.display = 'none';
        }

        prevProductBtn.addEventListener('click', () => {
            if (window.innerWidth <= 768) return; // Don't scroll on mobile
            currentPosition = Math.max(currentPosition - cardWidth, 0);
            productGrid.scrollTo({
                left: currentPosition,
                behavior: 'smooth'
            });
        });

        nextProductBtn.addEventListener('click', () => {
            if (window.innerWidth <= 768) return; // Don't scroll on mobile
            currentPosition = Math.min(currentPosition + cardWidth, maxPosition);
            productGrid.scrollTo({
                left: currentPosition,
                behavior: 'smooth'
            });
        });

        // Adjust visible buttons based on scroll position
        productGrid.addEventListener('scroll', () => {
            if (window.innerWidth <= 768) return; // Don't handle on mobile
            if (productGrid.scrollLeft <= 10) {
                prevProductBtn.classList.add('disabled');
            } else {
                prevProductBtn.classList.remove('disabled');
            }

            if (productGrid.scrollLeft >= productGrid.scrollWidth - productGrid.clientWidth - 10) {
                nextProductBtn.classList.add('disabled');
            } else {
                nextProductBtn.classList.remove('disabled');
            }
        });

        // Handle window resize to update display
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                prevProductBtn.style.display = 'none';
                nextProductBtn.style.display = 'none';
            } else {
                prevProductBtn.style.display = 'flex';
                nextProductBtn.style.display = 'flex';

                // Reset disabled state
                if (productGrid.scrollLeft <= 10) {
                    prevProductBtn.classList.add('disabled');
                } else {
                    prevProductBtn.classList.remove('disabled');
                }

                if (productGrid.scrollLeft >= productGrid.scrollWidth - productGrid.clientWidth - 10) {
                    nextProductBtn.classList.add('disabled');
                } else {
                    nextProductBtn.classList.remove('disabled');
                }
            }
        });

        // Initially disable prev button
        prevProductBtn.classList.add('disabled');
    }

    // Coming Soon Popup Functionality
    const popup = document.getElementById('coming-soon-popup');
    const closeBtn = document.querySelector('.close-popup');

    // Close popup when clicking the close button
    closeBtn.addEventListener('click', function () {
        popup.style.display = 'none';
    });

    // Close popup when clicking outside of it
    window.addEventListener('click', function (event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });

    // Power Solutions links
    const powerSolutionLinks = document.querySelectorAll('a[href="#"]');
    powerSolutionLinks.forEach(link => {
        const linkText = link.textContent.trim().toLowerCase();
        if (linkText === 'power solutions' || linkText === 'learn more') {
            const cardTitle = link.closest('.product-info')?.querySelector('h3')?.textContent.trim();
            if (cardTitle === 'Power Solutions' || !cardTitle) {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    popup.style.display = 'flex';
                });
            }
        }
    });

    // "View Details" button in Power Solutions card
    const viewDetailsLinks = document.querySelectorAll('.product-overlay .view-btn');
    viewDetailsLinks.forEach(link => {
        // Find the closest product card and check if it's the Power Solutions card
        const productCard = link.closest('.product-card');
        if (productCard) {
            const cardTitle = productCard.querySelector('.product-info h3')?.textContent.trim();
            if (cardTitle === 'Power Solutions') {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    popup.style.display = 'flex';
                });
            }
        }
    });

    // Moulding Process link
    const mouldingLink = document.querySelector('.moulding-content .btn.primary');
    if (mouldingLink) {
        mouldingLink.addEventListener('click', function (e) {
            e.preventDefault();
            popup.style.display = 'flex';
        });
    }
});