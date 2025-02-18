## Electron Display Application

### Description

This Electron application functions as a digital signage display that connects to a Socket server to fetch and display content.
It includes offline caching to ensure content is available even when the network connection is lost.

### Features

- **Full-screen Display**: Runs in fullscreen mode to present content.
- **Socket Communication**: Connects to a Socket server to request and receive content updates.
- **Offline Playback**: Stores content locally in `cached_content.json` and loads it when offline.
- **Device Syncing**: Uses `screen-activate` events to synchronize the display device with the backend.
- **Error Handling**: Detects Socket connection failures and switches to offline mode.

---

## Setup Instructions

### Prerequisites

- node version 22.0.0

### Command

-npm install

### Environment Variables

Create a `.env` file in the root directory and define:

SOCKET_URL=https://signcast-backend.sabinks.com/data-sync
NODE_ENV=production

### Running the Application

For production run:

- npm run dev

For development run with dev tools open:

- npm run start

## Application Workflow

1. **App Initialization**

   - The application launches in fullscreen mode.
   - Loads `index.html` into the `BrowserWindow`.
   - If in development mode, opens developer tools.

2. **Fetching Content**

   - The renderer process requests content by sending `request-content` event to `ipcMain`.
   - The main process sends a `request-content` event via Socket to the server.
   - The server responds with updated content, which is then cached in `cached_content.json`.
   - The new content is sent back to the renderer process via `update-content`.

3. **Offline Handling**

   - If Socket connection fails, the app reads `cached_content.json`.
   - Cached content is sent to the renderer process using `load-from-cache`.

4. **Device Syncing**
   - When a device is activated, the `screen-activate` event is triggered.
   - Sends a sync event to update the screen with the latest content.

---

## Troubleshooting

- **Socket Connection Issues**:

  - Ensure `SOCKET_URL` is correct and reachable.
  - Check if the Socket server is running.
  - Look for `Socket connection failed` in logs.

- **Content Not Updating**:

  - Delete `cached_content.json` and restart the application.
  - Verify the server is sending `update-content` events.

- **App Not Launching**:
  - Run `npm install` to ensure dependencies are installed.
  - Check error logs in the terminal output.

---

## Future Improvements

- Add retry mechanism for Socket reconnection.
- Implement UI notifications for connection status.
- Improve error handling for file read/write operations.
- Support additional content types like video and widgets.
