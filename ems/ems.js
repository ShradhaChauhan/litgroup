// EMS Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Animation on scroll for elements
    const animateOnScroll = () => {
        const elementsToAnimate = document.querySelectorAll('.feature-card, .category-card, .application-card');
        
        elementsToAnimate.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    };

    // Initial check on page load
    animateOnScroll();
    
    // Check animations on scroll
    window.addEventListener('scroll', animateOnScroll);
}); 