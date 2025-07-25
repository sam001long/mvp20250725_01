let playerScore = 0,
    cpuScore    = 0,
    roundEnded  = false,
    winTarget   = 3,
    soundOn     = true,
    bgmStarted  = false;

// 切換靜音 / 有聲
function toggleSound(){
  soundOn = !soundOn;
  document.getElementById('soundToggle').innerText = soundOn ? '🔊' : '🔇';
  const bgm = document.getElementById('audioBgm');
  if(soundOn && bgmStarted) bgm.play();
  else bgm.pause();
}

// 倒數計時
function startCountdown(){
  const cd = document.getElementById('countdown');
  let t = 3;
  cd.innerText = t;
  cd.style.display = 'block';
  const iv = setInterval(()=>{
    t--;
    if(t>0) cd.innerText = t;
    else {
      clearInterval(iv);
      cd.style.display = 'none';
      document.getElementById('result').innerText = '請出拳！';
    }
  },1000);
}

// 播放音效助理
function playSound(id){
  if(!soundOn) return;
  const a = document.getElementById(id);
  a.currentTime = 0;
  a.play();
}

// 核心出拳邏輯 + 動畫 + 音效
function play(playerMove){
  if(roundEnded) return;

  // 第一次出拳時啟動 BGM（避開自動播放限制）
  if(!bgmStarted){
    const bgm = document.getElementById('audioBgm');
    bgmStarted = true;
    if(soundOn) bgm.play();
  }

  // 出拳動畫 & click 音效
  document.querySelectorAll('.player-hands img').forEach(el => el.classList.add('animate'));
  playSound('audioClick');
  setTimeout(()=>{
    document.querySelectorAll('.player-hands img').forEach(el => el.classList.remove('animate'));
  },200);

  // 隨機 CPU 出拳
  const moves = ['rock','paper','scissors'];
  const cpuMove = moves[Math.floor(Math.random()*3)];
  moves.forEach(m => {
    document.getElementById(`cpu-${m}`).style.visibility = (cpuMove===m ? 'visible':'hidden');
  });

  // 判定勝負
  let res = '';
  if(playerMove===cpuMove){
    res = '平手！';
  } else if(
    (playerMove==='rock'     && cpuMove==='scissors') ||
    (playerMove==='scissors' && cpuMove==='paper')    ||
    (playerMove==='paper'    && cpuMove==='rock')
  ){
    res = '你贏了！'; playerScore++;
    document.getElementById('playerScore').innerText = playerScore;
  } else {
    res = '你輸了！'; cpuScore++;
    document.getElementById('cpuScore').innerText = cpuScore;
  }
  document.getElementById('result').innerText = res;

  // 勝/敗音效
  if(res.startsWith('你贏')) playSound('audioWin');
  else if(res.startsWith('你輸')) playSound('audioLose');

  // 顯示繼續或遊戲結束
  roundEnded = true;
  const btn = document.getElementById('continue');
  btn.innerText = (playerScore>=winTarget||cpuScore>=winTarget) ? '遊戲結束' : '繼續';
  btn.style.display = 'block';
}

// 重置以進入下一手或重新開始
function resetRound(){
  if(playerScore>=winTarget || cpuScore>=winTarget){
    // 直接重整頁面
    return location.reload();
  }
  // 顯示所有 CPU 拳
  ['rock','paper','scissors'].forEach(m => {
    document.getElementById(`cpu-${m}`).style.visibility = 'visible';
  });
  // 隱藏按鈕、重啟倒數
  const btn = document.getElementById('continue');
  btn.style.display = 'none';
  document.getElementById('countdown').style.display = 'block';
  document.getElementById('result').innerText = '請等待倒數...';
  roundEnded = false;
  startCountdown();
}
