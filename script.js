let playerScore      = 0,
    cpuScore         = 0,
    roundEnded       = false,
    winTarget        = 3,
    soundOn          = false,
    bgmStarted       = false,
    level            = 1,
    stageVisualIndex = 1,
    maxStage         = 4,   // 四階段：初始、勝1、勝2、勝3
    maxLevel         = 3,   // 三關卡
    countdownActive  = true;

// 初始化
function initGame(){
  updateAssets();
  startCountdown();
}

// 切換背景／角色圖
function updateAssets(){
  const base = `assets/levels/level${level}/stage${stageVisualIndex}`;
  document.getElementById('backgroundImage').src = `${base}/background.jpg`;
  document.getElementById('characterImage').src  = `${base}/character.png`;
  document.getElementById('levelDisplay').innerText = level;
}

// 播放音效
function playSound(id){
  if(!soundOn) return;
  const a = document.getElementById(id);
  a.currentTime = 0;
  a.play();
}

// 靜音／有聲切換
function toggleSound(){
  soundOn = !soundOn;
  document.getElementById('soundToggle').innerText = soundOn ? '🔊' : '🔇';
  document.getElementById('soundHint').style.display = soundOn ? 'none' : 'block';
  const bgm = document.getElementById('audioBgm');
  if(soundOn && !bgmStarted){ bgmStarted = true; bgm.play(); }
  else if(!soundOn) bgm.pause();
}

// 加速倒數（0.5s 一次，共3次）
function startCountdown(){
  countdownActive = true;
  roundEnded = true;                      // 鎖定出拳
  document.getElementById('result').innerText = '';  // 清除上一則提示
  const cd = document.getElementById('countdown');
  let t = 3;
  cd.innerText = t;
  cd.style.display = 'block';
  const iv = setInterval(()=>{
    if(--t > 0){
      cd.innerText = t;
    } else {
      clearInterval(iv);
      cd.style.display = 'none';
      document.getElementById('result').innerText = '請出拳！';
      countdownActive = false;
      roundEnded = false;                   // 解鎖出拳
    }
  }, 500);
}

// 玩家出拳
function play(playerMove){
  if(countdownActive || roundEnded) return;

  if(!bgmStarted && soundOn){
    document.getElementById('audioBgm').play();
    bgmStarted = true;
  }

  // 按鈕動畫 + 點擊音效
  document.querySelectorAll('.player-hands img').forEach(el => el.classList.add('animate'));
  playSound('audioClick');
  setTimeout(()=>{
    document.querySelectorAll('.player-hands img').forEach(el => el.classList.remove('animate'));
  }, 200);

  // CPU 隨機出拳
  const moves = ['rock','paper','scissors'];
  const cpuMove = moves[Math.floor(Math.random()*3)];
  moves.forEach(m => {
    document.getElementById(`cpu-${m}`).style.visibility = (cpuMove===m ? 'visible' : 'hidden');
  });

  // 判定
  let res = '';
  if(playerMove === cpuMove){
    res = '平手！';
  } else if(
    (playerMove==='rock'     && cpuMove==='scissors') ||
    (playerMove==='scissors' && cpuMove==='paper')    ||
    (playerMove==='paper'    && cpuMove==='rock')
  ){
    res = '你贏了！';
    playerScore++;
    // 根據勝場直接決定階段（1勝→2、2勝→3、3勝→4）
    stageVisualIndex = Math.min(1 + playerScore, maxStage);
  } else {
    res = '你輸了！';
    cpuScore++;
    // 一旦輸掉，退回初始
    stageVisualIndex = 1;
  }

  // 更新 UI
  document.getElementById('playerScore').innerText = playerScore;
  document.getElementById('cpuScore').innerText    = cpuScore;
  document.getElementById('result').innerText      = res;
  playSound(res.startsWith('你贏') ? 'audioWin' : 'audioLose');
  updateAssets();

  // 顯示 按鈕
  roundEnded = true;
  const btn = document.getElementById('continue');
  if(playerScore >= winTarget)   btn.innerText = '進入下一關';
  else if(cpuScore >= winTarget) btn.innerText = '重新開始';
  else                            btn.innerText = '繼續';
  btn.style.display = 'block';
}

// 處理 “繼續” / “進入下一關” / “重新開始”
function resetRound(){
  const btn = document.getElementById('continue');
  btn.style.display = 'none';

  // 電腦連輸3把 → 重置遊戲狀態
  if(cpuScore >= winTarget){
    level            = 1;
    playerScore      = 0;
    cpuScore         = 0;
    stageVisualIndex = 1;
    updateAssets();
    // **重置 CPU 三張圖都可見**
    ['rock','paper','scissors'].forEach(m=>{
      document.getElementById(`cpu-${m}`).style.visibility = 'visible';
    });
    document.getElementById('playerScore').innerText = 0;
    document.getElementById('cpuScore').innerText    = 0;
    document.getElementById('result').innerText      = '💀 重新開始';
    return startCountdown();
  }

  // 玩家連勝3把 → 升關
  if(playerScore >= winTarget){
    level = Math.min(level + 1, maxLevel);
    playerScore      = 0;
    cpuScore         = 0;
    stageVisualIndex = 1;
    updateAssets();
    // **重置 CPU 三張圖都可見**
    ['rock','paper','scissors'].forEach(m=>{
      document.getElementById(`cpu-${m}`).style.visibility = 'visible';
    });
    document.getElementById('playerScore').innerText = 0;
    document.getElementById('cpuScore').innerText    = 0;
    document.getElementById('result').innerText      = `🎉 進入第${level}關`;
    return startCountdown();
  }

  // 常規下一輪
  ['rock','paper','scissors'].forEach(m => {
    document.getElementById(`cpu-${m}`).style.visibility = 'visible';
  });
  document.getElementById('result').innerText = '請等待倒數...';
  return startCountdown();
}
