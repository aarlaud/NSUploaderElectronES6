
require('babel-register');
const electron = require('electron');

const {app, Menu,BrowserWindow} = require('electron');
// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow;
// import { app, BrowserWindow } from 'electron';
require('electron-debug')();




let mainWindow = null;

// Adds debug features like hotkeys for triggering dev tools and reload


app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});


app.on('ready', () => {
  mainWindow = new BrowserWindow({'minWidth': 800, 'minHeight': 600, titleBarStyle: 'hidden'});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });



  // Create the Application's main menu
      var template = [{
          label: "Application",
          submenu: [
              { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
              { type: "separator" },
              { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
          ]}, {
          label: "Edit",
          submenu: [
              { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
              { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
              { type: "separator" },
              { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
              { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
              { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
              { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
          ]}
      ];

      Menu.setApplicationMenu(Menu.buildFromTemplate(template));

});
