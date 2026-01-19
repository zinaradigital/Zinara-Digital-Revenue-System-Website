/**
 * ZINARA NAVIGATION
 * Mobile menu toggle with keyboard accessibility and focus trapping
 */

(function() {
  'use strict';
  
  const menuToggle = document.getElementById('menu-toggle');
  const navMobile = document.getElementById('nav-mobile');
  
  if (!menuToggle || !navMobile) return;
  
  let isOpen = false;
  
  // Toggle mobile menu
  function toggleMenu() {
    isOpen = !isOpen;
    
    // Update classes
    menuToggle.classList.toggle('menu-toggle--active', isOpen);
    navMobile.classList.toggle('nav-mobile--open', isOpen);
    
    // Update ARIA attributes
    menuToggle.setAttribute('aria-expanded', isOpen);
    
    // Manage body scroll
    document.body.style.overflow = isOpen ? 'hidden' : '';
    
    // Focus management
    if (isOpen) {
      const firstLink = navMobile.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  }
  
  // Click handler
  menuToggle.addEventListener('click', toggleMenu);
  
  // Close menu when clicking nav links
  const navLinks = navMobile.querySelectorAll('.nav-mobile__link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isOpen) toggleMenu();
    });
  });
  
  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      toggleMenu();
      menuToggle.focus();
    }
  });
  
  // Focus trap within mobile menu
  if (navMobile) {
    const focusableElements = navMobile.querySelectorAll('a, button');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    navMobile.addEventListener('keydown', (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Tab') {
        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    });
  }
  
  // Close mobile menu on window resize to desktop
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 768 && isOpen) {
        toggleMenu();
      }
    }, 250);
  });
  
})();
