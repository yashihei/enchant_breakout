/*
 * ブロック崩し
 * written by yashihei
 */
enchant();

Bar = Class.create(Sprite, {
    initialize: function (x, y) {
		//スプライトのコンストラクタ
        Sprite.call(this, 30, 10);
		this.image = game.assets['bar.png'];
		//座標
		this.x = x;
		this.y = y;
		//何番目の画像
		this.frame = 0;

		//イベェェント
		if (game.input.left) this.x -= 5;
		if (game.input.right) this.x += 5;
		//ルートシーンに追加
        game.rootScene.addChild(this);
	}
});

window.onload = function() {

	var game = new Game(320, 320);
	//game.preload('block.png');
	//game.preload('ball.png');
	game.preload('bar.png');
	game.fps = 60;
	game.onload = function() {
		var bar = new Bar(150, 150);
	}
	game.start();
};

