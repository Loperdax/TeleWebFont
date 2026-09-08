<div dir="rtl">

<div align="center">
  <img src="https://raw.githubusercontent.com/Loperdax/TeleWebFont/main/assets/logo.png" alt="Telegram Font Changer Logo" width="150"/>
</div>

# تغییر دهنده فونت تلگرام وب 
### ⚡ Telegram Font Changer

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-blue?logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/telegram-font-changer/cceldipdhnhkcmdooeehbnciimlahlmp)
[![Firefox Add-ons](https://img.shields.io/badge/Firefox%20Add--ons-Install-orange?logo=firefoxbrowser&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/telegram-font-changer/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Vazirmatn Font](https://img.shields.io/badge/Font-Vazirmatn-9cf?logo=font-awesome)](https://github.com/rastikerdar/vazirmatn)

---

## 📖 معرفی

یه اکستنشن سبک و ساده برای کروم که فونت **Telegram Web** رو به **وزیرمتن** تغییر میده و امکان کنترل سایز فونت به صورت زنده (بدون نیاز به رفرش صفحه) رو بهتون میده.

اگر از تلگرام وب استفاده میکنید و میخواید متون فارسی و عربی رو با فونت زیبا و خوانای وزیرمتن با سایز دلخواه ببینید، این اکستنشن دقیقاً همون چیزیه که نیاز دارید! 🎯

</div>

---

## ✨ امکانات

- **تغییر خودکار فونت** تلگرام وب با دکمه‌ی فعال / غیرفعال
- **شش فونت فارسی** — وزیرمتن، لطیف، ایران‌سنس، یکان، میترا و ادوبی عربیک، قابل انتخاب از پاپ‌آپ
- **پیش‌نمایش زنده** — نمونه متن داخل پاپ‌آپ، هم‌زمان با تغییر اسلایدرها
- **کنترل سایز فونت**
- **کنترل وزن فونت** — از نازک تا سیاه، یا سپردنش به خود تلگرام
- **جداسازی ساید پنل** — امکان فعال / غیرفعال کردن تغییر سایز فونت در پنل کناری (لیست چت‌ها) به صورت مجزا از پنل اصلی چت
- **اعمال فوری و بدون رفرش**
- **سبک و کم‌حجم**
- **متن‌باز** و رایگان

---

## 🚀 نصب (برای کاربران)

### از فروشگاه کروم (پیشنهادی) ✅

<div align="center">

**[📥 نصب از Chrome Web Store](https://chromewebstore.google.com/detail/telegram-font-changer/cceldipdhnhkcmdooeehbnciimlahlmp)** · **[🦊 نصب از Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/telegram-font-changer/)** · **[🌐 صفحه معرفی](https://loperdax.github.io/TeleWebFont/)**

</div>

روی لینک بالا بزنید و **Add to Chrome** یا **Add to Firefox** رو کلیک کنید. همین! بعدش برید به [web.telegram.org](https://web.telegram.org)، روی آیکون اکستنشن کلیک کنید و از فونت و سایز دلخواه لذت ببرید 🎉

> روی **Edge** هم لینک کروم کار می‌کنه — کافیه اجازه‌ی نصب از فروشگاه کروم رو بدید.

### نصب دستی (برای توسعه‌دهنده‌ها) 🛠

1. این ریپازیتوری رو کلون کنید یا دانلود کنید
2. مرورگر کروم رو باز کنید و به آدرس `chrome://extensions` برید
3. حالت **Developer mode** (حالت توسعه‌دهنده) رو فعال کنید
4. روی **Load unpacked** کلیک کنید
5. پوشه پروژه رو انتخاب کنید
6. حالا برید به [web.telegram.org](https://web.telegram.org)، روی آیکون اکستنشن کلیک کنید و از فونت و سایز دلخواه لذت ببرید! 🎉

---

## 🛠 ساختار پروژه

```
telegram-font-changer/
├── manifest.json       # تنظیمات اکستنشن (نسخه 1.3.1)
├── README.md           # مستندات پروژه
├── content.js          # اسکریپت اصلی (تزریق فونت + سایزدهی زنده)
├── style.css           # استایل‌های اصلی فونت Vazirmatn
├── popup.html          # رابط کاربری پاپ‌آپ (فارسی / RTL)
├── popup.css           # استایل دارک-mode پاپ‌آپ (طراحی اپل‌لایک)
├── popup.js            # منطق پاپ‌آپ و ذخیره تنظیمات
├── docs/index.html     # صفحه معرفی (GitHub Pages)
├── assets/             # آیکون‌های اکستنشن و لوگوی سفارشی
│   ├── 16x16.png
│   ├── 48x48.png
│   ├── 128x128.png
│   └── logo.png
└── fonts/
    ├── Vazirmatn-Thin.woff2
    ├── Vazirmatn-ExtraLight.woff2
    ├── Vazirmatn-Light.woff2
    ├── Vazirmatn-Regular.woff2
    ├── Vazirmatn-Medium.woff2
    ├── Vazirmatn-SemiBold.woff2
    ├── Vazirmatn-Bold.woff2
    ├── Vazirmatn-ExtraBold.woff2
    ├── Vazirmatn-Black.woff2
    ├── Vazirmatn[wght].woff2
    ├── Lateef-*.ttf         # لطیف (۷ وزن)
    ├── irsans.ttf           # ایران‌سنس (معمولی)
    ├── irsansb.ttf          # ایران‌سنس (ضخیم)
    ├── yekan.ttf            # یکان
    ├── BMitra-*.ttf         # میترا (معمولی و ضخیم)
    └── AdobeArabic-*.otf    # ادوبی عربیک (معمولی و ضخیم)
```

---

## 🎨 فونت وزیرمتن | Vazirmatn Font

این اکستنشن از فونت فوق‌العاده **[وزیرمتن](https://github.com/rastikerdar/vazirmatn)** ساخته شده توسط **صابر راستی‌کردار** استفاده میکنه.

وزیرمتن یک فونت فارسی/عربی متن‌باز، زیبا و خواناست که برای استفاده در وب و اپلیکیشن‌های مدرن طراحی شده.

[![Vazirmatn GitHub](https://img.shields.io/badge/Vazirmatn-Font%20Repository-181717?logo=github)](https://github.com/rastikerdar/vazirmatn)

---

## 🗺️ نقشه راه | Roadmap

### فیچرهای برنامه‌ریزی شده برای آینده 🚀

- [x] **🔤 اضافه شدن فونت‌های جدید** — پشتیبانی از فونت‌های محبوب دیگه مثل لطیف، ایران سنس و...
- [x] **⚙️ تنظیم وزن فونت (Font Weight)** — قابلیت تنظیم ضخامت فونت به صورت زنده
- [ ] **🌙 حالت شب (Dark Mode) اختصاصی** — تنظیمات فونت جداگانه برای حالت شب
- [x] **⚡ پشتیبانی از Firefox و Edge** — انتشار اکستنشن برای مرورگرهای دیگر

> 💡 **ایده یا پیشنهادی دارید؟** — یک Issue جدید توی گیت‌هاب باز کنید یا با contributors درمیون بذارید!

---

## ⚖️ مجوز

این پروژه تحت مجوز **MIT** منتشر شده. فونت وزیرمتن نیز تحت مجوز **SIL Open Font License 1.1** منتشر شده.

---

<div dir="ltr">

<div align="center">
  <img src="https://raw.githubusercontent.com/Loperdax/TeleWebFont/main/assets/logo.png" alt="Telegram Font Changer Logo" width="150"/>
</div>

---

# 🚀 Telegram Font Changer

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-blue?logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/telegram-font-changer/cceldipdhnhkcmdooeehbnciimlahlmp)
[![Firefox Add-ons](https://img.shields.io/badge/Firefox%20Add--ons-Install-orange?logo=firefoxbrowser&logoColor=white)](https://addons.mozilla.org/en-US/firefox/addon/telegram-font-changer/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Vazirmatn Font](https://img.shields.io/badge/Font-Vazirmatn-9cf?logo=font-awesome)](https://github.com/rastikerdar/vazirmatn)

---

## 📖 About

A lightweight Chrome extension that changes **Telegram Web** font to **Vazirmatn** and lets you adjust the font size live — no page refresh required.

If you use Telegram Web and want to read Persian & Arabic text with the beautiful, readable Vazirmatn font at your preferred size, this extension is exactly what you need! 🎯

---

## ✨ Features

- **Auto font change** of Telegram Web with an Enable / Disable button
- **Six Persian fonts** — Vazirmatn, Lateef, IRANSans, Yekan, B Mitra and Adobe Arabic, switchable from the popup
- **Live preview** — a sample text inside the popup updates as you move the sliders
- **Font size control**
- **Font weight control** — from Thin to Black, or leave it to Telegram
- **Side-panel isolation** — enable / disable font-size changes on the chat sidebar independently from the main chat panel
- **Instant, no-refresh apply**
- **Lightweight and small**
- **Open source** and free

---

## 🚀 Installation

### From the Chrome Web Store (recommended) ✅

<div align="center">

**[📥 Install from the Chrome Web Store](https://chromewebstore.google.com/detail/telegram-font-changer/cceldipdhnhkcmdooeehbnciimlahlmp)** · **[🦊 Install from Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/telegram-font-changer/)** · **[🌐 Homepage](https://loperdax.github.io/TeleWebFont/)**

</div>

Open the link above and click **Add to Chrome** or **Add to Firefox**. That's it — then go to [web.telegram.org](https://web.telegram.org), click the extension icon, and enjoy your new font & size 🎉

> The Chrome link also works on **Edge** — just allow installing extensions from the Chrome Web Store.

### Manual install (for developers) 🛠

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the project folder
6. Go to [web.telegram.org](https://web.telegram.org), click the extension icon, and enjoy your new font & size! 🎉

---

## 🛠 Project Structure

```
telegram-font-changer/
├── manifest.json       # Extension settings (v1.3.1)
├── README.md           # Project documentation
├── content.js          # Main script (font injection + live sizing)
├── style.css           # Core Vazirmatn font styles
├── popup.html          # Popup UI (Persian / RTL)
├── popup.css           # Popup dark-mode styles (Apple-like)
├── popup.js            # Popup logic & settings persistence
├── docs/index.html     # Landing page (GitHub Pages)
├── assets/             # Extension icons & custom logo
│   ├── 16x16.png
│   ├── 48x48.png
│   ├── 128x128.png
│   └── logo.png
└── fonts/
    ├── Vazirmatn-Thin.woff2
    ├── Vazirmatn-ExtraLight.woff2
    ├── Vazirmatn-Light.woff2
    ├── Vazirmatn-Regular.woff2
    ├── Vazirmatn-Medium.woff2
    ├── Vazirmatn-SemiBold.woff2
    ├── Vazirmatn-Bold.woff2
    ├── Vazirmatn-ExtraBold.woff2
    ├── Vazirmatn-Black.woff2
    ├── Vazirmatn[wght].woff2
    ├── Lateef-*.ttf         # Lateef (7 weights)
    ├── irsans.ttf           # IRANSans (regular)
    ├── irsansb.ttf          # IRANSans (bold)
    ├── yekan.ttf            # Yekan
    ├── BMitra-*.ttf         # B Mitra (regular & bold)
    └── AdobeArabic-*.otf    # Adobe Arabic (regular & bold)
```

---

## 🎨 Vazirmatn Font

This extension uses the awesome **[Vazirmatn](https://github.com/rastikerdar/vazirmatn)** font created by **Saber Rastikerdar**.

Vazirmatn is an open-source, beautiful, and highly readable Persian/Arabic font designed for modern web & apps.

[![Vazirmatn GitHub](https://img.shields.io/badge/Vazirmatn-Font%20Repository-181717?logo=github)](https://github.com/rastikerdar/vazirmatn)

---

## 🗺️ Roadmap

### Planned features for future versions 🚀

- [x] **🔤 More fonts** — Support for other popular fonts like Lalezar, IRANSans, etc.
- [x] **⚙️ Font weight control** — Live font-weight adjustment
- [ ] **🌙 Exclusive Dark Mode** — Separate font settings for dark mode
- [x] **⚡ Firefox & Edge support** — Publish the extension for other browsers

> 💡 **Have an idea or suggestion?** — Open a new Issue on GitHub or share it with the contributors!

---

## ⚖️ License

This project is released under the **MIT** license. Vazirmatn font is also released under the **SIL Open Font License 1.1** license.

</div>

