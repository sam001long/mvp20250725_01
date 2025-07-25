let playerScore      = 0,
    cpuScore         = 0,
    roundEnded       = false,
    winTarget        = 3,
    soundOn          = false,
    bgmStarted       = false,
    level            = 1,
    stageVisualIndex = 1,
    maxStage         = 4,
    maxLevel         = 3,
    countdownActive  = true;

// 初始化
function initGame(){
  updateAssets();
  startCountdown();
}

function updateAssets(){
  const base = `assets/levels/level${level}/stage${stageVisualIndex}`;
  document.getElementById('backgroundImage').src = `${base}/background.jpg`;
  document.getElementById('characterImage').src  = `${base}/character.png`;
  document.getElementById('levelDisplay').innerText = level;
}

function playSound(id){
  if(!soundOn) return;
  const a = document.getElementById(id);
  a.currentTime = 0;
  a.play();
}

function toggleSound(){
  soundOn = !soundOn;
  document.getElementById('soundToggle').innerText = soundOn ? '🔊':'🔇';
  document.getElementById('soundHint').style.display = soundOn ? 'none':'block';
  const bgm = document.getElementById('audioBgm');
  if(soundOn && !bgmStarted){ bgmStarted=true; bgm.play(); }
  else if(!soundOn) bgm.pause();
}

function startCountdown(){
  countdownActive = true;
  roundEnded = true;
  document.getElementById('result').innerText = '';
  const cd = document.getElementById('countdown');
  let t = 3; cd.innerText = t; cd.style.display = 'block';
  const iv = setInterval(()=>{
    if(--t > 0){
      cd.innerText = t;
    } else {
      clearInterval(iv);
      cd.style.display = 'none';
      // 倒计时结束时重置 CPU 拳图可见
      ['rock','paper','scissors'].forEach(m=>{
        document.getElementById(`cpu-${m}`).style.visibility = 'visible';
      });
      document.getElementById('result').innerText = '請出拳！';
      countdownActive = false;
      roundEnded = false;
    }
  }, 500);
}

function play(playerMove){
  if(countdownActive || roundEnded) return;

  if(!bgmStarted && soundOn){
    document.getElementById('audioBgm').play();
    bgmStarted = true;
  }

  // 玩家动画 + 缩放
  const playerImgs = document.querySelectorAll('.player-hands img');
  playerImgs.forEach(el => el.classList.add('scale'));
  // CPU 缩放
  const cpuImg = document.getElementById(`cpu-${playerMove}`); // placeholder
  // 实际 CPU move:
  const moves = ['rock','paper','scissors'];
  const cpuMove = moves[Math.floor(Math.random()*3)];
  const cpuImgReal = document.getElementById(`cpu-${cpuMove}`);
  cpuImgReal.classList.add('scale');

  playSound('audioClick');
  setTimeout(()=>{
    playerImgs.forEach(el => el.classList.remove('scale'));
    cpuImgReal.classList.remove('scale');
  }, 300);

  // 隐藏非出的 CPU
  moves.forEach(m => {
    document.getElementById(`cpu-${m}`).style.visibility = (cpuMove===m?'visible':'hidden');
  });

  let res = '';
  if(playerMove === cpuMove){
    res = '平手！';
  } else if(
    (playerMove==='rock'     && cpuMove==='scissors') ||
    (playerMove==='scissors' && cpuMove==='paper')    ||
    (playerMove==='paper'    && cpuMove==='rock')
  ){
    res = '你贏了！'; playerScore++;
    stageVisualIndex = Math.min(1 + playerScore, maxStage);
  } else {
    res = '你輸了！'; cpuScore++;
    stageVisualIndex = 1;
  }

  document.getElementById('playerScore').innerText = playerScore;
  document.getElementById('cpuScore').innerText    = cpuScore;
  document.getElementById('result').innerText      = res;
  playSound(res.startsWith('你贏')?'audioWin':'audioLose');
  updateAssets();

  roundEnded = true;
  const btn = document.getElementById('continue');
  if(playerScore>=winTarget)     btn.innerText='進入下一關';
  else if(cpuScore>=winTarget)   btn.innerText='重新開始';
  else                            btn.innerText='繼續';
  btn.style.display = 'block';
}

function resetRound(){
  const btn = document.getElementById('continue');
  btn.style.display = 'none';

  if(cpuScore>=winTarget){
    level = 1; playerScore=0; cpuScore=0; stageVisualIndex=1;
    updateAssets();
    document.getElementById('playerScore').innerText=0;
    document.getElementById('cpuScore').innerText=0;
    document.getElementById('result').innerText='💀 重新開始';
    return startCountdown();
  }

  if(playerScore>=winTarget){
    level = Math.min(level+1, maxLevel);
    playerScore=0; cpuScore=0; stageVisualIndex=1;
    updateAssets();
    document.getElementById('playerScore').innerText=0;
    document.getElementById('cpuScore').innerText=0;
    document.getElementById('result').innerText=`🎉 進入第${level}關`;
    return startCountdown();
  }

  ['rock','paper','scissors'].forEach(m=>{
    document.getElementById(`cpu-${m}`).style.visibility='visible';
  });
  document.getElementById('result').innerText = '請等待倒數...';
  return startCountdown();
}
