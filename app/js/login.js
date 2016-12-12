'use strict';

var {ipcRenderer} = require('electron');

document.getElementById('login').onclick = function() {
    ipcRenderer.send('facebook-login');
};
