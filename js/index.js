var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: false
      }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

var game = new Phaser.Game(config);

function preload () {
  //=========== Parallax BG =============
  //= = = = = = = = = = = = = = = = = = =
  this.load.image('ground', './assets/parallaxbg/01_ground.png');
  this.load.image('treesBushes', './assets/parallaxbg/02_treesandbushes.png');
  this.load.image('distantTrees', './assets/parallaxbg/03_distant_trees.png');
  this.load.image('bushes', './assets/parallaxbg/04_bushes.png');
  this.load.image('hill1', './assets/parallaxbg/05_hill1.png');
  this.load.image('hill2', './assets/parallaxbg/06_hill2.png');
  this.load.image('hugeClouds', './assets/parallaxbg/07_huge_clouds.png');
  this.load.image('clouds', './assets/parallaxbg/08_clouds.png');
  this.load.image('distantClouds1', './assets/parallaxbg/09_distant_clouds1.png');
  this.load.image('distantClouds2', './assets/parallaxbg/10_distant_clouds.png');
  this.load.image('background', './assets/parallaxbg/11_background.png');
  this.load.image('platform', './assets/parallaxbg/platform.png');
  //= = = = = = = = = = = = = = = = = = =
  //========== Parallax BG End ===========

  //=========== Phaser Example ===========
  //= = = = = = = = = = = = = = = = = = = 
  this.load.image('banana', './assets/banana.png');
  this.load.image('bomb', './assets/asteroid.png');
  this.load.spritesheet(
      'dude', './assets/dino.png',
      {frameWidth: 50, frameHeight: 60}
  );
  //= = = = = = = = = = = = = = = = = = = =
  //========= Phaser Example End ==========
}

function create () {
  //============ Parallax BG ===============
  //= = = = = = = = = = = = = = = = = = = =
  let scrollBG = 
      this.add.image(400,300,'background');
      this.hugeClouds = this.add.tileSprite(400, 300, 800, 600, 'hugeClouds');
      this.clouds = this.add.tileSprite(400, 300, 800, 600,'clouds');
      this.distantClouds1 = this.add.tileSprite(400, 300, 800, 600, 'distantClouds1');
      this.distantClouds2 = this.add.tileSprite(400, 300, 800, 600, 'distantClouds2');
      this.hill1 = this.add.tileSprite(400, 285, 800, 600,'hill1');
      this.hill2 = this.add.tileSprite(400, 300, 800, 600,'hill2');
      this.bushes = this.add.tileSprite(400, 300, 800, 600,'bushes');
      this.distantTrees = this.add.tileSprite(400, 300, 800, 600, 'distantTrees');
      this.treesBushes = this.add.tileSprite(400, 455, 1100, 900, 'treesBushes');
      // this.ground = this.add.tileSprite(400, 350, 800, 600,'ground');

  //= = = = = = = = = = = = = = = = = = = = 
  //========== End Parallax BG ============

  //============ Phaser Example ============
  //= = = = = = = = Ground = = = = = = = = 
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 580, 'ground');
  platforms.create(295, 100, 'platform');
  platforms.create(500, 400, 'platform');
  platforms.create(70, 275, 'platform');
  platforms.create(700, 220, 'platform');
  //= = = = = = = = = = = = = = = = = = = = 
  //============ Phaser Example ============

  //============ Player ============

  player = this.physics.add.sprite(100, 450, 'dude');
  player.body.setGravityY(10)
  this.physics.add.collider(player, platforms);
  cursors = this.input.keyboard.createCursorKeys();


  player.setBounce(.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
  });

  this.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 4 } ],
      frameRate: 20
  });

  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
  });
  //=========== End Player =========

  //=========== Items to Collect =============
  //= = = = = = = = = = = = = = = = = = = = = 
  // Creating Group
  bananas = this.physics.add.group({
  key: 'banana',
  repeat: 11,
  setXY: { x: 12, y: 0, stepX: 70 }
  });
  // Randomizing Bounce
  bananas.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });
  this.physics.add.collider(bananas, platforms);
  this.physics.add.overlap(player, bananas, collectStar, null, this);

  function collectStar (player, banana) {
      banana.disableBody(true, true);
      score += 10;
      scoreText.setText('Score: ' + score);

      if (bananas.countActive(true) === 0) {
          bananas.children.iterate(function (child) {
              child.enableBody(true, child.x, 0, true, true);
          });

          var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
          var bomb = bombs.create(x, 16, 'bomb')
          bomb.setBounce(1);
          bomb.setCollideWorldBounds(true);
          bomb.setVelocity(Phaser.Math.Between(-200, 300), 20);
      }
  }
  //= = = = = = = = = = = = = = = = = = = = = =
  //========== End Items to Collect ===========

  //========== Scrore ==============
  var score = 0;
  var scoreText;
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
  score += 10;
  scoreText.setText('Score: ' + score);
  //======= End Score ==============

  //=========== Bombs ==============
  bombs = this.physics.add.group();

  this.physics.add.collider(bombs, platforms)

  this.physics.add.collider(player, bombs, hitBomb, null, this);
  function hitBomb (player, bomb) {
      this.physics.pause();

      player.setTint(0xff0000);

      player.anims.play('turn');

      gameOver = true;
  }
  //======== End Bombs ============
}


function update () {
  if (cursors.left.isDown)
  {
      player.setVelocityX(-160);

      player.anims.play('left', true);
  }
  else if (cursors.right.isDown)
  {
      player.setVelocityX(160);

      player.anims.play('right', true);
  }
  else
  {
      player.setVelocityX(0);

      player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down)
  {
      player.setVelocityY(-350);
  }
  //console.log(this)
  this.treesBushes.tilePositionX += 0.2;
  this.distantTrees.tilePositionX += 0.17;
  this.bushes.tilePositionX += 0.3;
  this.hugeClouds.tilePositionX += .3;
  this.hill1.tilePositionX += 0.13
  this.hill2.tilePositionX += 0.27;
  this.clouds.tilePositionX += 0.50;
  this.distantClouds1.tilePositionX -= 0.3;
  this.distantClouds2.tilePositionX -= 0.4;
  // this.ground.tilePositionX += .2;
}