(() => {
  'use strict';

  // Находим все script теги с embed.js на странице
  const scripts = Array.from(document.querySelectorAll('script[src*="embed.js"]'));
  if (!scripts.length) return;

  // Базовый CSS с унифицированными переменными
  const baseCSS = `
    .ctc-container {
      font-family: var(--ctc-font, 'Inter', system-ui, sans-serif);
      max-width: var(--ctc-max-width, 380px);
      margin: var(--ctc-margin, 20px auto);
      width: 100%;
    }
    .ctc-widget {
      background: var(--ctc-bg, linear-gradient(135deg, #25d366 0%, #128c7e 100%));
      border-radius: var(--ctc-widget-radius, 16px);
      padding: var(--ctc-padding, 28px);
      color: var(--ctc-text-color, white);
      box-shadow: var(--ctc-shadow, 0 16px 48px rgba(0,0,0,0.25));
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: center;
    }
    .ctc-widget::before {
      content: '';
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%);
      pointer-events: none;
    }
    .ctc-widget:hover {
      transform: translateY(-3px);
      box-shadow: var(--ctc-shadow-hover, 0 24px 64px rgba(0,0,0,0.35));
    }
    .ctc-icon {
      font-size: var(--ctc-icon-size, 2.8em);
      margin-bottom: 12px;
      display: block;
      animation: ctc-pulse var(--ctc-pulse-duration, 2.2s) ease-in-out infinite;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
    }
    .ctc-title {
      font-size: var(--ctc-title-size, 1.4em);
      font-weight: 700;
      margin: 0 0 8px 0;
      text-shadow: var(--ctc-text-shadow, 0 2px 8px rgba(0,0,0,0.3));
      letter-spacing: 0.3px;
    }
    .ctc-subtitle {
      font-size: var(--ctc-subtitle-size, 0.95em);
      opacity: 0.92;
      margin: 0 0 22px 0;
      font-weight: 500;
    }
    .ctc-main-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 88%;
      max-width: 320px;
      margin: 0 auto 18px auto;
      background: var(--ctc-block-bg, rgba(255,255,255,0.22));
      color: var(--ctc-text-color);
      border: var(--ctc-block-border, 2px solid rgba(255,255,255,0.35));
      padding: var(--ctc-block-padding, 18px 24px);
      border-radius: var(--ctc-block-radius, 14px);
      font-size: var(--ctc-main-btn-size, 1.15em);
      font-weight: 700;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(12px);
      letter-spacing: 0.6px;
      font-family: var(--ctc-value-font, 'JetBrains Mono', 'SF Mono', monospace);
      box-sizing: border-box;
    }
    .ctc-main-btn:hover {
      background: var(--ctc-block-bg-hover, rgba(255,255,255,0.3));
      border-color: var(--ctc-block-border-hover, rgba(255,255,255,0.55));
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    }
    .ctc-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: var(--ctc-gap, 12px);
      margin-top: 18px;
    }
    .ctc-action-btn {
      padding: 10px 14px;
      background: rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.9);
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: var(--ctc-action-btn-radius, 10px);
      font-size: 0.85em;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      transition: all 0.3s ease;
      backdrop-filter: blur(8px);
    }
    .ctc-action-btn:hover {
      background: rgba(255,255,255,0.18);
      border-color: rgba(255,255,255,0.5);
      transform: translateY(-1px);
    }
    .ctc-info-text {
      margin-top: 18px;
      font-size: 0.82em;
      opacity: 0.85;
      font-weight: 500;
    }
    .ctc-loading {
      text-align: center;
      padding: 40px;
      color: white;
    }
    .ctc-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255,255,255,0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      animation: ctc-spin 1s linear infinite;
      margin: 0 auto 15px;
    }
    @keyframes ctc-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.08); }
    }
    @keyframes ctc-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @media (max-width: 480px) {
      .ctc-container { max-width: calc(100vw - 32px); margin: 16px auto; }
      .ctc-widget { padding: var(--ctc-padding-mobile, 22px); }
      .ctc-main-btn { font-size: var(--ctc-main-btn-size-mobile, 1.05em); padding: 16px 20px; }
      .ctc-actions { grid-template-columns: 1fr; gap: 10px; }
    }
  `;

  if (!document.querySelector('#ctc-base-styles')) {
    const style = document.createElement('style');
    style.id = 'ctc-base-styles';
    style.textContent = baseCSS;
    document.head.appendChild(style);
  }

  // Дефолтный конфиг
  const defaultConfig = {
    phone: "+420123456789",
    displayPhone: "+420 123 456 789",
    icon: "",
    iconHtml: "&#127829;", // 🍕 как HTML entity (безопасно)
    title: "Order Pizza",
    subtitle: "Call now! Delivery in 30 minutes",
    infoText: "Business Hours: 10:00-23:00 daily",
    actions: [
      { type: "whatsapp", text: "WhatsApp", icon: "💬", message: "Hi! I want to order pizza" },
      { type: "link", text: "Menu", icon: "📋", url: "https://example.com/menu" }
    ],
    style: {
      fontFamily: "'Inter', system-ui, sans-serif",
      valueFontFamily: "'JetBrains Mono', 'SF Mono', monospace",
      colors: {
        background: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
        text: "#ffffff",
        blockBackground: "rgba(255, 255, 255, 0.22)",
        blockBorder: "rgba(255, 255, 255, 0.35)",
        blockHover: "rgba(255, 255, 255, 0.30)",
        borderHover: "rgba(255, 255, 255, 0.55)"
      },
      borderRadius: { widget: 16, blocks: 14 },
      sizes: { fontSize: 1.0, padding: 28, blockPadding: 18, gap: 12 },
      shadow: {
        widget: "0 16px 48px rgba(0,0,0,0.25)",
        widgetHover: "0 24px 64px rgba(0,0,0,0.35)",
        text: "0 2px 8px rgba(0,0,0,0.3)"
      }
    }
  };

  // Обрабатываем каждый script тег отдельно
  scripts.forEach(async (script) => {
    if (script.dataset.ctcMounted === '1') return;
    script.dataset.ctcMounted = '1';

    const clientId = normalizeId(script.dataset.id);
    const baseUrl = getBasePath(script.src);
    const uniqueClass = `ctc-${clientId}-${Date.now()}-${Math.random().toString(36).slice(2,5)}`;

    // Создаем контейнер
    const container = document.createElement('div');
    container.className = `ctc-container ${uniqueClass}`;
    script.parentNode.insertBefore(container, script);

    // Показываем загрузку
    container.innerHTML = `
      <div class="ctc-widget">
        <div class="ctc-loading">
          <div class="ctc-spinner"></div>
          <div>Loading widget...</div>
        </div>
      </div>
    `;

    try {
      const cfg = await loadConfig(clientId, baseUrl);
      const finalConfig = mergeDeep(defaultConfig, cfg);
      applyCustomStyles(uniqueClass, finalConfig.style);
      renderWidget(container, finalConfig);
      console.log(`[CTC] ✅ Виджет "${clientId}" готов`);
    } catch (e) {
      console.warn(`[CTC] ⚠️ Используем дефолт для "${clientId}":`, e.message);
      applyCustomStyles(uniqueClass, defaultConfig.style);
      renderWidget(container, defaultConfig);
    }
  });

  function renderWidget(container, config) {
    const cleanPhone = (config.phone || '').replace(/[^\d+]/g, '');
    const displayPhone = config.displayPhone || config.phone || '';

    const iconHtml = renderIcon(config);

    const actionsHTML = (config.actions || []).map(action => {
      const url = buildActionUrl(action, config.phone);
      if (!url) return '';
      return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="ctc-action-btn">${action.icon ? `${escapeHtml(action.icon)} ` : ''}${escapeHtml(action.text)}</a>`;
    }).join('');

    container.innerHTML = `
      <div class="ctc-widget">
        ${iconHtml}
        <h3 class="ctc-title">${escapeHtml(config.title)}</h3>
        <p class="ctc-subtitle">${escapeHtml(config.subtitle)}</p>
        <a href="tel:${cleanPhone}" class="ctc-main-btn">${escapeHtml(displayPhone)}</a>
        ${actionsHTML ? `<div class="ctc-actions">${actionsHTML}</div>` : ''}
        ${config.infoText ? `<div class="ctc-info-text">${escapeHtml(config.infoText)}</div>` : ''}
      </div>
    `;
  }

  function renderIcon(config) {
    if (config.iconHtml && config.iconHtml.trim()) {
      // Поддержка HTML entities и эмодзи
      if (config.iconHtml.includes('&') || config.iconHtml.includes('<')) {
        return `<div class="ctc-icon">${config.iconHtml}</div>`;
      }
      return `<div class="ctc-icon">${escapeHtml(config.iconHtml)}</div>`;
    }
    if (config.icon && config.icon.trim()) {
      return `<div class="ctc-icon">${escapeHtml(config.icon)}</div>`;
    }
    return '';
  }

  function applyCustomStyles(uniqueClass, style) {
    const s = style || {};
    const colors = s.colors || {};
    const sizes = s.sizes || {};
    const radius = s.borderRadius || {};
    const shadow = s.shadow || {};
    const fs = sizes.fontSize || 1;

    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .${uniqueClass} {
        --ctc-font: ${s.fontFamily || "'Inter', system-ui, sans-serif"};
        --ctc-value-font: ${s.valueFontFamily || "'JetBrains Mono', 'SF Mono', monospace"};
        --ctc-max-width: ${Math.round(380 * fs)}px;
        --ctc-bg: ${colors.background || "linear-gradient(135deg, #25d366 0%, #128c7e 100%)"};
        --ctc-widget-radius: ${radius.widget || 16}px;
        --ctc-padding: ${sizes.padding || 28}px;
        --ctc-padding-mobile: ${Math.round((sizes.padding || 28) * 0.8)}px;
        --ctc-text-color: ${colors.text || "#ffffff"};
        --ctc-shadow: ${shadow.widget || "0 16px 48px rgba(0,0,0,0.25)"};
        --ctc-shadow-hover: ${shadow.widgetHover || "0 24px 64px rgba(0,0,0,0.35)"};
        --ctc-text-shadow: ${shadow.text || "0 2px 8px rgba(0,0,0,0.3)"};
        --ctc-icon-size: ${2.8 * fs}em;
        --ctc-title-size: ${1.4 * fs}em;
        --ctc-subtitle-size: ${0.95 * fs}em;
        --ctc-main-btn-size: ${1.15 * fs}em;
        --ctc-main-btn-size-mobile: ${1.05 * fs}em;
        --ctc-block-bg: ${colors.blockBackground || "rgba(255,255,255,0.22)"};
        --ctc-block-border: 2px solid ${colors.blockBorder || "rgba(255,255,255,0.35)"};
        --ctc-block-bg-hover: ${colors.blockHover || "rgba(255,255,255,0.30)"};
        --ctc-block-border-hover: ${colors.borderHover || "rgba(255,255,255,0.55)"};
        --ctc-block-radius: ${radius.blocks || 14}px;
        --ctc-block-padding: ${sizes.blockPadding || 18}px ${Math.round((sizes.blockPadding || 18) * 1.3)}px;
        --ctc-gap: ${sizes.gap || 12}px;
        --ctc-action-btn-radius: ${radius.blocks || 14}px;
        --ctc-pulse-duration: 2.2s;
      }
    `;
    document.head.appendChild(styleEl);
  }

  function mergeDeep(base, over) {
    const result = { ...base, ...over };
    result.style = { ...(base.style || {}), ...(over?.style || {}) };
    result.style.colors = { ...(base.style?.colors || {}), ...(over?.style?.colors || {}) };
    result.style.borderRadius = { ...(base.style?.borderRadius || {}), ...(over?.style?.borderRadius || {}) };
    result.style.sizes = { ...(base.style?.sizes || {}), ...(over?.style?.sizes || {}) };
    result.style.shadow = { ...(base.style?.shadow || {}), ...(over?.style?.shadow || {}) };
    if (Array.isArray(over?.actions)) result.actions = over.actions;
    return result;
  }

  async function loadConfig(clientId, baseUrl) {
    if (clientId === 'local') {
      const localScript = document.querySelector('#ctc-local-config');
      if (!localScript) throw new Error('Локальный конфиг не найден (#ctc-local-config)');
      try {
        return JSON.parse(localScript.textContent);
      } catch (e) {
        throw new Error('Ошибка парсинга локального JSON: ' + e.message);
      }
    }

    const url = `${baseUrl}configs/${encodeURIComponent(clientId)}.json?v=${Date.now()}`;
    console.log(`[CTC] 🌐 Загружаем: ${url}`);
    
    const response = await fetch(url, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const config = await response.json();
    console.log(`[CTC] ✅ Загружен конфиг:`, config);
    return config;
  }

  function normalizeId(id) {
    return (id || 'demo').replace(/\.(json|js)$/i, '');
  }

  function getBasePath(src) {
    try {
      const url = new URL(src, location.href);
      return url.origin + url.pathname.replace(/\/[^\/]*$/, '/');
    } catch (error) {
      return './';
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  function buildActionUrl(action, defaultPhone) {
    if (!action || typeof action !== 'object') return null;
    const type = (action.type || '').toLowerCase();
    const phone = (defaultPhone || '').replace(/[^\d]/g, '');
    
    switch (type) {
      case 'whatsapp':
        const message = action.message || action.additionalText || 'Hi!';
        return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : null;
      case 'telegram':
        const user = (action.value || '').replace(/^@/, '');
        return user ? `https://t.me/${user}` : null;
      case 'sms':
        const smsBody = action.message || action.text || '';
        const query = smsBody ? `?body=${encodeURIComponent(smsBody)}` : '';
        return phone ? `sms:${defaultPhone}${query}` : null;
      case 'email':
        const email = action.value || action.email || '';
        const subject = action.message || action.subject || action.text || '';
        const emailQuery = subject ? `?subject=${encodeURIComponent(subject)}` : '';
        return email ? `mailto:${email}${emailQuery}` : null;
      case 'link':
        return action.url || action.value || null;
      default:
        return null;
    }
  }
})();
