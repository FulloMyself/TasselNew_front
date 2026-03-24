// script.js - Tassel Hair & Beauty Studio

// ========== GLOBAL FUNCTIONS (Must be outside DOMContentLoaded) ==========

// ========== BOOKING MODAL FUNCTIONS ==========
function openBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

function updateServiceDetails() {
  const category = document.getElementById('serviceCategory')?.value;
  const serviceDetailsGroup = document.getElementById('serviceDetailsGroup');
  const serviceDetailsSelect = document.getElementById('serviceDetails');

  const serviceDetails = {
    "Kiddies Hair": [
      "Haircut & Style",
      "Braiding",
      "School-friendly Hairstyle",
      "Kids Party Package",
      "Hair Treatment",
      "Kiddies Wash & Blow-dry"
    ],
    "Barber": [
      "Men's Haircut (Fade)",
      "Men's Haircut (Scissor Cut)",
      "Beard Trim & Shape",
      "Hot Towel Shave",
      "Boys Haircut",
      "Beard & Haircut Combo"
    ],
    "Adult Hair": [
      "Women's Haircut",
      "Hair Coloring",
      "Highlights",
      "Balayage",
      "Keratin Treatment",
      "Wash & Blow-dry",
      "Styling (Braids/Updo)"
    ],
    "Nails": [
      "Classic Manicure",
      "Luxury Manicure",
      "Classic Pedicure",
      "Luxury Pedicure",
      "Gel Manicure",
      "Nail Art",
      "Gel Removal"
    ],
    "Skin & Beauty": [
      "Facial Treatment",
      "Brow Shaping",
      "Brow Lamination",
      "Waxing",
      "Makeup Application",
      "Lash Lift",
      "Body Scrub"
    ]
  };

  if (category && serviceDetails[category]) {
    serviceDetailsGroup.style.display = 'block';
    serviceDetailsSelect.innerHTML = '<option value="">Select a specific service</option>';

    serviceDetails[category].forEach(service => {
      const option = document.createElement('option');
      option.value = service;
      option.textContent = service;
      serviceDetailsSelect.appendChild(option);
    });

    serviceDetailsSelect.required = true;
  } else {
    serviceDetailsGroup.style.display = 'none';
    serviceDetailsSelect.required = false;
    serviceDetailsSelect.innerHTML = '<option value="">Select a specific service</option>';
  }
}

function formatWhatsAppMessage(formData) {
  const date = new Date(formData.preferredDate);
  const formattedDate = date.toLocaleDateString('en-ZA');

  let message = `*NEW BOOKING REQUEST - TASSEL STUDIO*\n`;
  message += `═══════════════════════════════\n\n`;

  message += `*CUSTOMER DETAILS*\n`;
  message += `Name: ${formData.fullName}\n`;
  message += `Phone: ${formData.phoneNumber}\n`;
  if (formData.email) message += `Email: ${formData.email}\n`;
  message += `\n`;

  message += `*SERVICE DETAILS*\n`;
  message += `Category: ${formData.serviceCategory}\n`;
  message += `Service: ${formData.selectedServiceDetails}\n`;
  message += `\n`;

  message += `*APPOINTMENT*\n`;
  message += `Date: ${formattedDate}\n`;
  message += `Time: ${formData.preferredTime}\n`;
  message += `People: ${formData.numberOfPeople} person(s)\n`;

  if (formData.specialRequests && formData.specialRequests.trim()) {
    message += `\n*SPECIAL REQUESTS*\n`;
    message += `${formData.specialRequests}\n`;
  }

  message += `\n*STATUS:* Pending Confirmation\n`;
  message += `═══════════════════════════════\n`;
  message += `Reply to confirm this booking.`;

  return encodeURIComponent(message);
}

function sendBookingToWhatsApp(event) {
  event.preventDefault();

  const category = document.getElementById('serviceCategory')?.value;
  const serviceDetails = document.getElementById('serviceDetails')?.value;
  const fullName = document.getElementById('fullName')?.value;
  const phoneNumber = document.getElementById('phoneNumber')?.value;
  const email = document.getElementById('email')?.value;
  const preferredDate = document.getElementById('preferredDate')?.value;
  const preferredTime = document.getElementById('preferredTime')?.value;
  const numberOfPeople = document.getElementById('numberOfPeople')?.value;
  const specialRequests = document.getElementById('specialRequests')?.value;

  if (!category || !serviceDetails || !fullName || !phoneNumber || !preferredDate || !preferredTime) {
    alert('Please fill in all required fields (*)');
    return;
  }

  const phoneRegex = /^[0-9\s\-\(\)\+]{10,}$/;
  if (!phoneRegex.test(phoneNumber)) {
    alert('Please enter a valid phone number');
    return;
  }

  const formData = {
    serviceCategory: category,
    selectedServiceDetails: serviceDetails,
    fullName: fullName,
    phoneNumber: phoneNumber,
    email: email,
    preferredDate: preferredDate,
    preferredTime: preferredTime,
    numberOfPeople: numberOfPeople,
    specialRequests: specialRequests
  };

  const message = formatWhatsAppMessage(formData);
  const whatsappNumber = '27729605153';
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

  window.open(whatsappURL, '_blank');

  setTimeout(() => {
    closeBookingModal();
    document.getElementById('bookingForm')?.reset();
    const serviceDetailsGroup = document.getElementById('serviceDetailsGroup');
    if (serviceDetailsGroup) serviceDetailsGroup.style.display = 'none';
  }, 500);

  console.log('Booking initiated:', formData);
}

// ========== REVIEW MODAL FUNCTIONS ==========
function openReviewModal() {
  const modal = document.getElementById('reviewModal');
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeReviewModal() {
  const modal = document.getElementById('reviewModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    document.getElementById('reviewForm')?.reset();
    resetStarRating();
  }
}

function resetStarRating() {
  const stars = document.querySelectorAll('.star-rating-star');
  const ratingInput = document.getElementById('reviewRating');
  if (ratingInput) ratingInput.value = '5';
  stars.forEach((star, index) => {
    if (index < 5) {
      star.textContent = '★';
      star.classList.add('active');
    }
  });
}

function setupStarRating() {
  const stars = document.querySelectorAll('.star-rating-star');
  const ratingInput = document.getElementById('reviewRating');

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.dataset.rating);
      if (ratingInput) ratingInput.value = rating;

      stars.forEach(s => {
        const starRating = parseInt(s.dataset.rating);
        if (starRating <= rating) {
          s.textContent = '★';
          s.classList.add('active');
        } else {
          s.textContent = '☆';
          s.classList.remove('active');
        }
      });
    });

    star.addEventListener('mouseenter', () => {
      const rating = parseInt(star.dataset.rating);
      stars.forEach(s => {
        const starRating = parseInt(s.dataset.rating);
        if (starRating <= rating) {
          s.textContent = '★';
        } else {
          s.textContent = '☆';
        }
      });
    });

    star.addEventListener('mouseleave', () => {
      const currentRating = parseInt(ratingInput?.value) || 0;
      stars.forEach(s => {
        const starRating = parseInt(s.dataset.rating);
        if (starRating <= currentRating) {
          s.textContent = '★';
        } else {
          s.textContent = '☆';
        }
      });
    });
  });
}

function formatWhatsAppReview(formData) {
  // Convert rating to stars without using unicode symbols
  const ratingText = `${formData.rating}/5 stars`;

  let message = `*NEW CLIENT REVIEW - TASSEL STUDIO*\n`;
  message += `----------------------------------------\n\n`;

  message += `Reviewer: ${formData.name}\n`;
  message += `Rating: ${ratingText}\n`;
  message += `Service: ${formData.service}\n`;
  if (formData.staff) message += `Staff: ${formData.staff}\n`;
  message += `Date: ${formData.date}\n\n`;

  message += `Title: ${formData.title}\n\n`;
  message += `Review:\n${formData.message}\n\n`;

  if (formData.highlights && formData.highlights.length > 0) {
    message += `Highlights:\n`;
    formData.highlights.forEach(h => {
      message += `  - ${h}\n`;
    });
    message += `\n`;
  }

  message += `Permission: ${formData.permission ? 'Yes - can share on website' : 'No'}\n`;
  message += `----------------------------------------\n`;
  message += `Thank you for your feedback!`;

  return encodeURIComponent(message);
}

function sendReviewToWhatsApp(event) {
  event.preventDefault();

  const rating = document.getElementById('reviewRating')?.value;
  const name = document.getElementById('reviewName')?.value;
  const service = document.getElementById('reviewService')?.value;
  const staff = document.getElementById('reviewStaff')?.value;
  const date = document.getElementById('reviewDate')?.value;
  const title = document.getElementById('reviewTitle')?.value;
  const message = document.getElementById('reviewMessage')?.value;
  const permission = document.getElementById('reviewPermission')?.checked;

  const highlights = [];
  document.querySelectorAll('input[name="highlights"]:checked').forEach(cb => {
    highlights.push(cb.value);
  });

  if (!rating || !name || !service || !date || !title || !message) {
    alert('Please fill in all required fields (*)');
    return;
  }

  if (!permission) {
    alert('Please grant permission to share your review');
    return;
  }

  const formData = {
    rating: rating,
    name: name,
    service: service,
    staff: staff,
    date: date,
    title: title,
    message: message,
    highlights: highlights,
    permission: permission
  };

  const formattedMessage = formatWhatsAppReview(formData);
  const whatsappNumber = '27729605153';
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${formattedMessage}`;

  window.open(whatsappURL, '_blank');

  setTimeout(() => {
    closeReviewModal();
  }, 500);

  console.log('Review submitted:', formData);
}

// ========== TEAM MEMBERS DATA ==========
const teamMembers = [
  {
    id: 1,
    name: "Sandra",
    role: "Staff - Nails Department",
    specialization: "Nail Tech",
    image: "assets/images/team/sandra.jpeg",
    bio: "Sandra is a skilled nail technician with a passion for creating beautiful and unique nail designs.",
    quote: "Beautiful nails are the perfect finishing touch to any look.",
    instagram: "https://instagram.com/",
    whatsapp: "https://wa.me/27729605153"
  },
  {
    id: 2,
    name: "Nomonde",
    role: "Staff - Beauty and Skincare Department",
    specialization: "Beauty Therapist",
    image: "assets/images/team/nomonde.jpeg",
    bio: "Nomonde brings precision and artistry to every treatment. Her expertise in skincare helps clients achieve healthy, glowing skin.",
    quote: "Healthy skin is beautiful skin. Let me help you find your glow.",
    instagram: "https://instagram.com/",
    whatsapp: "https://wa.me/27729605153"
  },
  {
    id: 3,
    name: "Natasha",
    role: "Staff - Hair and Kiddies Department",
    specialization: "Kiddies Hair Stylist",
    image: "assets/images/team/natasha.jpeg",
    bio: "Natasha's creative styling and gentle approach have made her a favorite among young clients. She specializes in creating magical hairstyles for children.",
    quote: "Every child deserves to feel special and confident in their own style.",
    instagram: "https://instagram.com/",
    whatsapp: "https://wa.me/27729605153"
  },
  {
    id: 4,
    name: "Cynthia",
    role: "Staff - Hair and Kiddies Department",
    specialization: "Kiddies Hair Stylist",
    image: "assets/images/team/cynthia.jpeg",
    bio: "Cynthia's creative styling and gentle approach have made her a favorite among young clients. She specializes in creating magical hairstyles for children.",
    quote: "Beautiful hair is the perfect way to express your child's unique personality.",
    instagram: "https://instagram.com/",
    whatsapp: "https://wa.me/27729605153"
  },
  {
    id: 5,
    name: "Tiny",
    role: "Staff - Hair and Kiddies Department",
    specialization: "Kiddies Hair Stylist",
    image: "assets/images/team/tiny.jpeg",
    bio: "Tiny's creative styling and gentle approach have made her a favorite among young clients. She specializes in creating magical hairstyles for children.",
    quote: "Beautiful hair is the perfect way to express your child's unique personality.",
    instagram: "https://instagram.com/",
    whatsapp: "https://wa.me/27729605153"
  },
  {
    id: 6,
    name: "Thando",
    role: "Staff - Hair and Kiddies Department",
    specialization: "Kiddies Hair Stylist",
    image: "assets/images/team/thando.jpeg",
    bio: "Thando's creative styling and gentle approach have made her a favorite among young clients. She specializes in creating magical hairstyles for children.",
    quote: "Beautiful hair is the perfect way to express your child's unique personality.",
    instagram: "https://instagram.com/",
    whatsapp: "https://wa.me/27729605153"
  },
  {
    id: 7,
    name: "Keisha",
    role: "Staff - Receptionist and Hair Department",
    specialization: "Hair Stylist, Receptionist",
    image: "assets/images/team/keisha.jpeg",
    bio: "The friendly face behind your bookings and the one keeping you updated on Tassel's latest offers. She's dedicated to making your experience smooth from start to finish.",
    quote: "Your smile is our greatest reward. Let me help you book your perfect appointment.",
    instagram: "https://instagram.com/",
    whatsapp: "https://wa.me/27729605153"
  }
];

// ========== TEAM SECTION FUNCTIONS ==========
function generateTeamCards() {
  const teamGrid = document.getElementById('teamGrid');
  if (!teamGrid) return;

  teamGrid.innerHTML = teamMembers.map(member => `
        <div class="team-card" data-id="${member.id}" style="opacity: 1; transform: none;">
            <div class="team-image-wrapper">
                <img src="${member.image}" 
                     alt="${member.name}" 
                     class="team-image" 
                     loading="lazy"
                     onerror="this.onerror=null; this.src='https://placehold.co/400x400/9a8060/white?text=${member.name.charAt(0)}'">
            </div>
            <div class="team-info">
                <h3>${member.name}</h3>
                <p class="team-role">${member.role}</p>
                <p class="team-specialization">${member.specialization}</p>
                <div class="team-social">
                    <a href="${member.instagram}" target="_blank" class="social-icon" onclick="event.stopPropagation()">📷</a>
                    <a href="${member.whatsapp}" target="_blank" class="social-icon" onclick="event.stopPropagation()">💬</a>
                </div>
            </div>
        </div>
    `).join('');

  document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('social-icon') || e.target.closest('.social-icon')) return;
      const memberId = parseInt(card.dataset.id);
      openTeamModal(memberId);
    });
  });
}

function openTeamModal(memberId) {
  const member = teamMembers.find(m => m.id === memberId);
  if (!member) return;

  const modal = document.getElementById('teamModal');
  if (!modal) return;

  const modalImage = document.getElementById('modalImage');
  const modalName = document.getElementById('modalName');
  const modalRole = document.getElementById('modalRole');
  const modalSpecialization = document.getElementById('modalSpecialization');
  const modalBio = document.getElementById('modalBio');
  const modalQuote = document.getElementById('modalQuote');
  const modalInstagram = document.getElementById('modalInstagram');
  const modalWhatsapp = document.getElementById('modalWhatsapp');

  modalImage.src = member.image;
  modalImage.alt = member.name;
  modalName.textContent = member.name;
  modalRole.textContent = member.role;
  modalSpecialization.textContent = member.specialization;
  modalBio.textContent = member.bio;
  modalQuote.textContent = `"${member.quote}"`;
  modalInstagram.href = member.instagram;
  modalWhatsapp.href = member.whatsapp;

  modal.classList.add('show');
}

function setupTeamModal() {
  const modal = document.getElementById('teamModal');
  if (!modal) return;

  const closeBtn = document.querySelector('.team-modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      modal.classList.remove('show');
    }
  });
}

// ========== DOM CONTENT LOADED INITIALIZATION ==========
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
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
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
      if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
      if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());
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

  // ========== GALLERY FILTER ==========
  const filterBtns = document.querySelectorAll('.filter-btn');
  const mediaBtns = document.querySelectorAll('.media-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentCategory = 'all';
  let currentMedia = 'all';

  function filterGallery() {
    galleryItems.forEach(item => {
      const categoryMatch = currentCategory === 'all' || item.getAttribute('data-category') === currentCategory;
      const mediaMatch = currentMedia === 'all' || item.getAttribute('data-media') === currentMedia;
      item.style.display = (categoryMatch && mediaMatch) ? 'block' : 'none';
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter');
      filterGallery();
    });
  });

  mediaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      mediaBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMedia = btn.getAttribute('data-media');
      filterGallery();
    });
  });

  // ========== LIGHTBOX GALLERY ==========
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
    updateLightboxContent(visibleMediaItems[currentMediaIndex]);
    lightbox.classList.add('show');
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      updateVisibleMediaItems();
      const index = visibleMediaItems.findIndex(i => i === item);
      if (index !== -1) openLightbox(index);
    });
  });

  function navigateLightbox(direction) {
    if (visibleMediaItems.length === 0) return;
    if (lightboxVideo.style.display === 'block') lightboxVideo.pause();
    if (direction === 'next') {
      currentMediaIndex = (currentMediaIndex + 1) % visibleMediaItems.length;
    } else {
      currentMediaIndex = (currentMediaIndex - 1 + visibleMediaItems.length) % visibleMediaItems.length;
    }
    updateLightboxContent(visibleMediaItems[currentMediaIndex]);
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

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') lightboxClose.click();
    else if (e.key === 'ArrowLeft') navigateLightbox('prev');
    else if (e.key === 'ArrowRight') navigateLightbox('next');
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
      if (index < 0) index = 0;
      if (index >= totalSlides) index = totalSlides - 1;
      currentSpecialIndex = index;
      const scrollAmount = specialSlides[currentSpecialIndex].offsetLeft;
      specialsCarousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      specialsDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSpecialIndex);
      });
    }

    function nextSpecial() {
      updateSpecialsCarousel(currentSpecialIndex < totalSlides - 1 ? currentSpecialIndex + 1 : 0);
    }

    function prevSpecial() {
      updateSpecialsCarousel(currentSpecialIndex > 0 ? currentSpecialIndex - 1 : totalSlides - 1);
    }

    function resetAutoPlay() {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(() => { if (isAutoPlaying) nextSpecial(); }, 5000);
    }

    specialsPrev.addEventListener('click', () => { prevSpecial(); resetAutoPlay(); });
    specialsNext.addEventListener('click', () => { nextSpecial(); resetAutoPlay(); });
    specialsDots.forEach((dot, index) => {
      dot.addEventListener('click', () => { updateSpecialsCarousel(index); resetAutoPlay(); });
    });

    const carouselContainer = document.querySelector('.specials-carousel-container');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', () => { isAutoPlaying = false; });
      carouselContainer.addEventListener('mouseleave', () => { isAutoPlaying = true; resetAutoPlay(); });
    }

    specialsCarousel.addEventListener('scroll', () => {
      const slideWidth = specialSlides[0]?.offsetWidth || 0;
      const newIndex = Math.round(specialsCarousel.scrollLeft / slideWidth);
      if (newIndex !== currentSpecialIndex && newIndex >= 0 && newIndex < totalSlides) {
        currentSpecialIndex = newIndex;
        specialsDots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentSpecialIndex);
        });
      }
    });

    updateSpecialsCarousel(0);
    resetAutoPlay();
    window.addEventListener('resize', () => updateSpecialsCarousel(currentSpecialIndex));
  }

  // ========== PDF DOWNLOAD TRACKING ==========
  document.querySelectorAll('.service-card[href$=".pdf"]').forEach(link => {
    link.addEventListener('click', () => {
      const serviceName = link.querySelector('.service-name')?.textContent || 'Price List';
      console.log(`PDF download initiated: ${serviceName}`);
    });
  });

  // ========== BOOKING MODAL SETUP ==========
  const bookingModalClose = document.querySelector('.booking-modal-close');
  const cancelBookingBtn = document.getElementById('cancelBookingBtn');
  const serviceCategorySelect = document.getElementById('serviceCategory');
  const bookingForm = document.getElementById('bookingForm');
  const dateInput = document.getElementById('preferredDate');

  if (bookingModalClose) bookingModalClose.addEventListener('click', closeBookingModal);
  if (cancelBookingBtn) cancelBookingBtn.addEventListener('click', closeBookingModal);
  if (serviceCategorySelect) serviceCategorySelect.addEventListener('change', updateServiceDetails);
  if (bookingForm) bookingForm.addEventListener('submit', sendBookingToWhatsApp);
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  window.addEventListener('click', (e) => {
    const modal = document.getElementById('bookingModal');
    if (e.target === modal) closeBookingModal();
    const reviewModal = document.getElementById('reviewModal');
    if (e.target === reviewModal) closeReviewModal();
  });

  // ========== REVIEW MODAL SETUP ==========
  setupStarRating();
  const reviewModalClose = document.querySelector('.review-modal-close');
  const cancelReviewBtn = document.getElementById('cancelReviewBtn');
  const reviewForm = document.getElementById('reviewForm');
  const reviewDateInput = document.getElementById('reviewDate');

  if (reviewModalClose) reviewModalClose.addEventListener('click', closeReviewModal);
  if (cancelReviewBtn) cancelReviewBtn.addEventListener('click', closeReviewModal);
  if (reviewForm) reviewForm.addEventListener('submit', sendReviewToWhatsApp);
  if (reviewDateInput) {
    const today = new Date().toISOString().split('T')[0];
    reviewDateInput.max = today;
  }

  // ========== TEAM SECTION INITIALIZATION ==========
  generateTeamCards();
  setupTeamModal();
});