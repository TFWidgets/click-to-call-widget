# 🚀 Shopify Widget Deployment Guide

## 🎯 Цель
Развернуть виджет на Cloudflare Pages, чтобы получить URL вида:
`https://your-widget.pages.dev/embed.js`

## 📋 Шаги для деплоя

### 1. Зайти в Cloudflare Pages
1. Перейти на [dash.cloudflare.com/pages](https://dash.cloudflare.com/pages)
2. Нажать **"Create a project"**
3. Выбрать **"Connect to Git"**

### 2. Подключить GitHub репозиторий
1. Выбрать **GitHub** в качестве источника
2. Найти репозиторий `TFWidgets/click-to-call-widget`
3. Нажать **"Begin setup"**

### 3. Настроить деплой
**Build settings:**
- **Framework preset:** None
- **Build command:** (оставить пустым)
- **Build output directory:** `/` (корень проекта)
- **Root directory:** (оставить пустым)

### 4. Развернуть
1. Нажать **"Save and Deploy"**
2. Дождаться завершения деплоя (2-3 минуты)
3. Получить URL вида: `https://call-widget-abc123.pages.dev`

## ✅ После деплоя

### Ваш рабочий код для клиентов:
```html
<script src="https://YOUR-DOMAIN.pages.dev/embed.js" data-id="demo"></script>
```

### Создание конфига для нового клиента:
1. Создать файл `/configs/client-name.json`
2. Настроить параметры виджета
3. Отправить клиенту код: `data-id="client-name"`

## 🛒 Процесс продажи на Shopify

### Шаг 1: Получение заказа
Клиент покупает виджет на вашем Shopify магазине

### Шаг 2: Создание конфига
```json
{
  "phone": "+клиент-номер",
  "displayPhone": "+1 (234) 567-890",
  "icon": "🛒", 
  "title": "Contact Us",
  "subtitle": "We're here to help!",
  "actions": [
    {
      "type": "whatsapp",
      "text": "WhatsApp",
      "icon": "💬", 
      "message": "Hi! I need help"
    }
  ],
  "theme": {
    "backgroundColor": "linear-gradient(135deg, #25d366 0%, #128c7e 100%)"
  }
}
```

### Шаг 3: Отправка кода клиенту
```html
<script src="https://your-widget.pages.dev/embed.js" data-id="client-unique-id"></script>
```

## 🔧 Customization

### Доступные иконки:
🍕 🛒 🏢 📞 💼 🏪 🍔 ☕ 🏥 🚗 🏠 💻 📱 🎵 🎮 📚 👕 💍 🌟

### Цветовые схемы:
```css
/* WhatsApp Green */
linear-gradient(135deg, #25d366 0%, #128c7e 100%)

/* Business Blue */ 
linear-gradient(135deg, #667eea 0%, #764ba2 100%)

/* E-commerce Red */
linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)
```

### Типы действий:
- `whatsapp` - WhatsApp чат
- `link` - Переход по ссылке  
- `email` - Отправка email
- `sms` - SMS сообщение
- `telegram` - Telegram чат

## 📞 Техподдержка

Если у клиента проблемы:
1. Проверить, что код вставлен правильно
2. Убедиться, что `data-id` совпадает с именем конфиг файла
3. Проверить, что конфиг файл в формате JSON без ошибок

## 🎯 Важные моменты

✅ **CORS настроен** - виджет работает на любых доменах
✅ **Кэширование настроено** - быстрая загрузка
✅ **Адаптивный дизайн** - работает на всех устройствах
✅ **Fallback конфиг** - виджет всегда отображается