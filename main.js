const { app, BrowserWindow, ipcMain, contextBridge, ipcRenderer } = require('electron');
const WebSocket = require('ws');
const fs = require('fs');
const io = require("socket.io-client");
const path = require('path');
require('dotenv').config()

const socket = io(process.env.SOCKET_URL);
const contentFile = "./cached_content.json";

app.whenReady().then(() => {
    const win = new BrowserWindow({
        width: 1200,
        height: 650,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    })

    win.loadFile('./index.html')
    // win.webContents.openDevTools()
    // Load cached content on startup

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });
});
ipcMain.on('request-content', (event, message) => {
    if (message == 'send-data') {
        console.log('Sending request to server for new data');
        socket.emit('request-content');
    }
    socket.on("update-content", (content) => {
        console.log('New updates from server');
        fs.writeFileSync(contentFile, JSON.stringify(content, null, 2));
        event.reply('update-content', fs.readFileSync(contentFile, "utf-8"));
    });
    socket.on("connect_error", () => {
        console.log("Socket connection failed, loading offline content...");
        if (fs.existsSync(contentFile)) {
            const offlineContent = fs.readFileSync(contentFile, "utf-8");
            event.reply("update-content", offlineContent);
        }
    });
});