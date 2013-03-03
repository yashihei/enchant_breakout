/*
 * ブロック崩し
 * written by yashihei
 */
enchant();

window.onload = function() {
	game = new Game(200, 250);
	//game.preload('block.png');
	game.preload('ball.png');
	game.preload('bar.png');
	game.fps = 60;
	game.onload = function() {
		bar = new Bar(100, 200);
		ball = new Ball(100, 200);
		this.addEventListener('enterframe', function() {
			// console.log(ball.dy);
			if (ball.intersect(bar)) {
				ball.y = bar.y - ball.height;
				ball.angle = -ball.angle;
				//ball.dx = ((ball.x+5 - bar.x+20) / (20 + 5)) * 2;
				// //バーの左端に当たったとき
				// if (bar.x + bar.width/2 < ball.x) {
				// 	ball.dx = 3;
				// 	ball.dy *= -1;
				// } else {
				// 	ball.dx = -3;
				// 	ball.dy *= -1;
				// }
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
		//何番目の画像
		this.frame = 0;

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
		this.speed = 5;
		this.angle = 40/180 * Math.PI;//ここランダムにしよう
		this.addEventListener('enterframe', function() {
			//移動量
			this.x += this.speed * Math.cos(this.angle);
			this.y -= this.speed * Math.sin(this.angle);
			//左端に来た時
			if (this.x < 0) {
				this.x = 0;
				this.angle = Math.PI - this.angle;
			}
			//右端に来た時
			if (this.x > game.width - this.width) {
				this.x = game.width - this.width;
				this.angle = Math.PI - this.angle;
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
	}
});
