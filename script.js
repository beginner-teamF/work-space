//初期化処理
const init=()=>{
    new Tetris();
}

const button = document.getElementById("restart-button");
button.addEventListener("click", () => {
    location.reload();
});

// テトリスブロッククラス
class TetrisBlock {
    constructor() {
        this.num = Math.floor(Math.random() * 7)+1;
        this.block = this.createBlock();
        this.tetColors = [
            '',
            '#f6fe85',
            '#07e0e7',
            '#7ced77',
            '#f78ff0',
            '#f94246',
            '#9693fe',
            '#f2b907',
        ];
    }

    // ブロックを生成するメソッド
    createBlock() {
        // テトリスのブロックの形状を配列で定義
        const tetTypes = [
            // 各ブロックの形状を2次元配列で定義
            [],
            [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
            ],
            [
            [0, 0, 0, 0],
            [0, 1, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0],
            ],
            [
            [0, 0, 0, 0],
            [1, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
            ],
            [
            [0, 0, 0, 0],
            [0, 0, 1, 1],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
            ],
            [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            ],
            [
            [0, 0, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0],
            ],
            [
            [0, 0, 0, 0],
            [0, 0, 1, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0],
            ],
        ];
        //ランダムにテトリスブロックを生成
        const tetType = tetTypes[this.num];
        return tetType;
    }
}

// テトリスクラスの作成
class Tetris {
    constructor() {
        // showクラスを削除
        const gameOver = document.getElementById("game-over");
        if(gameOver.classList.contains("show")) {
            gameOver.classList.remove("show");
        }

        //キャンバスの取得
        this.cvs = document.getElementById("cvs");
        this.ctx=cvs.getContext("2d");

        // ボードサイズとブロックサイズを指定する
        this.boardRow = 20;
        this.boardCol = 10;
        this.blockSize = 30; //ブロックの一辺の大きさ
        this.speed = 500; // ブロックが落ちるスピード
        this.timerId = NaN; // タイマーのID

        // テトリスブロックのサイズ
        this.tetSize = 4; // テトリスブロックの一辺の大きさ

        // テトリスブロックを描画。本来はランダム生成する。
        this.tetris = new TetrisBlock();
        this.tet = new TetrisBlock().block;
        this.tet_idx = this.tetris.num;

        //位置を調整するためのオフセット
        this.offsetX = 0;
        this.offsetY = 0;

        this.score = 0; //スコアボードに表示するスコア
        this.isGameOver = false;

        this.board = [];
        // 初期化処理
        this.createBoard(this.board); //真っ黒なボードを作成.draw関数も動く
        this.updateScore(); //3/5時点では未実装
        this.move(); //ボタンを押した時の処理
        this.timerId = setInterval(this.dropTet.bind(this), this.speed); //bindしてテトリスインスタンスを渡す
    }

    // ボードの作成
    createBoard() {
        //キャンバスサイズ
        const canvasW = this.blockSize * this.boardCol;
        const canvasH = this.blockSize * this.boardRow;
        this.cvs.width = canvasW;
        this.cvs.height = canvasH;

        //コンテナの設定
        const container = document.getElementById("container");
        container.style.width = canvasW + 'px';

        //キャンバスを全てゼロにする
        for (let y = 0; y < this.boardRow; y++) {
            this.board[y] = [];
            for (let x = 0; x < this.boardCol; x++) {
                this.board[y][x] = 0;
            }
        }

        this.initStartPos();
        // this.timerId = setInterval(this.dropTet, this.speed);

        this.draw();
    }

    // テトリスブロックの初期位置
    initStartPos = () => {
        this.offsetX = this.boardCol / 2 - this.tetSize / 2
        this.offsetY = 0
    }

    // スコアの更新
    updateScore() {
        const scoreElement = document.getElementById("score");
        scoreElement.textContent = `Score: ${this.score}`;
    }

    //drawメソッドで最新の状態を描画する
    draw() {
        if(this.isGameOver) {
            const gameOver = document.getElementById("game-over");
            console.log(gameOver);
            // showクラスを追加
            gameOver.classList.add("show");
            clearInterval(this.timerId);
            // スコアを反映
            const scoreElement = document.getElementById("game-over-score");
            scoreElement.textContent = `${this.score}`;
            return;
        }
        // 真っ黒にする
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);

        // ボードに存在しているブロック（1になっている）を塗る
        for (let y = 0; y < this.boardRow; y++) {
            for (let x = 0; x < this.boardCol; x++) {
                if (this.board[y][x]) {
                    this.drawBlock(x,y,this.board[y][x]);
                }
            }
        }

        // テストテトリスブロックを描画
        for (let y = 0; y < this.tetSize; y++) {
            for (let x = 0; x < this.tetSize; x++) {
                if (this.tet[y][x]) {
                    this.drawBlock(this.offsetX + x, this.offsetY + y, this.tet_idx);
                }
            }
        }
    }

    drawBlock(x, y, tet_idx) {
        // ブロックの色を指定
        this.ctx.fillStyle = this.tetris.tetColors[tet_idx];
        let px = x * this.blockSize;
        let py = y * this.blockSize;
        this.ctx.fillRect(px, py, this.blockSize, this.blockSize);
        this.ctx.strokeStyle = '#fff';
        this.ctx.strokeRect(px, py, this.blockSize, this.blockSize);
    };

    // ボタンを押した時の処理
    move() {
        if(this.isGameOver) return;
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                    if(this.canMoveCheck(this.tet, 1, 0)) this.offsetX++;
                    break;
                case 'ArrowLeft':
                    if(this.canMoveCheck(this.tet, -1, 0)) this.offsetX--;
                    break;
                case 'ArrowDown':
                    if(this.canMoveCheck(this.tet, 0, 1)) this.offsetY++;
                    break;
                // ↑キーで回転
                case 'ArrowUp':
                    console.log(this.tet);
                    let newTet = this.createRotateTet(this.tet);
                    if(this.canMoveCheck(newTet, 0, 0)) {
                        this.tet = newTet;
                    }
                    break;
            }
            this.draw(); // ボードを再描画
        });
    }

    // 自動で落ちる関数
    dropTet() {
        if(this.isGameOver) return;
        if(this.canMoveCheck(this.tet, 0, 1)) {
            this.offsetY++;
        } else {
            this.fixTet();// 落下後、動きが止まったtetをボードを書き込む処理の呼び出し
            this.clearLine();// ラインを消すかどうかの処理
            this.tetris = new TetrisBlock();//次のテトリスブロックを生成
            this.tet = this.tetris.block;//次のテトリスブロックに操作がうつる
            this.tet_idx = this.tetris.num;
            this.initStartPos();//初期位置に戻す

            // ゲームオーバー判定
            if (!this.canMoveCheck(this.tet, 0, 0)) {
                this.isGameOver = true;
                clearInterval(this.timerId);
            }
        }
        this.draw();
    }

    // 落下後、動きが止まったtetをボードを書き込
    fixTet() {
        for (let y = 0; y < this.tetSize; y++) {
            for (let x = 0; x < this.tetSize; x++) {
                if (this.tet[y][x]) {
                    // ボードに書き込む
                    this.board[this.offsetY + y][this.offsetX + x] = this.tet_idx;
                }
            }
        }
    }        //繰り返し行われる落下処理
    clearLine() {
        for (let y = 0; y < this.boardRow; y++) {
            let isLineOK = true;
            for (let x = 0; x < this.boardCol; x++) {
                if (this.board[y][x] === 0) {
                    isLineOK = false;
                    break;
                }
            }
            if (isLineOK) {
                for (let ny = y; ny > 0; ny--) {
                    for (let nx = 0; nx < this.boardCol; nx++) {
                        this.board[ny][nx] = this.board[ny - 1][nx];
                    }
                }
                // 最上行をクリア
                for (let nx = 0; nx < this.boardCol; nx++) {
                    this.board[0][nx] = 0;
                }
            }
        }
    }

    // 指定された方向に移動できるかを判断する(x, yは移動量)
    canMoveCheck(tet, dx, dy) {
        for (let y = 0; y < this.tetSize; y++) {
            for (let x = 0; x < this.tetSize; x++) {
                // 4×4の中にブロックが存在しているかを判断する
                if (tet[y][x]) {
                    let nx = this.offsetX + x + dx;
                    let ny = this.offsetY + y + dy;
                    // ボードの範囲外か判断する
                    if(nx < 0 || nx >= this.boardCol || ny >= this.boardRow || ny < 0) {
                        return false;
                    }
                    // ボードの上に存在する場合は移動不可
                    if (this.board[ny][nx]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    // 回転
    createRotateTet(tet) {
        //新しいtetを作る
        let newTet = [];
        for (let y = 0; y < this.tetSize; y++) {
            newTet[y] = [];
            for (let x = 0; x < this.tetSize; x++) {
            //時計回りに90度回転させる
            newTet[y][x] = tet[this.tetSize - 1 - x][y];
            }
        }
        return newTet;
    }
}
// EIJIさんの担当範囲
// 終了処理
// ネクストブロックを表示をする
// Pauseボタンを押した時の処理
