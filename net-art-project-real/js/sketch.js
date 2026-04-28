
let rock1, rock2, rock3; floor;

function preload() {
    treeImg = loadImage('/images/tree.png');
    sandImg = loadImage('images/sand.png');
    rockImg1 = loadImage('/images/rock.png');
    rockImg2 = loadImage('/images/rock2.png');
    rockImg3 = loadImage('/images/rock3.png');
    rockbaseImg = loadImage('/images/rockbase.webp');
}

function setup() {
    new Canvas(windowWidth, windowHeight);


    world.gravity.y = 10;

    floor = new Sprite(300, 650, 10000, 40, 'static');
    floor.opacity = 0;



    rockbase = new Sprite(windowWidth / 2 - 50, 580, 80, 80, 'static');
    rockbase.img = rockbaseImg;
    rockbase.scale = 0.5;
    rockbase.addCollider(0, 0, 250, 100);

    rock2 = new Sprite(1200, 50, 80, 80);
    rock2.img = rockImg2;
    rock2.scale = 0.15;
    rock2.addCollider(0, 0, 230, 150);

    rock1 = new Sprite(200, 100, 80, 80);
    rock1.img = rockImg1;
    rock1.scale = 0.7;
    rock1.addCollider(0, 0, 150, 150);

    rock3 = new Sprite(900, 150, 80, 80);
    rock3.img = rockImg3;
    rock3.scale = 0.5;
    rock3.addCollider(0, 0, 140, 60);

    rock1.friction = 2;
    rock2.friction = 2;
    rock3.friction = 2;

    rock1.bounciness = 0.2;
    rock2.bounciness = 0.2;
    rock3.bounciness = 0.2;

}


function draw() {
    clear();


    if (mouse.pressing()) {
        let s = world.getSpriteAt(mouse.x, mouse.y);
        if (s) {
            s.moveTo(mouse.x, mouse.y, 2);
        }
    }

    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0.2)';
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = -10;

    image(treeImg, 800, 0, 400, 400);
    image(treeImg, 200, 0, 400, 400);
    image(treeImg, 500, 0, 700, 700);
    image(treeImg, -160, 0, 1000, 1000);
    image(treeImg, 1000, 0, 700, 700);
    image(treeImg, 1360, 0, 1000, 1000);
    fill(200, 200, 200);
    ellipse(windowWidth / 2, windowWidth / 2 + 200, 3000, 1000);
    image(sandImg, -210, 264, windowWidth + 400, 890);





    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0.3)';
    drawingContext.shadowOffsetX = -5;
    drawingContext.shadowOffsetY = 10;
}