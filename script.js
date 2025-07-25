let playerScore = 0,
    cpuScore    = 0,
    roundEnded  = false,
    winTarget   = 3,
    soundOn     = false,
    bgmStarted  = false,
    level       = 1,
    stageVisualIndex = 1,
    maxStage    = 4,
    maxLevel    = 5;

// 页面加载立即初始化
function initGame(){
  updateAssets();
  startCountdown();
}

// 更新背景与角色图片
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

// 静音/有声切换
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

// 3 秒倒计时
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

  // 首次互动触发 BGM
  if(!bgmStarted && soundOn){
    document.getElementById('audioBgm').play();
    bgmStarted = true;
  }

  // 出拳动画 & 点击音
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
  ){
    res = '你贏了！';
    playerScore++;
    stageVisualIndex = Math.min(stageVisualIndex + 1, maxStage);
  } else {
    res = '你輸了！';
    cpuScore++;
    stageVisualIndex = Math.max(stageVisualIndex - 1, 1);
  }

  // 更新分数与提示
  document.getElementById('playerScore').innerText = playerScore;
  document.getElementById('cpuScore').innerText    = cpuScore;
  document.getElementById('result').innerText      = res;
  playSound(res.startsWith('你贏') ? 'audioWin' : 'audioLose');

  // 切图
  updateAssets();

  // 显示按钮
  roundEnded = true;
  const btn = document.getElementById('continue');
  // 如果玩家达标，按钮文字变「進入下一關」；电脑达标则「重新開始」
  if(playerScore >= winTarget){
    btn.innerText = '進入下一關';
  } else if(cpuScore >= winTarget){
    btn.innerText = '重新開始';
  } else {
    btn.innerText = '繼續';
  }
  btn.style.display = 'block';
}

// 点击「繼續」「進入下一關」或「重新開始」
function resetRound(){
  const btn = document.getElementById('continue');

  // 电脑三胜：重置到第一关第一阶段并重置分数
  if(cpuScore >= winTarget){
    level = 1;
    stageVisualIndex = 1;
    playerScore = 0;
    cpuScore = 0;
    updateAssets();
    document.getElementById('playerScore').innerText = 0;
    document.getElementById('cpuScore').innerText    = 0;
    document.getElementById('result').innerText = '💀 重新開始';
    roundEnded = true;
    btn.innerText = '繼續';
    return;
  }

  // 玩家三胜：进入下一关
  if(playerScore >= winTarget){
    if(level < maxLevel){
      level++;
    }
    stageVisualIndex = 1;
    updateAssets();
    document.getElementById('result').innerText = `🎉 進入第${level}關`;
    roundEnded = true;
    btn.innerText = '繼續';
    return;
  }

  // 常规继续下一手
  ['rock','paper','scissors'].forEach(m => {
    document.getElementById(`cpu-${m}`).style.visibility = 'visible';
  });
  btn.style.display = 'none';
  document.getElementById('result').innerText = '請等待倒數...';
  roundEnded = false;
  startCountdown();
}
