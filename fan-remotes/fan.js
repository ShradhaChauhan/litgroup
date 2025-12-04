      // Model tab switching functionality
      document.addEventListener('DOMContentLoaded', function() {
        const modelTabs = document.querySelectorAll('.model-tab');
        const modelContents = document.querySelectorAll('.model-content');
        
        // Hide all model contents first
        modelContents.forEach(content => {
          content.style.display = 'none';
        });
        
        // Then only show the first one (atomberg-smart)
        if (modelContents[0]) {
          modelContents[0].style.display = 'grid';
        }
        
        modelTabs.forEach(tab => {
          tab.addEventListener('click', function() {
            const modelType = this.getAttribute('data-model');
            
            // Remove active class from all tabs
            modelTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all model contents
            modelContents.forEach(content => {
              content.style.display = 'none';
            });
            
            // Show the selected model content
            const selectedContent = document.getElementById(`${modelType}-content`);
            if (selectedContent) {
              selectedContent.style.display = 'grid';
              
              // Reset to first image when tab is clicked
              resetToFirstImage(modelType);
              
              // Clean up any existing logo slider intervals
              cleanupLogoSliderIntervals();
            }
          });
        });

        // Image Carousel Functionality
        initializeCarousels();
        
        // Initialize mobile client logo slider
        initializeLogoSlider();

        // Add intersection observer for scrolling
        setupScrollObserver();
      });

      // Function to reset a model's images to the first one
      function resetToFirstImage(modelId) {
        const mainImage = document.getElementById(`${modelId}-main-image`);
        const thumbnails = document.querySelectorAll(`#${modelId}-content .thumbnail`);
        
        if (!mainImage || thumbnails.length === 0) return;
        
        // Set the first thumbnail as active
        thumbnails.forEach((thumb, index) => {
          if (index === 0) {
            thumb.classList.add('active');
            mainImage.src = thumb.getAttribute('data-image');
          } else {
            thumb.classList.remove('active');
          }
        });
      }

      // Setup intersection observer for when user scrolls to the models section
      function setupScrollObserver() {
        // Create observers for both scrolling up and down
        const observerOptions = { 
          threshold: 0.1,
          rootMargin: "0px 0px 0px 0px"
        };
        
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Get the active model tab
              const activeTab = document.querySelector('.model-tab.active');
              if (activeTab) {
                const modelType = activeTab.getAttribute('data-model');
                
                // Clean up any existing logo slider intervals
                cleanupLogoSliderIntervals();
                
                // Make sure all other content panels are hidden
                const modelContents = document.querySelectorAll('.model-content');
                modelContents.forEach(content => {
                  if (content.id !== `${modelType}-content`) {
                    content.style.display = 'none';
                  } else {
                    content.style.display = 'grid';
                  }
                });
                
                // Reset to first image
                resetToFirstImage(modelType);
              }
            }
          });
        }, observerOptions);
        
        // Observe the fan models section
        const modelsSection = document.getElementById('fan-models');
        if (modelsSection) {
          observer.observe(modelsSection);
        }
      }

      function initializeLogoSlider() {
        // Only initialize slider on mobile
        if (window.innerWidth <= 768) {
          const slider = document.querySelector('.clients-logos-slider');
          if (!slider) return;
          
          // Add automatic horizontal scrolling
          let scrollAmount = 0;
          const scrollSpeed = 1;
          const scrollInterval = 30;
          
          const maxScroll = slider.scrollWidth - slider.clientWidth;
          let direction = 1; // 1 for right, -1 for left
          
          // Start automatic scrolling
          const autoScroll = setInterval(() => {
            if (scrollAmount >= maxScroll - 5) { // Adding a small buffer
              direction = -1; // Change direction to left
            } else if (scrollAmount <= 5) { // Adding a small buffer
              direction = 1; // Change direction to right
            }
            
            scrollAmount += scrollSpeed * direction;
            slider.scrollLeft = scrollAmount;
          }, scrollInterval);
          
          // Pause scrolling on hover/touch
          slider.addEventListener('mouseenter', () => {
            clearInterval(autoScroll);
          });
          
          slider.addEventListener('touchstart', () => {
            clearInterval(autoScroll);
          }, { passive: true });
          
          // Variables to track manual scroll
          let isScrolling;
          
          // When user stops scrolling manually
          slider.addEventListener('scroll', () => {
            // Update the scroll position
            scrollAmount = slider.scrollLeft;
            
            // Clear the timeout
            window.clearTimeout(isScrolling);
            
            // Set a timeout to run after scrolling ends
            isScrolling = setTimeout(() => {
              // Restart automatic scrolling after manual scroll ends
              const newAutoScroll = setInterval(() => {
                if (scrollAmount >= maxScroll - 5) {
                  direction = -1;
                } else if (scrollAmount <= 5) {
                  direction = 1;
                }
                
                scrollAmount += scrollSpeed * direction;
                slider.scrollLeft = scrollAmount;
              }, scrollInterval);
              
              // Track new interval
              slider.setAttribute('data-interval', newAutoScroll);
            }, 100);
          });
          
          slider.addEventListener('mouseleave', () => {
            // Restart automatic scrolling
            scrollAmount = slider.scrollLeft;
            const newAutoScroll = setInterval(() => {
              if (scrollAmount >= maxScroll - 5) {
                direction = -1;
              } else if (scrollAmount <= 5) {
                direction = 1;
              }
              
              scrollAmount += scrollSpeed * direction;
              slider.scrollLeft = scrollAmount;
            }, scrollInterval);
            
            // Track new interval
            slider.setAttribute('data-interval', newAutoScroll);
          });
          
          // Handle touch end
          slider.addEventListener('touchend', () => {
            // Restart automatic scrolling
            scrollAmount = slider.scrollLeft;
            const newAutoScroll = setInterval(() => {
              if (scrollAmount >= maxScroll - 5) {
                direction = -1;
              } else if (scrollAmount <= 5) {
                direction = 1;
              }
              
              scrollAmount += scrollSpeed * direction;
              slider.scrollLeft = scrollAmount;
            }, scrollInterval);
            
            // Track new interval
            slider.setAttribute('data-interval', newAutoScroll);
          }, { passive: true });
        }
      }

      function initializeCarousels() {
        const modelSections = ['atomberg-smart', 'atomberg-classic', 'universal'];
        const carouselIntervals = {};

        modelSections.forEach(modelId => {
          const mainImage = document.getElementById(`${modelId}-main-image`);
          const thumbnails = document.querySelectorAll(`#${modelId}-content .thumbnail`);
          
          if (!mainImage || thumbnails.length === 0) return;
          
          // Thumbnail click handler
          thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
              updateMainImage(mainImage, this, thumbnails);
            });
            
            // Thumbnail hover handler
            thumbnail.addEventListener('mouseenter', function() {
              updateMainImage(mainImage, this, thumbnails);
            });
          });
          
          // Start automatic rotation
          startCarouselRotation(modelId, mainImage, thumbnails);
        });

        // Handle tab switching to restart rotations
        const modelTabs = document.querySelectorAll('.model-tab');
        modelTabs.forEach(tab => {
          tab.addEventListener('click', function() {
            const modelId = this.getAttribute('data-model');
            const mainImage = document.getElementById(`${modelId}-main-image`);
            const thumbnails = document.querySelectorAll(`#${modelId}-content .thumbnail`);
            
            // Reset all intervals
            Object.keys(carouselIntervals).forEach(key => {
              clearInterval(carouselIntervals[key]);
            });
            
            // Reset to first image
            resetToFirstImage(modelId);
            
            // Start new rotation for active tab
            startCarouselRotation(modelId, mainImage, thumbnails);
          });
        });

        function updateMainImage(mainImage, activeThumbnail, allThumbnails) {
          // Update main image src with smooth transition
          mainImage.style.opacity = '0.7';
          setTimeout(() => {
            mainImage.src = activeThumbnail.getAttribute('data-image');
            mainImage.style.opacity = '1';
          }, 150);
          
          // Update active thumbnail state
          allThumbnails.forEach(thumb => {
            thumb.classList.remove('active');
          });
          activeThumbnail.classList.add('active');
        }

        function startCarouselRotation(modelId, mainImage, thumbnails) {
          // Clear existing interval if any
          if (carouselIntervals[modelId]) {
            clearInterval(carouselIntervals[modelId]);
          }
          
          // Set new interval
          carouselIntervals[modelId] = setInterval(() => {
            // Find current active thumbnail
            const activeThumbnail = document.querySelector(`#${modelId}-content .thumbnail.active`);
            if (!activeThumbnail) return;
            
            // Get next thumbnail (or first if at end)
            let nextThumbnail = activeThumbnail.nextElementSibling;
            if (!nextThumbnail || !nextThumbnail.classList.contains('thumbnail')) {
              nextThumbnail = thumbnails[0];
            }
            
            // Update main image
            updateMainImage(mainImage, nextThumbnail, thumbnails);
          }, 4000); // Change image every 4 seconds
        }
      }

      // Function to clean up any existing logo slider intervals
      function cleanupLogoSliderIntervals() {
        const slider = document.querySelector('.clients-logos-slider');
        if (slider) {
          const intervalId = slider.getAttribute('data-interval');
          if (intervalId) {
            clearInterval(parseInt(intervalId));
            slider.removeAttribute('data-interval');
          }
        }
      }
