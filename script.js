// script.js - Tassel Hair & Beauty Studio

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {

  // ========== FADE OBSERVER ==========
  const faders = document.querySelectorAll('.fade');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2, rootMargin: '20px' });

  faders.forEach(el => observer.observe(el));

  // ========== NAV SHRINK ==========
  const nav = document.querySelector('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.padding = '12px 40px';
    } else {
      nav.style.padding = '20px 40px';
    }
  });

  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ========== HERO CAROUSEL ==========
  const carousel = {
    slides: document.querySelectorAll('.carousel-slide'),
    indicators: document.querySelectorAll('.indicator'),
    prevBtn: document.querySelector('.carousel-control.prev'),
    nextBtn: document.querySelector('.carousel-control.next'),
    currentSlide: 0,
    interval: null,

    init() {
      if (!this.slides.length) return;

      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
      }
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.nextSlide());
      }

      this.indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => this.goToSlide(index));
      });

      this.startAutoPlay();

      const container = document.querySelector('.hero-carousel');
      if (container) {
        container.addEventListener('mouseenter', () => this.stopAutoPlay());
        container.addEventListener('mouseleave', () => this.startAutoPlay());
      }
    },

    showSlide(index) {
      this.slides.forEach(slide => slide.classList.remove('active'));
      this.indicators.forEach(ind => ind.classList.remove('active'));

      this.slides[index].classList.add('active');
      this.indicators[index].classList.add('active');

      this.currentSlide = index;
    },

    nextSlide() {
      let next = this.currentSlide + 1;
      if (next >= this.slides.length) next = 0;
      this.showSlide(next);
    },

    prevSlide() {
      let prev = this.currentSlide - 1;
      if (prev < 0) prev = this.slides.length - 1;
      this.showSlide(prev);
    },

    goToSlide(index) {
      this.showSlide(index);
    },

    startAutoPlay() {
      this.interval = setInterval(() => this.nextSlide(), 5000);
    },

    stopAutoPlay() {
      clearInterval(this.interval);
    }
  };

  carousel.init();

  // ========== GALLERY FILTER (Category & Media Type) ==========
  const filterBtns = document.querySelectorAll('.filter-btn');
  const mediaBtns = document.querySelectorAll('.media-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  let currentCategory = 'all';
  let currentMedia = 'all';

  function filterGallery() {
    galleryItems.forEach(item => {
      const categoryMatch = currentCategory === 'all' || item.getAttribute('data-category') === currentCategory;
      const mediaMatch = currentMedia === 'all' || item.getAttribute('data-media') === currentMedia;

      if (categoryMatch && mediaMatch) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // Category filter
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      filterGallery();
    });
  });

  // Media type filter
  mediaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      mediaBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMedia = btn.getAttribute('data-media');
      filterGallery();
    });
  });

  // ========== LIGHTBOX GALLERY with Video Support ==========
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let currentMediaIndex = 0;
  let visibleMediaItems = [];

  function updateVisibleMediaItems() {
    visibleMediaItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
  }

  function updateLightboxContent(item) {
    const isVideo = item.classList.contains('video-item');
    const img = item.querySelector('img');
    const video = item.querySelector('video');
    const caption = item.querySelector('.gallery-overlay span')?.textContent || 'Tassel Studio';

    if (isVideo && video) {
      lightboxImg.style.display = 'none';
      lightboxVideo.style.display = 'block';
      lightboxVideo.src = video.querySelector('source')?.src || '';
      lightboxVideo.load();
      lightboxVideo.play();
    } else if (img) {
      lightboxVideo.style.display = 'none';
      lightboxVideo.pause();
      lightboxImg.style.display = 'block';
      lightboxImg.src = img.src;
    }

    lightboxCaption.textContent = caption;
  }

  function openLightbox(index) {
    updateVisibleMediaItems();
    if (visibleMediaItems.length === 0) return;

    currentMediaIndex = index;
    const item = visibleMediaItems[currentMediaIndex];
    updateLightboxContent(item);
    lightbox.classList.add('show');
  }

  // Open lightbox on click
  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      updateVisibleMediaItems();
      const index = visibleMediaItems.findIndex(i => i === item);
      if (index !== -1) {
        openLightbox(index);
      }
    });
  });

  function navigateLightbox(direction) {
    if (visibleMediaItems.length === 0) return;

    // Stop video playback before switching
    if (lightboxVideo.style.display === 'block') {
      lightboxVideo.pause();
    }

    if (direction === 'next') {
      currentMediaIndex = (currentMediaIndex + 1) % visibleMediaItems.length;
    } else {
      currentMediaIndex = (currentMediaIndex - 1 + visibleMediaItems.length) % visibleMediaItems.length;
    }

    const newItem = visibleMediaItems[currentMediaIndex];
    updateLightboxContent(newItem);
  }

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('show');
    if (lightboxVideo.style.display === 'block') {
      lightboxVideo.pause();
      lightboxVideo.src = '';
    }
  });

  lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
  lightboxNext.addEventListener('click', () => navigateLightbox('next'));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;

    if (e.key === 'Escape') {
      lightboxClose.click();
    } else if (e.key === 'ArrowLeft') {
      navigateLightbox('prev');
    } else if (e.key === 'ArrowRight') {
      navigateLightbox('next');
    }
  });

  // ========== PDF DOWNLOAD TRACKING ==========
  document.querySelectorAll('.service-card[href$=".pdf"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const serviceName = this.querySelector('.service-name')?.textContent || 'Price List';
      console.log(`PDF download initiated: ${serviceName}`);
    });
  });

  // ========== SPECIALS CAROUSEL ==========
  const specialsCarousel = document.getElementById('specialsCarousel');
  const specialsPrev = document.getElementById('specialsPrev');
  const specialsNext = document.getElementById('specialsNext');
  const specialsDots = document.querySelectorAll('.specials-dot');

  if (specialsCarousel && specialsPrev && specialsNext) {
    let currentSpecialIndex = 0;
    const specialSlides = document.querySelectorAll('.special-slide');
    const totalSlides = specialSlides.length;
    let autoPlayInterval;
    let isAutoPlaying = true;

    function updateSpecialsCarousel(index) {
      // Ensure index is within bounds
      if (index < 0) index = 0;
      if (index >= totalSlides) index = totalSlides - 1;

      currentSpecialIndex = index;
      const scrollAmount = specialSlides[currentSpecialIndex].offsetLeft;
      specialsCarousel.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });

      // Update dots
      specialsDots.forEach((dot, i) => {
        if (i === currentSpecialIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function nextSpecial() {
      if (currentSpecialIndex < totalSlides - 1) {
        updateSpecialsCarousel(currentSpecialIndex + 1);
      } else {
        updateSpecialsCarousel(0);
      }
    }

    function prevSpecial() {
      if (currentSpecialIndex > 0) {
        updateSpecialsCarousel(currentSpecialIndex - 1);
      } else {
        updateSpecialsCarousel(totalSlides - 1);
      }
    }

    // Event listeners for buttons
    specialsPrev.addEventListener('click', () => {
      prevSpecial();
      resetAutoPlay();
    });

    specialsNext.addEventListener('click', () => {
      nextSpecial();
      resetAutoPlay();
    });

    // Dot indicators
    specialsDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        updateSpecialsCarousel(index);
        resetAutoPlay();
      });
    });

    // Auto-play functionality
    function startAutoPlay() {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(() => {
        if (isAutoPlaying) {
          nextSpecial();
        }
      }, 5000);
    }

    function stopAutoPlay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    // Pause auto-play on hover
    const carouselContainer = document.querySelector('.specials-carousel-container');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', () => {
        isAutoPlaying = false;
      });

      carouselContainer.addEventListener('mouseleave', () => {
        isAutoPlaying = true;
        resetAutoPlay();
      });
    }

    // Handle scroll events to sync dots
    specialsCarousel.addEventListener('scroll', () => {
      const scrollPosition = specialsCarousel.scrollLeft;
      const slideWidth = specialSlides[0]?.offsetWidth || 0;
      const newIndex = Math.round(scrollPosition / slideWidth);

      if (newIndex !== currentSpecialIndex && newIndex >= 0 && newIndex < totalSlides) {
        currentSpecialIndex = newIndex;
        specialsDots.forEach((dot, i) => {
          if (i === currentSpecialIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    });

    // Initialize carousel
    updateSpecialsCarousel(0);
    startAutoPlay();

    // Handle window resize
    window.addEventListener('resize', () => {
      updateSpecialsCarousel(currentSpecialIndex);
    });
  }

});