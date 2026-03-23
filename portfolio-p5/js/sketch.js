
let canvas;
let img;
let xPos = 0;
let yPos = 0;
let easing = 0.04;

function preload() {
    img = loadImage('../images/duck.png');
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight + 2000);
    canvas.position(0, 0);
    canvas.style("z-index", -2);
    imageMode(CENTER);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight + 2000);
}

function draw() {
    // background (244)
    clear();

    xPos = xPos + ((mouseX - xPos) * easing);
    yPos = yPos + ((mouseY - yPos) * easing);

    drawThing(xPos, yPos);
}

function mouseClicked() {
    drawThing(xPos + random(-200, 200), yPos + random(-200, 200));
}

function drawThing(_x, _y) {

    image(img, _x, _y, 50, 55);
}