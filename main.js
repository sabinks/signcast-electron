const { app, BrowserWindow, ipcMain, contextBridge, ipcRenderer } = require('electron');
const WebSocket = require('ws');
const fs = require('fs');
const io = require("socket.io-client");
const path = require('path');
require('dotenv').config()
const env = process.env.NODE_ENV || 'development';
console.log(env);

const socket = io(process.env.SOCKET_URL, {
    connect_timeout: 5000 // 5 seconds in milliseconds
});
const contentFile = "./cached_content.json";

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 650,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    })
    win.loadFile(path.join(__dirname, 'index.html'))
    if (env === 'development') {
        win.webContents.openDevTools()
    }
}
app.on('ready', createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

ipcMain.on('request-content', (event, data) => {
    const { type, screenId } = data
    if (type == 'send-data') {
        console.log('Sending request to server for new data');
        socket.emit('request-content', { screenId });
    }
    socket.on("update-content", (content) => {
        console.log('New updates from server');
        fs.writeFileSync(contentFile, JSON.stringify(content, null, 2))
        event.reply('update-content', fs.readFileSync(contentFile, "utf-8"));
    });
    socket.on("connect_error", () => {
        console.log("Socket connection failed, loading offline content...");
        if (fs.existsSync(contentFile)) {
            const offlineContent = fs.readFileSync(contentFile, "utf-8");
            event.reply("load-from-cache", offlineContent);
        }
    });
});
// Listen for screen activation
ipcMain.on('screen-activate', (event, data) => {
    console.log('Screen Id:', data);
    event.reply('sync-device-screen', 'new data');
});

// // If development environment 
