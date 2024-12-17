document.getElementById('save').onclick = function() {
    const apiKey = document.getElementById('apiKey').value;
    chrome.storage.sync.set({ apiKey: apiKey }, function() {
        alert('API Key saved!');
    });
};

// 加载已保存的API Key
chrome.storage.sync.get(['apiKey'], function(result) {
    if (result.apiKey) {
        document.getElementById('apiKey').value = result.apiKey;
    }
});
