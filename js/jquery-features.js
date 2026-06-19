/**
 * iDanny Repair - jQuery Custom Features
 * Handles:
 * 1. Mobile Menu Toggler
 * 2. Testimonial Carousel/Slider from Scratch
 * 3. FAQ Accordion Component from Scratch
 * 4. Scroll-Reveal Viewport Animations
 */

$(document).ready(function () {
  
  // --- 1. MOBILE MENU TOGGLER ---
  const $navToggle = $('#nav-toggle');
  const $navMenu = $('#nav-menu');

  if ($navToggle.length && $navMenu.length) {
    $navToggle.on('click', function () {
      $(this).toggleClass('active');
      $navMenu.toggleClass('active');
    });

    // Close menu when clicking navigation links
    $('.nav-link').on('click', function () {
      $navToggle.removeClass('active');
      $navMenu.removeClass('active');
    });
  }


  // --- 2. CUSTOM TESTIMONIAL CAROUSEL ---
  const $slides = $('.carousel-slide');
  const $dotsContainer = $('.carousel-dots');
  let currentIndex = 0;
  let carouselInterval;

  if ($slides.length) {
    // Dynamically generate dots based on slide count
    $slides.each(function (index) {
      const activeClass = index === 0 ? 'active' : '';
      $dotsContainer.append(`<span class="carousel-dot ${activeClass}" data-index="${index}"></span>`);
    });

    const $dots = $('.carousel-dot');
    let isAnimating = false;

    function goToSlide(index) {
      if (isAnimating) return;

      // Boundaries
      if (index < 0) {
        index = $slides.length - 1;
      } else if (index >= $slides.length) {
        index = 0;
      }

      if (index === currentIndex) return;

      isAnimating = true;

      // Transition dots
      $dots.removeClass('active');
      $dots.eq(index).addClass('active');

      // Transition slides sequentially to prevent overlap
      const $activeSlide = $slides.filter('.active');
      if ($activeSlide.length) {
        $activeSlide.removeClass('active').fadeOut(200, function () {
          $slides.eq(index).addClass('active').fadeIn(200, function () {
            isAnimating = false;
          });
        });
      } else {
        $slides.eq(index).addClass('active').fadeIn(200, function () {
          isAnimating = false;
        });
      }

      currentIndex = index;
    }

    // Prev/Next Click Handlers
    $('.carousel-btn-next').on('click', function () {
      goToSlide(currentIndex + 1);
    });

    $('.carousel-btn-prev').on('click', function () {
      goToSlide(currentIndex - 1);
    });

    // Dot Navigation Click Handlers
    $dots.on('click', function () {
      const index = parseInt($(this).attr('data-index'));
      goToSlide(index);
    });

    // Auto Play Functionality
    function startAutoplay() {
      carouselInterval = setInterval(function () {
        goToSlide(currentIndex + 1);
      }, 5000);
    }

    function stopAutoplay() {
      clearInterval(carouselInterval);
    }

    // Play/Pause on hover
    $('.carousel-container').hover(stopAutoplay, startAutoplay);

    // Initial setup
    $slides.hide().eq(0).show();
    startAutoplay();
  }


  // --- 3. FAQ ACCORDION COMPONENT ---
  const $accordionHeaders = $('.accordion-header');

  if ($accordionHeaders.length) {
    $accordionHeaders.on('click', function () {
      const $currentItem = $(this).closest('.accordion-item');
      const $currentContent = $currentItem.find('.accordion-content');
      
      // Close other accordion items (accordion behavior)
      $('.accordion-item').not($currentItem).removeClass('active').find('.accordion-content').slideUp(300);

      // Toggle current item
      $currentItem.toggleClass('active');
      $currentContent.slideToggle(300);
    });
  }


  // --- 4. SCROLL-REVEAL VIEWPORT ANIMATIONS ---
  const $revealElements = $('.reveal');

  if ($revealElements.length) {
    function checkReveal() {
      const windowHeight = $(window).height();
      const revealPoint = 150; // offset pixels

      $revealElements.each(function () {
        const elementTop = this.getBoundingClientRect().top;

        if (elementTop < windowHeight - revealPoint) {
          $(this).addClass('active');
        }
      });
    }

    // Bind scroll & load events
    $(window).on('scroll load', checkReveal);
    
    // Initial run
    checkReveal();
  }
});
