


let backgroundList = 0;

const backgrounds = [
    "images/sky.gif",
    "images/sky.gif",
    "images/sky.gif",
    "images/sky.gif",
    "images/sky.gif",
    "images/sky.gif",
    "images/sky.gif",
    "images/sky.gif",
    "images/sky.gif",
    "images/sky.gif",
    "images/sky.gif",
    "images/sky.gif",
    "images/sky.gif",
    "images/sky.gif",
    "images/sky.gif",
    "images/sky.gif",
    "images/ded.png"
];


document.addEventListener("click", () => {
    backgroundList = (backgroundList + 1) % backgrounds.length;

    document.body.style.backgroundImage = `url('${backgrounds[backgroundList]}')`;

    
});

