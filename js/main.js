/**
 * iDanny Repair - Main Vanilla JavaScript
 * Handles: 
 * 1. Device Repair Estimator Logic
 * 2. Custom Form Validation with inline UI feedback
 */

document.addEventListener('DOMContentLoaded', function () {
  // --- DEVICE REPAIR ESTIMATOR ---
  const deviceSelect = document.getElementById('estimator-device');
  const brandSelect = document.getElementById('estimator-brand');
  const checkboxCards = document.querySelectorAll('.checkbox-card');
  const resultPrice = document.getElementById('result-price');

  if (deviceSelect && brandSelect && resultPrice) {
    // Pricing configurations
    const basePrices = {
      smartphone: 50,
      tablet: 70,
      laptop: 120,
      console: 90
    };

    const brandMultipliers = {
      apple: 30,
      samsung: 20,
      google: 15,
      hp: 25,
      dell: 25,
      lenovo: 25,
      sony: 20,
      microsoft: 20,
      nintendo: 15,
      other: 0
    };

    // Calculate estimated price
    function calculateEstimate() {
      const device = deviceSelect.value;
      const brand = brandSelect.value;

      if (!device || !brand) {
        resultPrice.textContent = 'RM0';
        return;
      }

      let total = basePrices[device] + brandMultipliers[brand];

      // Add checked issues
      checkboxCards.forEach(card => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
          const price = parseFloat(checkbox.dataset.price) || 0;
          total += price;
        }
      });

      // Animate price change
      animatePriceValue(resultPrice, 0, total, 400);
    }

    // Dynamic price change animation
    function animatePriceValue(obj, start, end, duration) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentVal = Math.floor(progress * (end - start) + start);
        obj.textContent = 'RM' + currentVal;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }

    // Toggle Checkbox Card styling and trigger calculation
    checkboxCards.forEach(card => {
      card.addEventListener('click', function (e) {
        // Prevent click trigger overlap when clicking the checkbox element directly
        if (e.target.tagName !== 'INPUT') {
          const checkbox = this.querySelector('input[type="checkbox"]');
          checkbox.checked = !checkbox.checked;
        }
        
        if (this.querySelector('input[type="checkbox"]').checked) {
          this.classList.add('selected');
        } else {
          this.classList.remove('selected');
        }
        
        calculateEstimate();
      });
    });

    // Event Listeners for Estimator controls
    deviceSelect.addEventListener('change', calculateEstimate);
    brandSelect.addEventListener('change', calculateEstimate);

    // Initial run
    calculateEstimate();
  }

  // --- BOOKING FORM VALIDATION ---
  const bookingForm = document.getElementById('booking-form');
  
  if (bookingForm) {
    const fields = [
      { id: 'client-name', validator: val => val.trim().length >= 3, errorMsg: 'Name must be at least 3 characters long.' },
      { id: 'client-email', validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), errorMsg: 'Please enter a valid email address.' },
      { id: 'client-phone', validator: val => /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(val) && val.trim().length >= 8, errorMsg: 'Please enter a valid phone number (min 8 digits).' },
      { id: 'device-type', validator: val => val !== '', errorMsg: 'Please select a device category.' },
      { id: 'booking-date', validator: val => {
          if (!val) return false;
          const selectedDate = new Date(val);
          selectedDate.setHours(0,0,0,0);
          const today = new Date();
          today.setHours(0,0,0,0);
          return selectedDate >= today;
        }, errorMsg: 'Booking date cannot be in the past.' }
    ];

    // Real-time validation helper
    function validateField(inputElement, fieldConfig) {
      const isValid = fieldConfig.validator(inputElement.value);
      if (isValid) {
        inputElement.classList.remove('is-invalid');
      } else {
        inputElement.classList.add('is-invalid');
      }
      return isValid;
    }

    // Bind real-time input event listeners
    fields.forEach(field => {
      const inputEl = document.getElementById(field.id);
      if (inputEl) {
        // Set error message text in DOM
        const feedbackEl = inputEl.parentNode.querySelector('.invalid-feedback');
        if (feedbackEl) {
          feedbackEl.textContent = field.errorMsg;
        }

        // Validate on blur or typing
        inputEl.addEventListener('blur', () => validateField(inputEl, field));
        inputEl.addEventListener('input', () => {
          if (inputEl.classList.contains('is-invalid')) {
            validateField(inputEl, field);
          }
        });
      }
    });

    // Submit handler
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      let isFormValid = true;
      
      fields.forEach(field => {
        const inputEl = document.getElementById(field.id);
        if (inputEl) {
          const isValid = validateField(inputEl, field);
          if (!isValid) {
            isFormValid = false;
          }
        }
      });

      if (isFormValid) {
        // Display custom success toast/box
        const successMsg = document.getElementById('form-success-message');
        if (successMsg) {
          successMsg.textContent = 'Success! Your repair booking request has been submitted. We will contact you shortly.';
          successMsg.className = 'form-message success';
          successMsg.style.display = 'block';
          
          // Smooth scroll to top of form
          bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Reset form and UI indicators
          bookingForm.reset();
          checkboxCards.forEach(c => c.classList.remove('selected'));
          const resultPrice = document.getElementById('result-price');
          if (resultPrice) resultPrice.textContent = 'RM0';
          
          // Clear success message after 6 seconds
          setTimeout(() => {
            successMsg.style.display = 'none';
          }, 6000);
        }
      }
    });
  }
});
