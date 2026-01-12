// Simple form submission handling
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const toast = document.getElementById('toast');

  function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => (toast.className = 'toast'), 3000);
  }

  submitBtn.addEventListener('click', async () => {
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok && result.success) {
        showToast('Message sent successfully!', 'success');
        form.reset();
      } else {
        showToast('Submission failed. Try again.', 'error');
      }
    } catch {
      showToast('Server error. Please try later.', 'error');
    }
  });
});

  // Location tabs functionality
  document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const mapTabs = document.querySelectorAll('.map-tab');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons and tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        mapTabs.forEach(tab => tab.classList.remove('active'));

        // Add active class to clicked button
        button.classList.add('active');
        
        // Show corresponding map tab
        const locationId = button.getAttribute('data-location');
        document.getElementById(locationId).classList.add('active');
      });
    });
  });
  
  // Dropdown Menu Improvements
  const dropdowns = document.querySelectorAll('.dropdown');
  let dropdownTimeout;
  
  dropdowns.forEach(dropdown => {
      // For mouse interactions
      dropdown.addEventListener('mouseenter', function() {
          clearTimeout(dropdownTimeout);
          closeAllDropdowns();
          this.classList.add('dropdown-open');
      });
      
      dropdown.addEventListener('mouseleave', function() {
          const self = this;
          dropdownTimeout = setTimeout(function() {
              self.classList.remove('dropdown-open');
          }, 300); // Delay before closing
      });
      
      // For touch devices
      dropdown.addEventListener('touchstart', function(e) {
          if (!this.classList.contains('dropdown-open')) {
              e.preventDefault();
              closeAllDropdowns();
              this.classList.add('dropdown-open');
          }
      }, {passive: false});
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
      if (!e.target.closest('.dropdown')) {
          closeAllDropdowns();
      }
  });
  
  function closeAllDropdowns() {
      dropdowns.forEach(d => d.classList.remove('dropdown-open'));
  }