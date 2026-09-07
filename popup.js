const toggle = document.getElementById('fontToggle');
const sidePanelToggle = document.getElementById('sidePanelToggle');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');
const fontWeightSlider = document.getElementById('fontWeightSlider');
const fontWeightValue = document.getElementById('fontWeightValue');
const fontSwitch = document.getElementById('fontSwitch');
const sideSwitch = document.getElementById('sideSwitch');
const langPicker = document.getElementById('langPicker');
const fontPicker = document.getElementById('fontPicker');
const fontCard = document.getElementById('fontCard');
const sideCard = document.getElementById('sideCard');

// Dim the font panel's controls while the font is off.
function setFontCardActive(enabled) {
    fontCard.classList.toggle('off', !enabled);
}

function setSwitch(switchEl, hiddenInput, value) {
    const on = !!value;
    hiddenInput.checked = on;
    switchEl.setAttribute('aria-checked', String(on));
}

function initSwitch(switchEl, hiddenInput) {
    switchEl.addEventListener('click', () => {
        setSwitch(switchEl, hiddenInput, !hiddenInput.checked);
        if (hiddenInput === toggle) setFontCardActive(hiddenInput.checked);
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    });
}

initSwitch(fontSwitch, toggle);
initSwitch(sideSwitch, sidePanelToggle);

function updateSliderFill(slider) {
    const min = parseInt(slider.min, 10) || 0;
    const max = parseInt(slider.max, 10) || 100;
    const cur = parseInt(slider.value, 10) || min;
    const pct = ((cur - min) / (max - min)) * 100;
    const isRTL = document.documentElement.dir === 'rtl' || (document.body && getComputedStyle(document.body).direction === 'rtl');
    const BLUE = '#0a84ff';
    const GRAY = 'rgba(255,255,255,0.12)';
    if (isRTL) {
        const inv = 100 - pct;
        slider.style.setProperty('--twf-p', inv.toFixed(2) + '%');
        slider.style.setProperty('--twf-track-blue', GRAY);
        slider.style.setProperty('--twf-track-gray', BLUE);
    } else {
        slider.style.setProperty('--twf-p', pct.toFixed(2) + '%');
        slider.style.setProperty('--twf-track-blue', BLUE);
        slider.style.setProperty('--twf-track-gray', GRAY);
    }
}

const I18N = {
    fa: {
        dir: 'rtl',
        title: 'تغییر‌دهنده فونت تلگرام',
        subtitle: 'شخصی‌سازی تایپوگرافی وب تلگرام',
        customFont: 'فونت سفارشی',
        chooseFont: 'انتخاب فونت',
        sidePanel: 'تغییر سایز فونت پنل کناری',
        fontSize: 'سایز فونت',
        fontWeight: 'وزن فونت',
        on: 'فعال',
        off: 'غیرفعال',
        homepage: 'صفحه معرفی',
        github: 'گیت‌هاب',
        fontVazirmatn: 'وزیرمتن',
        fontLateef: 'لطیف',
        fontIransans: 'ایران‌سنس',
        digits: '۰۱۲۳۴۵۶۷۸۹',
        w0: 'پیش‌فرض', w100: 'نازک', w200: 'خیلی نازک', w300: 'سبک', w400: 'معمولی',
        w500: 'متوسط', w600: 'نیمه‌ضخیم', w700: 'ضخیم', w800: 'خیلی ضخیم', w900: 'سیاه'
    },
    en: {
        dir: 'ltr',
        title: 'Telegram Font Changer',
        subtitle: 'Customize Telegram Web typography',
        customFont: 'Custom font',
        chooseFont: 'Choose font',
        sidePanel: 'Resize side panel font',
        fontSize: 'Font size',
        fontWeight: 'Font weight',
        on: 'On',
        off: 'Off',
        homepage: 'Homepage',
        github: 'Github',
        fontVazirmatn: 'Vazirmatn',
        fontLateef: 'Lateef',
        fontIransans: 'IRANSans',
        digits: '0123456789',
        w0: 'Default', w100: 'Thin', w200: 'ExtraLight', w300: 'Light', w400: 'Regular',
        w500: 'Medium', w600: 'SemiBold', w700: 'Bold', w800: 'ExtraBold', w900: 'Black'
    },
    ar: {
        dir: 'rtl',
        title: 'مُغيّر خط تيليجرام',
        subtitle: 'تخصيص خطوط تيليجرام ويب',
        customFont: 'خط مخصص',
        chooseFont: 'اختر الخط',
        sidePanel: 'تغيير حجم خط الشريط الجانبي',
        fontSize: 'حجم الخط',
        fontWeight: 'سماكة الخط',
        on: 'مفعّل',
        off: 'معطّل',
        homepage: 'الصفحة الرئيسية',
        github: 'جيت هَب',
        fontVazirmatn: 'وزير متن',
        fontLateef: 'لطيف',
        fontIransans: 'إيران سانس',
        digits: '٠١٢٣٤٥٦٧٨٩',
        w0: 'افتراضي', w100: 'رفيع جداً', w200: 'رفيع', w300: 'خفيف', w400: 'عادي',
        w500: 'متوسط', w600: 'نصف عريض', w700: 'عريض', w800: 'عريض جداً', w900: 'أسود'
    }
};

let lang = 'fa';
const t = (key) => I18N[lang][key];
// Latin digits -> the active locale's digits.
const localizeDigits = (s) => String(s).replace(/\d/g, (d) => t('digits')[+d]);

function applyLanguage(code) {
    lang = I18N[code] ? code : 'fa';
    document.documentElement.lang = lang;
    document.documentElement.dir = t('dir');

    document.querySelectorAll('[data-i18n]').forEach((el) => {
        el.textContent = t(el.dataset.i18n);
    });
    langPicker.querySelectorAll('.lang-btn').forEach((btn) => {
        btn.classList.toggle('selected', btn.dataset.lang === lang);
    });

    // Values that are built at runtime, not stored in the markup.
    fontSizeValue.textContent = localizeDigits(fontSizeSlider.value + '%');
    renderWeight(parseInt(fontWeightSlider.value, 10));
    updateSliderFill(fontSizeSlider);
    updateSliderFill(fontWeightSlider);
}

langPicker.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        applyLanguage(btn.dataset.lang);
        silentStorageSet({ lang });
    });
});

let selectedFont = 'vazirmatn';

function renderFontPicker(fontKey) {
    selectedFont = fontKey;
    fontPicker.querySelectorAll('.font-btn').forEach((btn) => {
        btn.classList.toggle('selected', btn.dataset.font === fontKey);
    });
}

fontPicker.querySelectorAll('.font-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        renderFontPicker(btn.dataset.font);
        const st = currentState();
        silentStorageSet({ fontFamily: st.fontFamily });
        broadcastToTabs({ action: 'changeFontFamily', ...st });
    });
});

function renderWeight(weight) {
    fontWeightValue.textContent = t('w' + weight) || localizeDigits(weight);
}

chrome.storage.sync.get(['fontEnabled', 'fontSizePercent', 'includeSidePanel', 'fontWeight', 'fontFamily', 'lang'], (result) => {
    const fontEnabled = result.fontEnabled !== false;
    const sideEnabled = result.includeSidePanel !== false;
    const size = result.fontSizePercent || 100;
    const weight = result.fontWeight || 0;

    renderFontPicker(result.fontFamily || 'vazirmatn');
    setSwitch(fontSwitch, toggle, fontEnabled);
    setSwitch(sideSwitch, sidePanelToggle, sideEnabled);
    setFontCardActive(fontEnabled);
    fontSizeSlider.value = size;
    fontWeightSlider.value = weight;
    applyLanguage(result.lang || 'fa'); // also renders the size/weight readouts
});

function broadcastToTabs(message) {
    chrome.tabs.query({ url: 'https://web.telegram.org/*' }, (tabs) => {
        tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, message, () => void chrome.runtime.lastError);
        });
    });
}

function currentState() {
    return {
        enabled: toggle.checked,
        includeSidePanel: sidePanelToggle.checked,
        fontSizePercent: parseInt(fontSizeSlider.value, 10),
        fontWeight: parseInt(fontWeightSlider.value, 10),
        fontFamily: selectedFont
    };
}

function silentStorageSet(obj) {
    try {
        chrome.storage.sync.set(obj, () => {
            void chrome.runtime.lastError;
        });
    } catch (e) {}
}

toggle.addEventListener('change', () => {
    const st = currentState();
    setFontCardActive(st.enabled);
    silentStorageSet({ fontEnabled: st.enabled });
    broadcastToTabs({ action: 'toggleFont', ...st });
});

sidePanelToggle.addEventListener('change', () => {
    const st = currentState();
    silentStorageSet({ includeSidePanel: st.includeSidePanel });
    broadcastToTabs({ action: 'toggleSidePanel', ...st });
});

fontSizeSlider.addEventListener('input', () => {
    fontSizeValue.textContent = localizeDigits(parseInt(fontSizeSlider.value, 10) + '%');
    updateSliderFill(fontSizeSlider);
});

fontSizeSlider.addEventListener('change', () => {
    const st = currentState();
    silentStorageSet({ fontSizePercent: st.fontSizePercent });
    broadcastToTabs({ action: 'changeFontSize', ...st });
});

fontWeightSlider.addEventListener('input', () => {
    renderWeight(parseInt(fontWeightSlider.value, 10));
    updateSliderFill(fontWeightSlider);
});

fontWeightSlider.addEventListener('change', () => {
    const st = currentState();
    silentStorageSet({ fontWeight: st.fontWeight });
    broadcastToTabs({ action: 'changeFontWeight', ...st });
});
