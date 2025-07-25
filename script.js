let playerScore=0, cpuScore=0, roundEnded=false,
    winTarget=3, soundOn=false, bgmStarted=false;

function initGame(){
  document.getElementById('backgroundImage').src = 'assets/background.jpg';
  document.getElementById('characterImage').src  = 'assets/character.png';
  startCountdown();
}

function toggleSound(){
  soundOn = !soundOn;
  document.getElementById('soundToggle').innerText = soundOn ? '🔊':'🔇';
  document.getElementById('soundHint').style.display = soundOn ? 'none':'block';
  const bgm = document.getElementById('audioBgm');
  if(soundOn){ bgmStarted=true; bgm.play(); } else bgm.pause();
}

function startCountdown(){
  const cd=document.getElementById('countdown');
  let t=3; cd.innerText=t; cd.style.display='block';
  const iv=setInterval(()=>{
    if(--t>0) cd.innerText=t;
    else { clearInterval(iv); cd.style.display='none'; document.getElementById('result').innerText='請出拳！'; }
  },1000);
}

function playSound(id){
  if(!soundOn) return;
  const a=document.getElementById(id);
  a.currentTime=0; a.play();
}

function play(playerMove){
  if(roundEnded) return;
  if(!bgmStarted) toggleSound();
  document.querySelectorAll('.player-hands img').forEach(el=>el.classList.add('animate'));
  playSound('audioClick');
  setTimeout(()=>document.querySelectorAll('.player-hands img').forEach(el=>el.classList.remove('animate')),200);

  const moves=['rock','paper','scissors'];
  const cpuMove=moves[Math.floor(Math.random()*3)];
  moves.forEach(m=>document.getElementById(`cpu-${m}`).style.visibility = cpuMove===m?'visible':'hidden');

  let res='';
  if(playerMove===cpuMove) res='平手！';
  else if((playerMove==='rock'&&cpuMove==='scissors')||(playerMove==='scissors'&&cpuMove==='paper')||(playerMove==='paper'&&cpuMove==='rock')){
    res='你贏了！'; playerScore++; document.getElementById('playerScore').innerText=playerScore;
  } else {
    res='你輸了！'; cpuScore++; document.getElementById('cpuScore').innerText=cpuScore;
  }
  document.getElementById('result').innerText=res;
  playSound(res.startsWith('你贏')?'audioWin':'audioLose');
  roundEnded=true;
  document.getElementById('continue').innerText='繼續';
  document.getElementById('continue').style.display='block';
}

function resetRound(){
  ['rock','paper','scissors'].forEach(m=>document.getElementById(`cpu-${m}`).style.visibility='visible');
  document.getElementById('continue').style.display='none';
  document.getElementById('result').innerText='請等待倒數...';
  roundEnded=false;
  startCountdown();
}