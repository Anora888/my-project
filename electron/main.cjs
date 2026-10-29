const { app, BrowserWindow, ipcMain, session } = require('electron')
const path = require('path')

let win

const createWindow = () => {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    frame: false,
    resizable: false,
    maximizable: false,

    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
    },
  })

  // АВТОМАТИЧНО ДОЗВОЛЯЄМО ДОСТУП ДО МІКРОФОНА
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media' || permission === 'audioCapture') {
      callback(true) // Дозволити
    } else {
      callback(false)
    }
  })

  // Також автоматично відповідаємо на запити перевірки дозволів
  session.defaultSession.setPermissionCheckHandler((webContents, permission) => {
    if (permission === 'media' || permission === 'audioCapture') {
      return true
    }
    return false
  })

  win.loadURL('http://localhost:5173')
}

ipcMain.on('window-minimize', () => {
  win.minimize()
})

ipcMain.on('window-close', () => {
  win.close()
})

app.whenReady().then(() => {
  createWindow()
})