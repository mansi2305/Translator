let translationHistory = [];

function translateText() {
    const text = document.getElementById('text').value.trim();
    const target = document.getElementById('target').value;
    if (!text) {
        document.getElementById('result').textContent = 'Please enter some text.';
        return;
    }
    document.getElementById('result').textContent = 'Translating...';
    fetch('/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, target })
    })
    .then(res => res.json())
    .then(data => {
        if (data.translated || data.translatedText) {
            const translated = data.translated || data.translatedText;
            document.getElementById('result').textContent = translated;
            addToHistory(text, translated, target);
        } else {
            document.getElementById('result').textContent = 'Error: ' + (data.error || 'Unknown error');
        }
    })
    .catch(err => {
        document.getElementById('result').textContent = 'Error: ' + err;
    });
}



function addToHistory(src, tgt, lang) {
    translationHistory.unshift({ src, tgt, lang });
    if (translationHistory.length > 10) translationHistory.pop();
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    translationHistory.forEach(item => {
        const li = document.createElement('li');
        li.className = 'history-item';
        li.innerHTML = `<div class=\"history-src\">${item.src}</div><div class=\"history-tgt\">${item.tgt}</div><div style=\"font-size:0.9em;color:#888;\">→ ${getLangName(item.lang)}</div>`;
        list.appendChild(li);
    });
}

function getLangName(code) {
    const map = {
        'en': 'English', 'hi': 'Hindi', 'es': 'Spanish', 'fr': 'French', 'de': 'German', 'zh-CN': 'Chinese (Simplified)', 'zh-TW': 'Chinese (Traditional)', 'ar': 'Arabic', 'ru': 'Russian', 'ja': 'Japanese', 'ko': 'Korean', 'pt': 'Portuguese', 'it': 'Italian', 'tr': 'Turkish', 'nl': 'Dutch', 'sv': 'Swedish', 'pl': 'Polish', 'uk': 'Ukrainian', 'vi': 'Vietnamese', 'th': 'Thai', 'fa': 'Persian', 'he': 'Hebrew', 'id': 'Indonesian', 'ms': 'Malay', 'ro': 'Romanian', 'hu': 'Hungarian', 'cs': 'Czech', 'el': 'Greek', 'fi': 'Finnish', 'no': 'Norwegian', 'da': 'Danish'
    };
    return map[code] || code;
}

document.getElementById('text').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        translateText();
    }
}); 