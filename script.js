//ブロック1マスの大きさ
const blockSize = 30;
//ボードサイズ
const boardRow = 20;
const boardCol = 10;
//キャンバスの取得
const cvs = document.getElementById("cvs");
//2dコンテキストを取得
const ctx=cvs.getContext("2d");
//キャンバスサイズ
const canvasW = blockSize * boardCol;
const canvasH = blockSize * boardRow;
cvs.width = canvasW;
cvs.height = canvasH;
//コンテナの設定
const container = document.getElementById("container");
container.style.width = canvasW + 'px';

// スコアの初期化
let score = 0;

// スコア表示を更新する関数
function updateScore() {
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = `Score: ${score}`;
}

//描画処理
const draw=()=>{
  //塗りに黒を設定
  ctx.fillStyle = '#000';
  //キャンバスを塗りつぶす
  ctx.fillRect(0, 0, canvasW, canvasH);
}
//初期化処理
const init=()=>{
  draw();
  updateScore();
}
