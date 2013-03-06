/*
 * ブロック崩し
 * written by yashihei
 */
enchant();

//グローバル変数
var game = null;

//定数
var BAR_SPEED = 5;

window.onload = function() {
	game = new Game(200, 250);
	game.preload('ball.png', 'bar.png', 'block.png', 'pon.wav');
	game.fps = 60;
	game.onload = function() {
		var bar = new Bar(100, 200);
		var ball = new Ball(100, 190);
		var blocks = [];
		for (var i=0; i < 8; i++) {
			for (var j=0; j < 4; j++) {
				blocks[i*4 + j] = new Block(j*40+20, i*15+20);
			}
		}
        game.rootScene.backgroundColor = '#eee';
		this.addEventListener('enterframe', function() {
			if (ball.intersect(bar)) {
				ball.y = bar.y - ball.height;
				ball.dy *= -1;
				ball.dx = ((ball.x+ball.width/2 - (bar.x+bar.width/2)) / 25) * 3;
				ball.se.play();
			}
			for (var i=0; i < 32; i++) {
				if (blocks[i].flag == 1) continue;
				if (blocks[i].intersect(ball)) {
					blocks[i].flag = 1;
					//ボールの移動量が4以上にならないのを条件として
					if (ball.y+ball.height < blocks[i].y+4) {
						ball.dy = (ball.dy < 0 ? ball.dy*-1 : ball.dy);
					} else if (blocks[i].y+blocks[i].height-4 < ball.y) {
						ball.dy = (ball.dy > 0 ? ball.dy*-1 : ball.dy);
					} else if (ball.x+ball.width < blocks[i].x+4) {
						ball.dx = (ball.dx > 0 ? ball.dx*-1 : ball.dx);
					} else if (blocks[i].x+blocks[i].width-4 < ball.x) {
						ball.dx = (ball.dx < 0 ? ball.dx*-1 : ball.dx);
					}
					blocks[i].se.play();
					game.rootScene.removeChild(blocks[i]);
				}
			}
			for (var i=0; i < 32; i++) {
				if (blocks[i].flag == 0) break;
				if (i == 31) game.end();
			}
		});
	}
	game.start();
};

Bar = Class.create(Sprite, {
    initialize: function (x, y) {
        Sprite.call(this, 40, 10);
		this.image = game.assets['bar.png'];
		this.x = x - this.width/2;
		this.y = y;
		this.addEventListener('enterframe', function() {
			if (game.input.left) this.x -= BAR_SPEED;
			if (game.input.right) this.x += BAR_SPEED;
			//行動制限
			if (game.width - this.width < this.x) this.x = game.width - this.width;
			if (this.x < 0) this.x = 0;
		});
        game.rootScene.addChild(this);
	},
});

Ball = Class.create(Sprite, {
	initialize: function (x, y)  {
		Sprite.call(this, 10, 10);
		this.image = game.assets['ball.png'];
		this.se = game.assets['pon.wav'].clone();
		this.x = x;
		this.y = y;
		this.dx = 2;
		this.dy = -3;
		this.angle = 40;
		this.addEventListener('enterframe', function() {
			//移動量
			this.x += this.dx;
			this.y -= this.dy;
			//左端に来た時
			if (this.x < 0) {
				this.x = 0;
				this.dx *= -1;
			}
			//右端に来た時
			if (this.x > game.width - this.width) {
				this.x = game.width - this.width;
				this.dx *= -1;
			}
			//上端に来た時
			if (this.y < 0) {
				this.y = 0;
				this.dy *= -1;
			}
			//下端に来た時
			if (this.y > game.height) {
				game.end()
			}
		});
		game.rootScene.addChild(this);
	},
});

Block = Class.create(Sprite, {
	initialize: function (x, y) {
		Sprite.call(this, 40, 15);
		this.image = game.assets['block.png'];
		this.se = game.assets['pon.wav'].clone();
		this.x = x;
		this.y = y;
		this.flag = 0;
		game.rootScene.addChild(this);
	},
});
