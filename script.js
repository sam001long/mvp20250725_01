let playerScore = 0,
    cpuScore    = 0,
    roundEnded  = false,
    winTarget   = 3,
    soundOn     = false,
    bgmStarted  = false,
    level       = 1,
    stageVisualIndex = 1,
    maxStage    = 3,
    maxLevel    = 5;

// 页面载入后立即初始化
function initGame(){
  // 一开始就加载背景与角色
  updateAssets();
  // 然后开始倒计时
  startCountdown();
}

// 根据当前关卡与阶段，更新背景/角色图
function updateAssets(){
  const base = `assets/levels/level${level}/stage${stageVisualIndex}`;
  document.getElementById('backgroundImage').src  = `${base}/background.jpg`;
  document.getElementById('characterImage').src   = `${base}/character.png`;
  document.getElementById('levelDisplay').innerText = level;
}

// 播放音效辅助
function playSound(id){
  if(!soundOn) return;
  const a = document.getElementById(id);
  a.currentTime = 0;
  a.play();
}

// 切换静音/有声
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

// 倒计时 3 秒
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

  // 第一次互动启动 BGM（若已打开声）
  if(!bgmStarted && soundOn){
    document.getElementById('audioBgm').play();
    bgmStarted = true;
  }

  // 出拳动画 & 点击音效
  document.querySelectorAll('.player-hands img').forEach(el => el.classList.add('animate'));
  playSound('audioClick');
  setTimeout(()=>{
    document.querySelectorAll('.player-hands img').forEach(el => el.classList.remove('animate'));
  }, 200);

  // 随机 CPU 出拳
  const moves = ['rock','paper','scissors'];
  const cpuMove = moves[Math.floor(Math.random()*3)];
  moves.forEach(m => {
    document.getElementById(`cpu-${m}`).style.visibility = (cpuMove === m ? 'visible' : 'hidden');
  });

  // 判定胜负
  let res = '';
  if(playerMove === cpuMove){
    res = '平手！';
  } else if(
    (playerMove==='rock'     && cpuMove==='scissors') ||
    (playerMove==='scissors' && cpuMove==='paper')    ||
    (playerMove==='paper'    && cpuMove==='rock')
  ) {
    res = '你贏了！';
    playerScore++;
    // 赢一把就切下一阶段
    if(stageVisualIndex < maxStage) stageVisualIndex++;
  } else {
    res = '你輸了！';
    cpuScore++;
    // 输一把就退回上一阶段
    if(stageVisualIndex > 1) stageVisualIndex--;
  }

  // 更新分数与结果
  document.getElementById('playerScore').innerText = playerScore;
  document.getElementById('cpuScore').innerText    = cpuScore;
  document.getElementById('result').innerText      = res;
  playSound(res.startsWith('你贏') ? 'audioWin' : 'audioLose');

  // 判断过关或失败
  if(playerScore >= winTarget){
    if(level < maxLevel){
      level++;
      stageVisualIndex = 1;
    }
    document.getElementById('result').innerText = `🎉 過關！進入第${level}關`;
  } else if(cpuScore >= winTarget){
    document.getElementById('result').innerText = '💀 電腦勝利，遊戲結束';
  }

  // 刷新背景/角色
  updateAssets();

  // 显示“繼續”或“遊戲結束”按钮
  roundEnded = true;
  const btn = document.getElementById('continue');
  btn.innerText = (playerScore >= winTarget || cpuScore >= winTarget) ? '遊戲結束' : '繼續';
  btn.style.display = 'block';
}

// 点击“繼續”或游戏结束后重置
function resetRound(){
  if(playerScore >= winTarget || cpuScore >= winTarget){
    location.reload();
    return;
  }
  // 重置 CPU 拳头可见
  ['rock','paper','scissors'].forEach(m => {
    document.getElementById(`cpu-${m}`).style.visibility = 'visible';
  });
  // 隐藏按钮，重置文字与状态
  document.getElementById('continue').style.display = 'none';
  document.getElementById('result').innerText = '請等待倒數...';
  roundEnded = false;
  startCountdown();
}
