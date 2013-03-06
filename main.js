/*
 * ブロック崩し
 * written by yashihei
 */
enchant();

//グローバル変数
var game = null;

//定数
var BAR_SPEED = 5;
var BALL_SPEED = 5;

window.onload = function() {
	game = new Game(200, 250);
	game.preload('ball.png', 'bar.png', 'block.png');
	game.preload('pon.wav');
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
				ball.angle = 90 - ((ball.x+5 - (bar.x+20)) / 25) * 60;
				ball.se.play();
			}
			var chk = false;
			for (var i=0; i < 32; i++) {
				if (blocks[i].flag == 1) continue;
				if (blocks[i].intersect(ball)) {
					blocks[i].flag = 1;
					game.rootScene.removeChild(blocks[i]);
					if(chk == false) {
						if (ball.y+ball.height < blocks[i].y+BALL_SPEED || blocks[i].y+blocks[i].height-BALL_SPEED < ball.y) {
							ball.angle = -ball.angle;
						} else if (ball.x+ball.width < blocks[i].x+BALL_SPEED || blocks[i].x+blocks[i].width-BALL_SPEED < ball.x) {
							ball.angle = 180 - ball.angle;
						}
						blocks[i].se.play();
						chk = true;
					}
				}
			}
		});
	}
	game.start();
};

Bar = Class.create(Sprite, {
    initialize: function (x, y) {
		//スプライトのコンストラクタ
        Sprite.call(this, 40, 10);
		this.image = game.assets['bar.png'];
		//座標
		this.x = x - this.width/2;
		this.y = y;
		//イベェェント
		this.addEventListener('enterframe', function() {
			if (game.input.left) this.x -= BAR_SPEED;
			if (game.input.right) this.x += BAR_SPEED;
			//行動制限
			if (game.width - this.width < this.x) this.x = game.width - this.width;
			if (this.x < 0) this.x = 0;
		});
		//ルートシーンに追加
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
		this.speed = BALL_SPEED;
		this.angle = 40;
		this.addEventListener('enterframe', function() {
			//移動量
			this.x += this.speed * Math.cos(this.angle/180 * Math.PI);
			this.y -= this.speed * Math.sin(this.angle/180 * Math.PI);
			//左端に来た時
			if (this.x < 0) {
				this.x = 0;
				this.angle = 180 - this.angle;
			}
			//右端に来た時
			if (this.x > game.width - this.width) {
				this.x = game.width - this.width;
				this.angle = 180 - this.angle;
			}
			//上端に来た時
			if (this.y < 0) {
				this.y = 0;
				this.angle = -this.angle;
			}
			//下端に来た時
			if (this.y > game.height - this.height) {
				this.y = game.height - this.height;
				this.angle = -this.angle;
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
