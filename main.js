//TODO: Fix up this code!!!
//'use strict';

const {app, BrowserWindow, ipcMain} = require('electron');
var FB = require('fb');

var data = null;
var albumID = null;

app.on('ready', function() {
    var mainWindow = new BrowserWindow({
        //fullscreen: true,
        //frame: false,
    });

    mainWindow.loadURL('file://' + __dirname + '/app/login.html');

    ipcMain.on('facebook-login', function(event, args) {
        var options = {
            client_id: '{app-id}',
            scopes: "public_profile,user_photos",
            redirect_uri: "https://www.facebook.com/connect/login_success.html"
        }

        var authWindow = new BrowserWindow({
            width: 450,
            height: 300,
            show: false,
            webPreferences: {
                webSecurity: false,
                plugins: true,
                nodeIntegration: false
            }
        });

        var facebookAuthURL = "https://www.facebook.com/dialog/oauth?client_id=" + options.client_id + "&redirect_uri=" + options.redirect_uri + "&response_type=token,granted_scopes&scope=" + options.scopes + "&display=popup";
        authWindow.loadURL(facebookAuthURL);
        authWindow.show();
        authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
            var raw_code = /access_token=([^&]*)/.exec(newUrl) || null;
            access_token = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
            error = /\?error=(.+)$/.exec(newUrl);
            if(access_token) {
                mainWindow.loadURL('file://' + __dirname + '/app/albums.html');
                FB.setAccessToken(access_token);
                authWindow.close();
            } else {
                mainWindow.webContents.executeJavaScript("document.getElementById('status').innerHTML = '" + error + "'");
            }
        });
    });

    ipcMain.on('get-albums', (event) => {
        FB.api('/me/albums', function(res) {
            event.returnValue = res;
        });
    });

    ipcMain.on('get-photos', (event) => {
        FB.api('/' + albumID + '/photos', { fields: ['id', 'name', 'source'] }, function (res) {
            event.returnValue = res;
            //console.log(res);
        });
    });

    ipcMain.on('set-album', (event, arg) => {
        albumID = arg;
    });
});
