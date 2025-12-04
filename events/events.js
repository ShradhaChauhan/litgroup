// Global variables for gallery
let currentGalleryImages = [];
let currentGalleryIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  const categoryCards = document.querySelectorAll(".category-card");
  const heroScrollButtons = document.querySelectorAll(
    ".events-hero [data-scroll-target]"
  );
  const imageGrids = document.querySelectorAll(".workshop-images-grid");

  const categoryTargets = {
    exhibition: "#exhibitions-list",
    workshop: "#workshops-list",
    celebration: "#celebrations-list",
    tour: "#tours-list",
  };

  // Function to load deferred images
  function loadDeferredImage(img) {
    if (img.dataset.src && !img.src) {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    }
  }

  // Function to load all deferred images in a grid
  function loadAllDeferredImages(grid) {
    const deferredImages = grid.querySelectorAll("img[data-src]");
    deferredImages.forEach(loadDeferredImage);
  }

  imageGrids.forEach((grid) => {
    const cards = Array.from(grid.querySelectorAll(".image-card"));
    if (!cards.length) return;

    // Remove any existing carousel wrapper and arrows
    const wrapper = grid.parentElement;
    if (wrapper && wrapper.classList.contains("carousel-wrapper")) {
      const arrows = wrapper.querySelectorAll(".carousel-arrow");
      arrows.forEach(arrow => arrow.remove());
      wrapper.classList.remove("carousel-wrapper");
    }

    // Remove carousel classes from all cards
    cards.forEach((card, index) => {
      card.dataset.imageIndex = index;
      card.classList.remove(
        "carousel-center",
        "carousel-side",
        "carousel-hidden",
        "hidden",
        "extra-hidden"
      );
    });

    const totalImages = cards.length;
    const celebrationType = grid.dataset.celebration;
    const tourType = grid.dataset.tour;

    // Special handling for Diwali, Birthday celebrations, and Office Tour - use button-based View More
    if (celebrationType === "diwali" || celebrationType === "birthday" || tourType === "office") {
      // Ensure hidden-image class is applied to images after index 5 (show only first 6)
      cards.forEach((card, index) => {
        if (index >= 6) {
          card.classList.add("hidden-image");
        }
      });
    } else {
      // For other sections, use the old View More card approach if more than 6 images
      if (totalImages > 6) {
        // Hide images after index 5 (keep 0-5 visible, with 5 being View More)
        cards.forEach((card, index) => {
          if (index > 5) {
            card.classList.add("extra-hidden");
          }
        });

        // Make the 6th image (index 5) a View More card
        const viewMoreCard = cards[5];
        if (viewMoreCard) {
          viewMoreCard.classList.add("view-more-card");
          
          // Remove existing overlay if any
          const existingOverlay = viewMoreCard.querySelector(".view-more-overlay");
          if (existingOverlay) {
            existingOverlay.remove();
          }

          // Create and add View More overlay
          const overlay = document.createElement("div");
          overlay.className = "view-more-overlay";
          viewMoreCard.appendChild(overlay);

          // Prevent image click from opening gallery with wrong index
          const viewMoreImg = viewMoreCard.querySelector("img");
          if (viewMoreImg) {
            viewMoreImg.style.pointerEvents = "none";
          }

          // Make View More card clickable to open gallery starting from index 0
          viewMoreCard.addEventListener("click", (e) => {
            e.stopPropagation();
            // Load all deferred images before opening gallery
            loadAllDeferredImages(grid);
            // Get all images including hidden ones
            const allImages = Array.from(grid.querySelectorAll(".image-card img"));
            openGallery(allImages, 0);
          });
        }
      } else {
        // If 6 or fewer images, ensure no View More card exists
        cards.forEach((card) => {
          card.classList.remove("view-more-card");
          const existingOverlay = card.querySelector(".view-more-overlay");
          if (existingOverlay) {
            existingOverlay.remove();
          }
        });
      }
    }
  });

  // Handle View More button clicks for Diwali, Birthday celebrations, and Office Tour
  document.querySelectorAll(".view-more-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const celebrationType = button.dataset.celebration;
      const tourType = button.dataset.tour;
      
      let grid;
      if (celebrationType) {
        grid = button.closest(".workshop-card").querySelector(`[data-celebration="${celebrationType}"]`);
      } else if (tourType) {
        grid = button.closest(".workshop-card").querySelector(`[data-tour="${tourType}"]`);
      }
      
      if (!grid) return;

      // Load all deferred images before opening gallery
      loadAllDeferredImages(grid);
      
      // Get all images including hidden ones
      const allImages = Array.from(grid.querySelectorAll(".image-card img"));
      
      // Open gallery starting from the first image (index 0)
      openGallery(allImages, 0);
    });
  });

  // Category card click to scroll to relevant section
  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      const category = card.dataset.category;
      const targetSelector = categoryTargets[category];
      
      if (targetSelector) {
        const targetSection = document.querySelector(targetSelector);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "auto", block: "start" });
        }
      }
    });
  });

  // Image card click to open gallery (for both workshops and exhibitions)
  document.querySelectorAll(".image-card img").forEach((img) => {
    img.addEventListener("click", () => {
      const grid = img.closest(".workshop-images-grid");
      // Load all deferred images before opening gallery
      loadAllDeferredImages(grid);
      const images = Array.from(grid.querySelectorAll(".image-card img"));
      const currentCard = img.closest(".image-card");
      const imageIndex = parseInt(currentCard.dataset.imageIndex) || 0;
      
      openGallery(images, imageIndex);
    });
  });

  // Intersection Observer for lazy loading deferred images when they become visible
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          loadDeferredImage(img);
          imageObserver.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: "50px" // Start loading 50px before image enters viewport
  });

  // Observe all deferred images in celebrations section
  const celebrationsSection = document.getElementById("celebrations-list");
  if (celebrationsSection) {
    const deferredImages = celebrationsSection.querySelectorAll("img[data-src]");
    deferredImages.forEach((img) => {
      imageObserver.observe(img);
    });
  }

  // Smooth scroll for hero buttons
  heroScrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.scrollTarget || button.getAttribute("href")?.substring(1));
      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
      }
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#" && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "auto", block: "start" });
        }
      }
    });
  });

  // Keyboard navigation for gallery
  document.addEventListener("keydown", (e) => {
    const modal = document.getElementById("gallery-modal");
    if (modal && modal.style.display === "flex") {
      if (e.key === "Escape") {
        closeGallery();
      } else if (e.key === "ArrowLeft") {
        changeGalleryImage(-1);
      } else if (e.key === "ArrowRight") {
        changeGalleryImage(1);
      }
    }
  });
});


// Open gallery modal
function openGallery(images, startIndex = 0) {
  // Ensure all images are loaded (convert data-src to src if needed)
  images.forEach(img => {
    if (img.dataset.src && !img.src) {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    }
  });
  
  currentGalleryImages = images.map(img => ({
    src: img.src || img.dataset.src || img.getAttribute("src"),
    alt: img.alt
  }));
  currentGalleryIndex = startIndex;
  
  const modal = document.getElementById("gallery-modal");
  const mainImg = document.getElementById("gallery-main-img");
  const thumbnails = document.getElementById("gallery-thumbnails");
  const current = document.getElementById("gallery-current");
  const total = document.getElementById("gallery-total");
  
  if (modal && mainImg && thumbnails) {
    // Set main image
    mainImg.src = currentGalleryImages[currentGalleryIndex].src;
    mainImg.alt = currentGalleryImages[currentGalleryIndex].alt;
    
    // Create thumbnails
    thumbnails.innerHTML = "";
    currentGalleryImages.forEach((img, index) => {
      const thumb = document.createElement("img");
      thumb.src = img.src;
      thumb.alt = img.alt;
      thumb.classList.add("gallery-thumb");
      if (index === currentGalleryIndex) {
        thumb.classList.add("active");
      }
      thumb.addEventListener("click", () => {
        currentGalleryIndex = index;
        updateGalleryDisplay();
      });
      thumbnails.appendChild(thumb);
    });
    
    // Update counter
    if (current && total) {
      current.textContent = currentGalleryIndex + 1;
      total.textContent = currentGalleryImages.length;
    }
    
    // Show modal
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

// Close gallery modal
function closeGallery() {
  const modal = document.getElementById("gallery-modal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
}

// Change gallery image
function changeGalleryImage(direction) {
  if (currentGalleryImages.length === 0) return;
  
  currentGalleryIndex += direction;
  
  if (currentGalleryIndex < 0) {
    currentGalleryIndex = currentGalleryImages.length - 1;
  } else if (currentGalleryIndex >= currentGalleryImages.length) {
    currentGalleryIndex = 0;
  }
  
  updateGalleryDisplay();
}

// Update gallery display
function updateGalleryDisplay() {
  const mainImg = document.getElementById("gallery-main-img");
  const thumbnails = document.getElementById("gallery-thumbnails");
  const current = document.getElementById("gallery-current");
  
  if (mainImg) {
    mainImg.src = currentGalleryImages[currentGalleryIndex].src;
    mainImg.alt = currentGalleryImages[currentGalleryIndex].alt;
  }
  
  if (thumbnails) {
    const thumbs = thumbnails.querySelectorAll(".gallery-thumb");
    thumbs.forEach((thumb, index) => {
      if (index === currentGalleryIndex) {
        thumb.classList.add("active");
      } else {
        thumb.classList.remove("active");
      }
    });
  }
  
  if (current) {
    current.textContent = currentGalleryIndex + 1;
  }
}


