/* ====================================================
   SHARED SCROLL ANIMATIONS - INTERSECTION OBSERVER
   Glitch-free, one-time scroll animations
   ==================================================== */

/**
 * Initialize smooth scroll animations using IntersectionObserver
 * This runs animations ONCE when elements enter the viewport
 * No flicker, no retrigger, no glitches
 */
(function() {
  'use strict';

  // Configuration
  const OBSERVER_CONFIG = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  // Elements to animate (add more selectors as needed)
  const ANIMATED_SELECTORS = [
    '.section',
    '.feature-card',
    '.function-item',
    '.sustainability-item',
    '.slide-left',
    '.slide-right',
    '.fade-in',
    '.scale-in'
  ];

  /**
   * Create and configure the IntersectionObserver
   */
  function initScrollAnimations() {
    // Create observer that triggers once per element
    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach(entry => {
        // Only trigger when element enters viewport
        if (entry.isIntersecting) {
          const element = entry.target;
          
          // Add the in-view class to trigger animation
          element.classList.add('in-view');
          
          // Immediately unobserve to prevent re-triggering
          observerInstance.unobserve(element);
          
          // Remove will-change after animation completes (performance optimization)
          setTimeout(() => {
            element.classList.add('animation-complete');
          }, 1000); // Slightly longer than animation duration
        }
      });
    }, OBSERVER_CONFIG);

    // Find and observe all animated elements
    const elements = document.querySelectorAll(ANIMATED_SELECTORS.join(', '));
    
    elements.forEach(element => {
      // Only observe elements that don't already have the in-view class
      if (!element.classList.contains('in-view')) {
        observer.observe(element);
      }
    });

    // Return observer for potential cleanup
    return observer;
  }

  /**
   * Initialize animations when DOM is ready
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initScrollAnimations);
    } else {
      // DOM is already loaded
      initScrollAnimations();
    }
  }

  // Auto-initialize
  init();

  // Expose API for manual control if needed
  window.ScrollAnimations = {
    init: initScrollAnimations,
    config: OBSERVER_CONFIG
  };
})();

