/*
 * ブロック崩し
 * written by yashihei
 */
enchant();

window.onload = function() {

	var core = new Core(320, 320);
	//core.preload('block.png');
	//core.preload('ball.png');
	core.preload('bar.png');
	core.fps = 60;
	core.onload = function() {
		var bar = Bar(150, 300);
	}
	core.start();
};

Bar = Class.create(Sprite, {
    initialize: function (x, y) {
		//スプライトのコンストラクタ
        enchant.Sprite.call(this, 30, 10);
		this.image = game.assets['ball.png'];
		//座標
		this.x = x;
		this.y = y;
		//何番目の画像
		this.frame = 0;

		//イベェェント
		if (core.input.left) this.x -= 5;
		if (core.input.right) this.x += 5;
		//ルートシーンに追加
        core.rootScene.addChild(this);
	}
});
