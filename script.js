let playerScore = 0,
    cpuScore    = 0,
    roundEnded  = false,
    winTarget   = 3,
    soundOn     = false,
    bgmStarted  = false;

// 切換靜音 / 有聲
function toggleSound(){
  soundOn = !soundOn;
  document.getElementById('soundToggle').innerText = soundOn ? '🔊' : '🔇';
  const hint = document.getElementById('soundHint');
  hint.style.display = soundOn ? 'none' : 'block';

  const bgm = document.getElementById('audioBgm');
  if(soundOn){
    bgmStarted = true;
    bgm.play();
  } else {
    bgm.pause();
  }
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

// 播放音效
function playSound(id){
  if(!soundOn) return;
  const audio = document.getElementById(id);
  audio.currentTime = 0;
  audio.play();
}

// 出拳邏輯 + 動畫 + 音效
function play(playerMove){
  if(roundEnded) return;

  // 強制開啟 BGM（第一次互動啟動）
  if(!bgmStarted){
    toggleSound();
  }

  // 播放點擊動畫 & 音效
  document.querySelectorAll('.player-hands img').forEach(el => el.classList.add('animate'));
  playSound('audioClick');
  setTimeout(()=>{
    document.querySelectorAll('.player-hands img').forEach(el => el.classList.remove('animate'));
  },200);

  // CPU 隨機出拳
  const moves = ['rock','paper','scissors'];
  const cpuMove = moves[Math.floor(Math.random()*3)];
  moves.forEach(m => {
    document.getElementById(`cpu-${m}`).style.visibility = (cpuMove===m ? 'visible':'hidden');
  });

  // 判定勝負
  let res = '';
  if(playerMove === cpuMove){
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

  // 顯示繼續或結束
  roundEnded = true;
  const btn = document.getElementById('continue');
  btn.innerText = (playerScore>=winTarget||cpuScore>=winTarget) ? '遊戲結束' : '繼續';
  btn.style.display = 'block';
}

// 重置或重新開始
function resetRound(){
  if(playerScore>=winTarget || cpuScore>=winTarget){
    location.reload();
    return;
  }
  ['rock','paper','scissors'].forEach(m => {
    document.getElementById(`cpu-${m}`).style.visibility = 'visible';
  });
  const btn = document.getElementById('continue');
  btn.style.display = 'none';
  document.getElementById('result').innerText = '請等待倒數...';
  roundEnded = false;
  startCountdown();
}
