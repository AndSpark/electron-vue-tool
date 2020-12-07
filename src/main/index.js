import { app, BrowserWindow, Menu, protocol } from 'electron'
import { productName } from '../../package.json'

// set app name
app.name = productName
// to hide deprecation message
app.allowRendererProcessReuse = true

// disable electron warning
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = false

const gotTheLock = app.requestSingleInstanceLock()
const isDev = process.env.NODE_ENV === 'development'
const isDebug = process.argv.includes('--debug')
let mainWindow

// only allow single instance of application
if (!isDev) {
  if (gotTheLock) {
    app.on('second-instance', () => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow && mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    })
  } else {
    app.quit()
    process.exit(0)
  }
} else {
  // process.env.ELECTRON_ENABLE_LOGGING = true

  require('electron-debug')({
    showDevTools: false,
  })
}

async function installDevTools() {
  let installExtension = require('electron-devtools-installer')
  installExtension.default(installExtension.VUEJS_DEVTOOLS).catch((err) => {
    console.log('Unable to install `vue-devtools`: \n', err)
  })
}

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 800,
    useContentSize: true,
    width: 1200,
    frame: false,
    resizable: true,
    // useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: false,
      webSecurity: false,
      enableRemoteModule: true,
    },
    show: true,
  })

  // eslint-disable-next-line
  Menu.setApplicationMenu(null)

  // load root file/url
  if (isDev) {
    mainWindow.loadURL('http://localhost:9080')
  } else {
    mainWindow.loadFile(`${__dirname}/index.html`)

    global.__static = require('path')
      .join(__dirname, '/static')
      .replace(/\\/g, '\\\\')
  }

  // Show when loaded
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    console.log('\nApplication exiting...')
  })
}

app.on('ready', () => {
  // file文件请求路线需要拦截 安全问题
  protocol.interceptFileProtocol(
    'file',
    (req, callback) => {
      const url = req.url.substr(8)
      callback(decodeURI(url))
    },
    (error) => {
      if (error) {
        console.error('Failed to register protocol')
      }
    }
  )

  createWindow()

  if (isDev) {
    installDevTools()
    mainWindow.webContents.openDevTools()
  }

  if (isDebug) {
    mainWindow.webContents.openDevTools()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
