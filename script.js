

// テトリスボードの作成
function createTetrisBoard() {
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


// //初期化処理
const init=()=>{
    createTetrisBoard();
    new Tetris();
}

// テトリスクラスの作成
class Tetris {
    constructor() {
        const cvs = document.getElementById("cvs");
        this.offsetX = 0;
        this.offsetY = 0;
        this.ctx = cvs.getContext("2d");
        this.blockSize = 30;
        this.score = 0; //スコアボードに表示するスコア
        this.updateScore();
        this.createTetrisBlock();
        this.move();
    }

    updateScore() {
        const scoreElement = document.getElementById("score");
        scoreElement.textContent = `Score: ${this.score}`;
    }

    c
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

    move() {
        // ボタンを押した時の処理
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
