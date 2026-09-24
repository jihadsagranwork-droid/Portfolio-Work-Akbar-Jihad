// 1. On-Demand Dynamic Video Loader
function loadVideo(container, iframeSrc) {
  if (!container) return;
  container.innerHTML = `<iframe src="${iframeSrc}" allow="autoplay; fullscreen; picture-in-picture" frameborder="0" allowfullscreen style="width:100%; height:100%; border:none; display:block;"></iframe>`;
}

// 2. Carousel Controls for Photo Highlights
function moveCarousel(carouselId, direction) {
  var container = document.getElementById(carouselId);
  if (!container) return;

  var slides = container.querySelectorAll('.carousel-slide');
  var counter = container.querySelector('.carousel-counter');
  var currentIndex = Array.from(slides).findIndex(function(slide) {
    return slide.classList.contains('active');
  });

  if (currentIndex === -1) currentIndex = 0;

  slides[currentIndex].classList.remove('active');
  var newIndex = (currentIndex + direction + slides.length) % slides.length;
  slides[newIndex].classList.add('active');

  if (counter) {
    counter.innerText = (newIndex + 1) + ' / ' + slides.length;
  }
}

// 3. Helper toggle function for nav links
function toggleMenu() {
  var navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.classList.remove('active');
  }
}

// 4. Main Event Initializer
document.addEventListener('DOMContentLoaded', function() {
  // Dynamic Current Year in Footer
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Sticky Navbar Shadow on Scroll
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Mobile Menu Hamburger Toggle
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }

  // Scroll Fade-In Observer & Counter Trigger
  var fadeInElements = document.querySelectorAll('.fade-in');
  var observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  var observer = new IntersectionObserver(function(entries, observerInstance) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        var counterElements = entry.target.querySelectorAll('.stat-number');
        counterElements.forEach(function(counter) {
          runCounter(counter);
        });

        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeInElements.forEach(function(el) {
    observer.observe(el);
  });

  // Animated Metric Counter
  function runCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = "true";

    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 2000;
    var stepTime = 30;
    var steps = duration / stepTime;
    var increment = target / steps;
    var current = 0;

    var timer = setInterval(function() {
      current += increment;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, stepTime);
  }

  // Contact Form Submission
  var contactForm = document.getElementById('contactForm');
  var submitBtn = document.getElementById('submitBtn');
  var formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';
      formStatus.textContent = '';
      formStatus.className = 'form-status';

      var formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
      };

      // Replace with your executable URL ending in /exec
      var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxvDqsiNCFs4QOYKccHfIPGQG0HII0440Uzf6wEXGE/exec';

      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      .then(function() {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        formStatus.textContent = 'Message sent successfully!';
        formStatus.className = 'form-status success';
        document.getElementById('contactForm').reset();
      })
      .catch(function(error) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        formStatus.textContent = 'Failed to send message. Please try again.';
        formStatus.className = 'form-status error';
      });
    });
  }
});