

// // テトリスボードの作成
// function createTetrisBoard(board) {
//     //ボードサイズ
//     const blockSize = 30;
//     const boardRow = 20;
//     const boardCol = 10;
//     //キャンバスの取得
//     const cvs = document.getElementById("cvs");
//     const ctx=cvs.getContext("2d");
//     //2dコンテキストを取得
//     //キャンバスサイズ
//     const canvasW = blockSize * boardCol;
//     const canvasH = blockSize * boardRow;
//     cvs.width = canvasW;
//     cvs.height = canvasH;
//     //コンテナの設定
//     const container = document.getElementById("container");
//     container.style.width = canvasW + 'px';
//     //塗りに黒を設定
//     ctx.fillStyle = '#000';
//     //キャンバスを塗りつぶす
//     ctx.fillRect(0, 0, canvasW, canvasH);
// }

// //初期化処理
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
        // this.createTetrisBlock();
        this.move();
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
        this.board[3][5] = 1; //テスト用
        this.draw();
    }


    // スコアの更新
    updateScore() {
        const scoreElement = document.getElementById("score");
        scoreElement.textContent = `Score: ${this.score}`;
    }

    // // テトリスブロックを制生成
    // createTetrisBlock() {
    //     // テトブロック一つ分
    //     //T型のtet
    //     let tet= [
    //         [0, 0, 0, 0],
    //         [0, 1, 0, 0],
    //         [1, 1, 1, 0],
    //         [0, 0, 0, 0],
    //     ];

    //     // ブロックの描画
    //     for(let y = 0; y < this.tetSize; y++) {
    //         for(let x = 0; x < this.tetSize; x++) {
    //             if(tet[y][x]) {
    //                 let px = this.offsetX + x;
    //                 let py = this.offsetY + y;
    //                 this.board[py][px] = 1;
    //             }
    //         }
    //     }

    //     this.draw();
    // }

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
                    console.log(this.tet);
                    let newTet = this.createRotateTet(this.tet);
                    if(this.canMoveCheck(newTet, 0, 0)) {
                        this.tet = newTet;
                    }
                    break;
            }
            this.draw();
        });
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
