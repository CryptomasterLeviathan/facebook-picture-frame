'use strict';

var {ipcRenderer} = require('electron');
var handlebars = require('handlebars');

var data = ipcRenderer.sendSync('get-albums');

var pickAlbum = function(albumID) {
    console.log(albumID);
    ipcRenderer.send('set-album', albumID);
};

handlebars.registerHelper("currIndex", function(index) {
    return index + 1;
});

var albumTemplate = document.getElementById('album-template').innerHTML;
var template = handlebars.compile(albumTemplate);
var albums = template(data);
document.getElementById('albums').innerHTML = albums;
