chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'playTTS') {
        generateAndPlayTTS(message.text, sender.tab.id);
    }
});

async function generateAndPlayTTS(text, tabId) {
    try {
        //const KEY = await chrome.storage.sync.get(['apiKey']);
        //const apiKey = KEY.apiKey;
        const apiKey = 'sk-777770Yf0JGyJxgRmXqFQyTgWUd9GZnmi3KlvowmRWpWqrhy'
        const response = await fetch('https://tts.liupeng.info/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'tts-1',
                input: text,
                voice: 'zh-CN-XiaoxiaoNeural',
                response_format: 'mp3'
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`TTS API请求失败: ${response.status} ${response.statusText} ${errorText}`);
        }

        const audioBlob = await response.blob();
        const arrayBuffer = await audioBlob.arrayBuffer();
        
        const uint8Array = new Uint8Array(arrayBuffer);
        const data = {
            data: Array.from(uint8Array),
            contentType: 'x-an-example'
        };
        var transportData = JSON.stringify(data);
        chrome.tabs.sendMessage(tabId, {
            action: 'playAudio',
            audioBlob: transportData
        });
    } catch (error) {
        console.error('TTS生成错误:', error);
    }
}
