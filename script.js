let playerScore = 0,
    cpuScore    = 0,
    roundEnded  = false,
    winTarget   = 3;

// 倒數 3 秒
function startCountdown() {
  const cd = document.getElementById('countdown');
  let t = winTarget;  // 可以跟勝利目標同步
  cd.innerText = t;
  const iv = setInterval(() => {
    t--;
    if (t > 0) {
      cd.innerText = t;
    } else {
      clearInterval(iv);
      cd.style.display = 'none';
      document.getElementById('result').innerText = '請出拳！';
    }
  }, 1000);
}

// 出拳邏輯
function play(playerMove) {
  if (roundEnded) return;
  const moves   = ['rock','paper','scissors'];
  const cpuMove = moves[Math.floor(Math.random()*3)];

  // 顯示 CPU 出拳
  document.getElementById('cpu-rock').style.visibility    = cpuMove==='rock'    ? 'visible':'hidden';
  document.getElementById('cpu-paper').style.visibility   = cpuMove==='paper'   ? 'visible':'hidden';
  document.getElementById('cpu-scissors').style.visibility= cpuMove==='scissors'? 'visible':'hidden';

  // 判定
  let res = '';
  if (playerMove === cpuMove) {
    res = '平手！';
  } else if (
    (playerMove==='rock'     && cpuMove==='scissors') ||
    (playerMove==='scissors' && cpuMove==='paper')    ||
    (playerMove==='paper'    && cpuMove==='rock')
  ) {
    res = '你贏了！'; playerScore++;
    document.getElementById('playerScore').innerText = playerScore;
  } else {
    res = '你輸了！'; cpuScore++;
    document.getElementById('cpuScore').innerText = cpuScore;
  }
  document.getElementById('result').innerText = res;

  roundEnded = true;
  // 顯示「繼續」或「再來一局」
  if (playerScore >= winTarget || cpuScore >= winTarget) {
    document.getElementById('continue').innerText = '遊戲結束';
    document.getElementById('continue').style.display = 'block';
  } else {
    document.getElementById('continue').innerText = '繼續';
    document.getElementById('continue').style.display = 'block';
  }
}

// 重置本局（連輸/連贏到 3 都會在 play() 完成後進入這裡）
function resetRound() {
  const btn = document.getElementById('continue');
  // 若任何一方已達標，按鈕就刷新頁面重來
  if (playerScore >= winTarget || cpuScore >= winTarget) {
    return location.reload();
  }
  // 否則，繼續下一把（直到誰累積到 3）
  ['cpu-rock','cpu-paper','cpu-scissors'].forEach(id => {
    document.getElementById(id).style.visibility = 'visible';
  });
  btn.style.display = 'none';
  document.getElementById('countdown').style.display = 'block';
  startCountdown();
  document.getElementById('result').innerText = '請等待倒數...';
  roundEnded = false;
}
