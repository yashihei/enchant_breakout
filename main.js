/*
 * ブロック崩し
 * written by yashihei
 */
enchant();

window.onload = function() {
	game = new Game(320, 320);
	//game.preload('block.png');
	//game.preload('ball.png');
	game.preload('bar.png');
	game.fps = 60;
	game.onload = function() {
		var bar = new Bar(160, 280);
	}
	game.start();
};

Bar = Class.create(Sprite, {
    initialize: function (x, y) {
		//スプライトのコンストラクタ
        Sprite.call(this, 60, 15);
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
