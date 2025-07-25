let playerScore = 0,
    cpuScore    = 0,
    roundEnded  = false,
    winTarget   = 3,
    soundOn     = false,
    bgmStarted  = false,
    level       = 1,
    stageVisualIndex = 1,
    maxStage    = 4,   // 四張圖：初始、第1勝、第2勝、第3勝
    maxLevel    = 5;

// 頁面載入後立即執行
function initGame(){
  updateAssets();
  startCountdown();
}

// 根據 level 與 stageVisualIndex 更新背景／角色圖
function updateAssets(){
  const base = `assets/levels/level${level}/stage${stageVisualIndex}`;
  document.getElementById('backgroundImage').src  = `${base}/background.jpg`;
  document.getElementById('characterImage').src   = `${base}/character.png`;
  document.getElementById('levelDisplay').innerText = level;
}

// 播放音效
function playSound(id){
  if(!soundOn) return;
  const a = document.getElementById(id);
  a.currentTime = 0;
  a.play();
}

// 切換靜音/有聲
function toggleSound(){
  soundOn = !soundOn;
  document.getElementById('soundToggle').innerText = soundOn ? '🔊' : '🔇';
  document.getElementById('soundHint').style.display = soundOn ? 'none' : 'block';
  const bgm = document.getElementById('audioBgm');
  if(soundOn && !bgmStarted){
    bgmStarted = true;
    bgm.play();
  } else if(!soundOn){
    bgm.pause();
  }
}

// 倒數 3 秒
function startCountdown(){
  const cd = document.getElementById('countdown');
  let t = 3;
  cd.innerText = t;
  cd.style.display = 'block';
  const iv = setInterval(()=>{
    if(--t > 0) {
      cd.innerText = t;
    } else {
      clearInterval(iv);
      cd.style.display = 'none';
      document.getElementById('result').innerText = '請出拳！';
    }
  }, 1000);
}

// 玩家出拳
function play(playerMove){
  if(roundEnded) return;

  // 第一次互動啟動 BGM
  if(!bgmStarted && soundOn){
    document.getElementById('audioBgm').play();
    bgmStarted = true;
  }

  // 出拳動畫 & 點擊音
  document.querySelectorAll('.player-hands img').forEach(el => el.classList.add('animate'));
  playSound('audioClick');
  setTimeout(()=>{
    document.querySelectorAll('.player-hands img').forEach(el => el.classList.remove('animate'));
  }, 200);

  // 隨機 CPU 出拳
  const moves = ['rock','paper','scissors'];
  const cpuMove = moves[Math.floor(Math.random()*3)];
  moves.forEach(m => {
    document.getElementById(`cpu-${m}`).style.visibility = (cpuMove === m ? 'visible' : 'hidden');
  });

  // 判定勝敗
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
    // 每贏一次，階段 +1，不超過 maxStage
    stageVisualIndex = Math.min(stageVisualIndex + 1, maxStage);
  } else {
    res = '你輸了！';
    cpuScore++;
    // 每輸一次，階段 -1，不低於 1
    stageVisualIndex = Math.max(stageVisualIndex - 1, 1);
  }

  // 更新分數與結果
  document.getElementById('playerScore').innerText = playerScore;
  document.getElementById('cpuScore').innerText    = cpuScore;
  document.getElementById('result').innerText      = res;
  playSound(res.startsWith('你贏') ? 'audioWin' : 'audioLose');

  // 切換圖
  updateAssets();

  // 顯示「繼續」或「進入下一關」按鈕
  roundEnded = true;
  const btn = document.getElementById('continue');
  btn.innerText = (playerScore >= winTarget) ? '進入下一關' : '繼續';
  btn.style.display = 'block';
}

// 處理「繼續」或「進入下一關」
function resetRound(){
  const btn = document.getElementById('continue');

  // 玩家連贏 3 把才真正升關
  if(playerScore >= winTarget){
    if(level < maxLevel){
      level++;
    }
    stageVisualIndex = 1;
    updateAssets();
    document.getElementById('result').innerText = `🎉 過關！進入第${level}關`;
    roundEnded = true;
    return;
  }

  // 電腦連贏 3 把，重載重來
  if(cpuScore >= winTarget){
    return location.reload();
  }

  // 否則進行下一輪
  ['rock','paper','scissors'].forEach(m => {
    document.getElementById(`cpu-${m}`).style.visibility = 'visible';
  });
  btn.style.display = 'none';
  document.getElementById('result').innerText = '請等待倒數...';
  roundEnded = false;
  startCountdown();
}
