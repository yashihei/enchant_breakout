enchant();

window.onload = function() {

	var core = new Core(320, 320);
	core.preload('block.png');
	core.preload('ball.png');
	core.fps = 60;
	core.onload = function() {
	}
	core.start();
};

Player 
