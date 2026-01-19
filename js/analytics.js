/**
 * ZINARA ANALYTICS EVENT TRACKING
 * 
 * This file sets up analytics event tracking hooks for:
 * - CTA clicks
 * - Form submissions
 * - Scroll depth
 * - Section visibility
 * 
 * INTEGRATION INSTRUCTIONS:
 * 1. Install Google Analytics 4 or your analytics platform
 * 2. Replace the trackEvent() function with your actual tracking code
 * 3. Uncomment the integration section below
 */

(function() {
  'use strict';
  
  /**
   * ANALYTICS INTEGRATION - TODO: Replace with actual tracking service
   * 
   * Example GA4 integration:
   * 
   * function trackEvent(eventName, eventParams = {}) {
   *   if (typeof gtag === 'function') {
   *     gtag('event', eventName, eventParams);
   *   }
   * }
   * 
   * Example for other platforms (Mixpanel, Amplitude, etc.):
   * 
   * function trackEvent(eventName, eventParams = {}) {
   *   if (typeof mixpanel !== 'undefined') {
   *     mixpanel.track(eventName, eventParams);
   *   }
   * }
   */
  
  function trackEvent(eventName, eventParams = {}) {
    // TODO: Replace with actual analytics integration
    console.log('[Analytics Event]', eventName, eventParams);
    
    // Uncomment and modify for Google Analytics 4:
    // if (typeof gtag === 'function') {
    //   gtag('event', eventName, eventParams);
    // }
    
    // Uncomment for Mixpanel:
    // if (typeof mixpanel !== 'undefined') {
    //   mixpanel.track(eventName, eventParams);
    // }
  }
  
  // Track page view
  trackEvent('page_view', {
    page_path: window.location.pathname,
    page_title: document.title
  });
  
  /**
   * CTA CLICK TRACKING
   * Tracks all buttons and links with data-event attribute
   */
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-event]');
    if (target) {
      const eventName = target.getAttribute('data-event');
      trackEvent('cta_click', {
        event_category: 'engagement',
        event_label: eventName,
        element_text: target.textContent.trim(),
        element_href: target.href || null
      });
    }
  });
  
  /**
   * FORM SUBMISSION TRACKING
   * Tracks all form submissions
   */
  document.addEventListener('submit', (e) => {
    const form = e.target;
    const formId = form.id || 'unknown';
    const formAction = form.action || window.location.href;
    
    trackEvent('form_submit', {
      event_category: 'conversion',
      event_label: formId,
      form_action: formAction
    });
  });
  
  /**
   * SCROLL DEPTH TRACKING
   * Tracks when users scroll to 25%, 50%, 75%, and 100% of page
   */
  (function trackScrollDepth() {
    const thresholds = [25, 50, 75, 100];
    const tracked = new Set();
    
    function checkScrollDepth() {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const percentage = Math.round((scrolled / scrollHeight) * 100);
      
      thresholds.forEach(threshold => {
        if (percentage >= threshold && !tracked.has(threshold)) {
          tracked.add(threshold);
          trackEvent('scroll_depth', {
            event_category: 'engagement',
            event_label: `${threshold}_percent`,
            value: threshold
          });
        }
      });
    }
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(checkScrollDepth, 100);
    });
  })();
  
  /**
   * SECTION VISIBILITY TRACKING
   * Tracks when major sections become visible using Intersection Observer
   */
  (function trackSectionVisibility() {
    const sections = document.querySelectorAll('section[id], section[data-section]');
    
    if (!sections.length || !('IntersectionObserver' in window)) return;
    
    const observerOptions = {
      threshold: 0.5, // 50% of section must be visible
      rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id || entry.target.getAttribute('data-section');
          
          trackEvent('section_view', {
            event_category: 'engagement',
            event_label: sectionId || 'unnamed_section'
          });
          
          // Stop observing after first view
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
  })();
  
  /**
   * TIME ON PAGE TRACKING
   * Tracks engagement time in 30-second intervals
   */
  (function trackTimeOnPage() {
    let timeOnPage = 0;
    const interval = 30000; // 30 seconds
    
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        timeOnPage += interval;
        
        trackEvent('engagement_time', {
          event_category: 'engagement',
          event_label: 'time_on_page',
          value: timeOnPage / 1000 // Convert to seconds
        });
      }
    }, interval);
  })();
  
  /**
   * OUTBOUND LINK TRACKING
   * Tracks clicks on external links
   */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.href;
    const isExternal = href && 
      link.hostname !== window.location.hostname &&
      href.startsWith('http');
    
    if (isExternal) {
      trackEvent('outbound_click', {
        event_category: 'engagement',
        event_label: href,
        outbound_url: href
      });
    }
  });
  
  /**
   * ERROR TRACKING
   * Tracks JavaScript errors
   */
  window.addEventListener('error', (e) => {
    trackEvent('javascript_error', {
      event_category: 'error',
      event_label: e.message,
      error_file: e.filename,
      error_line: e.lineno
    });
  });
  
})();

/**
 * ANALYTICS EVENTS DOCUMENTATION
 * 
 * All tracked events and their parameters:
 * 
 * 1. page_view
 *    - page_path: Current URL path
 *    - page_title: Page title
 * 
 * 2. cta_click
 *    - event_category: 'engagement'
 *    - event_label: Value from data-event attribute
 *    - element_text: Button/link text
 *    - element_href: Link destination (if applicable)
 * 
 * 3. form_submit
 *    - event_category: 'conversion'
 *    - event_label: Form ID
 *    - form_action: Form action URL
 * 
 * 4. scroll_depth
 *    - event_category: 'engagement'
 *    - event_label: '25_percent', '50_percent', '75_percent', '100_percent'
 *    - value: Numeric percentage
 * 
 * 5. section_view
 *    - event_category: 'engagement'
 *    - event_label: Section ID or data-section value
 * 
 * 6. engagement_time
 *    - event_category: 'engagement'
 *    - event_label: 'time_on_page'
 *    - value: Seconds on page
 * 
 * 7. outbound_click
 *    - event_category: 'engagement'
 *    - event_label: External URL
 *    - outbound_url: Full external URL
 * 
 * 8. javascript_error
 *    - event_category: 'error'
 *    - event_label: Error message
 *    - error_file: File where error occurred
 *    - error_line: Line number of error
 */
