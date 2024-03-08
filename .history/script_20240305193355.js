//初期化処理
const init=()=>{
    new Tetris();
}

// テトリスクラスの作成
class Tetris {
    constructor() {
        //キャンバスの取得
        this.cvs = document.getElementById("cvs");
        this.ctx=cvs.getContext("2d");

        // ボードサイズとブロックサイズを指定する
        this.boardRow = 20;
        this.boardCol = 10;
        this.blockSize = 30;
        this.speed = 300; // ブロックが落ちるスピード
        this.timerId = NaN; // タイマーのID

        // テトリスブロックのサイズ
        this.tetSize = 4; // テトリスブロックの一辺の大きさ
        // テトリスブロックを描画
        this.tet = [
            [0, 0, 0, 0],
            [0, 1, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0],
        ]

        //位置を調整するためのオフセット
        this.offsetX = 0;
        this.offsetY = 0;

        this.score = 0; //スコアボードに表示するスコア

        this.board = [];
        // 初期化処理
        this.createBoard(this.board);
        this.updateScore();
        this.move();
        this.timerId = setInterval(this.dropTet.bind(this), this.speed);
    }

    // ボードの作成
    createBoard(board) {
        //キャンバスサイズ
        const canvasW = this.blockSize * this.boardCol;
        const canvasH = this.blockSize * this.boardRow;
        this.cvs.width = canvasW;
        this.cvs.height = canvasH;

        //コンテナの設定
        const container = document.getElementById("container");
        container.style.width = canvasW + 'px';

        //塗りに黒を設定
        // this.ctx.fillStyle = '#000';

        //キャンバスを全てゼロにする
        for (let y = 0; y < this.boardRow; y++) {
            this.board[y] = [];
            for (let x = 0; x < this.boardCol; x++) {
                this.board[y][x] = 0;
            }
        }

        // テトリスブロックの初期位置
        const initStartPos = () => {
            this.offsetX = this.boardCol / 2 - this.tetSize / 2
            this.offsetY = 0
        }

        initStartPos();
        // this.timerId = setInterval(this.dropTet, this.speed);

        this.draw();
    }


    // スコアの更新
    updateScore() {
        const scoreElement = document.getElementById("score");
        scoreElement.textContent = `Score: ${this.score}`;
    }

    //
    draw() {
        // 真っ黒にする
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);

        // ボードに存在しているブロック（一になっている）を塗る
        for (let y = 0; y < this.boardRow; y++) {
            for (let x = 0; x < this.boardCol; x++) {
                if (this.board[y][x]) {
                    this.drawBlock(x,y);
                }
            }
        }

        for (let y = 0; y < this.tetSize; y++) {
            for (let x = 0; x < this.tetSize; x++) {
                if (this.tet[y][x]) {
                    this.drawBlock(this.offsetX + x, this.offsetY + y);
                }
            }
        }
    }

    // ブロック一つを表示する関数
    drawBlock(x, y) {
        // ブロックの色を指定
        this.ctx.fillStyle = '#f00';
        let px = x * this.blockSize;
        let py = y * this.blockSize;
        this.ctx.fillRect(px, py, this.blockSize, this.blockSize);
        this.ctx.strokeStyle = '#fff';
        this.ctx.strokeRect(px, py, this.blockSize, this.blockSize);
    };

    // ボタンを押した時の処理
    move() {
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
                case 'ArrowUp':
                    if(this.canMoveCheck(this.tet, 0, -1)) this.offsetY--;
                    break;
                // スペースキーで回転
                case ' ':
                    let newTet = this.createRotateTet(this.tet);
                    if(this.canMoveCheck(newTet, 0, 0)) {
                        this.tet = newTet;
                    }
                    break;
            }
            this.draw();
        });
    }

    dropTet() {
        if(this.canMoveCheck(this.tet, 0, 1)) {
            this.offsetY++;
        } else {
        }
        this.draw();
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
                        console.log('false');
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

    /
    writeToBoard(tet){
      //動きが止まったtetをボード座標に書き写す
        const fixTet = () => {
        for (let y = 0; y < tetSize; y++) {
            for (let x = 0; x < tetSize; x++) {
            if (tet[y][x]) {
              //ボードに書き込む
                board[offsetY + y][offsetX + x] = 1;
            }
        }
        }
    };
      //繰り返し行われる落下処理
        const dropTet = () => {
        //下に行けたら
        if (canMove(0, 1)) {
          //下に行く
            offsetY++;
        } else {
          //行けなかったら固定する
        fixTet();
          //初期位置に戻す
        initStartPos();
        }
        draw(); 
    };
}
