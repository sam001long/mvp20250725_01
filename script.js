let playerScore      = 0,
    cpuScore         = 0,
    roundEnded       = false,
    winTarget        = 3,
    soundOn          = false,
    bgmStarted       = false,
    level            = 1,
    stageVisualIndex = 1,
    maxStage         = 4,   // 四阶段
    maxLevel         = 3,   // 三关卡
    countdownActive  = true;

// 页面载入时执行
function initGame(){
  updateAssets();
  startCountdown();
}

// 切换背景与角色图
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

// 静音/有声切换
function toggleSound(){
  soundOn = !soundOn;
  document.getElementById('soundToggle').innerText = soundOn ? '🔊' : '🔇';
  document.getElementById('soundHint').style.display = soundOn ? 'none' : 'block';
  const bgm = document.getElementById('audioBgm');
  if(soundOn && !bgmStarted){ bgmStarted = true; bgm.play(); }
  else if(!soundOn) bgm.pause();
}

// 加速倒计时（每 0.5s 减一次）
function startCountdown(){
  countdownActive = true;
  roundEnded = true;  // 锁定出拳
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
      countdownActive = false;
      roundEnded = false; // 解锁出拳
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

  // 出拳动画 + 音效
  document.querySelectorAll('.player-hands img').forEach(el => el.classList.add('animate'));
  playSound('audioClick');
  setTimeout(()=>{
    document.querySelectorAll('.player-hands img').forEach(el => el.classList.remove('animate'));
  }, 200);

  // CPU 随机出拳
  const moves = ['rock','paper','scissors'];
  const cpuMove = moves[Math.floor(Math.random()*3)];
  moves.forEach(m => {
    document.getElementById(`cpu-${m}`).style.visibility = (cpuMove===m?'visible':'hidden');
  });

  // 判定胜负
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
    stageVisualIndex = Math.min(1 + playerScore, maxStage);
  } else {
    res = '你輸了！';
    cpuScore++;
    stageVisualIndex = 1;
  }

  // 更新 UI
  document.getElementById('playerScore').innerText = playerScore;
  document.getElementById('cpuScore').innerText    = cpuScore;
  document.getElementById('result').innerText      = res;
  playSound(res.startsWith('你贏') ? 'audioWin' : 'audioLose');
  updateAssets();

  // 显示按钮
  roundEnded = true;
  const btn = document.getElementById('continue');
  if(playerScore >= winTarget)     btn.innerText = '進入下一關';
  else if(cpuScore >= winTarget)   btn.innerText = '重新開始';
  else                              btn.innerText = '繼續';
  btn.style.display = 'block';
}

// 处理“繼續” / “進入下一關” / “重新開始”
function resetRound(){
  const btn = document.getElementById('continue');
  btn.style.display = 'none';

  // 电脑连输3把 → 重置到关卡1, 阶段1，并重置分数
  if(cpuScore >= winTarget){
    level = 1;
    playerScore = 0;
    cpuScore = 0;
    stageVisualIndex = 1;
    updateAssets();
    document.getElementById('playerScore').innerText = 0;
    document.getElementById('cpuScore').innerText    = 0;
    document.getElementById('result').innerText      = '💀 重新開始';
    // 等待玩家点击继续后倒计时
    roundEnded = true;
    return;
  }

  // 玩家连赢3把 → 真正升关，并重置分数
  if(playerScore >= winTarget){
    level = Math.min(level + 1, maxLevel);
    playerScore = 0;
    cpuScore = 0;
    stageVisualIndex = 1;
    updateAssets();
    document.getElementById('playerScore').innerText = 0;
    document.getElementById('cpuScore').innerText    = 0;
    document.getElementById('result').innerText      = `🎉 進入第${level}關`;
    // 等待玩家点击继续后倒计时
    roundEnded = true;
    return;
  }

  // 常规继续下一轮
  ['rock','paper','scissors'].forEach(m => {
    document.getElementById(`cpu-${m}`).style.visibility = 'visible';
  });
  document.getElementById('result').innerText = '請等待倒數...';
  roundEnded = false;
  startCountdown();
}

// 重新加载倒计时按钮逻辑
document.getElementById('continue').onclick = () => {
  // 继续/升关/重新开始后，统一走 resetRound
  resetRound();
};
