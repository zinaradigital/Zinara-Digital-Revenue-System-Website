/**
 * ZINARA CHATBOT WIDGET
 * Lightweight chat interface with documented backend connector
 * 
 * BACKEND INTEGRATION INSTRUCTIONS:
 * Replace the sendToBot() function with actual API call to your chatbot service.
 * Example services: Dialogflow, Rasa, Custom API, WhatsApp Business API
 */

(function() {
  'use strict';
  
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');
  
  if (!chatbotToggle || !chatbotWindow || !chatbotMessages) return;
  
  let isOpen = false;
  
  // Toggle chatbot window
  function toggleChat() {
    isOpen = !isOpen;
    chatbotWindow.classList.toggle('chatbot__window--open', isOpen);
    chatbotToggle.setAttribute('aria-expanded', isOpen);
    
    if (isOpen && chatbotInput) {
      chatbotInput.focus();
    }
  }
  
  // Add message to chat
  function addMessage(text, sender = 'user') {
    const messageEl = document.createElement('p');
    messageEl.style.cssText = `
      padding: var(--space-3);
      border-radius: var(--border-radius);
      background: ${sender === 'user' ? 'var(--color-primary)' : 'var(--color-background-alt)'};
      color: ${sender === 'user' ? 'var(--color-dark)' : 'var(--color-text)'};
      max-width: 80%;
      align-self: ${sender === 'user' ? 'flex-end' : 'flex-start'};
      margin-bottom: var(--space-3);
    `;
    messageEl.innerHTML = `<strong>${sender === 'user' ? 'You' : 'Assistant'}:</strong> ${text}`;
    chatbotMessages.appendChild(messageEl);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }
  
  /**
   * BACKEND CONNECTOR - TODO: Replace with actual API integration
   * 
   * This function should be replaced with a real API call to your chatbot backend.
   * 
   * Example implementation with fetch:
   * 
   * async function sendToBot(message) {
   *   try {
   *     const response = await fetch('https://your-api.com/chat', {
   *       method: 'POST',
   *       headers: { 'Content-Type': 'application/json' },
   *       body: JSON.stringify({ message, sessionId: getSessionId() })
   *     });
   *     const data = await response.json();
   *     return data.reply;
   *   } catch (error) {
   *     console.error('Chatbot API error:', error);
   *     return 'Sorry, I encountered an error. Please try again or contact us directly.';
   *   }
   * }
   */
  async function sendToBot(message) {
    // TODO: Replace this placeholder with actual backend integration
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple keyword-based responses (placeholder logic)
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('audit') || lowerMsg.includes('diagnostic')) {
      return 'I can help you request a Revenue Recovery Audit. This is a 45-minute diagnostic session at no cost. Would you like to <a href="/audit">schedule an audit</a>?';
    }
    
    if (lowerMsg.includes('price') || lowerMsg.includes('cost')) {
      return 'Our pricing depends on your specific infrastructure needs. The initial diagnostic audit is free. After diagnosis, we provide a custom quote based on required systems. Would you like to <a href="/audit">request an audit</a>?';
    }
    
    if (lowerMsg.includes('service') || lowerMsg.includes('system')) {
      return 'We rebuild six core revenue systems: Workflow Automation, Revenue Infrastructure, Lead Handling, AI Integration, Marketing Infrastructure, and Communication Systems. Which would you like to learn about? Or view all on our <a href="/systems">systems page</a>.';
    }
    
    if (lowerMsg.includes('contact') || lowerMsg.includes('phone') || lowerMsg.includes('email')) {
      return 'You can reach us at:<br>Email: info@zinara.co.ke<br>Phone: +254 798 859 452<br>Or use our <a href="/contact">contact form</a>.';
    }
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      return 'Hello! I can help you understand where your revenue system is failing. What would you like to know about revenue recovery, our diagnostic audit, or our systems?';
    }
    
    // Default response
    return 'I can help you with:<br>- Revenue Recovery Audit information<br>- Our six core systems<br>- Contact and pricing<br>What would you like to know? Or <a href="/audit">request an audit directly</a>.';
  }
  
  // Handle sending message
  async function handleSend() {
    const message = chatbotInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    chatbotInput.value = '';
    
    // Show typing indicator
    const typingEl = document.createElement('p');
    typingEl.className = 'typing-indicator';
    typingEl.textContent = 'Assistant is typing...';
    typingEl.style.cssText = 'color: var(--color-text-muted); font-size: var(--font-size-sm); font-style: italic;';
    chatbotMessages.appendChild(typingEl);
    
    // Get bot response
    try {
      const response = await sendToBot(message);
      
      // Remove typing indicator
      typingEl.remove();
      
      // Add bot response
      addMessage(response, 'bot');
    } catch (error) {
      typingEl.remove();
      addMessage('Sorry, I encountered an error. Please try contacting us directly at info@zinara.co.ke', 'bot');
      console.error('Chatbot error:', error);
    }
  }
  
  // Event listeners
  chatbotToggle.addEventListener('click', toggleChat);
  
  if (chatbotSend) {
    chatbotSend.addEventListener('click', handleSend);
  }
  
  if (chatbotInput) {
    chatbotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSend();
      }
    });
  }
  
  // Close chatbot on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      toggleChat();
    }
  });
  
  // Focus trap in chatbot window
  chatbotWindow.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    
    if (e.key === 'Tab') {
      const focusableElements = chatbotWindow.querySelectorAll('input, button');
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });
  
})();
