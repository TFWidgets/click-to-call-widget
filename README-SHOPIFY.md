# 🛒 Shopify Widget Business - Полная инструкция

## 🎯 Что у вас сейчас есть

✅ **Рабочий виджет API** - все файлы готовы  
✅ **GitHub репозиторий** - `TFWidgets/click-to-call-widget`  
✅ **CORS заголовки** - работает на любых доменах  
✅ **Готовые демо** - 3 примера виджетов  
✅ **Документация** - полные инструкции  

## 🚀 Что нужно сделать СЕЙЧАС

### Шаг 1: Развернуть на Cloudflare Pages
1. Зайти на [dash.cloudflare.com/pages](https://dash.cloudflare.com/pages)
2. Нажать **"Create a project"** → **"Connect to Git"**  
3. Выбрать GitHub репозиторий `TFWidgets/click-to-call-widget`
4. **Build settings:**
   - Framework preset: `None`
   - Build command: (пустое)
   - Build output directory: `/`
5. Нажать **"Save and Deploy"**
6. Получить URL типа: `https://call-widget-abc123.pages.dev`

### Шаг 2: Обновить свой Shopify магазин
Замените в описании товара старый код на новый:

**БЫЛО:**
```html
<script src="https://call-widget.tf-widgets.com/embed.js" data-id="demo"></script>
```

**СТАЛО (после деплоя):**
```html
<script src="https://ВАШ-ДОМЕН.pages.dev/embed.js" data-id="demo"></script>
```

## 💰 Бизнес-процесс продаж

### Когда клиент покупает виджет:

1. **Создать конфиг файл**
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
       },
       {
         "type": "link",
         "text": "Shop", 
         "icon": "🛒",
         "url": "https://client-store.com"
       }
     ],
     "theme": {
       "backgroundColor": "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
       "textColor": "white",
       "borderRadius": 16
     }
   }
   ```

2. **Сохранить как** `/configs/имя-клиента.json`

3. **Отправить клиенту код:**
   ```html
   <script src="https://ВАШ-ДОМЕН.pages.dev/embed.js" data-id="имя-клиента"></script>
   ```

4. **Инструкция для клиента:**
   "Вставьте этот код в любое место на вашем сайте где хотите видеть виджет"

## 🎨 Настройки для разных типов бизнеса

### Ресторан/Кафе
```json
{
  "icon": "🍕",
  "title": "Order Now",
  "theme": {
    "backgroundColor": "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)"
  }
}
```

### Магазин/E-commerce  
```json
{
  "icon": "🛒", 
  "title": "Shop Now",
  "theme": {
    "backgroundColor": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  }
}
```

### Услуги/Консалтинг
```json
{
  "icon": "💼",
  "title": "Contact Us", 
  "theme": {
    "backgroundColor": "linear-gradient(135deg, #25d366 0%, #128c7e 100%)"
  }
}
```

## 📞 Поддержка клиентов

### Частые проблемы:

**"Виджет не отображается"**
- Проверить, что код вставлен правильно
- Убедиться что `data-id` совпадает с файлом конфига

**"Неправильный номер телефона"**
- Обновить файл `/configs/client-name.json`
- Изменения применятся автоматически

**"Хочу другой дизайн"**
- Изменить `icon`, `backgroundColor` в конфиге
- Список иконок: 🍕🛒🏢📞💼🏪🍔☕🏥🚗🏠💻📱🎵🎮📚👕💍🌟

## 🔧 Управление клиентами

### Добавить нового клиента:
1. Создать `/configs/новый-клиент.json` 
2. Настроить параметры
3. Отправить код с `data-id="новый-клиент"`

### Обновить настройки клиента:
1. Изменить файл `/configs/существующий-клиент.json`
2. Сохранить - изменения применятся мгновенно

### Удалить клиента:
1. Удалить файл `/configs/клиент.json`

## 💎 Дополнительные возможности

### Типы действий в виджете:
- **WhatsApp** - `"type": "whatsapp"` 
- **Сайт** - `"type": "link"`
- **Email** - `"type": "email"`
- **SMS** - `"type": "sms"`
- **Telegram** - `"type": "telegram"`

### Примеры использования:
```json
{
  "actions": [
    {
      "type": "whatsapp",
      "text": "WhatsApp", 
      "icon": "💬",
      "message": "Hi! I'm interested"
    },
    {
      "type": "email",
      "text": "Email",
      "icon": "📧", 
      "value": "support@client.com",
      "message": "Question about products"
    },
    {
      "type": "link",
      "text": "Website",
      "icon": "🌐",
      "url": "https://client-site.com"
    }
  ]
}
```

## 🎯 Ваш успех!

После настройки у вас будет:
- ✅ Автоматический виджет API
- ✅ Быстрое добавление новых клиентов  
- ✅ Работа на всех сайтах и устройствах
- ✅ Профессиональный вид
- ✅ Техподдержка через конфиги

**Ссылки для тестирования:**
- 🏠 Главная: https://ваш-домен.pages.dev
- 🛒 Shopify гид: https://ваш-домен.pages.dev/shopify-test.html  
- 🔍 Диагностика: https://ваш-домен.pages.dev/debug.html

**Удачи в бизнесе!** 🚀