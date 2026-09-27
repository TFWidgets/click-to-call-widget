/*!
 * TF Widgets — Click to Call v2
 * Встраивание: <script src=".../embed.js" data-id="CLIENT_ID"></script>
 * Конфиг клиента: configs/CLIENT_ID.json (формат v1 поддерживается, все новые поля необязательные)
 * Классы и CSS-переменные: префикс bhw- (общий для всех виджетов TF Widgets).
 * Все стили этого виджета ограничены классом .bhw-ctc, чтобы не спорить с другими виджетами на странице.
 */
(function () {
    'use strict';
    var VERSION = '2.0.0';
    var LOG = '[TFW Call]';
    // Где работает живое превью BHWClickToCall.render() (конфигуратор на сайте)
    var PREVIEW_DOMAINS = ['tf-widgets.com', '*.tf-widgets.com', '9ac5za-h1.myshopify.com'];

    var ICONS = {
        phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
        whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.25-.12-1.47-.72-1.7-.8s-.39-.12-.56.12-.64.8-.78.97-.29.19-.54.06a6.7 6.7 0 0 1-3.3-2.9c-.25-.43.25-.4.71-1.33a.45.45 0 0 0-.02-.42c-.06-.12-.56-1.34-.76-1.84s-.4-.41-.56-.42h-.48a.92.92 0 0 0-.66.31 2.8 2.8 0 0 0-.87 2.07 4.9 4.9 0 0 0 1 2.58 11.1 11.1 0 0 0 4.3 3.8c1.6.7 2.2.75 3 .63a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .15-1.2c-.06-.1-.23-.17-.48-.29z"/></svg>',
        telegram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.9 4.3 18.7 19.4c-.24 1.06-.87 1.32-1.76.82l-4.87-3.59-2.35 2.26c-.26.26-.48.48-.98.48l.35-4.96 9.02-8.15c.39-.35-.09-.54-.61-.2L6.35 13.07 1.55 11.57c-1.04-.33-1.06-1.04.22-1.54L20.5 2.8c.87-.32 1.63.2 1.4 1.5z"/></svg>',
        sms: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2zm3 6.5a1.5 1.5 0 1 0 0 .01zm5 0a1.5 1.5 0 1 0 0 .01zm5 0a1.5 1.5 0 1 0 0 .01z"/></svg>',
        email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2L4.4 7H4v.5l8 5.5 8-5.5V7h-.4z"/></svg>',
        link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14zM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>',
        close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4z"/></svg>'
    };

    var inlineCSS = `
        .bhw-ctc { font-family: var(--bhw-font, 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif); -webkit-font-smoothing: antialiased; box-sizing: border-box; }
        .bhw-ctc *, .bhw-ctc *::before, .bhw-ctc *::after { box-sizing: border-box; }
        .bhw-ctc.bhw-container { width: 100%; max-width: var(--bhw-max-width, 380px); margin: var(--bhw-margin, 20px auto); container: none; }
        .bhw-ctc .bhw-widget {
            position: relative; overflow: hidden; isolation: isolate; text-align: center;
            background: var(--bhw-bg, #ffffff); color: var(--bhw-text-color, #111111);
            border: 1px solid var(--bhw-widget-border, rgba(0,0,0,.07));
            border-radius: var(--bhw-widget-radius, 22px);
            padding: var(--bhw-padding, 28px);
            box-shadow: var(--bhw-shadow, 0 24px 60px -24px rgba(0,0,0,.35));
            transition: transform .4s cubic-bezier(.2,.8,.2,1), box-shadow .4s;
        }
        .bhw-ctc .bhw-widget::before { content: none; }
        .bhw-ctc.bhw-legacy .bhw-widget::before {
            content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none;
            background: radial-gradient(circle at 25% 25%, rgba(255,255,255,.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,.1) 0%, transparent 50%);
        }
        .bhw-ctc.bhw-container .bhw-widget:hover { transform: translateY(-2px); box-shadow: var(--bhw-shadow-hover, 0 30px 70px -24px rgba(0,0,0,.4)); }
        .bhw-ctc .bhw-icon { display: block; margin: 0 0 12px; font-size: var(--bhw-icon-size, 2.6em); line-height: 1; }
        .bhw-ctc .bhw-logo { display: block; max-width: 130px; max-height: 40px; margin: 0 auto 14px; object-fit: contain; }
        .bhw-ctc .bhw-status { display: inline-flex; align-items: center; gap: 7px; margin: 0 0 12px; padding: 5px 11px; border-radius: 999px; font-size: .74em; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--bhw-accent, #16a34a); background: color-mix(in srgb, var(--bhw-accent, #16a34a) 12%, transparent); }
        .bhw-ctc .bhw-status::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: currentColor; animation: bhw-ctc-pulse 1.6s ease-in-out infinite; }
        .bhw-ctc .bhw-title { margin: 0 0 6px; padding: 0; font-family: inherit; font-size: var(--bhw-title-size, 1.35em); font-weight: 800; line-height: 1.2; letter-spacing: -.02em; text-shadow: var(--bhw-text-shadow, none); }
        .bhw-ctc .bhw-subtitle { margin: 0 auto 20px; max-width: 32ch; font-size: var(--bhw-subtitle-size, .95em); line-height: 1.5; opacity: .72; font-weight: 400; }

        /* главная кнопка звонка */
        .bhw-ctc .bhw-main-btn {
            display: flex; align-items: center; gap: 14px; width: 100%; margin: 0;
            padding: var(--bhw-block-padding, 12px 20px 12px 12px); text-align: left; text-decoration: none !important;
            background: var(--bhw-block-bg, #16a34a); color: var(--bhw-btn-text, #ffffff);
            border: var(--bhw-block-border, 0 solid transparent); border-radius: var(--bhw-block-radius, 18px);
            box-shadow: 0 14px 30px -14px var(--bhw-block-bg, #16a34a);
            transition: transform .2s, filter .2s, box-shadow .2s;
        }
        .bhw-ctc .bhw-main-btn:hover { transform: translateY(-2px); filter: brightness(1.05); }
        .bhw-ctc .bhw-main-btn:focus-visible, .bhw-ctc .bhw-action-btn:focus-visible, .bhw-ctc .bhw-fab:focus-visible, .bhw-ctc .bhw-fab-close:focus-visible { outline: 2px solid var(--bhw-accent, #16a34a); outline-offset: 3px; }
        .bhw-ctc .bhw-main-ico { flex: none; display: grid; place-items: center; width: 46px; height: 46px; border-radius: calc(var(--bhw-block-radius, 18px) - 6px); background: rgba(255,255,255,.2); }
        .bhw-ctc .bhw-main-ico svg { width: 22px; height: 22px; animation: bhw-ctc-ring 2.4s ease-in-out infinite; }
        .bhw-ctc .bhw-main-txt { display: grid; gap: 2px; min-width: 0; }
        .bhw-ctc .bhw-main-label { font-size: .72em; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; opacity: .8; }
        .bhw-ctc .bhw-main-num { font-family: var(--bhw-value-font, inherit); font-size: var(--bhw-main-btn-size, 1.25em); font-weight: 800; letter-spacing: .01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .bhw-ctc.bhw-legacy .bhw-main-btn { justify-content: center; text-align: center; backdrop-filter: blur(12px); box-shadow: none; }

        .bhw-ctc .bhw-actions { display: grid; grid-template-columns: 1fr 1fr; gap: var(--bhw-gap, 8px); margin: 10px 0 0; }
        .bhw-ctc .bhw-action-btn {
            display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 10px 12px;
            border-radius: calc(var(--bhw-block-radius, 18px) - 4px); text-decoration: none !important;
            font-size: .88em; font-weight: 700; color: var(--bhw-text-color, #111);
            background: var(--bhw-action-bg, rgba(0,0,0,.04)); border: 1px solid var(--bhw-action-border, rgba(0,0,0,.08));
            transition: background .2s, transform .2s, border-color .2s;
        }
        .bhw-ctc .bhw-actions > .bhw-action-btn:last-child:nth-child(odd) { grid-column: 1 / -1; }
        .bhw-ctc .bhw-action-btn:hover { transform: translateY(-1px); background: var(--bhw-action-bg-hover, rgba(0,0,0,.07)); }
        .bhw-ctc .bhw-action-btn svg { width: 18px; height: 18px; flex: none; }
        .bhw-ctc .bhw-action-whatsapp svg { color: #25d366; }
        .bhw-ctc .bhw-action-telegram svg { color: #229ed9; }
        .bhw-ctc .bhw-info-text { margin: 16px 0 0; font-size: .8em; line-height: 1.45; opacity: .6; }

        /* плавающая кнопка */
        .bhw-ctc.bhw-floating { position: fixed; bottom: 20px; z-index: 2147482990; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
        .bhw-ctc.bhw-floating.bhw-pos-left { align-items: flex-start; }
        .bhw-ctc.bhw-floating.bhw-inline { position: absolute; }
        .bhw-ctc.bhw-only-mobile { display: none; }
        @media (max-width: 767px), (hover: none) { .bhw-ctc.bhw-only-mobile { display: flex; } }
        .bhw-ctc .bhw-fab-row { display: flex; align-items: center; gap: 10px; }
        .bhw-ctc.bhw-pos-left .bhw-fab-row { flex-direction: row-reverse; }
        .bhw-ctc .bhw-fab {
            position: relative; flex: none; display: grid; place-items: center; width: 60px; height: 60px; margin: 0; padding: 0;
            border: 0; border-radius: 50%; cursor: pointer; text-decoration: none !important;
            background: var(--bhw-block-bg, #16a34a); color: var(--bhw-btn-text, #fff);
            box-shadow: 0 14px 30px -10px var(--bhw-block-bg, #16a34a), 0 4px 12px rgba(0,0,0,.18);
            transition: transform .25s cubic-bezier(.2,.8,.2,1);
        }
        .bhw-ctc .bhw-fab:hover { transform: scale(1.06); }
        .bhw-ctc .bhw-fab svg { width: 26px; height: 26px; }
        .bhw-ctc .bhw-fab::after { content: ''; position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--bhw-block-bg, #16a34a); animation: bhw-ctc-wave 2.2s ease-out infinite; pointer-events: none; }
        .bhw-ctc.bhw-open .bhw-fab::after { animation: none; opacity: 0; }
        .bhw-ctc .bhw-fab-label {
            padding: 10px 14px; border-radius: 999px; font-size: .9em; font-weight: 700; white-space: nowrap;
            background: var(--bhw-bg, #fff); color: var(--bhw-text-color, #111); box-shadow: 0 10px 26px -10px rgba(0,0,0,.35); cursor: pointer; border: 0; margin: 0;
        }
        .bhw-ctc.bhw-open .bhw-fab-label { display: none; }
        .bhw-ctc .bhw-fab-panel { display: none; width: min(360px, calc(100vw - 32px)); transform-origin: bottom right; }
        .bhw-ctc.bhw-pos-left .bhw-fab-panel { transform-origin: bottom left; }
        .bhw-ctc.bhw-open .bhw-fab-panel { display: block; animation: bhw-ctc-pop .35s cubic-bezier(.2,.8,.2,1); }
        .bhw-ctc .bhw-fab-close {
            position: absolute; top: 10px; right: 10px; z-index: 2; display: grid; place-items: center; width: 34px; height: 34px; margin: 0; padding: 0;
            border: 0; border-radius: 50%; cursor: pointer; background: color-mix(in srgb, var(--bhw-text-color, #111) 8%, transparent); color: inherit;
        }
        .bhw-ctc .bhw-fab-close svg { width: 16px; height: 16px; }
        .bhw-ctc .bhw-fab-panel .bhw-widget { padding: max(var(--bhw-padding, 28px), 44px) 22px 22px; }
        .bhw-ctc .bhw-fab-panel .bhw-main-num { font-size: calc(var(--bhw-main-btn-size, 1.25em) * .92); }

        @keyframes bhw-ctc-pulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
        @keyframes bhw-ctc-ring { 0%,80%,100% { transform: rotate(0); } 84% { transform: rotate(-14deg); } 88% { transform: rotate(14deg); } 92% { transform: rotate(-10deg); } 96% { transform: rotate(8deg); } }
        @keyframes bhw-ctc-wave { 0% { transform: scale(1); opacity: .7; } 100% { transform: scale(1.6); opacity: 0; } }
        @keyframes bhw-ctc-pop { from { transform: translateY(10px) scale(.96); opacity: 0; } to { transform: none; opacity: 1; } }
        @media (max-width: 480px) {
            .bhw-ctc.bhw-container { max-width: none; margin: var(--bhw-margin-mobile, 16px auto); }
            .bhw-ctc .bhw-widget { padding: var(--bhw-padding-mobile, 22px); }
            .bhw-ctc.bhw-floating { bottom: 16px; }
        }
        @media (prefers-reduced-motion: reduce) {
            .bhw-ctc *, .bhw-ctc *::after { animation: none !important; transition: none !important; }
        }

        /* защита от тем сайта, которые красят весь текст через color: ... !important */
        .bhw-ctc .bhw-widget { color: var(--bhw-text-color, #111) !important; }
        .bhw-ctc .bhw-widget :where(*) { color: inherit !important; }
        .bhw-ctc .bhw-widget .bhw-status { color: var(--bhw-accent, #16a34a) !important; }
        .bhw-ctc .bhw-main-btn, .bhw-ctc .bhw-main-btn *, .bhw-ctc .bhw-fab { color: var(--bhw-btn-text, #fff) !important; }
        .bhw-ctc .bhw-widget .bhw-action-whatsapp svg { color: #25d366 !important; }
        .bhw-ctc .bhw-widget .bhw-action-telegram svg { color: #229ed9 !important; }
        .bhw-ctc .bhw-fab-label { color: var(--bhw-text-color, #111) !important; }
    `;

    /* =========================================================
       ПУБЛИЧНЫЕ API
       ========================================================= */
    window.BusinessHoursWidgets = window.BusinessHoursWidgets || {};
    window.BusinessHoursWidgets.clickToCall = window.BusinessHoursWidgets.clickToCall || {};

    // Живое превью для конфигуратора: BHWClickToCall.render(container, config) -> { update, setState, destroy }
    var api = window.BHWClickToCall = window.BHWClickToCall || {};
    api.version = VERSION;
    api.defaults = getDefaultConfig;
    api.checkAccess = bhwCheckAccess;
    api.render = function (container, config) {
        var noop = { destroy: function () {}, update: function () {}, setState: function () {} };
        if (!bhwCheckAccess({ domains: PREVIEW_DOMAINS }).ok) { console.warn(LOG, 'preview is only available on tf-widgets.com'); return noop; }
        injectBaseStyles();
        if (container._bhwCtcDestroy) container._bhwCtcDestroy();
        var cls = container.__bhwCtcClass || (container.__bhwCtcClass = 'bhw-ctc-preview-' + Math.random().toString(36).slice(2, 8));
        var widget = null, st = 'open';
        function build(cfg) {
            if (widget) widget.destroy();
            widget = mountWidget(normalizeConfig(cfg || {}), cls, 'preview', { inline: container });
            widget.setState(st);
        }
        build(config);
        var ctrl = {
            update: function (cfg) { build(cfg); },
            setState: function (s) { st = s; if (widget) widget.setState(s); },
            destroy: function () { if (widget) widget.destroy(); widget = null; container._bhwCtcDestroy = null; }
        };
        container._bhwCtcDestroy = ctrl.destroy;
        return ctrl;
    };

    /* =========================================================
       АВТОЗАПУСК ПО <script data-id="..."> (только свой тег, а не все embed.js на странице)
       ========================================================= */
    try {
        var currentScript = document.currentScript || (function () {
            var scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();
        if (currentScript && currentScript.dataset && currentScript.dataset.id && currentScript.dataset.bhwMounted !== '1') {
            currentScript.dataset.bhwMounted = '1';
            var debug = currentScript.dataset.debug === '1';
            var clientId = normalizeId(currentScript.dataset.id);
            var baseUrl = getBasePath(currentScript.src);
            loadConfig(clientId, baseUrl)
                .then(function (fetched) {
                    var access = bhwCheckAccess(fetched);
                    if (!access.ok) {
                        console.warn(LOG, 'widget "' + clientId + '" is not active on ' + (location.hostname || 'this page') + ': ' + access.reason);
                        return;
                    }
                    injectBaseStyles();
                    var cfg = normalizeConfig(fetched);
                    if (debug) console.log(LOG, 'config "' + clientId + '":', cfg);
                    var mount = function () {
                        var w = mountWidget(cfg, 'bhw-ctc-' + clientId.replace(/[^a-z0-9_-]/gi, '') + '-' + Date.now(), clientId, { anchor: currentScript });
                        window.BusinessHoursWidgets.clickToCall[clientId] = w;
                    };
                    if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
                })
                .catch(function (error) {
                    // Нет конфига = нет виджета
                    console.warn(LOG, 'config "' + clientId + '" not loaded:', error.message);
                });
        }
    } catch (error) {
        console.error(LOG, 'critical error:', error);
    }

    /* =========================================================
       ФУНКЦИИ
       ========================================================= */
    function injectBaseStyles() {
        if (!document.getElementById('business-hours-clicktocall-widget-styles')) {
            var style = document.createElement('style');
            style.id = 'business-hours-clicktocall-widget-styles';
            style.textContent = inlineCSS;
            (document.head || document.documentElement).appendChild(style);
        }
    }

    /* ---------------------------------------------------------
       ДОСТУП (общий блок для всех виджетов TF Widgets — копировать без изменений)
       В конфиге клиента:
         "active": true,                       // false = виджет выключен (например, подписка отменена)
         "domains": ["client.com", "client-shop.myshopify.com", "*.client.com"]
       "client.com" разрешает client.com и www.client.com,
       "*.client.com" — любые поддомены (shop.client.com и т.д.).
       Без списка domains виджет не запускается.
       На localhost и при открытии файла с компьютера работает всегда (для тестов).
       --------------------------------------------------------- */
    function bhwCheckAccess(config) {
        config = config || {};
        if (config.active === false) return { ok: false, reason: 'widget is switched off ("active": false)' };
        var host = String(location.hostname || '').toLowerCase().replace(/^www\./, '');
        if (!host || host === 'localhost' || host === '127.0.0.1' || location.protocol === 'file:') return { ok: true };
        var list = config.domains;
        if (typeof list === 'string') list = list.split(/[\s,]+/);
        if (!Array.isArray(list) || !list.length) return { ok: false, reason: 'no "domains" in config' };
        for (var i = 0; i < list.length; i++) {
            var d = String(list[i] || '').trim().toLowerCase()
                .replace(/^[a-z]+:\/\//, '').replace(/[\/:].*$/, '').replace(/^www\./, '');
            if (!d) continue;
            if (d.indexOf('*.') === 0) {
                var base = d.slice(2);
                if (host === base || host.slice(-(base.length + 1)) === '.' + base) return { ok: true };
            } else if (host === d) {
                return { ok: true };
            }
        }
        return { ok: false, reason: 'domain is not in "domains"' };
    }

    function normalizeId(id) { return String(id || 'demo').replace(/\.(json|js)$/i, ''); }
    function getBasePath(src) {
        if (!src) return './';
        try { var url = new URL(src, location.href); return url.origin + url.pathname.replace(/\/[^\/]*$/, '/'); }
        catch (error) { return './'; }
    }
    function loadConfig(clientId, baseUrl) {
        if (clientId === 'local') {
            var el = document.querySelector('#bhw-ctc-local-config');
            if (!el) return Promise.reject(new Error('#bhw-ctc-local-config not found'));
            try { return Promise.resolve(JSON.parse(el.textContent)); } catch (e) { return Promise.reject(e); }
        }
        var url = baseUrl + 'configs/' + encodeURIComponent(clientId) + '.json?v=' + Date.now();
        return fetch(url, { cache: 'no-store', headers: { 'Accept': 'application/json' } })
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    }

    function getDefaultConfig() {
        return {
            // "card" — карточка там, где стоит код; "floating" — круглая кнопка в углу экрана на всех страницах
            layout: 'card',
            position: 'right',              // для floating: right | left
            showOn: 'all',                  // для floating: all | mobile
            fabLabel: 'Call us',            // подпись рядом с плавающей кнопкой (пусто — без подписи)
            phone: '+420123456789',
            displayPhone: '',
            callLabel: 'Call now',
            status: '',                     // маленькая метка сверху, например "Open now"
            iconHtml: '',
            logo: '',
            title: 'Talk to us',
            subtitle: 'We pick up fast. Or message us, whichever you prefer.',
            infoText: '',
            actions: [],
            style: {
                fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
                valueFontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
                colors: {
                    background: '#ffffff',
                    text: '#111111',
                    accent: '#16a34a',
                    widgetBorder: 'rgba(0, 0, 0, 0.07)',
                    blockBackground: '#16a34a',
                    buttonText: '#ffffff',
                    blockBorder: 'transparent',
                    actionBackground: 'rgba(0, 0, 0, 0.04)',
                    actionBorder: 'rgba(0, 0, 0, 0.08)',
                    actionHover: 'rgba(0, 0, 0, 0.07)'
                },
                borderRadius: { widget: 22, blocks: 18 },
                sizes: { fontSize: 1, padding: 28, gap: 8, width: 380 },
                shadow: { widget: '0 24px 60px -24px rgba(0, 0, 0, 0.35)', widgetHover: '0 30px 70px -24px rgba(0, 0, 0, 0.4)', text: 'none' }
            }
        };
    }

    /* v1-конфиг (зелёная карточка с эмодзи) выглядит как задумано; поддержаны и короткие поля whatsapp / menu */
    function normalizeConfig(raw) {
        raw = raw || {};
        var legacy = !raw.layout;
        var base = getDefaultConfig();
        if (legacy) {
            base.callLabel = '';
            base.title = 'Order Pizza'; base.subtitle = 'Call now! Delivery in 30 minutes';
            base.iconHtml = '&#127829;';
            var c = base.style.colors;
            c.background = 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)'; c.text = '#ffffff'; c.accent = '#ffffff';
            c.widgetBorder = 'transparent'; c.blockBackground = 'rgba(255, 255, 255, 0.22)'; c.blockBorder = 'rgba(255, 255, 255, 0.35)';
            c.actionBackground = 'rgba(255, 255, 255, 0.12)'; c.actionBorder = 'rgba(255, 255, 255, 0.3)'; c.actionHover = 'rgba(255, 255, 255, 0.18)';
            base.style.borderRadius = { widget: 16, blocks: 14 };
            base.style.shadow = { widget: '0 16px 48px rgba(0,0,0,0.25)', widgetHover: '0 24px 64px rgba(0,0,0,0.35)', text: '0 2px 8px rgba(0,0,0,0.3)' };
        }
        var cfg = mergeDeep(base, raw);
        if (Array.isArray(raw.actions)) cfg.actions = raw.actions;
        // короткие поля v1-демо: "whatsapp": "текст", "menu": "https://..."
        if (!Array.isArray(raw.actions)) {
            var acts = [];
            if (typeof raw.whatsapp === 'string') acts.push({ type: 'whatsapp', text: 'WhatsApp', message: raw.whatsapp });
            if (typeof raw.menu === 'string' && raw.menu) acts.push({ type: 'link', text: 'Menu', url: raw.menu });
            cfg.actions = acts;
        }
        var rc = (raw.style && raw.style.colors) || {};
        if (legacy && !rc.blockBackground && rc.background) cfg.style.colors.blockBackground = 'rgba(255, 255, 255, 0.22)';
        if (!rc.buttonText && legacy) cfg.style.colors.buttonText = cfg.style.colors.text;
        cfg._legacy = legacy;
        return cfg;
    }

    function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }
    function mergeDeep(base, over) {
        var out = {};
        Object.keys(base || {}).forEach(function (k) { out[k] = isObj(base[k]) ? mergeDeep(base[k], {}) : base[k]; });
        Object.keys(over || {}).forEach(function (k) {
            var v = over[k];
            if (isObj(v) && isObj(out[k])) out[k] = mergeDeep(out[k], v);
            else if (v !== undefined) out[k] = v;
        });
        return out;
    }
    function cssValue(v, fallback) { if (v === undefined || v === null || v === '') return fallback; return String(v).replace(/[;{}<>]/g, ''); }
    function num(v, fallback) { var n = Number(v); return isFinite(n) && v !== '' && v !== null ? n : fallback; }
    function safeUrl(url) {
        var u = String(url || '').trim();
        if (!u) return '';
        if (/^https?:/i.test(u) || /^\/(?!\/)/.test(u)) return u;
        if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(u)) return 'https://' + u;
        return '';
    }
    function escapeHtml(text) {
        return String(text == null ? '' : text).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function renderIcon(icon) {
        var s = String(icon || '').trim();
        if (!s) return '';
        if (/^(&#?[a-z0-9]+;\s*)+$/i.test(s)) return s;
        return escapeHtml(s.slice(0, 8));
    }
    function prettyPhone(p) {
        var s = String(p || '').trim();
        if (/\s/.test(s) || !/^\+?\d{8,15}$/.test(s)) return s;
        var d = s.replace(/^\+/, '');
        if (s[0] === '+' && d.length === 12) return '+' + d.slice(0, 3) + ' ' + d.slice(3, 6) + ' ' + d.slice(6, 9) + ' ' + d.slice(9);   // +420 123 456 789
        if (s[0] === '+' && d.length === 11 && d[0] === '1') return '+1 ' + d.slice(1, 4) + ' ' + d.slice(4, 7) + ' ' + d.slice(7);   // +1 415 555 1234
        return s;
    }

    function actionUrl(a, phone) {
        if (!a || typeof a !== 'object') return '';
        var digits = String(phone || '').replace(/[^\d]/g, '');
        switch (String(a.type || '').toLowerCase()) {
            case 'whatsapp': {
                var wa = String(a.value || '').replace(/[^\d]/g, '') || digits;
                var msg = a.message || a.additionalText || '';
                return wa ? 'https://wa.me/' + wa + (msg ? '?text=' + encodeURIComponent(msg) : '') : '';
            }
            case 'telegram': { var u = String(a.value || '').replace(/^@/, '').replace(/[^\w]/g, ''); return u ? 'https://t.me/' + u : ''; }
            case 'sms': { var b = a.message || ''; return digits ? 'sms:+' + digits + (b ? '?body=' + encodeURIComponent(b) : '') : ''; }
            case 'email': {
                var e = String(a.value || a.email || '').trim();
                if (!/^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i.test(e)) return '';
                var sub = a.subject || a.message || '';
                return 'mailto:' + e + (sub ? '?subject=' + encodeURIComponent(sub) : '');
            }
            case 'link': return safeUrl(a.url || a.value);
            default: return '';
        }
    }

    function applyCustomStyles(uniqueClass, style) {
        var id = 'bhw-ctc-style-' + uniqueClass;
        var el = document.getElementById(id);
        if (!el) { el = document.createElement('style'); el.id = id; (document.head || document.documentElement).appendChild(el); }
        var s = style || {}, c = s.colors || {}, z = s.sizes || {}, r = s.borderRadius || {}, sh = s.shadow || {};
        var fs = num(z.fontSize, 1), pad = num(z.padding, 28);
        el.textContent = '.' + uniqueClass + '{' +
            '--bhw-font:' + cssValue(s.fontFamily, "'Inter', system-ui, sans-serif") + ';' +
            '--bhw-value-font:' + cssValue(s.valueFontFamily, 'inherit') + ';' +
            '--bhw-max-width:' + Math.round(num(z.width, 380)) + 'px;' +
            '--bhw-bg:' + cssValue(c.background, '#ffffff') + ';' +
            '--bhw-text-color:' + cssValue(c.text, '#111111') + ';' +
            '--bhw-accent:' + cssValue(c.accent, '#16a34a') + ';' +
            '--bhw-widget-border:' + cssValue(c.widgetBorder, 'rgba(0,0,0,0.07)') + ';' +
            '--bhw-widget-radius:' + num(r.widget, 22) + 'px;' +
            '--bhw-block-radius:' + num(r.blocks, 18) + 'px;' +
            '--bhw-padding:' + pad + 'px;' +
            '--bhw-padding-mobile:' + Math.round(pad * .8) + 'px;' +
            '--bhw-block-bg:' + cssValue(c.blockBackground, '#16a34a') + ';' +
            '--bhw-block-border:' + (c.blockBorder && c.blockBorder !== 'transparent' ? '2px solid ' + cssValue(c.blockBorder, 'transparent') : '0 solid transparent') + ';' +
            '--bhw-btn-text:' + cssValue(c.buttonText, '#ffffff') + ';' +
            '--bhw-action-bg:' + cssValue(c.actionBackground, 'rgba(0,0,0,0.04)') + ';' +
            '--bhw-action-border:' + cssValue(c.actionBorder, 'rgba(0,0,0,0.08)') + ';' +
            '--bhw-action-bg-hover:' + cssValue(c.actionHover || c.blockHover, 'rgba(0,0,0,0.07)') + ';' +
            '--bhw-gap:' + num(z.gap, 8) + 'px;' +
            '--bhw-icon-size:' + (2.6 * fs).toFixed(3) + 'em;' +
            '--bhw-title-size:' + (1.35 * fs).toFixed(3) + 'em;' +
            '--bhw-subtitle-size:' + (0.95 * fs).toFixed(3) + 'em;' +
            '--bhw-main-btn-size:' + (1.25 * fs).toFixed(3) + 'em;' +
            '--bhw-shadow:' + cssValue(sh.widget, '0 24px 60px -24px rgba(0,0,0,0.35)') + ';' +
            '--bhw-shadow-hover:' + cssValue(sh.widgetHover, '0 30px 70px -24px rgba(0,0,0,0.4)') + ';' +
            '--bhw-text-shadow:' + cssValue(sh.text, 'none') + ';' +
            '}';
        return id;
    }

    function cardHtml(cfg, withClose) {
        var clean = String(cfg.phone || '').replace(/[^\d+]/g, '');
        var shown = cfg.displayPhone || prettyPhone(cfg.phone);
        var logo = safeUrl(cfg.logo), icon = renderIcon(cfg.iconHtml || cfg.icon);
        var acts = (cfg.actions || []).slice(0, 5).map(function (a) {
            var url = actionUrl(a, cfg.phone); if (!url) return '';
            var t = String(a.type || '').toLowerCase();
            var ext = /^https?:/i.test(url);
            return '<a class="bhw-action-btn bhw-action-' + escapeHtml(t) + '" href="' + escapeHtml(url) + '"' + (ext ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' +
                (ICONS[t] || ICONS.link) + '<span>' + escapeHtml(a.text || t) + '</span></a>';
        }).join('');
        return '<div class="bhw-widget">' +
            (withClose ? '<button class="bhw-fab-close" type="button" aria-label="Close">' + ICONS.close + '</button>' : '') +
            (logo ? '<img class="bhw-logo" src="' + escapeHtml(logo) + '" alt="">' : '') +
            (icon ? '<div class="bhw-icon" aria-hidden="true">' + icon + '</div>' : '') +
            (cfg.status ? '<span class="bhw-status">' + escapeHtml(cfg.status) + '</span>' : '') +
            (cfg.title ? '<h3 class="bhw-title">' + escapeHtml(cfg.title) + '</h3>' : '') +
            (cfg.subtitle ? '<p class="bhw-subtitle">' + escapeHtml(cfg.subtitle) + '</p>' : '') +
            '<a class="bhw-main-btn" href="tel:' + escapeHtml(clean) + '" aria-label="Call ' + escapeHtml(shown) + '">' +
                (cfg._legacy ? '' : '<span class="bhw-main-ico">' + ICONS.phone + '</span>') +
                '<span class="bhw-main-txt">' + (cfg.callLabel ? '<span class="bhw-main-label">' + escapeHtml(cfg.callLabel) + '</span>' : '') +
                '<span class="bhw-main-num">' + escapeHtml(shown) + '</span></span></a>' +
            (acts ? '<div class="bhw-actions">' + acts + '</div>' : '') +
            (cfg.infoText ? '<div class="bhw-info-text">' + escapeHtml(cfg.infoText) + '</div>' : '') +
        '</div>';
    }

    function mountWidget(cfg, uniqueClass, id, opts) {
        opts = opts || {};
        var inline = opts.inline || null;
        var styleId = applyCustomStyles(uniqueClass, cfg.style);
        var floating = cfg.layout === 'floating';
        var root = document.createElement('div');
        root.id = 'business-hours-clicktocall-widget-' + id;
        root.className = 'bhw-ctc ' + uniqueClass + (cfg._legacy ? ' bhw-legacy' : '') +
            (floating ? ' bhw-floating bhw-pos-' + (cfg.position === 'left' ? 'left' : 'right') + (cfg.showOn === 'mobile' && !inline ? ' bhw-only-mobile' : '') + (inline ? ' bhw-inline' : '')
                      : ' bhw-container');
        if (floating) {
            root.style[cfg.position === 'left' ? 'left' : 'right'] = '20px';
            var clean = String(cfg.phone || '').replace(/[^\d+]/g, '');
            var direct = !(cfg.actions || []).some(function (a) { return actionUrl(a, cfg.phone); }) && !cfg.title && !cfg.subtitle;
            root.innerHTML =
                '<div class="bhw-fab-panel" role="dialog" aria-label="' + escapeHtml(cfg.title || 'Contact') + '">' + cardHtml(cfg, true) + '</div>' +
                '<div class="bhw-fab-row">' +
                    (cfg.fabLabel ? '<button class="bhw-fab-label" type="button">' + escapeHtml(cfg.fabLabel) + '</button>' : '') +
                    (direct ? '<a class="bhw-fab" href="tel:' + escapeHtml(clean) + '" aria-label="' + escapeHtml(cfg.fabLabel || 'Call') + '">' + ICONS.phone + '</a>'
                            : '<button class="bhw-fab" type="button" aria-expanded="false" aria-label="' + escapeHtml(cfg.fabLabel || 'Contact us') + '">' + ICONS.phone + '</button>') +
                '</div>';
        } else {
            root.innerHTML = cardHtml(cfg, false);
        }
        if (inline) inline.appendChild(root);
        else if (floating) document.body.appendChild(root);
        else if (opts.anchor && opts.anchor.parentNode) opts.anchor.parentNode.insertBefore(root, opts.anchor.nextSibling);
        else document.body.appendChild(root);

        var cleanups = [];
        function on(t, e, h) { t.addEventListener(e, h); cleanups.push(function () { t.removeEventListener(e, h); }); }
        var widget = {
            root: root, config: cfg, id: id,
            open: function () { root.classList.add('bhw-open'); var f = root.querySelector('button.bhw-fab'); if (f) f.setAttribute('aria-expanded', 'true'); },
            close: function () { root.classList.remove('bhw-open'); var f = root.querySelector('button.bhw-fab'); if (f) f.setAttribute('aria-expanded', 'false'); },
            setState: function (st) { if (!floating) return; if (st === 'open') this.open(); else this.close(); },
            destroy: function () { cleanups.forEach(function (f) { try { f(); } catch (e) {} }); root.remove(); var s = document.getElementById(styleId); if (s) s.remove(); }
        };
        if (floating) {
            var fab = root.querySelector('button.bhw-fab'), lab = root.querySelector('.bhw-fab-label');
            var toggle = function () { root.classList.contains('bhw-open') ? widget.close() : widget.open(); };
            if (fab) on(fab, 'click', toggle);
            if (lab) on(lab, 'click', function () { if (fab) toggle(); else root.querySelector('.bhw-fab').click(); });
            on(root.querySelector('.bhw-fab-close'), 'click', function () { widget.close(); if (fab) fab.focus(); });
            if (!inline) on(document, 'keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('bhw-open')) { widget.close(); if (fab) fab.focus(); } });
        }
        return widget;
    }
})();
