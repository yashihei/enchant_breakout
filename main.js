/*
 * ブロック崩し
 * written by yashihei
 */
enchant();

window.onload = function() {
	game = new Game(200, 250);
	game.preload('ball.png');
	game.preload('bar.png');
	game.preload('block.png');
	game.fps = 60;
	game.onload = function() {
		var bar = new Bar(100, 200);
		var ball = new Ball(100, 190);
		var blocks = [];
		for (var i=0; i < 7; i++) {
			for (var j=0; j < 4; j++) {
				blocks[i*4 + j] = new Block(j*40+20, i*15+20);
			}
		}
		this.addEventListener('enterframe', function() {
			if (ball.intersect(bar)) {
				ball.y = bar.y - ball.height;
				ball.dy *= -1;
				ball.dx = ((ball.x+5 - (bar.x+20)) / 25) * 3;
			}
			if (game.input.up) ball.speed = 0;
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
			if (game.input.left) this.x -= 5;
			if (game.input.right) this.x += 5;
			//行動制限
			if (game.width - this.width < this.x) this.x = game.width - this.width;
			if (this.x < 0) this.x = 0;
		});
		//ルートシーンに追加
        game.rootScene.addChild(this);
	}
});

Ball = Class.create(Sprite, {
	initialize: function (x, y)  {
		Sprite.call(this, 10, 10);
		this.image = game.assets['ball.png'];
		this.x = x;
		this.y = y;
		this.dx = 1;
		this.dy = -3;
		this.addEventListener('enterframe', function() {
			//移動量
			this.x += this.dx;
			this.y += this.dy;
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
			if (this.y > game.height - this.height) {
				this.y = game.height - this.height;
				this.dy *= -1;
			}
		});
		game.rootScene.addChild(this);
	}
});

Block = Class.create(Sprite, {
	initialize: function (x, y) {
		Sprite.call(this, 40, 15);
		this.image = game.assets['block.png'];
		this.x = x;
		this.y = y;
		game.rootScene.addChild(this);
	}
});
