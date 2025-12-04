// Function to change the main image based on slider image selection
function changeImage(mainImageId, newImageSrc) {
  const mainImage = document.getElementById(mainImageId);
  if (mainImage) {
    mainImage.src = newImageSrc;

    // Find the parent product container and then find slider images within it
    const productContainer = mainImage.closest('.product-detail-parent');
    if (productContainer) {
      const sliderImages = productContainer.querySelectorAll('.slider-image');

      sliderImages.forEach((img) => {
        if (img.src === newImageSrc || img.src.includes(newImageSrc.split('/').pop())) {
          img.classList.add("active");
        } else {
          img.classList.remove("active");
        }
      });
    }
  }
}

// Add automatic image cycling for product sections
document.addEventListener("DOMContentLoaded", function () {
  const products = document.querySelectorAll(".product-detail-parent");
  
  // Store reset functions for each product to use with Intersection Observer
  const productResetFunctions = new Map();

  products.forEach((product) => {
    const mainImage = product.querySelector(".active-image");
    const sliderImages = product.querySelector(".product-detail-image-slider").querySelectorAll(".slider-image");
    let currentIndex = 0;
    let intervalId;

    // Function to change image
    function updateImage(index) {
      currentIndex = index;
      const nextImage = sliderImages[currentIndex];
      if (mainImage && nextImage) {
        mainImage.src = nextImage.src;

        // Update active class in slider
        sliderImages.forEach((img) => img.classList.remove("active"));
        nextImage.classList.add("active");
      }
    }

    // Function to cycle to next image
    function cycleImage() {
      const nextIndex = (currentIndex + 1) % sliderImages.length;
      updateImage(nextIndex);
    }

    // Function to reset to first image
    function resetToFirstImage() {
      clearInterval(intervalId);
      updateImage(0);
      if (sliderImages.length > 1) {
        intervalId = setInterval(cycleImage, 5000);
      }
    }
    
    // Store reset function for this product
    productResetFunctions.set(product, resetToFirstImage);

    // Start cycling images if there are multiple slider images
    if (sliderImages.length > 1) {
      intervalId = setInterval(cycleImage, 5000);
    }

    // Add hover event listeners to slider images
    sliderImages.forEach((image, index) => {
      image.addEventListener("mouseenter", function () {
        // Clear the current interval
        clearInterval(intervalId);
        // Change to hovered image
        updateImage(index);
      });

      image.addEventListener("click", function () {
        clearInterval(intervalId);
        updateImage(index);
        // Restart interval after clicking
        if (sliderImages.length > 1) {
          intervalId = setInterval(cycleImage, 5000);
        }
      });
      // Add touchend event for mobile tap support
      image.addEventListener("touchend", function (e) {
        // Prevents simulated mouse events after touch
        e.preventDefault();
        clearInterval(intervalId);
        updateImage(index);
        if (sliderImages.length > 1) {
          intervalId = setInterval(cycleImage, 5000);
        }
      });
    });
    
    // Add mouseleave event to the slider container to reset to first image
    const sliderContainer = product.querySelector('.product-detail-image-slider');
    sliderContainer.addEventListener('mouseleave', function() {
      resetToFirstImage();
    });
    
    // For mobile - add swipe functionality for image slider
    if ('ontouchstart' in window) {
      const slider = product.querySelector('.product-detail-image-slider');
      let touchStartX = 0;
      let touchEndX = 0;
      
      slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
      });
      
      slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      });
      
      function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
          // Swipe left - go to next image
          if (currentIndex < sliderImages.length - 1) {
            clearInterval(intervalId);
            updateImage(currentIndex + 1);
            if (sliderImages.length > 1) {
              intervalId = setInterval(cycleImage, 5000);
            }
          }
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
          // Swipe right - go to previous image
          if (currentIndex > 0) {
            clearInterval(intervalId);
            updateImage(currentIndex - 1);
            if (sliderImages.length > 1) {
              intervalId = setInterval(cycleImage, 5000);
            }
          }
        }
      }
    }
  });

  // Set up Intersection Observer to reset sliders when scrolling between products
  const resetOptions = {
    root: null, // viewport
    rootMargin: '-20% 0px -20% 0px', // trigger when 20% in/out of viewport
    threshold: 0.1
  };
  
  const resetObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const product = entry.target;
      const resetFunction = productResetFunctions.get(product);
      
      if (entry.isIntersecting) {
        // When product comes into view, reset to first image
        if (resetFunction) resetFunction();
      } else {
        // When product leaves view, also reset to first image
        // so it starts fresh when scrolled to again
        if (resetFunction) resetFunction();
      }
    });
  }, resetOptions);
  
  // Observe all product sections
  products.forEach(product => {
    resetObserver.observe(product);
  });

  // Setup client logo slider animation
  function setupLogoSlider() {
    const sliderContainer = document.querySelector('.logos-container');
    const slider = document.querySelector('.clients-logos-slider');
    if (!slider || !sliderContainer) return;

    // Get all original slides
    const originalSlides = Array.from(slider.querySelectorAll('.logo-slide'));
    if (originalSlides.length === 0) return;
    
    let animationId = null;
    
    // Function to check if we're on mobile
    function isMobile() {
      return window.innerWidth < 768;
    }
    
    // Function to setup and start the animation
    function setupAndStartAnimation() {
      // Only proceed with animation on mobile
      if (!isMobile()) {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
          // Reset slider position on desktop
          slider.style.transform = 'translateX(0)';
        }
        return;
      }
      
      // If we already have an animation running, don't start another
      if (animationId) return;

      // Remove any existing clones
      slider.querySelectorAll('[data-clone="true"]').forEach(clone => clone.remove());

      // Clone slides for the infinite loop effect - clone enough for at least twice the visible area
      for (let i = 0; i < 2; i++) {
        originalSlides.forEach(slide => {
          const clone = slide.cloneNode(true);
          clone.setAttribute('data-clone', 'true');
          slider.appendChild(clone);
        });
      }

      // Animation settings
      const speed = 1; // pixels per frame
      let position = 0;
      let isPaused = false;

      // Calculate dimensions
      const slideWidth = originalSlides[0].offsetWidth + 
                        parseInt(window.getComputedStyle(originalSlides[0]).marginLeft) + 
                        parseInt(window.getComputedStyle(originalSlides[0]).marginRight);
      
      // Set initial position to ensure full visibility at start
      position = 0;
      
      // Apply initial position
      slider.style.transform = `translateX(${position}px)`;

      // Animation function
      function animateSlider() {
        // Check if we switched to desktop view
        if (!isMobile()) {
          cancelAnimationFrame(animationId);
          animationId = null;
          slider.style.transform = 'translateX(0)';
          return;
        }
        
        if (!isPaused) {
          position -= speed;
          
          // When a complete slide has moved out of view to the left
          if (position <= -slideWidth) {
            // Get the first slide
            const firstSlide = slider.querySelector('.logo-slide');
            
            // Move it to the end
            slider.appendChild(firstSlide);
            
            // Adjust position to account for the removed slide
            position += slideWidth;
          }
          
          // Apply the new position
          slider.style.transform = `translateX(${position}px)`;
        }
        
        animationId = requestAnimationFrame(animateSlider);
      }

      // Start animation
      animationId = requestAnimationFrame(animateSlider);

      // Pause on hover
      slider.addEventListener('mouseenter', () => {
        isPaused = true;
      });

      slider.addEventListener('mouseleave', () => {
        isPaused = false;
      });
    }

    // Initial setup based on screen size
    setupAndStartAnimation();

    // Handle resize for responsiveness
    window.addEventListener('resize', () => {
      // Check if we need to start or stop animation based on screen size
      setupAndStartAnimation();
    });
  }

  // Initialize logo slider
  setupLogoSlider();
});
