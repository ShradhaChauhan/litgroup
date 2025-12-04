// Global function for the inline onclick handlers in HTML
function changeImage(targetId, imageSrc) {
    const mainImage = document.getElementById(targetId);
    if (mainImage) {
        // Fade out effect
        mainImage.style.opacity = 0;
        
        setTimeout(() => {
            // Change the source
            mainImage.src = imageSrc;
            
            // Fade in effect
            mainImage.style.opacity = 1;
        }, 200);
        
        // Find the parent product container
        const productContainer = mainImage.closest('.product-detail-parent');
        if (productContainer) {
            // Update active class in slider
            const sliderImages = productContainer.querySelectorAll('.slider-image');
            sliderImages.forEach(img => {
                img.classList.remove('active');
                if (img.src === imageSrc) {
                    img.classList.add('active');
                }
            });
        }
    }
}

// Function to reset product images to the first one when section becomes visible
function resetProductImages() {
    // For each product, set the first image as active
    for (let i = 1; i <= 2; i++) {
        const mainImageId = `product${i}-main-image`;
        const productSelector = `.product-${i}`;
        const firstSliderImage = document.querySelector(`${productSelector} .slider-image:first-child`);
        
        if (firstSliderImage && document.getElementById(mainImageId)) {
            // Set main image to the first slider image
            document.getElementById(mainImageId).src = firstSliderImage.src;
            
            // Set active class on first slider image only
            document.querySelectorAll(`${productSelector} .slider-image`).forEach(img => {
                img.classList.remove('active');
            });
            firstSliderImage.classList.add('active');
            
            // Reset the current index for cycling - get the product element first
            const productElement = document.querySelector(productSelector);
            if (productElement) {
                productElement.setAttribute('data-current-index', '0');
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Setup for the product section display
    setupFullscreenProducts();

    // Add smooth scrolling for product section navigation
    function setupFullscreenProducts() {
        const productSection = document.getElementById('stb-remotes');
        const productCards = document.querySelectorAll('.product-detail-parent');
        
        if (!productSection || productCards.length === 0) return;
        
        // Set initial states
        productCards.forEach((card, index) => {
            // Make sure first product is fully visible
            if (index === 0) {
                card.classList.add('active-product');
            }
            
            // Set data attribute for identifying cards
            card.setAttribute('data-product-index', index);
            
            // Ensure this product starts with its first image
            const mainImageId = `product${index + 1}-main-image`;
            const firstSliderImage = card.querySelector('.slider-image:first-child');
            
            if (firstSliderImage && document.getElementById(mainImageId)) {
                document.getElementById(mainImageId).src = firstSliderImage.src;
                
                card.querySelectorAll('.slider-image').forEach(img => {
                    img.classList.remove('active');
                });
                firstSliderImage.classList.add('active');
            }
        });
        
        // Function to handle scrolling between products
        function handleProductScroll() {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            
            productCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardTop = rect.top;
                const cardHeight = rect.height;
                
                // Check if card is in view
                if (cardTop < windowHeight * 0.5 && cardTop > -cardHeight * 0.5) {
                    card.classList.add('active-product');
                    card.style.opacity = 1;
                    
                    // Calculate parallax effect for image
                    const parallaxValue = Math.max(0, Math.min(1, (windowHeight * 0.5 - cardTop) / windowHeight));
                    const productImage = card.querySelector('.product-detail-full-size-image img');
                    if (productImage) {
                        productImage.style.transform = `translateY(${parallaxValue * 20}px)`;
                    }
                } else {
                    card.classList.remove('active-product');
                }
            });
        }
        
        // Call once on load
        setTimeout(handleProductScroll, 100);
        
        // Add scroll event listener
        window.addEventListener('scroll', handleProductScroll);
    }

    // Animate elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 50) {
                element.classList.add('animate');
            }
        });
    };
    
    // Initial check for elements in view
    animateOnScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // For product section, handle special scrolling
                if (targetId === '#stb-remotes') {
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                } else {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Animate hero features on load
    const heroFeatures = document.querySelectorAll('.hero-feature-item');
    heroFeatures.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            feature.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            feature.style.opacity = '1';
            feature.style.transform = 'translateX(0)';
        }, 800 + (index * 200));
    });
    
    // Set up product image cycling and effects
    function setupProductImages() {
        const products = document.querySelectorAll('.product-detail-parent');
        
        // Store intervals globally so they can be cleared from outside this function
        window.productIntervals = [];
        
        products.forEach((product, productIdx) => {
            const mainImage = product.querySelector('.active-image');
            const sliderImages = product.querySelectorAll('.slider-image');
            let currentIndex = 0;
            let intervalId;
            
            // Store the current index in a data attribute for external access
            product.setAttribute('data-current-index', '0');
            
            // Function to change image
            function updateImage(index) {
                currentIndex = index;
                // Update the current index data attribute
                product.setAttribute('data-current-index', index.toString());
                
                const nextImage = sliderImages[currentIndex];
                if (mainImage && nextImage) {
                    // Add a fade effect
                    mainImage.style.opacity = 0;
                    
                    setTimeout(() => {
                        mainImage.src = nextImage.src;
                        mainImage.style.opacity = 1;
                    }, 200);
                    
                    // Update active class in slider
                    sliderImages.forEach(img => img.classList.remove('active'));
                    nextImage.classList.add('active');
                }
            }
            
            // Function to cycle to next image
            function cycleImage() {
                const nextIndex = (currentIndex + 1) % sliderImages.length;
                updateImage(nextIndex);
            }
            
            // Function to reset interval - will be called when scrolling to this product
            function resetCycling() {
                // Clear existing interval
                if (intervalId) {
                    clearInterval(intervalId);
                }
                
                // Reset to first image
                updateImage(0);
                
                // Start new interval
                intervalId = setInterval(cycleImage, 5000);
                
                // Store the interval ID in our global array
                window.productIntervals[productIdx] = intervalId;
            }
            
            // Store the reset function on the product element
            product.resetCycling = resetCycling;
            
            // Add hover event listeners to slider images
            sliderImages.forEach((image, index) => {
                image.addEventListener('mouseenter', function() {
                    // Clear the current interval
                    clearInterval(intervalId);
                    // Change to hovered image
                    updateImage(index);
                });
                
                image.addEventListener('click', function() {
                    clearInterval(intervalId);
                    intervalId = setInterval(cycleImage, 5000);
                    window.productIntervals[productIdx] = intervalId;
                });
            });
            
            // Set initial active class
            if (sliderImages.length > 0) {
                const activeImg = product.querySelector('.slider-image.active') || sliderImages[0];
                activeImg.classList.add('active');
                if (mainImage) {
                    mainImage.src = activeImg.src;
                    mainImage.style.opacity = 1;
                }
            }
            
            // Start cycling every 5 seconds
            intervalId = setInterval(cycleImage, 5000);
            window.productIntervals[productIdx] = intervalId;

            // Add hover effect on product parent
            product.addEventListener('mouseenter', function() {
                product.classList.add('hover');
            });
            
            product.addEventListener('mouseleave', function() {
                product.classList.remove('hover');
            });
        });
    }

    // Call the function when the page loads
    setupProductImages();
    
    // Reset product images on page load
    resetProductImages();

    // Add CSS transition to main images
    const productImages = document.querySelectorAll('.product-detail-full-size-image img');
    productImages.forEach(img => {
        img.style.transition = 'opacity 0.3s ease, transform 0.5s ease';
        img.style.opacity = 1;
    });

    // Add scroll animation for product sections
    const productElements = document.querySelectorAll('.product-detail-parent');

    // Debounce function
    function debounce(func, wait = 10, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Initialize Intersection Observer
    const observerOptions = {
        root: null, // use viewport
        rootMargin: '0px',
        threshold: 0.15 // trigger when 15% of the target is visible
    };

    const productObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If this is the product section container, no need to reset individual product
                if (entry.target.id === 'stb-remotes') {
                    // Do nothing specific here, we'll handle individual products
                } else if (entry.target.classList.contains('product-detail-parent')) {
                    // Reset just this specific product's images to show the first one
                    const productIndex = entry.target.getAttribute('data-product-index');
                    if (productIndex !== null) {
                        const mainImageId = `product${parseInt(productIndex) + 1}-main-image`;
                        const firstSliderImage = entry.target.querySelector('.slider-image:first-child');
                        
                        if (firstSliderImage && document.getElementById(mainImageId)) {
                            // Clear existing interval for this product
                            if (window.productIntervals && window.productIntervals[productIndex]) {
                                clearInterval(window.productIntervals[productIndex]);
                            }
                            
                            // If the product has a reset cycling function, call it
                            if (typeof entry.target.resetCycling === 'function') {
                                entry.target.resetCycling();
                            } else {
                                // Fallback to manual reset
                                // Set main image to the first slider image
                                document.getElementById(mainImageId).src = firstSliderImage.src;
                                
                                // Set active class on first slider image only
                                entry.target.querySelectorAll('.slider-image').forEach(img => {
                                    img.classList.remove('active');
                                });
                                firstSliderImage.classList.add('active');
                                
                                // Reset the current index
                                entry.target.setAttribute('data-current-index', '0');
                            }
                        }
                    }
                }
            } else {
                // Only remove the class if it's completely out of view (for better UX)
                if (entry.intersectionRatio <= 0) {
                    entry.target.classList.remove('visible');
                }
            }
        });
    }, observerOptions);

    // Observe all product elements
    productElements.forEach(product => {
        productObserver.observe(product);
    });
    
    // Also observe the product section container
    const productSection = document.getElementById('stb-remotes');
    if (productSection) {
        productObserver.observe(productSection);
    }

    // Also trigger on scroll event for browsers with poor IntersectionObserver support
    window.addEventListener('scroll', debounce(function() {
        productElements.forEach(product => {
            const rect = product.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const visibilityThreshold = 150;
            
            if (rect.top < windowHeight - visibilityThreshold && rect.bottom > visibilityThreshold) {
                product.classList.add('visible');
                
                // If this product just became visible, reset its images
                if (!product.hasAttribute('data-reset-done')) {
                    const productIndex = product.getAttribute('data-product-index');
                    if (productIndex !== null) {
                        // Clear existing interval for this product
                        if (window.productIntervals && window.productIntervals[productIndex]) {
                            clearInterval(window.productIntervals[productIndex]);
                        }
                        
                        // If the product has a reset cycling function, call it
                        if (typeof product.resetCycling === 'function') {
                            product.resetCycling();
                        } else {
                            // Fallback to manual reset
                            const mainImageId = `product${parseInt(productIndex) + 1}-main-image`;
                            const firstSliderImage = product.querySelector('.slider-image:first-child');
                            
                            if (firstSliderImage && document.getElementById(mainImageId)) {
                                // Set main image to the first slider image
                                document.getElementById(mainImageId).src = firstSliderImage.src;
                                
                                // Set active class on first slider image only
                                product.querySelectorAll('.slider-image').forEach(img => {
                                    img.classList.remove('active');
                                });
                                firstSliderImage.classList.add('active');
                                
                                // Reset the current index
                                product.setAttribute('data-current-index', '0');
                            }
                        }
                        
                        // Mark as reset done for this scroll action
                        product.setAttribute('data-reset-done', 'true');
                    }
                }
            } else if (rect.bottom < 0 || rect.top > windowHeight) {
                product.classList.remove('visible');
                // Reset the "reset done" flag when product goes off screen
                product.removeAttribute('data-reset-done');
            }
        });
    }, 15));
    
    // Slider image click functionality
    const sliderImages = document.querySelectorAll('.slider-image');
    sliderImages.forEach(img => {
        img.addEventListener('click', function() {
            // Remove active class from all slider images in the same product
            const parentSlider = this.closest('.product-detail-image-slider');
            parentSlider.querySelectorAll('.slider-image').forEach(sliderImg => {
                sliderImg.classList.remove('active');
            });
            
            // Add active class to clicked image
            this.classList.add('active');
        });
    });

    // Add subtle mouse parallax effect to product images
    document.addEventListener('mousemove', function(e) {
        const productContainers = document.querySelectorAll('.product-detail-parent');
        
        productContainers.forEach(container => {
            // Only apply the effect if the product is visible
            if (container.classList.contains('visible')) {
                const rect = container.getBoundingClientRect();
                
                // Calculate if mouse is within the container's boundaries or close to it
                const isInRange = 
                    e.clientX > rect.left - 200 && 
                    e.clientX < rect.right + 200 &&
                    e.clientY > rect.top - 200 && 
                    e.clientY < rect.bottom + 200;
                
                if (isInRange) {
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    
                    // Calculate mouse position relative to the center of the container
                    const mouseX = e.clientX - centerX;
                    const mouseY = e.clientY - centerY;
                    
                    // Apply subtle movement to the image based on mouse position
                    const image = container.querySelector('.product-detail-full-size-image img');
                    
                    if (image) {
                        // Apply a subtle movement
                        const moveX = mouseX / rect.width * 20;
                        const moveY = mouseY / rect.height * 15;
                        
                        // Apply transform with a smooth transition
                        image.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
                        
                        // Reset animation when mouse leaves the area
                        image.style.animation = 'none';
                    }
                } else {
                    // Reset the image position with animation when mouse is out of range
                    const image = container.querySelector('.product-detail-full-size-image img');
                    if (image) {
                        image.style.transform = '';
                        image.style.animation = 'floating 6s ease-in-out infinite';
                    }
                }
            }
        });
    });

    // Hero Carousel Functionality
    const heroCarouselTrack = document.getElementById('heroCarouselTrack');
    const heroCarouselSlides = document.querySelectorAll('.hero-carousel-slide');
    const heroCarouselDots = document.querySelectorAll('.hero-carousel-dots .dot');
    
    let currentHeroSlide = 0;
    const totalHeroSlides = heroCarouselSlides.length;
    let heroCarouselInterval;

    function updateHeroCarousel() {
        // Update track position
        heroCarouselTrack.style.transform = `translateX(-${currentHeroSlide * 100}%)`;
        
        // Update slides
        heroCarouselSlides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentHeroSlide);
        });
        
        // Update dots
        heroCarouselDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentHeroSlide);
        });
    }

    function nextHeroSlide() {
        currentHeroSlide = (currentHeroSlide + 1) % totalHeroSlides;
        updateHeroCarousel();
        resetHeroCarouselInterval();
    }

    function prevHeroSlide() {
        currentHeroSlide = (currentHeroSlide - 1 + totalHeroSlides) % totalHeroSlides;
        updateHeroCarousel();
        resetHeroCarouselInterval();
    }

    function goToHeroSlide(index) {
        currentHeroSlide = index;
        updateHeroCarousel();
        resetHeroCarouselInterval();
    }

    function startHeroCarousel() {
        heroCarouselInterval = setInterval(nextHeroSlide, 5000);
    }

    function resetHeroCarouselInterval() {
        clearInterval(heroCarouselInterval);
        startHeroCarousel();
    }

    // Event listeners
    heroCarouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToHeroSlide(index));
    });

    // Pause on hover
    const heroCarouselContainer = document.querySelector('.hero-carousel-container');
    if (heroCarouselContainer) {
        heroCarouselContainer.addEventListener('mouseenter', () => {
            clearInterval(heroCarouselInterval);
        });

        heroCarouselContainer.addEventListener('mouseleave', () => {
            startHeroCarousel();
        });
    }

    // Initialize carousel
    if (heroCarouselSlides.length > 0) {
        updateHeroCarousel();
        startHeroCarousel();
    }
});

