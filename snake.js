// Snake by Patrick OReilly and Richard Davey
// Twitter: @pato_reilly Web: http://patricko.byethost9.com

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'wappumato', { preload: preload, create: create, update: update,render : render });

function preload() {
    game.load.image('startscreen','images/startscreen.png');
}

var died = false;
var snakeHead; //head of snake sprite
var snakeSection = new Array(); //array of sprites that make the snake body sections
var snakePath = new Array(); //arrary of positions(points) that have to be stored for the path the sections follow
var numSnakeSections = 30; //number of snake body sections
var snakeSpacer = 6; //parameter that sets the spacing between sections
var gameStarted = false;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.world.setBounds(0, 0, 800, 600);

    cursors = game.input.keyboard.createCursorKeys();

    snakeHead = game.add.sprite(400, 300, 'ball');
    snakeHead.anchor.setTo(0.5, 0.5);

    game.physics.enable(snakeHead, Phaser.Physics.ARCADE);

    //  Init snakeSection array
    for (var i = 1; i <= numSnakeSections-1; i++)
    {
        snakeSection[i] = game.add.sprite(400, 300, 'ball');
        snakeSection[i].anchor.setTo(0.5, 0.5);
    }

    //  Init snakePath array
    for (var i = 0; i <= numSnakeSections * snakeSpacer; i++)
    {
        snakePath[i] = new Phaser.Point(400, 300);
    }

    var bmd = game.add.bitmapData(800, 600);

    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, 800, 600);
    bmd.ctx.fillStyle = '#000000';
    bmd.ctx.fill();
    blackBackground = game.add.sprite(0, 0, bmd);

    startscreen = game.add.sprite(0, 0, 'startscreen');
    startscreen.inputEnabled = true;
    startscreen.events.onInputDown.add(closeStartscreen);
}

function update() {
    if (gameStarted) {
        if (died) {
            gameOverScreen();
        }
        else {
            gameLoop();
        }

    }
    else {
        startScreen();
    }
}

function gameLoop() {

    setSnakeBodyVelocity();

    // Everytime the snake head moves, insert the new location at the start of the array,
    // and knock the last position off the end

    moveSnake();

    checkCollisionToWalls();

    checkCollisionToItself();

    reactToKeyboardEvents();

    function setSnakeBodyVelocity() {
        snakeHead.body.velocity.setTo(0, 0);
        snakeHead.body.angularVelocity = 0;
        snakeHead.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(snakeHead.angle, 300));
    }

    function moveSnake() {
        var part = snakePath.pop();

        part.setTo(snakeHead.x, snakeHead.y);

        for (var i = 1; i <= numSnakeSections - 1; i++)
        {
            snakeSection[i].x = (snakePath[i * snakeSpacer]).x;
            snakeSection[i].y = (snakePath[i * snakeSpacer]).y;
        }

        snakePath.unshift(part);
    }

    function checkCollisionToWalls() {
        game.physics.arcade.collide(snakeHead, game.world.bounds, function() { died = true; }, null, snakeHead);
        // died = true;
    }

    function checkCollisionToItself() {
        // died = true;
    }

    function reactToKeyboardEvents() {
        if (cursors.left.isDown)
        {
            snakeHead.body.angularVelocity = -300;
        }
        else if (cursors.right.isDown)
        {
            snakeHead.body.angularVelocity = 300;
        }
    }
}

function startScreen() {
    if (cursors.up.isDown) {
        closeStartscreen();
    }
}

function closeStartscreen() {
    gameStarted = true;
    blackBackground.visible = false;
    startscreen.visible = false;
}

function gameOverScreen() {

}

function render() {

}