const { app, BrowserWindow, Menu } = require('electron')

const createWindow = () => {
  // We cannot require the screen module until the app is ready.
  const { screen } = require('electron')
  const primaryDisplay = screen.getPrimaryDisplay()
  // const { width, height } = primaryDisplay.workAreaSize
  const { width, height, y } = primaryDisplay.workArea

  const win = new BrowserWindow({
    // 3:4 ratio
    width: 480,
    height: 640
  })
  const [wWidth, wHeight] = win.getSize()
  win.setPosition(width - wWidth, y)

  win.loadFile('index.html')
}

const dockMenu = Menu.buildFromTemplate([
  {
    label: 'New Window',
    click () { createWindow() }
  }, 
  // {
  //   label: 'New Window with Settings',
  //   submenu: [
  //     { label: 'Basic' },
  //     { label: 'Pro' }
  //   ]
  // },
  // { label: 'New Command...' }
])

app.whenReady()
.then(() => {
  if (process.platform === 'darwin') {
    app.dock.setMenu(dockMenu)
  }
}).then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) { createWindow() }
})

