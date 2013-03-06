/**
 * enchant.js を使う前に必要な処理。
 */
enchant();

GAME_WIDTH = 320;
GAME_HEIGHT = 320;
GAME_FPS = 15;

BALL_PX = 16;
BALL_IMG = "ball.png";

BLOCK_WIDTH = 64;
BLOCK_HEIGHT = 16;

BAR_WIDTH = 64;
BAR_HEIGHT = 16;

SCORE_WIDTH = 80;
SCORE_HEIGHT = 16;

/**
 * HTMLのロードが完了したときに実行する関数。初期設定
 */
window.onload = function () {
    /**
     * ゲームの初期設定
     */
    game = new Game(GAME_WIDTH, GAME_HEIGHT);
    game.fps = GAME_FPS;

    /**
     * ゲームが始まる前にロードしておくファイルを指定
     */
    game.preload(BALL_IMG);

    /**
     * ロードされたときの関数
     */
    game.onload = function () {
        /**
         * ブロックの作成
         */
        blockMap = new Array(GAME_WIDTH/BLOCK_WIDTH);
        for (var i=0; i<blockMap.length; i++) {
            blockMap[i] = new Array(GAME_HEIGHT/BLOCK_HEIGHT/2);
            for (var j=0; j<blockMap[i].length; j++) {
                var red = 0;
                var green = 0;
                var blue = 0;
                if ((i%2 == 0 && j%2== 0) || (i%2 != 0 && j%2 != 0)) {
                    blue = 255;
                } else {
                    green = 255;
                }
                blockMap[i][j] = new Block(i*BLOCK_WIDTH, j*BLOCK_HEIGHT, red, green, blue);
                game.rootScene.addChild(blockMap[i][j]);
            }
        }

        /**
         * バーの作成
         */
        bar = new Bar(GAME_WIDTH/2 - BAR_WIDTH/2, GAME_HEIGHT - 2*BAR_HEIGHT);
        game.rootScene.addChild(bar);

        /**
         * ボールの作成
         */
        ball = new Ball(GAME_WIDTH/2 - BALL_PX/2, GAME_HEIGHT - 2*BAR_HEIGHT - BALL_PX);
        game.rootScene.addChild(ball);

        /**
         * スコア
         */
        score = new Score(0, GAME_HEIGHT - SCORE_HEIGHT, 0);
        game.rootScene.addChild(score);

        /**
         * 背景色
         */      
        game.rootScene.backgroundColor = 'black';

        /**
         * フレームごとに実行する
         */
        game.rootScene.addEventListener('enterframe', function () {
            var isChangePos = ball.move();
            if (isChangePos) {
                // 衝突判定
                // XXX: 本当は近傍のみ判定すべき
                for (var i=0; i<blockMap.length; i++) {
                    for (var j=0; j<blockMap[i].length; j++) {
                        if (blockMap[i][j].hp <= 0) continue;
                        if (ball.checkHit(blockMap[i][j])) {
                            var isBreak = blockMap[i][j].hit();
                            if (isBreak) {
                                score.update(blockMap[i][j].score);
                                game.rootScene.removeChild(blockMap[i][j]);
                            }
                        }
                    }
                }              
                ball.checkHit(bar);

                // 境界値判定
                ball.borderCheck();
            }
        });
    };

    game.start();
};

var Ball = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y) {
        enchant.Sprite.call(this, BALL_PX, BALL_PX);

        this.x = x;
        this.y = y;

        this.fx = x * 1.0;
        this.fy = y * 1.0;
        this.vx = -4.0;
        this.vy = -4.0;
        
        this.image = game.assets[BALL_IMG];
        this.frame = 0;
    },

    /**
     * ボールの位置に変化があった場合はtrueを返す
     */
    move: function() {
        this.fx += this.vx;
        this.fy += this.vy;

        var isChangePos = false;
        var nextX = Math.floor(this.fx);
        var nextY = Math.floor(this.fy);
        if (nextX != this.x || nextY != this.y) {
            isChangePos = true;
        }

        this.x = nextX;
        this.y = nextY;

        return isChangePos;
    },

    /**
     * 衝突反映
     */
    checkHit: function(sprite) {
        var isHit = false;
        // 移動速度がゲーム内の全サイズの約数であることを暗黙の前提としている        
        if (this.x - sprite.x == -this.width) {
            if (-this.height <= this.y - sprite.y  && this.y - sprite.y <= sprite.height) {
                this.vx = (this.vx > 0 ? this.vx*-1 : this.vx);
                isHit = true;
            }
        }
        if (this.x - sprite.x == sprite.width) {
            if (-this.height <= this.y - sprite.y  && this.y - sprite.y <= sprite.height) {
                this.vx = (this.vx < 0 ? this.vx*-1 : this.vx);
                isHit = true;
            }
        }
        if (this.y - sprite.y == -this.height) {
            if (-this.width <= this.x - sprite.x && this.x - sprite.x <= sprite.width) {
                this.vy = (this.vy > 0 ? this.vy*-1 : this.vy);
                isHit = true;
            }
        }
        if (this.y - sprite.y == sprite.height) {
            if (-this.width <= this.x - sprite.x && this.x - sprite.x <= sprite.width) {
                this.vy = (this.vy < 0 ? this.vy*-1 : this.vy);
                isHit = true;
            }
        }
        return isHit;
    },
    
    /**
     * 境界値判定
     */
    borderCheck: function() {
        if (this.y <= 0) this.vy *= -1;
        if (this.x <= 0) this.vx *= -1;
        if (this.x >= GAME_WIDTH - BALL_PX) this.vx *= -1;
    }
});

var Block = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y, r, g, b) {
        enchant.Sprite.call(this, BLOCK_WIDTH, BLOCK_HEIGHT);

        this.x = x;
        this.y = y;

        this.MAX_HP = 3;
        this.hp = this.MAX_HP;

        this.orgR = r;
        this.orgG = g;
        this.orgB = b;
        this.backgroundColor = this.getRgb();

        this.score = 100;
    },

    getRgb: function() {
        var hpRatio = this.hp * 1.0 / this.MAX_HP;

        return 'rgb(' + (Math.floor(this.orgR * hpRatio)).toString() + ',' + (Math.floor(this.orgG * hpRatio)).toString() + ',' + (Math.floor(this.orgB * hpRatio)).toString() + ')';
    },

    /**
     * 破壊されたらtrue
     */
    hit: function() {
        this.hp -= 1;
        this.backgroundColor = this.getRgb();

        if (this.hp <= 0) return true;
        else return false;
    }
});

var Bar = enchant.Class.create(enchant.Sprite, {
    initialize: function(x, y) {
        enchant.Sprite.call(this, BAR_WIDTH, BAR_HEIGHT);

        this.x = x;
        this.y = y;

        this.backgroundColor = 'gray';

        /**
         * タッチしている座標とバーの位置を同期させる
         */
        this.addEventListener('touchmove', function(e) {
            var nextX = e.x - BAR_WIDTH/2;
            if (nextX < 0) this.x = 0;
            else if (nextX > GAME_WIDTH-BAR_WIDTH) this.x = GAME_WIDTH-BAR_WIDTH;
            else this.x = nextX;
        });
    }
});

var Score = enchant.Class.create(enchant.Label, {
    initialize: function(x, y, score) {
        enchant.Label.call(this);

        this.x = x;
        this.y = y;

        this.color = 'white';

        this.score = score;
        this.text = 'SCORE: ' + this.score.toString();
    },

    update: function(addScore) {
        this.score += addScore;
        this.text = 'SCORE: ' + this.score.toString();
    }
});
