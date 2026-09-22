/**
 * MARRYWITHDIGNITY - MULTI-LANGUAGE SYSTEM ENGINE
 * Seamless translation, 40+ languages, RTL auto-adjustment, persistent selection
 */

(function(window, document) {
  'use strict';

  // 1. COMPREHENSIVE LANGUAGE REGISTRY
  const LANGUAGES = [
    // Top Featured Languages
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', featured: true },
    { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰', rtl: true, featured: true },
    { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', rtl: true, featured: true },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', featured: true },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩', featured: true },
    { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷', featured: true },
    { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', featured: true },
    { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', featured: true },
    { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪', featured: true },
    { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩', featured: true },
    
    // Regional & Islamic World
    { code: 'fa', name: 'Persian', native: 'فارسی', flag: '🇮🇷', rtl: true },
    { code: 'ps', name: 'Pashto', native: 'پښتو', flag: '🇦🇫', rtl: true },
    { code: 'sd', name: 'Sindhi', native: 'سنڌي', flag: '🇵🇰', rtl: true },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ / پنجابی', flag: '🇵🇰' },
    { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'sw', name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' },
    { code: 'so', name: 'Somali', native: 'Soomaali', flag: '🇸🇴' },
    { code: 'ha', name: 'Hausa', native: 'Hausa', flag: '🇳🇬' },
    { code: 'uz', name: 'Uzbek', native: 'Oʻzbekcha', flag: '🇺🇿' },
    { code: 'az', name: 'Azerbaijani', native: 'Azərbaycan', flag: '🇦🇿' },
    { code: 'ku', name: 'Kurdish', native: 'کوردی', flag: '🇮🇶', rtl: true },

    // Global Languages
    { code: 'zh-CN', name: 'Chinese (Simplified)', native: '中文 (简体)', flag: '🇨🇳' },
    { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
    { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
    { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
    { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
    { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
    { code: 'sv', name: 'Swedish', native: 'Svenska', flag: '🇸🇪' },
    { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱' },
    { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭' },
    { code: 'el', name: 'Greek', native: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'ro', name: 'Romanian', native: 'Română', flag: '🇷🇴' },
    { code: 'uk', name: 'Ukrainian', native: 'Українська', flag: '🇺🇦' },
    { code: 'cs', name: 'Czech', native: 'Čeština', flag: '🇨🇿' },
    { code: 'hu', name: 'Hungarian', native: 'Magyar', flag: '🇭🇺' },
    { code: 'da', name: 'Danish', native: 'Dansk', flag: '🇩🇰' },
    { code: 'fi', name: 'Finnish', native: 'Suomi', flag: '🇫🇮' },
    { code: 'no', name: 'Norwegian', native: 'Norsk', flag: '🇳🇴' },
    { code: 'he', name: 'Hebrew', native: 'עבריت', flag: '🇮🇱', rtl: true }
  ];

  const RTL_LANGUAGES = ['ur', 'ar', 'fa', 'ps', 'sd', 'ku', 'he'];

  const LanguageSystem = {
    currentLang: 'en',
    isOpen: false,

    init: function() {
      // 1. Detect saved language
      this.currentLang = this.getStoredLanguage();
      
      // 2. Ensure Google Translate container exists
      this.ensureGoogleTranslateContainer();

      // 3. Render / Enhance Language Dropdowns across the page
      this.renderDropdowns();

      // 4. Apply RTL / Typography styling for the current language
      this.applyLanguageDirection(this.currentLang);

      // 5. Load Google Translate Element Engine
      this.loadGoogleTranslateScript();

      // 6. Global listeners
      this.attachGlobalListeners();
    },

    getStoredLanguage: function() {
      // Check localStorage
      const stored = localStorage.getItem('mwd_preferred_lang');
      if (stored && LANGUAGES.some(l => l.code === stored)) {
        return stored;
      }
      
      // Check googtrans cookie
      const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
      if (match) {
        const parts = match[1].split('/');
        const code = parts[parts.length - 1];
        if (code && LANGUAGES.some(l => l.code === code)) {
          return code;
        }
      }

      return 'en';
    },

    setStoredLanguage: function(code) {
      localStorage.setItem('mwd_preferred_lang', code);
      
      // Set cookie for current domain and root path
      const cookieVal = `/en/${code}`;
      document.cookie = `googtrans=${cookieVal}; path=/; max-age=31536000`;
      
      const host = window.location.hostname;
      if (host && host !== 'localhost' && !host.match(/^127\./)) {
        document.cookie = `googtrans=${cookieVal}; domain=.${host}; path=/; max-age=31536000`;
      }
    },

    ensureGoogleTranslateContainer: function() {
      if (!document.getElementById('google_translate_element')) {
        const div = document.createElement('div');
        div.id = 'google_translate_element';
        div.style.display = 'none';
        document.body.appendChild(div);
      }
    },

    loadGoogleTranslateScript: function() {
      if (window.google && window.google.translate) {
        return;
      }

      window.googleTranslateElementInit = function() {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: LANGUAGES.map(l => l.code).join(','),
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');

        // Trigger translation if not English
        const current = LanguageSystem.getStoredLanguage();
        if (current && current !== 'en') {
          setTimeout(() => LanguageSystem.triggerGoogleTranslation(current), 400);
        }
      };

      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);
      }
    },

    applyLanguageDirection: function(code) {
      const isRTL = RTL_LANGUAGES.includes(code);
      const htmlEl = document.documentElement;
      const bodyEl = document.body;

      if (isRTL) {
        htmlEl.setAttribute('dir', 'rtl');
        htmlEl.setAttribute('lang', code);
        bodyEl.classList.add('lang-rtl');
      } else {
        htmlEl.setAttribute('dir', 'ltr');
        htmlEl.setAttribute('lang', code);
        bodyEl.classList.remove('lang-rtl');
      }
    },

    renderDropdowns: function() {
      const wrappers = document.querySelectorAll('.lang-selector-wrapper');
      
      wrappers.forEach(wrapper => {
        const activeLangObj = LANGUAGES.find(l => l.code === this.currentLang) || LANGUAGES[0];
        
        wrapper.innerHTML = `
          <button type="button" class="lang-toggle-btn" aria-label="Select Language" aria-expanded="false">
            <span class="lang-globe-icon">🌐</span>
            <span class="lang-flag">${activeLangObj.flag}</span>
            <span class="lang-current-name">${activeLangObj.native}</span>
            <span class="lang-chevron">▼</span>
          </button>
          
          <div class="lang-dropdown-menu" role="menu">
            <div class="lang-search-box">
              <span class="search-icon">🔍</span>
              <input type="text" class="lang-search-input" placeholder="Search language / زبان تلاش کریں..." aria-label="Search language">
            </div>

            <div class="lang-quick-pills">
              ${LANGUAGES.filter(l => l.featured).map(l => `
                <button type="button" class="lang-quick-pill ${l.code === this.currentLang ? 'active' : ''}" data-code="${l.code}">
                  <span>${l.flag}</span> ${l.native}
                </button>
              `).join('')}
            </div>

            <div class="lang-list">
              ${LANGUAGES.map(l => `
                <button type="button" class="lang-item ${l.code === this.currentLang ? 'active' : ''}" data-code="${l.code}" role="menuitem">
                  <div class="lang-item-left">
                    <span class="lang-item-flag">${l.flag}</span>
                    <div class="lang-item-names">
                      <span class="lang-item-native">${l.native}</span>
                      <span class="lang-item-en">${l.name}</span>
                    </div>
                  </div>
                  <span class="lang-item-check">✓</span>
                </button>
              `).join('')}
            </div>
          </div>
        `;

        this.bindWrapperEvents(wrapper);
      });
    },

    bindWrapperEvents: function(wrapper) {
      const btn = wrapper.querySelector('.lang-toggle-btn');
      const dropdown = wrapper.querySelector('.lang-dropdown-menu');
      const searchInput = wrapper.querySelector('.lang-search-input');
      const langItems = wrapper.querySelectorAll('.lang-item');
      const quickPills = wrapper.querySelectorAll('.lang-quick-pill');

      if (!btn || !dropdown) return;

      // Toggle dropdown open/close
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('show');
        this.closeAllDropdowns();
        if (!isOpen) {
          dropdown.classList.add('show');
          btn.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
          }
        }
      });

      // Prevent closing when clicking inside dropdown
      dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      // Search filtering
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase().trim();
          langItems.forEach(item => {
            const nativeText = item.querySelector('.lang-item-native')?.textContent.toLowerCase() || '';
            const enText = item.querySelector('.lang-item-en')?.textContent.toLowerCase() || '';
            const code = item.getAttribute('data-code')?.toLowerCase() || '';
            
            if (nativeText.includes(query) || enText.includes(query) || code.includes(query)) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });
        });
      }

      // Language item click handler
      const selectLang = (code) => {
        this.switchLanguage(code);
        this.closeAllDropdowns();
      };

      langItems.forEach(item => {
        item.addEventListener('click', () => {
          const code = item.getAttribute('data-code');
          if (code) selectLang(code);
        });
      });

      quickPills.forEach(pill => {
        pill.addEventListener('click', () => {
          const code = pill.getAttribute('data-code');
          if (code) selectLang(code);
        });
      });
    },

    closeAllDropdowns: function() {
      document.querySelectorAll('.lang-dropdown-menu').forEach(menu => {
        menu.classList.remove('show');
      });
      document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    },

    attachGlobalListeners: function() {
      document.addEventListener('click', () => {
        this.closeAllDropdowns();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeAllDropdowns();
        }
      });
    },

    switchLanguage: function(code) {
      if (!code) return;
      this.currentLang = code;
      this.setStoredLanguage(code);
      this.applyLanguageDirection(code);

      // Update UI across all wrappers
      const langObj = LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
      
      document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
        const flagEl = btn.querySelector('.lang-flag');
        const nameEl = btn.querySelector('.lang-current-name');
        if (flagEl) flagEl.textContent = langObj.flag;
        if (nameEl) nameEl.textContent = langObj.native;
      });

      document.querySelectorAll('.lang-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-code') === code);
      });

      document.querySelectorAll('.lang-quick-pill').forEach(pill => {
        pill.classList.toggle('active', pill.getAttribute('data-code') === code);
      });

      // Trigger Translation Engine
      this.triggerGoogleTranslation(code);
    },

    triggerGoogleTranslation: function(langCode, retryCount = 0) {
      if (langCode === 'en') {
        // Reset to original English
        document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        document.cookie = `googtrans=; domain=.${window.location.hostname}; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        
        const iframe = document.querySelector('iframe.goog-te-banner-frame');
        if (iframe) {
          try {
            const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
            const restoreBtn = innerDoc.getElementById(':1.restore') || innerDoc.querySelector('button');
            if (restoreBtn) restoreBtn.click();
          } catch(e) {}
        }
        
        const select = document.querySelector('.goog-te-combo');
        if (select) {
          select.value = 'en';
          select.dispatchEvent(new Event('change'));
        }
        return;
      }

      // Find Google Translate Combo Element
      const select = document.querySelector('.goog-te-combo');
      if (select && select.options && select.options.length > 0) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
      } else if (retryCount < 15) {
        setTimeout(() => {
          this.triggerGoogleTranslation(langCode, retryCount + 1);
        }, 200);
      }
    },

    // Helper to toggle between English and Urdu
    toggleUrduEnglish: function() {
      const next = this.currentLang === 'ur' ? 'en' : 'ur';
      this.switchLanguage(next);
    }
  };

  // Expose Globally
  window.LanguageSystem = LanguageSystem;

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => LanguageSystem.init());
  } else {
    LanguageSystem.init();
  }

})(window, document);
