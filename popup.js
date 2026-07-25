const toggle = document.getElementById('fontToggle');
const sidePanelToggle = document.getElementById('sidePanelToggle');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');
const fontSegment = document.getElementById('fontSegment');
const sidePanelSegment = document.getElementById('sidePanelSegment');
const fontCard = document.getElementById('fontCard');
const sideCard = document.getElementById('sideCard');

function setFontCardActive(enabled) {
    if (fontCard) {
        fontCard.classList.toggle('active', !!enabled);
    }
}

function setSideCardActive(enabled) {
    if (sideCard) {
        sideCard.classList.toggle('active', !!enabled);
    }
}

function setSegment(segmentEl, hiddenInput, value) {
    const boolValue = !!value;
    hiddenInput.checked = boolValue;
    segmentEl.dataset.selected = String(boolValue);
}

function initSegment(segmentEl, hiddenInput) {
    segmentEl.querySelectorAll('.seg-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const raw = btn.dataset.value;
            const newValue = raw === 'true' ? true : (raw === 'false' ? false : hiddenInput.checked);
            setSegment(segmentEl, hiddenInput, newValue);
            if (hiddenInput === toggle) setFontCardActive(newValue);
            if (hiddenInput === sidePanelToggle) setSideCardActive(newValue);
            hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        });
    });
}

initSegment(fontSegment, toggle);
initSegment(sidePanelSegment, sidePanelToggle);

function updateSliderFill() {
    const min = parseInt(fontSizeSlider.min, 10) || 80;
    const max = parseInt(fontSizeSlider.max, 10) || 150;
    const cur = parseInt(fontSizeSlider.value, 10) || 100;
    const pct = ((cur - min) / (max - min)) * 100;
    const isRTL = document.documentElement.dir === 'rtl' || (document.body && getComputedStyle(document.body).direction === 'rtl');
    const BLUE = '#0a84ff';
    const GRAY = 'rgba(255,255,255,0.12)';
    if (isRTL) {
        const inv = 100 - pct;
        fontSizeSlider.style.setProperty('--twf-p', inv.toFixed(2) + '%');
        fontSizeSlider.style.setProperty('--twf-track-blue', GRAY);
        fontSizeSlider.style.setProperty('--twf-track-gray', BLUE);
    } else {
        fontSizeSlider.style.setProperty('--twf-p', pct.toFixed(2) + '%');
        fontSizeSlider.style.setProperty('--twf-track-blue', BLUE);
        fontSizeSlider.style.setProperty('--twf-track-gray', GRAY);
    }
}

chrome.storage.sync.get(['fontEnabled', 'fontSizePercent', 'includeSidePanel'], (result) => {
    const fontEnabled = result.fontEnabled !== false;
    const sideEnabled = result.includeSidePanel !== false;
    const size = result.fontSizePercent || 100;

    setSegment(fontSegment, toggle, fontEnabled);
    setSegment(sidePanelSegment, sidePanelToggle, sideEnabled);
    setFontCardActive(fontEnabled);
    setSideCardActive(sideEnabled);
    fontSizeSlider.value = size;
    fontSizeValue.textContent = size + '%';
    updateSliderFill();
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
        fontSizePercent: parseInt(fontSizeSlider.value, 10)
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
    broadcastToTabs({ action: 'toggleFont', enabled: st.enabled, fontSizePercent: st.fontSizePercent, includeSidePanel: st.includeSidePanel });
});

sidePanelToggle.addEventListener('change', () => {
    const st = currentState();
    setSideCardActive(st.includeSidePanel);
    silentStorageSet({ includeSidePanel: st.includeSidePanel });
    broadcastToTabs({ action: 'toggleSidePanel', includeSidePanel: st.includeSidePanel, fontSizePercent: st.fontSizePercent, enabled: st.enabled });
});

fontSizeSlider.addEventListener('input', () => {
    const size = parseInt(fontSizeSlider.value, 10);
    fontSizeValue.textContent = size + '%';
    updateSliderFill();
});

fontSizeSlider.addEventListener('change', () => {
    const size = parseInt(fontSizeSlider.value, 10);
    const st = currentState();
    silentStorageSet({ fontSizePercent: size });
    broadcastToTabs({ action: 'changeFontSize', fontSizePercent: size, enabled: st.enabled, includeSidePanel: st.includeSidePanel });
});
