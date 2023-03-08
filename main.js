/**
 * @date 2023 Mar. 7
 * References:
 *  https://www.electronjs.org/docs/latest/tutorial/keyboard-shortcuts
 *  https://www.electronjs.org/docs/latest/api/menu-item
 *  https://www.electronjs.org/docs/latest/api/menu#menuitems
 *  https://stackoverflow.com/questions/41258906/electron-application-menu-working-example
 *  https://stackoverflow.com/questions/63840870/electron-how-to-remove-a-menu-item-from-the-default-menu
 */
const { app, BrowserWindow, Menu, MenuItem } = require('electron')

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
])

app.whenReady()
.then(() => {
  if (process.platform === 'darwin') {
    app.dock.setMenu(dockMenu)
  }
}).then(() => {
  const menu = Menu.getApplicationMenu()
  menu.items.find((item) => item.role === "filemenu").submenu.insert(0, 
    new MenuItem({
      label: 'New Window',
      accelerator: "CommandOrControl+N",
      click: () => {createWindow()}
    })
  )
  Menu.setApplicationMenu(menu)
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) { createWindow() }
})

