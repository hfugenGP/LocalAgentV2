const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 1024,
    height: 760,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, '../dist/preload.js'),
    },
  })

  // and load the index.html of the app.
  // win.loadFile('index.html')
  win.maximize()
  win.loadURL(`file://${path.join(__dirname, '../dist/index.html')}`)
}

app.on('ready', createWindow)

app.disableHardwareAcceleration()

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})