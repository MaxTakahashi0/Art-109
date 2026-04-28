
let rock1, rock2, rock3; floor;

function preload() {
    treeImg = loadImage('/images/April02.png');
    rockImg1 = loadImage('/images/rock.png');
    rockImg2 = loadImage('/images/rock2.png');
    rockImg3 = loadImage('/images/rock3.png');
    rockbaseImg = loadImage('/images/rockbase.png');
}

function setup() {
    new Canvas(windowWidth, windowHeight);


    world.gravity.y = 10;

    floor = new Sprite(300, 650, 10000, 40, 'static');

    rockbase = new Sprite(windowWidth/2 - 50, 580, 80, 80, 'static');
    rockbase.img = rockbaseImg;
    rockbase.scale = 0.9;
    rockbase.addCollider(0, 0, 400, 200);

    rock1 = new Sprite(200, 100, 80, 80);
    rock1.img = rockImg1;
    rock1.scale = 0.8;
    rock1.addCollider(0, 0, 200, 200);



    rock2 = new Sprite(600, 50, 80, 80);
    rock2.img = rockImg2;
    rock2.scale = 0.2;
    rock2.addCollider(0, 0, 200, 200);



    rock3 = new Sprite(900, 150, 80, 80);
    rock3.img = rockImg3;
    rock3.scale = 1;
    rock3.addCollider(0, 0, 100, 50);


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
            s.moveTo(mouse.x, mouse.y, 6);
        }
    }
}