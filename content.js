let currentAudio = null;

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z') {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            playText(selectedText);
        }
    }
});

function playText(text) {
    if (currentAudio) {
        currentAudio.pause();
    }
    
    try {
        chrome.runtime.sendMessage({
            action: 'playTTS',
            text: text
        }, (response) => {
            if (chrome.runtime.lastError) {
                // console.error('扩展程序通信错误：', chrome.runtime.lastError.message);
                // alert('扩展程序可能已被禁用或需要重新加载。请刷新页面后重试。');
            }
        });
    } catch (error) {
        // console.error('扩展程序错误：', error);
        //alert('扩展程序可能已被禁用或需要重新加载。请刷新页面后重试。');
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'playAudio') {
        var receivedData = JSON.parse(message.audioBlob);
        audioData = new Uint8Array(receivedData.data).buffer;
        
        const blob = new Blob([audioData], { type: 'audio/mpeg' });
        
        if (currentAudio) {
            currentAudio.pause();
            URL.revokeObjectURL(currentAudio.src);
        }
        
        const audio = new Audio();
        currentAudio = audio;
        
        audio.onloadeddata = () => {
            audio.play();
        };
        
        audio.onerror = (e) => {
            console.error('音频错误:', audio.error);
        };
        
        const audioUrl = URL.createObjectURL(blob);
        audio.src = audioUrl;
        
        audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            currentAudio = null;
        };
    }
});
