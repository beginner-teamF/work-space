

// テトリスボードの作成
function createTetrisBoard(board) {
    //ボードサイズ
    const blockSize = 30;
    const boardRow = 20;
    const boardCol = 10;
    //キャンバスの取得
    const cvs = document.getElementById("cvs");
    const ctx=cvs.getContext("2d");
    //2dコンテキストを取得
    //キャンバスサイズ
    const canvasW = blockSize * boardCol;
    const canvasH = blockSize * boardRow;
    cvs.width = canvasW;
    cvs.height = canvasH;
    //コンテナの設定
    const container = document.getElementById("container");
    container.style.width = canvasW + 'px';
    //塗りに黒を設定
    ctx.fillStyle = '#000';
    //キャンバスを塗りつぶす
    ctx.fillRect(0, 0, canvasW, canvasH);

}

const board = [];
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

        //位置を調整するためのオフセット
        this.offsetX = 0;
        this.offsetY = 0;

        this.score = 0; //スコアボードに表示するスコア

        this.board = [];
        // 初期化処理
        this.createBoard(board);
        this.updateScore();
        // this.createTetrisBlock();
        // this.move();
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
        console.log(this.board);
        this.board[3][5] = 1;
        this.draw();
    }


    // スコアの更新
    updateScore() {
        const scoreElement = document.getElementById("score");
        scoreElement.textContent = `Score: ${this.score}`;
    }

    // テトリスブロックを制生成
    createTetrisBlock() {
        createTetrisBoard();
        //塗りに赤を設定
        this.ctx.fillStyle="#f00";
        // テトブロック一つ分
        //tetの1辺の大きさ
        const tetSize=4;
        //T型のtet
        let tet= [
            [0, 0, 0, 0],
            [0, 1, 0, 0],
            [1, 1, 1, 0],
            [0, 0, 0, 0],
        ];

        // ブロックの描画
        for(let y = 0; y < tetSize; y++) {
            for(let x = 0; x < tetSize; x++) {
                if(tet[y][x]) {
                    let px = this.offsetX + x;
                    let py = this.offsetY + y;
                    this.ctx.fillRect(px * this.blockSize, py * this.blockSize, this.blockSize, this.blockSize);
                }
            }
        }
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
            console.log(e.key);
            switch(e.key) {
                case 'ArrowRight':
                    this.offsetX++;
                    // console.log('right', this.offsetX);
                    break;
                case 'ArrowLeft':
                    this.offsetX--;
                    break;
                case 'ArrowDown':
                    this.offsetY++;
                    break;
                case 'ArrowUp':
                    this.offsetY--;
                    break;
            }
            this.createTetrisBlock();
        });
    }

}
