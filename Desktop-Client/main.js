const { app, BrowserWindow, screen } = require('electron');
const url = require('url');
const path = require('path');

function createAppWindow() {
    const window = new BrowserWindow({
        show: false,
        width: 1123,
        height: screen.getPrimaryDisplay().size.height,
        icon: './favicon.ico',
    });

    window.loadURL(
        url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file',
            slashes: true,
        })
    );

    window.once('ready-to-show', () => {
        window.show();
        window.focus();
    });
}

app.whenReady().then(createAppWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
