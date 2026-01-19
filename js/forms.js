/**
 * ZINARA FORM VALIDATION & HANDLING
 * Accessible form validation with inline error messages
 */

(function() {
  'use strict';
  
  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Kenyan phone number regex (+254...)
  const phoneRegex = /^\+254[0-9]{9}$/;
  
  /**
   * Validate individual field
   */
  function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.required || field.hasAttribute('aria-required');
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field check
    if (required && !value) {
      return setFieldError(field, 'This field is required');
    }
    
    // Email validation
    if (type === 'email' && value && !emailRegex.test(value)) {
      return setFieldError(field, 'Enter a valid email address');
    }
    
    // Phone validation
    if (type === 'tel' && value && !phoneRegex.test(value)) {
      return setFieldError(field, 'Enter a valid Kenyan phone number (+254...)');
    }
    
    // Number validation
    if (type === 'number' && value) {
      const min = field.getAttribute('min');
      const max = field.getAttribute('max');
      const numValue = parseFloat(value);
      
      if (min && numValue < parseFloat(min)) {
        return setFieldError(field, `Minimum value is ${min}`);
      }
      if (max && numValue > parseFloat(max)) {
        return setFieldError(field, `Maximum value is ${max}`);
      }
    }
    
    return true;
  }
  
  /**
   * Set field error state
   */
  function setFieldError(field, message) {
    field.classList.add('form__input--error');
    field.setAttribute('aria-invalid', 'true');
    
    // Create or update error message
    let errorEl = field.parentElement.querySelector('.form__error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'form__error';
      errorEl.setAttribute('role', 'alert');
      field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
    
    // Link error to field for screen readers
    const errorId = `${field.id || field.name}-error`;
    errorEl.id = errorId;
    field.setAttribute('aria-describedby', errorId);
    
    return false;
  }
  
  /**
   * Clear field error state
   */
  function clearFieldError(field) {
    field.classList.remove('form__input--error');
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    
    const errorEl = field.parentElement.querySelector('.form__error');
    if (errorEl) {
      errorEl.remove();
    }
  }
  
  /**
   * Validate entire form
   */
  function validateForm(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    let firstInvalidField = null;
    
    fields.forEach(field => {
      if (!validateField(field) && !firstInvalidField) {
        firstInvalidField = field;
        isValid = false;
      }
    });
    
    // Focus first invalid field
    if (firstInvalidField) {
      firstInvalidField.focus();
    }
    
    return isValid;
  }
  
  /**
   * Handle form submission
   */
  function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    if (!validateForm(form)) {
      return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    /**
     * TODO: Replace with actual form submission endpoint
     * 
     * Example fetch implementation:
     * 
     * fetch(form.action, {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify(data)
     * })
     * .then(response => response.json())
     * .then(result => {
     *   showSuccess(form, 'Thank you! We\'ll contact you within 24 hours.');
     *   form.reset();
     * })
     * .catch(error => {
     *   showError(form, 'Something went wrong. Please try again or email us directly.');
     * })
     * .finally(() => {
     *   submitBtn.disabled = false;
     *   submitBtn.textContent = originalText;
     * });
     */
    
    // Simulated submission (remove this in production)
    setTimeout(() => {
      console.log('Form data:', data);
      showSuccess(form, 'Audit request received. We\'ll contact you within 24 hours to schedule.');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }, 1000);
  }
  
  /**
   * Show success message
   */
  function showSuccess(form, message) {
    // Remove existing messages
    const existingMsg = form.querySelector('.form__success, .form__error');
    if (existingMsg) existingMsg.remove();
    
    const successEl = document.createElement('div');
    successEl.className = 'form__success';
    successEl.setAttribute('role', 'status');
    successEl.setAttribute('aria-live', 'polite');
    successEl.textContent = message;
    
    form.insertBefore(successEl, form.firstChild);
    
    // Scroll to message
    successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  /**
   * Show error message
   */
  function showError(form, message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'form__error';
    errorEl.setAttribute('role', 'alert');
    errorEl.textContent = message;
    
    form.insertBefore(errorEl, form.firstChild);
    errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  /**
   * Initialize all forms
   */
  function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Prevent default HTML5 validation
      form.setAttribute('novalidate', '');
      
      // Add submit handler
      form.addEventListener('submit', handleFormSubmit);
      
      // Add real-time validation on blur
      const fields = form.querySelectorAll('input, textarea, select');
      fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        
        // Clear error on input
        field.addEventListener('input', () => {
          if (field.classList.contains('form__input--error')) {
            clearFieldError(field);
          }
        });
      });
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }
  
})();
