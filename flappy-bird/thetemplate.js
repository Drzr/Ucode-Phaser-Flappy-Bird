var game;

var SCREEN_W = 500;
var SCREEN_H = 340;

var bootState = {
   preload: function()
   {
        game.load.image('progressBar', 'assets/progressBar.png');
   },
   create: function()
   {
        game.stage.backgroundColor = "#000000";   //would change this line to change the color of the background
        game.physics.startSystem(Phaser.Physics.ARCADE);  //would change this line if using anything other than ARCADE
        game.state.start('load');
   }
};

var loadState = {
   preload: function()
   {
        var progressBar = game.add.sprite(game.world.centerX, game.world.centerY, 'progressBar');
        progressBar.anchor.setTo(.5, .5);
        game.load.setPreloadSprite(progressBar);
   },
   create: function()
   {
        game.state.start('menu');
   }
};

var menuState = {
   preload: function()
   {

   },
   create: function()
   {
       var text;
       if(game.device.desktop)
       {
           text = "Press the Up Arrow Key to Start!"
           var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
           upKey.onDown.addOnce(this.startGame, this);
       }
       else
       {
           text = "Tap the Screen to Start!"
           game.input.onTap.addOnce(this.startGame, this);
       }
       var startLabel = game.add.text(game.world.centerX, game.world.height-80, text, {font: '20px Roboto', fill: '#FFFFFF'});
       startLabel.anchor.setTo(.5, .5);

   },
   startGame: function()
   {
        game.state.start('play');
   }
};

var playState = {
   preload: function()
   {

   },
   create: function()
   {

   },
   update: function()
   {

   }
};


game = new Phaser.Game(SCREEN_W, SCREEN_H, Phaser.AUTO, 'game');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

game.state.start('boot');