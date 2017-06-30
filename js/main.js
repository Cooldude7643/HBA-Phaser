function init(){
	game.renderer.renderSession.roundPixels = true;
}

function preload(){
	game.load.image('background', 'images/background.png');
	game.load.audio('sfx:jump', 'audio/jump.wav');
    game.load.json('level:1', 'data/level01.json');
    game.load.image('ground', 'images/ground.png');
    game.load.image('grass:8x1', 'images/grass_8x1.png');
    game.load.image('grass:6x1', 'images/grass_6x1.png');
    game.load.image('grass:4x1', 'images/grass_4x1.png');
    game.load.image('grass:2x1', 'images/grass_2x1.png');
    game.load.image('grass:1x1', 'images/grass_1x1.png');
    game.load.image('grass:1x1', 'images/grass_1x1.png');
      game.load.audio('sfx:jump', 'audio/jump.wav');
      game.load.image('hero', 'images/hero_stopped.png');
    game.load.audio('sfx:jump', 'audio/jump.wav');
    game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
    game.load.spritesheet('spider', 'images/spider.png', 42, 32);
};

function create(){
     sfxJump = game.add.audio('sfx:jump');
     sfxCoin = game.add.audio('sfx:coin');
    game.add.image(0, 0, 'background');
  loadLevel(this.game.cache.getJSON('level:1'));
  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    upKey.onDown.add(function(){
        jump();
        sfxJump = game.add.audio()
 
    })
};


function update(){
    handleInput();
    handleCollisions();
}
 function handleInput(){
    
    if (leftKey.isDown) { // move hero left
        
        move(-1);
    }

   else if (rightKey.isDown) { // move hero right
        
        move(1);
    }

    else { //stop
        move(0);
    }
};
function spawnPlatform(platform) {
    game.add.sprite(platform.x, platform.y, platform.image);
    var sprite = platforms.create(platform.x, platform.y, platform.image);
    console.log(sprite);
    game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    game.add.sprite(platform.x, platform.y, platform.image);
    var sprite = platforms.create(platform.x, platform.y, platform.image);
    
};

function loadLevel(data) {
	platforms = game.add.group();
    console.log(data);
    coins = game.add.group();
    data.platforms.forEach(spawnPlatform, this);
    spawnCharacters({hero: data.hero});
    game.physics.arcade.gravity.y = 1200;  // ..
    data.coins.forEach(spawnCoin, this);
    spiders = game.add.group()
};

function spawnCharacters (data) {
    hero = game.add.sprite(data.hero.x, data.hero.y, 'hero');
    hero.anchor.set(0.5, 0.5);
    //Make the main character use the physics engine for movement
    game.physics.enable(hero);
    hero.body.collideWorldBounds = true;
    data.spiders.forEach(function (spider){
        var sprite = game.add.sprite(spider.x, spider.y, 'spider');
        spiders.add(sprite);
        sprite.anchor.set(0.5);
        // animation
        sprite.animations.add('crawl', [0, 1, 2], 8, true);
        sprite.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
        sprite.animations.play('crawl');
        game.physics.enable(sprite);
        sprite.body.collideWorldBounds = true;
        sprite.body.velocity.x = 100
    })

};

function move(direction){
    hero.body.velocity.x = direction * 200;
    if (hero.body.velocity.x < 0) {
        hero.scale.x = -1;
    }
    else if (hero.body.velocity.x > 0) {
        hero.scale.x = 1;
    }
};



function handleCollisions(){
   game.physics.arcade.collide(hero, platforms);
   game.physics.arcade.overlap(hero, coins, onHeroVsCoin, null);
};

function jump(){
        var canJump = hero.body.touching.down;
    //Ensures hero is on the ground or on a platform
    if (canJump) {
        hero.body.velocity.y = -600;
        sfxJump.play();
    }
   
    return canJump;
   
};

function spawnCoin(coin) {
    var sprite = coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);
    sprite.animations.add('rotate', [0, 1, 2, 1], 6, true); // 6fps, looped
    sprite.animations.play('rotate');
    game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    game.physics.arcade.overlap(hero, coins, onHeroVsCoin, null, this);
};

function onHeroVsCoin(hero, coin){

    sfxCoin.play();
   coin.kill();
};


//Create a game state
var game = new Phaser.Game(960, 600, Phaser.AUTO, 'game', {init: init, preload: preload, create: create, update: update});