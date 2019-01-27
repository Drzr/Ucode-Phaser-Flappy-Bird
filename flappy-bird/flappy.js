var game;
var SCREEN_W = 288;
var SCREEN_H = 505;
var bootState = {
    preload: function() {
        game.load.image('progressBar', '../assets/progressBar.png');
    },
    create: function() {
        game.stage.backgroundColor = "#000000"; //would change this line to change the color of the background
        game.physics.startSystem(Phaser.Physics.ARCADE); //would change this line if using anything other than ARCADE physics
        game.state.start('load');
    }
};
var loadState = {
    preload: function() {
        game.load.spritesheet('medals', '../assets/medals.png', 44, 44);
        game.load.spritesheet('pipe', '../assets/pipes.png', 54, 320);
        game.load.image("pixel", "../assets/pixel.png");
        game.load.image('flappy', '../assets/flappy.png');
        game.load.image('start', '../assets/start-button.png');
        game.load.image('getReady', '../assets/get-ready.png');
        game.load.image('instructions', '../assets/instructions.png');
        game.load.image('Night', '../assets/flappyNight.png');
        
        game.load.image('ground', '../assets/ground.png');
        game.load.image('gameover', '../assets/gameover.png');
        game.load.image('score', '../assets/scoreboard.png');
        game.load.bitmapFont('flappyfont', 'fonts/flappyfont/flappyfont.png', 'fonts/flappyfont/flappyfont.fnt')
        game.load.audio('hit','../assets/coin.mp3')
        var progressBar = game.add.sprite(game.world.centerX, game.world.centerY, 'progressBar');
        progressBar.anchor.setTo(.5, .5);
        progressBar.scale.x = '75'
        game.load.setPreloadSprite(progressBar);
    },
    create: function() {
        game.state.start('menu');
    }
};
var menuState = {
    preload: function() {},
    create: function() {
        
        var text;
        if(game.device.desktop) {
            text = "Press the Up Arrow Key to Start!"
            game.input.onDown.addOnce(this.startGame, this);
        } else {
            text = "Tap the Screen to Start!"
            game.input.onTap.addOnce(this.startGame, this);
        }
        this.background = game.add.sprite(0, 0, 'Night');
        this.ground = game.add.tileSprite(0, SCREEN_H - 100, SCREEN_W, 110, 'ground');
        this.ground.autoScroll(-10, 0);
        this.flappy = game.add.sprite((SCREEN_W / 2 - 44), SCREEN_H / 2, 'flappy');
        this.flappy.animations.add('flap', [0, 1, 2], 12, true);
        this.flappy.animations.play('flap');
        //        var startLabel = game.add.text(game.world.centerX, game.world.height-80, text, {font: '20px Roboto', fill: '#FFFFFF'});
        //        startLabel.anchor.setTo(.5, .5);
        this.startButton = game.add.button(game.width / 2, 300, 'start', this.startGame, this);
        this.startButton.anchor.setTo(.5, .5);
    },
    startGame: function() {
        game.state.start('play');
    }
};
var playState = {
    preload: function() {},
    create: function() {
        
        
        //this.background = game.add.sprite(0, 0, 'Night');
        this.score = 0;
//         this.scoreText = game.add.text(SCREEN_W / 2, 50, "Score:", {
//             font: "28px Roboto",
//             fill: "#FFFFFF"
//         });
        //this.scoreText.visible = false;
        
      //  this.scoreText.anchor.setTo(.5, .5);
        this.flappy = game.add.sprite((SCREEN_W / 2 - 44), SCREEN_H / 2, 'flappy');
        this.flappy.anchor.setTo(.2, .5);
        this.flappy.alive = false;
        this.flappy.animations.add('flap', [0, 1, 2], 12, true);
        this.flappy.animations.play('flap');
        this.instructions = game.add.group();
        var ready = game.add.sprite(game.width / 2, 100, 'getReady');
        var prompt = game.add.sprite(game.width / 2, 325, 'instructions');
        game.add.tween(prompt).to( { angle: 128 }, 2000, Phaser.Easing.Linear.None, true);
        this.instructions.add(ready);
        this.instructions.add(prompt);
        this.instructions.setAll('anchor.x', .5);
        this.instructions.setAll('anchor.y', .5);
        game.input.onDown.addOnce(this.startGame, this);
        //this.background = game.add.tilesprite(0, SCREEN_H,SCREEN_W,SCREEN_H,"Night");
        this.ground = game.add.tileSprite(0, SCREEN_H - 100, SCREEN_W, 110, 'ground');
        this.ground.autoScroll(-200, 0);
        game.physics.arcade.enable(this.ground);
        this.ground.body.immovable = true;
        this.pipes = game.add.group();
        // this.pipes.enableBody = true;
        // this.pipes.createMultiple(10,'pipe');
        this.hit = game.add.audio('hit');
        game.physics.arcade.enable(this.pipes);
        this.scoreText = this.game.add.bitmapText(SCREEN_W/2,10, 'flappyfont', this.score.toString(), 24)
        //this.scoreText.visible = false;
        
    },
    update: function() {
        this.emitter = game.add.emitter(this.flappy.x,this.flappy.y, 15)
        this.emitter.makeParticles('pixel');
        this.emitter.setYSpeed(1,10);
        this.emitter.setXSpeed(1,10);
        game.physics.arcade.collide(this.flappy, this.ground, this.hitPipe, null, this);
        this.pipes.forEach(function(pipeGroup) {
            this.checkScore(pipeGroup);
            // this.pipeGroup;
            game.physics.arcade.overlap(this.flappy, pipeGroup, this.hitPipe, null, this);
        }, this);
        game.input.onDown.addOnce(this.flap, this);
        if(this.flappy.angle < 90) this.flappy.angle += 2.5;
        if(!this.flappy.inWorld)
          {
              this.gameOver();
          }
        this.emitter.gravity = 100;
        //emitter.start(explode,lifespan,quantity,forceQuantity)
        this.emitter.start(true,100,0,0,00); 
       // this.emitter.push(emitter)
        if(this.emitter.alive){
            this.emitter.forEachAlive(function(p){ 
            
            
            
            
            });
            
        }
//         if(this.flappy.body.position.y<0){
            
//             this.flappy.body.position.y = 0;
//         }
        
    },
    startGame: function() {
        this.timer = game.time.events.loop(1500, this.spawnPipes, this);
        this.instructions.destroy();
        this.flappy.alive = true;
        game.physics.arcade.enable(this.flappy);
        this.flappy.body.gravity.y = 1200;
    },
    flap: function() {
        if(!this.flappy.alive) return;
        var tween = game.add.tween(this.flappy).to({
            angle: -35
        }, 150).start();
        this.flappy.body.velocity.y = -350;
    },
    spawnPipes: function() {
        var pipeCouple = this.pipes.getFirstDead();
        pipeCouple = game.add.group(this.pipes);
        var topPipe = game.add.sprite(game.width, 0, 'pipe', 0, pipeCouple);
        game.physics.arcade.enable(topPipe);
        var bottomPipe = game.add.sprite(game.width, 440, 'pipe', 1, pipeCouple);
        game.physics.arcade.enable(bottomPipe);
        pipeCouple.setAll('checkWorldBounds', true);
        pipeCouple.setAll('outOfBoundsKill', true);
        pipeCouple.setAll('anchor.x', .5);
        pipeCouple.setAll('anchor.y', .5);
        pipeCouple.setAll('body.velocity.x', -200);
        pipeCouple.scored = false;
        var randomY = game.rnd.integerInRange(-100, 100);
        pipeCouple.y = randomY;
    },
    hitPipe: function() {
        this.pipes.forEachAlive(function(pipeGroup) {
            
            pipeGroup.forEachAlive(function(pipe) {
                pipe.body.velocity.x = 0;
            }, this);
        }, this);
        
        if(!this.flappy.alive) {
            return;
        }
        this.hit.play();
        this.flappy.alive = false;
        this.flappy.animations.stop();
        this.ground.stopScroll();
        game.time.events.remove(this.timer);
        //restart game after 1 second
        game.time.events.add(150, this.gameOver, this);
    },
    checkScore: function(pipeGroup) {
        if(!pipeGroup.scored && pipeGroup.children[0].x <= this.flappy.x) {
            pipeGroup.scored = true;
            this.score++;
            this.scoreText.setText(this.score.toString());
        }
    },
    gameOver: function() {
        var text = game.add.sprite(game.width / 2, 100, 'gameover');
        text.anchor.setTo(.5, .5);
        var scoreBoard = game.add.sprite(game.width / 2, 200, 'score');
        scoreBoard.anchor.setTo(.5, .5);
        var scoreText = game.add.text(scoreBoard.width, 190, this.score, {
            font: "28px Robot",
            fill: "#FFFFFF"
        });
        scoreText.anchor.setTo(.5, .5);
        var start = game.add.button(game.width / 2, 300, "start", this.play, this);
        start.anchor.setTo(.5, .5);
        if(!localStorage.getItem('bestScore')) {
            localStorage.setItem('bestScore', 0);
        }
        if(this.score > localStorage.getItem('bestScore')) {
            localStorage.setItem('bestScore', this.score);
        }
        var highScoreText = game.add.text(scoreBoard.width, 235, localStorage.getItem('bestScore'), {
            font: "28px Roboto",
            fill: "#FFFFFF"
        });
        highScoreText.anchor.setTo(.5, .5);
        
        if(this.score >= 3 && this.score < 20) {
            this.medal = game.add.sprite(-65, 7, 'medals', 0);
            this.medal.anchor.setTo(.5, .5);
            scoreBoard.addChild(this.medal);
        } else if(this.score >= 20) {
            this.medal = game.add.sprite(-65, 7, 'medals', 1);
            this.medal.anchor.setTo(.5, .5);
            scoreBoard.addChild(this.medal);
        }
        
    },
    play: function() {
        game.state.start('play');
    }
};
game = new Phaser.Game(SCREEN_W, SCREEN_H, Phaser.AUTO, 'game');
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.start('boot');