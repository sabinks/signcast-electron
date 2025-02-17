document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('sync-container').style.display = 'none';
    document.getElementById('content-container').style.display = 'none';
    document.getElementById('loadingOverlay').style.display = 'none';
    var screenName = document.getElementById('screen-name')
    var screenId = '';
    // Request initial content from Electron
    // window.electron.sendMessage("request-content", 'send-data');

    // Activate button
    document.getElementById('activateButton').addEventListener('click', (event) => {
        event.preventDefault()
        screenId = document.getElementById('screen-id').value
        window.electron.sendMessage("screen-activate", screenId);
    });

    window.electron.onReceiveMessage("sync-device-screen", (data) => {
        document.getElementById('sync-container').style.display = 'block';
        document.getElementById('screen-id-form-container').style.display = 'none';
    })

    // Sync device button
    document.getElementById('syncDeviceButton').addEventListener('click', (event) => {
        event.preventDefault()
        loadingOverlay.style.display = 'flex';
        document.getElementById('sync-container').style.display = 'none';
        window.electron.sendMessage("request-content", { type: 'send-data', screenId });
    });
    // Listen for content updates
    window.electron.onReceiveMessage("update-content", (data) => {
        console.log('Loading data received from server');
        loadAllContent(data)
    });
    window.electron.onReceiveMessage("load-from-cache", (data) => {
        console.log('Loading data from cache');
        loadAllContent(data)
    });
    function loadAllContent(data) {
        loadingOverlay.style.display = 'none';
        document.getElementById('content-container').style.display = 'block'
        const canvas = new fabric.Canvas("canvas", {
            lockMovementX: true,
            lockMovementY: true,
            selection: false,
        });
        const parsedData = JSON.parse(data)
        // screenName.innerHTML = `Screen Name: ${parsedData.name} (${parsedData.screenId})`
        const list = parsedData.content.objects
        canvas.loadFromJSON(parsedData.content)
        canvas.requestRenderAll()
    }
});
