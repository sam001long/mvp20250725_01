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

// 更新背景 & 角色（支持 MP4 或回退 JPG/PNG）
function updateAssets(){
  const base = `assets/levels/level${level}/stage${stageVisualIndex}`;

  // 背景视频/图片
  const videoBg = document.getElementById('backgroundVideo');
  const imgBg   = document.getElementById('backgroundImage');
  videoBg.src = `${base}/background.mp4`;
  videoBg.load();
  videoBg.onloadeddata = () => {
    imgBg.style.display   = 'none';
    videoBg.style.display = 'block';
  };
  videoBg.onerror = () => {
    videoBg.style.display = 'none';
    imgBg.src             = `${base}/background.jpg`;
    imgBg.style.display   = 'block';
  };

  // 角色视频/图片
  const videoCh = document.getElementById('characterVideo');
  const imgCh   = document.getElementById('characterImage');
  videoCh.src = `${base}/character.mp4`;
  videoCh.load();
  videoCh.onloadeddata = () => {
    imgCh.style.display   = 'none';
    videoCh.style.display = 'block';
  };
  videoCh.onerror = () => {
    videoCh.style.display = 'none';
    imgCh.src             = `${base}/character.png`;
    imgCh.style.display   = 'block';
  };

  // 更新关卡
  document.getElementById('levelDisplay').innerText = level;
}

// 播放音效
function playSound(id){
  if(!soundOn) return;
  const a = document.getElementById(id);
  a.currentTime = 0;
  a.play();
}

// 切换静音
function toggleSound(){
  soundOn = !soundOn;
  document.getElementById('soundToggle').innerText = soundOn ? '🔊':'🔇';
  document.getElementById('soundHint').style.display = soundOn ? 'none':'block';
  const bgm = document.getElementById('audioBgm');
  if(soundOn && !bgmStarted){ bgmStarted=true; bgm.play(); }
  else if(!soundOn) bgm.pause();
}

// 倒计时（每 0.5s 减 1，共 3 次）
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
      // 恢复所有拳头可见
      document.querySelectorAll('.cpu-hands img, .player-hands img').forEach(el=>{
        el.style.visibility = 'visible';
      });
      document.getElementById('result').innerText = '請出拳！';
      countdownActive = false;
      roundEnded = false;
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
  playSound('audioClick');

  // 只保留玩家所选拳头并缩放
  document.querySelectorAll('.player-hands img').forEach(el=>{
    if(el.getAttribute('onclick')===`play('${playerMove}')`){
      el.style.visibility = 'visible';
      el.classList.add('scale');
    } else {
      el.style.visibility = 'hidden';
    }
  });

  // CPU 随机并只保留一张
  const moves = ['rock','paper','scissors'];
  const cpuMove = moves[Math.floor(Math.random()*3)];
  moves.forEach(m=>{
    const img = document.getElementById(`cpu-${m}`);
    if(m===cpuMove){
      img.style.visibility = 'visible';
      img.classList.add('scale');
    } else {
      img.style.visibility = 'hidden';
    }
  });

  // 动画结束移除
  setTimeout(()=>{
    document.querySelectorAll('.player-hands img, .cpu-hands img').forEach(el=>{
      el.classList.remove('scale');
    });
  }, 300);

  // 判定
  let res = '';
  if(playerMove===cpuMove){
    res = '平手！';
  } else if(
    (playerMove==='rock'     && cpuMove==='scissors')||
    (playerMove==='scissors' && cpuMove==='paper')   ||
    (playerMove==='paper'    && cpuMove==='rock')
  ){
    res = '你贏了！'; playerScore++;
    stageVisualIndex = Math.min(1+playerScore, maxStage);
  } else {
    res = '你輸了！'; cpuScore++;
    stageVisualIndex = 1;
  }

  // 更新 UI
  document.getElementById('playerScore').innerText = playerScore;
  document.getElementById('cpuScore').innerText    = cpuScore;
  document.getElementById('result').innerText      = res;
  playSound(res.startsWith('你贏')?'audioWin':'audioLose');
  updateAssets();

  // 显示按钮
  roundEnded = true;
  const btn = document.getElementById('continue');
  if(playerScore>=winTarget)   btn.innerText='進入下一關';
  else if(cpuScore>=winTarget) btn.innerText='重新開始';
  else                          btn.innerText='繼續';
  btn.style.display='block';
}

// 继续/进关/重置
function resetRound(){
  const btn = document.getElementById('continue');
  btn.style.display='none';

  // 电脑三胜→重置
  if(cpuScore>=winTarget){
    level=1; playerScore=0; cpuScore=0; stageVisualIndex=1;
    updateAssets();
    document.querySelectorAll('.cpu-hands img, .player-hands img').forEach(el=>{
      el.style.visibility='visible';
    });
    document.getElementById('playerScore').innerText=0;
    document.getElementById('cpuScore').innerText=0;
    document.getElementById('result').innerText='💀 重新開始';
    return startCountdown();
  }

  // 玩家三胜→升关
  if(playerScore>=winTarget){
    level=Math.min(level+1, maxLevel);
    playerScore=0; cpuScore=0; stageVisualIndex=1;
    updateAssets();
    document.querySelectorAll('.cpu-hands img, .player-hands img').forEach(el=>{
      el.style.visibility='visible';
    });
    document.getElementById('playerScore').innerText=0;
    document.getElementById('cpuScore').innerText=0;
    document.getElementById('result').innerText=`🎉 進入第${level}關`;
    return startCountdown();
  }

  // 常规继续
  document.querySelectorAll('.cpu-hands img, .player-hands img').forEach(el=>{
    el.style.visibility='visible';
  });
  document.getElementById('result').innerText='請等待倒數...';
  return startCountdown();
}
