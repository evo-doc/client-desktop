const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let win;

const config = {
   windowDarwin: {
      title: 'EvoDoc',
      width: 1000,
      height: 600,
      minWidth: 500,
      minHeight: 300,
      titleBarStyle: 'hiddenInset',
   },

   windowOther: {
      title: 'EvoDoc',
      width: 1000,
      height: 600,
      minWidth: 500,
      minHeight: 300,
   },
};

function createWindow() {
   win = new BrowserWindow(process.platform === 'darwin' ? config.windowDarwin : config.windowOther);

   win.loadURL(
      url.format({
         pathname: path.join(__dirname, '/../build/index.html'),
         protocol: 'file:',
         slashes: true,
      }),
   );

   if (process.platform !== 'darwin') {
      win.setMenu(null);
   }


   win.webContents.openDevTools();

   win.on('closed', () => {
      win = null;
   });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
   if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
   if (win === null) createWindow();
});
