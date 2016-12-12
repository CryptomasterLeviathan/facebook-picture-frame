const {ipcRenderer} = require('electron')
var handlebars = require('handlebars');

var data = ipcRenderer.sendSync('get-photos');
console.log(data);


handlebars.registerHelper('currIndex', function(index) {
   return index + 1;
});
  
var imageTemplate = document.getElementById('image-template').innerHTML;
var template = handlebars.compile(imageTemplate);
var slideshowPictures = template(data);
document.getElementById('slideshow').innerHTML = slideshowPictures;



var slideIndex = 1;
var timeout;
showSlides(1);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) {slideIndex = 1} 
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none"; 
    }
    slides[slideIndex-1].style.display = "block"; 
    clearTimeout(timeout);
    timeout = setTimeout(autoAdvance, 5000);
}

function autoAdvance() {
    data = ipcRenderer.sendSync("get-photos");
    slideshowPictures = template(data);
    document.getElementById('slideshow').innerHTML = slideshowPictures;





    var i;
    var slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex> slides.length) {slideIndex = 1}
    slides[slideIndex-1].style.display = "block";
    timeout = setTimeout(autoAdvance, 5000);
}

document.getElementById("nextButton").onclick = function() {plusSlides(1)};
document.getElementById("prevButton").onclick = function() {plusSlides(-1)};
