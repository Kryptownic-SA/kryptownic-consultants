/* ==========================================================================
   Kryptownic Consultants PWA - App Logic
   President: Thato Charles Mapaesa
   Services: Business Consulting, Mentorship, Consulting, Market Research, Data Analysis
   ========================================================================== */

const KC_APP = {
  // Company information
  company: {
    name: "Kryptownic Consultants (Pty) Ltd",
    shortName: "Kryptownic Consultants",
    registration: "2026/987654/07",
    president: "Thato Charles Mapaesa",
    address: "Online Platform, South Africa",
    phone: "+27 76 964 6245",
    email: "info@kryptownic.co.za",
    secondaryEmail: "krytownicconsultants@mail.com",
    website: "https://kryptownic.co.za",
    founded: "2026"
  },

  services: [
    {
      id: "business-consulting",
      title: "Business Consulting",
      icon: "📊",
      description: "Strategic advisory, operational improvement, organisational transformation, financial advisory, and change management services."
    },
    {
      id: "business-mentorship",
      title: "Business Mentorship",
      icon: "🎓",
      description: "Personalised mentorship programs for entrepreneurs, startups, and executive leadership development."
    },
    {
      id: "consulting-services",
      title: "Consulting Services",
      icon: "💼",
      description: "Specialised consulting across industries including market analysis, process optimisation, and strategic planning."
    },
    {
      id: "market-research",
      title: "Market Research",
      icon: "🔍",
      description: "Comprehensive market research, consumer behaviour analysis, competitive intelligence, and business environment studies."
    },
    {
      id: "data-analysis",
      title: "Data Analysis",
      icon: "📈",
      description: "Data-driven insights, statistical analysis, business intelligence, and predictive modelling for strategic decision-making."
    }
  ],

  // Local storage key for messages
  storageKey: 'kc_client_messages',

  // Current navigation state
  currentSection: 'home',

  // Initialize the app
  init: function() {
    this.renderCompanyInfo();
    this.renderServices();
    this.loadMessages();
    this.setupEventListeners();
    this.registerServiceWorker();
    this.checkInstallPrompt();
  },

  // Setup event listeners
  setupEventListeners: function() {
    const navButtons = document.querySelectorAll('.kc-nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const section = e.currentTarget.dataset.section;
        this.showSection(section);
      });
    });

    // Submit query form
    const form = document.getElementById('kc-client-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitQuery(e);
      });
    }

    // Refresh messages button
    const refreshBtn = document.getElementById('kc-refresh-messages');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.loadMessages());
    }
  },

  // Show a specific section
  showSection: function(sectionId) {
    document.querySelectorAll('.kc-section').forEach(section => {
      section.classList.remove('active');
    });
    const targetSection = document.getElementById('kc-section-' + sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Update nav buttons
    document.querySelectorAll('.kc-nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`.kc-nav-btn[data-section="${sectionId}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }

    this.currentSection = sectionId;

    // Load messages when navigating to messages section
    if (sectionId === 'messages') {
      this.loadMessages();
    }
  },

  // Render company info
  renderCompanyInfo: function() {
    const container = document.getElementById('kc-company-info');
    if (!container) return;

    container.innerHTML = `
      <h2>Company Information</h2>
      <div class="kc-info-row">
        <span class="kc-info-label">Company Name</span>
        <span class="kc-info-value">${this.company.shortName}</span>
      </div>
      <div class="kc-info-row">
        <span class="kc-info-label">Registration</span>
        <span class="kc-info-value">${this.company.registration}</span>
      </div>
      <div class="kc-info-row">
        <span class="kc-info-label">President</span>
        <span class="kc-info-value">${this.company.president}</span>
      </div>
      <div class="kc-info-row">
        <span class="kc-info-label">Address</span>
        <span class="kc-info-value">${this.company.address}</span>
      </div>
      <div class="kc-info-row">
        <span class="kc-info-label">Contact</span>
        <span class="kc-info-value">${this.company.phone} | ${this.company.email}</span>
      </div>
      <div class="kc-info-row">
        <span class="kc-info-label">Website</span>
        <span class="kc-info-value">${this.company.website}</span>
      </div>
    `;
  },

  // Render services
  renderServices: function() {
    const container = document.getElementById('kc-services-grid');
    if (!container) return;

    container.innerHTML = this.services.map(service => `
      <div class="kc-service-card" onclick="KC_APP.showService('${service.id}')">
        <div class="kc-service-icon">${service.icon}</div>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
      </div>
    `).join('');
  },

  // Show service detail (placeholder for future expansion)
  showService: function(serviceId) {
    const service = this.services.find(s => s.id === serviceId);
    if (service) {
      alert(`${service.title}\n\n${service.description}\n\nFor inquiries about this service, please submit a query through the Client Portal.`);
    }
  },

  // Submit query form
  submitQuery: function(event) {
    const form = event.target;
    const formData = new FormData(form);

    const message = {
      id: Date.now().toString(),
      type: formData.get('messageType') || 'query',
      name: formData.get('name') || 'Anonymous',
      email: formData.get('email') || '',
      subject: formData.get('subject') || '',
      message: formData.get('message') || '',
      service: formData.get('service') || '',
      timestamp: new Date().toISOString(),
      status: 'new'
    };

    // Save to local storage
    this.saveMessage(message);

    // Show success
    this.showSuccessMessage();

    // Reset form
    form.reset();

    // Trigger notification if supported
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      this.sendNotification(message);
    }
  },

  // Save message to local storage
  saveMessage: function(message) {
    const messages = this.getMessages();
    messages.unshift(message);
    localStorage.setItem(this.storageKey, JSON.stringify(messages));
  },

  // Get all messages
  getMessages: function() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  },

  // Load and display messages
  loadMessages: function() {
    const container = document.getElementById('kc-messages-list');
    if (!container) return;

    const messages = this.getMessages();

    if (messages.length === 0) {
      container.innerHTML = `
        <div class="kc-form-subtitle" style="text-align:center; padding: 30px;">
          No client messages yet. Be the first to send a query!
        </div>
      `;
      return;
    }

    container.innerHTML = messages.map(msg => {
      const typeClass = 'kc-type-' + msg.type;
      const typeLabel = msg.type.charAt(0).toUpperCase() + msg.type.slice(1);
      const date = new Date(msg.timestamp).toLocaleString();

      return `
        <div class="kc-message-card">
          <div class="kc-message-header">
            <span class="kc-message-type ${typeClass}">${typeLabel}</span>
            <span class="kc-message-date">${date}</span>
          </div>
          <div class="kc-message-subject">${msg.subject || '(No subject)'}</div>
          <div class="kc-message-content">
            <strong>From:</strong> ${msg.name} (${msg.email || 'No email'})
            ${msg.service ? '| <strong>Service:</strong> ' + msg.service : ''}
            <br><br>${msg.message}
          </div>
        </div>
      `;
    }).join('');
  },

  // Show success message after form submission
  showSuccessMessage: function() {
    const container = document.getElementById('kc-form-container');
    if (container) {
      container.innerHTML = `
        <div class="kc-success">
          <div class="kc-success-icon">✓</div>
          <div>Your message has been sent successfully!</div>
          <p style="color: var(--kc-light-gray); font-size: 13px; margin-top: 10px;">
            Thank you for contacting Kryptownic Consultants.<br>
            We will respond to your ${this.getMessageTypeLabel()} as soon as possible.
          </p>
          <button class="kc-submit-btn" style="margin-top: 15px; background: var(--kc-primary); color: var(--kc-gold); border: 1px solid var(--kc-gold);"
            onclick="KC_APP.resetForm()">
            Send Another Message
          </button>
        </div>
      `;
    }
  },

  // Get label for message type
  getMessageTypeLabel: function() {
    const form = document.getElementById('kc-client-form');
    if (form) {
      const type = form.querySelector('select[name="messageType"]').value;
      return type;
    }
    return 'message';
  },

  // Reset form back to original
  resetForm: function() {
    const container = document.getElementById('kc-form-container');
    if (container) {
      // Reload the form section
      const formHTML = container.getAttribute('data-original');
      if (formHTML) {
        container.innerHTML = formHTML;
      } else {
        location.reload();
      }
    }
  },

  // Send a notification
  sendNotification: function(message) {
    const event = new CustomEvent('kc-new-message', { detail: message });
    window.dispatchEvent(event);
  },

  // Register service worker
  registerServiceWorker: function() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js')
        .then(reg => {
          console.log('Service Worker registered:', reg);
        })
        .catch(err => {
          console.log('Service Worker registration failed:', err);
        });
    }
  },

  // Check for install prompt
  checkInstallPrompt: function() {
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      // Could show install button here
    });

    window.addEventListener('appinstalled', () => {
      console.log('Kryptownic Consultants PWA installed');
    });
  },

  // Check online/offline status
  updateConnectionStatus: function() {
    const status = navigator.onLine ? 'online' : 'offline';
    const banner = document.getElementById('kc-connection-banner');
    if (banner) {
      if (status === 'offline') {
        banner.textContent = 'You are currently offline. Messages will be saved locally.';
        banner.style.display = 'block';
      } else {
        banner.style.display = 'none';
      }
    }
  }
};

// PWA Install logic
let deferredPrompt;
const installBtn = document.getElementById('kc-install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) {
    installBtn.style.display = 'block';
  }
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('Kryptownic app installed');
      installBtn.textContent = '✓ Installed';
      installBtn.style.background = 'var(--kc-primary)';
      installBtn.style.color = 'var(--kc-gold)';
      installBtn.style.border = '1px solid var(--kc-gold)';
    }
    deferredPrompt = null;
  });
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  KC_APP.init();

  // Save original form for reset
  const formContainer = document.getElementById('kc-form-container');
  if (formContainer) {
    formContainer.setAttribute('data-original', formContainer.innerHTML);
  }

  // Connection status
  window.addEventListener('online', () => KC_APP.updateConnectionStatus());
  window.addEventListener('offline', () => KC_APP.updateConnectionStatus());
  KC_APP.updateConnectionStatus();
});
