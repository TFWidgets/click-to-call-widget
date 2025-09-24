(function() {
    'use strict';

    // Базовые CSS стили с унифицированными CSS-переменными (как у countdown timer)
    const inlineCSS = `
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
            background: var(--ctc-overlay, 
                radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
            );
            pointer-events: none;
        }
        
        .ctc-widget:hover {
            transform: translateY(-3px);
            box-shadow: var(--ctc-shadow-hover, 0 24px 64px rgba(0,0,0,0.35));
        }
        
        .ctc-icon {
            font-size: var(--ctc-icon-size, 2.8em);
            margin-bottom: var(--ctc-icon-margin, 12px);
            display: block;
            animation: ctc-pulse var(--ctc-pulse-duration, 2.2s) ease-in-out infinite;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        }
        
        .ctc-title {
            font-size: var(--ctc-title-size, 1.4em);
            font-weight: var(--ctc-title-weight, 700);
            margin: 0 0 8px 0;
            text-shadow: var(--ctc-text-shadow, 0 2px 8px rgba(0,0,0,0.3));
            letter-spacing: var(--ctc-title-spacing, 0.3px);
            color: var(--ctc-title-color, inherit);
        }
        
        .ctc-subtitle {
            font-size: var(--ctc-subtitle-size, 0.95em);
            opacity: var(--ctc-subtitle-opacity, 0.92);
            margin: 0 0 22px 0;
            font-weight: var(--ctc-subtitle-weight, 500);
            color: var(--ctc-subtitle-color, inherit);
        }
        
        .ctc-main-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: var(--ctc-main-btn-width, 88%);
            max-width: var(--ctc-main-btn-max-width, 320px);
            margin: 0 auto 18px auto;
            background: var(--ctc-block-bg, rgba(255, 255, 255, 0.22));
            color: var(--ctc-main-btn-color, inherit);
            border: var(--ctc-block-border, 2px solid rgba(255, 255, 255, 0.35));
            padding: var(--ctc-block-padding, 18px 24px);
            border-radius: var(--ctc-block-radius, 14px);
            font-size: var(--ctc-main-btn-size, 1.15em);
            font-weight: var(--ctc-main-btn-weight, 700);
            cursor: pointer;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(12px);
            box-sizing: border-box;
            letter-spacing: var(--ctc-main-btn-spacing, 0.6px);
            font-family: var(--ctc-value-font, 'JetBrains Mono', 'SF Mono', monospace);
            position: relative;
            z-index: 1;
        }
        
        .ctc-main-btn:hover {
            background: var(--ctc-block-bg-hover, rgba(255, 255, 255, 0.3));
            border-color: var(--ctc-block-border-hover, rgba(255, 255, 255, 0.55));
            transform: translateY(-2px) scale(1.02);
            box-shadow: var(--ctc-main-btn-shadow-hover, 0 8px 24px rgba(0,0,0,0.25));
        }
        
        .ctc-actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
            gap: var(--ctc-gap, 12px);
            margin-top: var(--ctc-actions-margin, 18px);
            position: relative;
            z-index: 1;
        }
        
        .ctc-action-btn {
            padding: var(--ctc-action-btn-padding, 10px 14px);
            background: var(--ctc-action-btn-bg, rgba(255, 255, 255, 0.12));
            color: var(--ctc-action-btn-color, rgba(255, 255, 255, 0.9));
            border: var(--ctc-action-btn-border, 1px solid rgba(255, 255, 255, 0.3));
            border-radius: var(--ctc-action-btn-radius, 10px);
            font-size: var(--ctc-action-btn-size, 0.85em);
            font-weight: var(--ctc-action-btn-weight, 600);
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: var(--ctc-action-btn-gap, 7px);
            transition: all 0.3s ease;
            backdrop-filter: blur(8px);
        }
        
        .ctc-action-btn:hover {
            background: var(--ctc-action-btn-bg-hover, rgba(255, 255, 255, 0.18));
            border-color: var(--ctc-action-btn-border-hover, rgba(255, 255, 255, 0.5));
            transform: translateY(-1px);
        }
        
        .ctc-info-text {
            margin-top: var(--ctc-info-margin, 18px);
            font-size: var(--ctc-info-size, 0.82em);
            opacity: var(--ctc-info-opacity, 0.85);
            font-weight: var(--ctc-info-weight, 500);
            position: relative;
            z-index: 1;
            color: var(--ctc-info-color, inherit);
        }
        
        .ctc-loading {
            text-align: center;
            padding: var(--ctc-loading-padding, 40px);
            color: var(--ctc-loading-color, white);
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
            .ctc-container {
                max-width: calc(100vw - 32px);
                margin: var(--ctc-margin-mobile, 16px auto);
            }
            .ctc-widget {
                padding: var(--ctc-padding-mobile, 22px);
            }
            .ctc-main-btn {
                font-size: var(--ctc-main-btn-size-mobile, 1.05em);
                padding: var(--ctc-main-btn-padding-mobile, 16px 20px);
            }
            .ctc-actions {
                grid-template-columns: 1fr;
                gap: var(--ctc-gap-mobile, 10px);
            }
        }
    `;

    try {
        const currentScript = document.currentScript || (function() {
            const scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();

        let clientId = currentScript.dataset.id;
        if (!clientId) {
            console.error('[ClickToCallWidget] data-id обязателен');
            return;
        }

        clientId = normalizeId(clientId);

        // Защита от повторного выполнения
        if (currentScript.dataset.ctcMounted === '1') return;
        currentScript.dataset.ctcMounted = '1';

        console.log(`[ClickToCallWidget] 🚀 Инициализация виджета "${clientId}"`);

        // Добавляем базовые стили один раз в head
        if (!document.querySelector('#click-to-call-widget-styles')) {
            const style = document.createElement('style');
            style.id = 'click-to-call-widget-styles';
            style.textContent = inlineCSS;
            document.head.appendChild(style);
        }

        const baseUrl = getBasePath(currentScript.src);
        const uniqueClass = `ctc-${clientId}-${Date.now()}`;
        const container = createContainer(currentScript, clientId, uniqueClass);
        
        showLoading(container);

        // Загружаем конфигурацию
        loadConfig(clientId, baseUrl)
            .then(fetchedConfig => {
                const finalConfig = mergeDeep(getDefaultConfig(), fetchedConfig);
                console.log(`[ClickToCallWidget] 📋 Финальный конфиг для "${clientId}":`, finalConfig);
                
                applyCustomStyles(uniqueClass, finalConfig.style);
                createClickToCallWidget(container, finalConfig);
                console.log(`[ClickToCallWidget] ✅ Виджет "${clientId}" успешно создан`);
            })
            .catch(error => {
                console.warn(`[ClickToCallWidget] ⚠️ Ошибка загрузки "${clientId}":`, error.message);
                const defaultConfig = getDefaultConfig();
                applyCustomStyles(uniqueClass, defaultConfig.style);
                createClickToCallWidget(container, defaultConfig);
            });

    } catch (error) {
        console.error('[ClickToCallWidget] 💥 Критическая ошибка:', error);
    }

    function normalizeId(id) {
        return (id || 'demo').replace(/\.(json|js)$/i, '');
    }

    function getBasePath(src) {
        if (!src) return './';
        try {
            const url = new URL(src, location.href);
            return url.origin + url.pathname.replace(/\/[^\/]*$/, '/');
        } catch (error) {
            return './';
        }
    }

    function createContainer(scriptElement, clientId, uniqueClass) {
        const container = document.createElement('div');
        container.id = `click-to-call-widget-${clientId}`;
        container.className = `ctc-container ${uniqueClass}`;
        scriptElement.parentNode.insertBefore(container, scriptElement.nextSibling);
        return container;
    }

    function showLoading(container) {
        container.innerHTML = `
            <div class="ctc-widget">
                <div class="ctc-loading">
                    <div class="ctc-spinner"></div>
                    <div>Loading widget...</div>
                </div>
            </div>
        `;
    }

    // УНИФИЦИРОВАННАЯ СТРУКТУРА (точно как у countdown timer)
    function getDefaultConfig() {
        return {
            phone: "+420123456789",
            displayPhone: "+420 123 456 789",
            icon: "", // Текстовая иконка (может быть пустой)
            iconHtml: "🍕", // HTML иконка (эмодзи, SVG, HTML entities)
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
                    text: "white",
                    blockBackground: "rgba(255, 255, 255, 0.22)",
                    blockBorder: "rgba(255, 255, 255, 0.35)",
                    blockHover: "rgba(255, 255, 255, 0.3)",
                    borderHover: "rgba(255, 255, 255, 0.55)"
                },
                borderRadius: {
                    widget: 16,
                    blocks: 14
                },
                sizes: {
                    fontSize: 1.0,
                    padding: 28,
                    blockPadding: 18,
                    gap: 12
                },
                shadow: {
                    widget: "0 16px 48px rgba(0,0,0,0.25)",
                    widgetHover: "0 24px 64px rgba(0,0,0,0.35)",
                    text: "0 2px 8px rgba(0,0,0,0.3)"
                }
            }
        };
    }

    function mergeDeep(base, override) {
        const result = { ...base, ...override };

        // Сливаем объекты первого уровня
        for (const key of ['style']) {
            if (base[key] && typeof base[key] === 'object' && !Array.isArray(base[key])) {
                result[key] = { ...(base[key] || {}), ...(override[key] || {}) };
            }
        }

        // Сливаем объекты второго уровня в style (как у countdown timer)
        if (result.style) {
            for (const subKey of ['colors', 'borderRadius', 'sizes', 'shadow']) {
                if (base.style[subKey] && typeof base.style[subKey] === 'object' && !Array.isArray(base.style[subKey])) {
                    result.style[subKey] = { ...(base.style[subKey] || {}), ...(override.style?.[subKey] || {}) };
                }
            }
        }

        // Для actions заменяем полностью, если указан в override
        if (Array.isArray(override?.actions)) {
            result.actions = override.actions;
        }
        
        return result;
    }

    async function loadConfig(clientId, baseUrl) {
        // Локальный конфиг для разработки
        if (clientId === 'local') {
            const localScript = document.querySelector('#ctc-local-config');
            if (!localScript) {
                throw new Error('Локальный конфиг не найден (#ctc-local-config)');
            }
            try {
                const config = JSON.parse(localScript.textContent);
                console.log(`[ClickToCallWidget] 📄 Локальный конфиг загружен:`, config);
                return config;
            } catch (err) {
                throw new Error('Ошибка парсинга локального JSON: ' + err.message);
            }
        }

        // Загрузка с сервера
        const configUrl = `${baseUrl}configs/${encodeURIComponent(clientId)}.json?v=${Date.now()}`;
        console.log(`[ClickToCallWidget] 🌐 Загружаем конфиг: ${configUrl}`);
        
        const response = await fetch(configUrl, { 
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const config = await response.json();
        console.log(`[ClickToCallWidget] ✅ Серверный конфиг загружен:`, config);
        return config;
    }

    function applyCustomStyles(uniqueClass, style) {
        const styleId = `ctc-style-${uniqueClass}`;
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = generateUniqueStyles(uniqueClass, style);
    }

    // УНИФИЦИРОВАННЫЕ CSS-ПЕРЕМЕННЫЕ (как у countdown timer)
    function generateUniqueStyles(uniqueClass, style) {
        const s = style;
        const colors = s.colors || {};
        const sizes = s.sizes || {};
        const borderRadius = s.borderRadius || {};
        const shadow = s.shadow || {};
        const fs = sizes.fontSize || 1;

        return `
            .${uniqueClass} {
                --ctc-font: ${s.fontFamily || "'Inter', system-ui, sans-serif"};
                --ctc-value-font: ${s.valueFontFamily || "'JetBrains Mono', 'SF Mono', monospace"};
                --ctc-max-width: ${Math.round(380 * fs)}px;
                --ctc-bg: ${colors.background || "linear-gradient(135deg, #25d366 0%, #128c7e 100%)"};
                --ctc-widget-radius: ${borderRadius.widget || 16}px;
                --ctc-padding: ${sizes.padding || 28}px;
                --ctc-padding-mobile: ${Math.round((sizes.padding || 28) * 0.8)}px;
                --ctc-text-color: ${colors.text || "white"};
                --ctc-shadow: ${shadow.widget || "0 16px 48px rgba(0,0,0,0.25)"};
                --ctc-shadow-hover: ${shadow.widgetHover || "0 24px 64px rgba(0,0,0,0.35)"};
                --ctc-text-shadow: ${shadow.text || "0 2px 8px rgba(0,0,0,0.3)"};
                --ctc-icon-size: ${2.8 * fs}em;
                --ctc-title-size: ${1.4 * fs}em;
                --ctc-subtitle-size: ${0.95 * fs}em;
                --ctc-main-btn-size: ${1.15 * fs}em;
                --ctc-main-btn-size-mobile: ${1.05 * fs}em;
                --ctc-block-bg: ${colors.blockBackground || "rgba(255, 255, 255, 0.22)"};
                --ctc-block-border: 2px solid ${colors.blockBorder || "rgba(255, 255, 255, 0.35)"};
                --ctc-block-bg-hover: ${colors.blockHover || "rgba(255, 255, 255, 0.3)"};
                --ctc-block-border-hover: ${colors.borderHover || "rgba(255, 255, 255, 0.55)"};
                --ctc-block-radius: ${borderRadius.blocks || 14}px;
                --ctc-block-padding: ${sizes.blockPadding || 18}px ${Math.round((sizes.blockPadding || 18) * 1.3)}px;
                --ctc-gap: ${sizes.gap || 12}px;
                --ctc-gap-mobile: ${Math.round((sizes.gap || 12) * 0.8)}px;
                --ctc-action-btn-size: ${0.85 * fs}em;
                --ctc-info-size: ${0.82 * fs}em;
                --ctc-pulse-duration: 2.2s;
            }
        `;
    }

    function createClickToCallWidget(container, config) {
        const cleanPhone = (config.phone || '').replace(/[^\d+]/g, '');
        const displayPhone = config.displayPhone || config.phone || '';

        // Безопасное отображение иконки
        const iconHtml = renderIcon(config);

        // Генерируем кнопки действий
        const actionsHTML = (config.actions || []).map(action => {
            const url = buildActionUrl(action, config.phone);
            if (!url) return '';
            
            return `
                <a href="${escapeHtml(url)}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="ctc-action-btn">
                  ${action.icon ? `${escapeHtml(action.icon)} ` : ''}${escapeHtml(action.text)}
                </a>
            `;
        }).join('');

        container.innerHTML = `
            <div class="ctc-widget">
                ${iconHtml}
                <h3 class="ctc-title">${escapeHtml(config.title)}</h3>
                <p class="ctc-subtitle">${escapeHtml(config.subtitle)}</p>
                
                <a href="tel:${cleanPhone}" class="ctc-main-btn">
                    ${escapeHtml(displayPhone)}
                </a>
                
                ${actionsHTML ? `<div class="ctc-actions">${actionsHTML}</div>` : ''}
                
                ${config.infoText ? `<div class="ctc-info-text">${escapeHtml(config.infoText)}</div>` : ''}
            </div>
        `;
    }

    // БЕЗОПАСНОЕ ОТОБРАЖЕНИЕ ИКОНОК
    function renderIcon(config) {
        // Приоритет: iconHtml > icon > ничего
        if (config.iconHtml && config.iconHtml.trim()) {
            // Если это HTML entity или простой HTML - вставляем как есть
            if (config.iconHtml.includes('&') || config.iconHtml.includes('<')) {
                return `<div class="ctc-icon">${config.iconHtml}</div>`;
            }
            // Если это эмодзи - экранируем
            return `<div class="ctc-icon">${escapeHtml(config.iconHtml)}</div>`;
        }
        
        if (config.icon && config.icon.trim()) {
            return `<div class="ctc-icon">${escapeHtml(config.icon)}</div>`;
        }
        
        // Нет иконки - не рендерим блок
        return '';
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

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
})();
