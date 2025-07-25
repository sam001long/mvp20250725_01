let playerScore=0, cpuScore=0, roundEnded=false,
    winTarget=3, soundOn=false, bgmStarted=false,
    level=1, stageVisualIndex=1, maxStage=3, maxLevel=5;

// 初始化
function initGame(){
  updateAssets();
  startCountdown();
}

// 更新背景 & 角色
function updateAssets(){
  // 背景
  const bgVideo = document.getElementById('backgroundVideo'),
        bgImg   = document.getElementById('backgroundImage'),
        bgSrc   = document.getElementById('bgSource');
  // 角色
  const chVideo = document.getElementById('characterVideo'),
        chImg   = document.getElementById('characterImage'),
        chSrc   = document.getElementById('charSource');

  const base = `assets/levels/level${level}/stage${stageVisualIndex}`;
  // 優先 mp4
  bgSrc.src = `${base}/background.mp4`;
  bgVideo.style.display = 'block';
  bgVideo.load();
  bgImg.src = `${base}/background.jpg`;
  bgImg.style.display = 'none';

  chSrc.src = `${base}/character.mp4`;
  chVideo.style.display = 'block';
  chVideo.load();
  chImg.src = `${base}/character.png`;
  chImg.style.display = 'none';

  document.getElementById('levelDisplay').innerText = level;
}

// fallback
function showBgImage(){
  document.getElementById('backgroundVideo').style.display='none';
  document.getElementById('backgroundImage').style.display='block';
}
function showCharImage(){
  document.getElementById('characterVideo').style.display='none';
  document.getElementById('characterImage').style.display='block';
}

// 音量開關
function toggleSound(){
  soundOn = !soundOn;
  document.getElementById('soundToggle').innerText = soundOn ? '🔊' : '🔇';
  document.getElementById('soundHint').style.display = soundOn ? 'none' : 'block';
  const bgm = document.getElementById('audioBgm');
  if(soundOn){ bgmStarted=true; bgm.play(); } else bgm.pause();
}

// 倒數
function startCountdown(){
  const cd = document.getElementById('countdown');
  let t = 3;
  cd.innerText = t; cd.style.display='block';
  const iv = setInterval(()=>{
    if(--t>0) cd.innerText = t;
    else { clearInterval(iv); cd.style.display='none'; document.getElementById('result').innerText='請出拳！'; }
  },1000);
}

// 播音效
function playSound(id){
  if(!soundOn) return;
  const a = document.getElementById(id);
  a.currentTime = 0; a.play();
}

// 出拳主邏輯
function play(playerMove){
  if(roundEnded) return;
  if(!bgmStarted) toggleSound();

  // 動畫 + 點擊音
  document.querySelectorAll('.player-hands img').forEach(el=>el.classList.add('animate'));
  playSound('audioClick');
  setTimeout(()=>document.querySelectorAll('.player-hands img').forEach(el=>el.classList.remove('animate')),200);

  // CPU 隨機
  const moves=['rock','paper','scissors'];
  const cpuMove = moves[Math.floor(Math.random()*3)];
  moves.forEach(m=>{
    document.getElementById(`cpu-${m}`).style.visibility = cpuMove===m?'visible':'hidden';
  });

  // 判定
  let res='';
  if(playerMove===cpuMove) res='平手！';
  else if((playerMove==='rock'&&cpuMove==='scissors')||(playerMove==='scissors'&&cpuMove==='paper')||(playerMove==='paper'&&cpuMove==='rock')){
    res='你贏了！'; playerScore++;
    document.getElementById('playerScore').innerText = playerScore;
    if(stageVisualIndex<maxStage) stageVisualIndex++;
  } else {
    res='你輸了！'; cpuScore++;
    document.getElementById('cpuScore').innerText = cpuScore;
    if(stageVisualIndex>1) stageVisualIndex--;
  }
  document.getElementById('result').innerText = res;
  playSound(res.startsWith('你贏')?'audioWin':'audioLose');

  // 過關或結束
  if(playerScore>=winTarget){
    if(level<maxLevel) level++, stageVisualIndex=1;
    document.getElementById('result').innerText = `🎉 過關！進入第${level}關`;
  } else if(cpuScore>=winTarget){
    document.getElementById('result').innerText = '💀 電腦勝利，遊戲結束';
  }
  updateAssets();

  // 按鈕顯示
  roundEnded = true;
  const btn = document.getElementById('continue');
  btn.innerText = (playerScore>=winTarget||cpuScore>=winTarget)?'遊戲結束':'繼續';
  btn.style.display = 'block';
}

// 重置或重新開始
function resetRound(){
  if(playerScore>=winTarget || cpuScore>=winTarget){
    return location.reload();
  }
  ['rock','paper','scissors'].forEach(m=>{
    document.getElementById(`cpu-${m}`).style.visibility = 'visible';
  });
  document.getElementById('continue').style.display='none';
  document.getElementById('result').innerText='請等待倒數...';
  roundEnded = false;
  startCountdown();
}
