window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    

var game = new Phaser.Game(1200, 800, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('backdrop', 'assets/Desert.png');
    game.load.image('card', 'assets/player_4.png');
	game.load.image('bullet', 'assets/Bullet.png');
	game.load.image('enemy', 'assets/Inf.png');
}

var card;
var bullets;
var fireRate = 100;
var nextFire = 0;
var efireRate = 100;
var enextFire = 0;
var eBullets;
var enemies;
var enemy;
var killedEnemy;
var timer; 
var turnTimer;
var etimer; 
var eturnTimer;
var dice;
var edice;
var fDice;
var efDice;
var mDice;
var movDie;
var cursors;
function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.defaultRestitution = 0.8;
    game.world.setBounds(0, 0, 2560, 1600);
    game.add.sprite(0, 0, 'backdrop');
    card = game.add.sprite(300, 300, 'card');
	card.enableBody = true;
	enemies = game.add.group(); 
	enemies.enableBody = true;
    game.camera.follow(card);
	card.anchor.set(0.5);
	//card.scale = 1;
	bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
	bullets.createMultiple(2, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
	eBullets = game.add.group();
    eBullets.enableBody = true;
    eBullets.physicsBodyType = Phaser.Physics.ARCADE;
	eBullets.createMultiple(2, 'bullet');
    eBullets.setAll('checkWorldBounds', true);
    eBullets.setAll('outOfBoundsKill', true);
    game.physics.enable(card, Phaser.Physics.ARCADE);
	timer = game.time.create(false);
	timer.loop(5000, stepChange, this);
	etimer = game.time.create(false);
	etimer.loop(5000, enemyMoves, this);
	turnTimer = game.time.create(false);
	turnTimer.loop(2000, dirChange, this)
	turnTimer.start();
	eturnTimer = game.time.create(false);
	eturnTimer.loop(2000, dirChange, this)
	eturnTimer.start();
	timer.start();
	etimer.start();
	game.physics.p2.enable(card);
	for (var i = 0; i<10; i++)
	{
		var e = enemies.create(card.x+game.rnd.integerInRange(1000,2000), game.world.randomY, 'enemy');
		e.anchor.setTo(0.5, 0.5);
		game.physics.enable(e, Phaser.Physics.ARCADE);
	}
	cursors = game.input.keyboard.createCursorKeys();
}
function fire() 
{
    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(card.x - 8, card.y - 8);
		bullet.body.velocity.x = 0;
		bullet.body.velocity.y = 600;
    }
}
function fly(enemy)
{
	enemy.body.velocity.y = game.rnd.integerInRange(-30, -60);
	game.world.wrap(enemy, 0, true);
}
function eDirChange(enemy)
{
		edice = game.rnd.integerInRange(0, 18)
		if(edice >0 && edice <4)
		{
			enemy.body.angularVelocity += game.rnd.integerInRange(1, 25);
		}
		else if(edice > 4 && edice < 8)
		{
			enemy.body.angularVelocity += game.rnd.integerInRange(-25, -1);
		}
		else
		{
			enemy.body.angularVelocity = 0;
		}
}
function enemyMoves()
{
	enemies.forEach(fly, this, true);
}
function enemyTurns()
{
	enemies.forEach(eDirChange, this, true);
}
function kill(enemy)
{
	enemy.kill();
}
function explode(bullet, enemy)
{
	bullet.kill();
	enemy.kill();
	killedEnemy++;
}
function pexplode(bullet, card)
{
	bullet.kill();
	card.kill();
}
function enemyFires(enemy)
{
	if (game.time.now > enextFire && eBullets.countDead() > 0)
    {
        enextFire = game.time.now + efireRate;

        var eBullet = eBullets.getFirstDead();

        eBullet.reset(enemy.x + 8, enemy.y + 8);
		eBullet.body.velocity.x=0;
		eBullet.body.velocity.y=-600;
    }
}
function stepChange()
{
	if(movDie > 5 && movDie < 12)
	{
		mDice = game.rnd.integerInRange(0, 18);
		if (mDice >= 0 && mDice < 9)
		{
			card.body.velocity = 0;
			game.physics.arcade.accelerationFromRotation(card.rotation, game.rnd.integerInRange(1,60), card.body.acceleration);
		}
		else if (mDice >= 9 && mDice < 13)
		{
			card.body.velocity = 0;
			game.physics.arcade.accelerationFromRotation(card.rotation, game.rnd.integerInRange(-30,-1), card.body.acceleration);
		}
		else if (mDice >= 13 && mDice <15)
		{
			card.body.velocity = 0;
		}
	}
}
function dirChange()
{
	dice = game.rnd.integerInRange(0, 18)
	if(movDie > 0 && movDie < 4)
	{
		if(dice > 0 && dice < 4)
		{
			card.body.angularVelocity += game.rnd.integerInRange(1, 25);
		}
		else if(dice > 4 && dice < 8)
		{
			card.body.angularVelocity += game.rnd.integerInRange(-25, -1);
		}
		else
		{
			card.body.angularVelocity = 0;
		}
	}
}
function update() 
{
	movDie = game.rnd.integerInRange(0,18);
	game.physics.arcade.collide(card, enemies);
    game.physics.arcade.collide(enemies, enemies);
	game.physics.arcade.overlap(bullets, enemies, explode, null, this);
	game.physics.arcade.overlap(eBullets, card, pexplode, null, this);
	game.world.wrap(card, 0, true);
	fDice = game.rnd.integerInRange(0,18)
	if(fDice <6)
	{
		fire();
	}
	efDice = game.rnd.integerInRange(0,18)
	if (efDice <4)
	{
		enemies.forEach(enemyFires, this, true);
	}
}

function render() {
	  game.debug.text('Time until move: ' + timer.duration.toFixed(0), 32, 32);
	  game.debug.text('Time until turn: ' + turnTimer.duration.toFixed(0), 32, 42);
}
};
