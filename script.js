let playerScore = 0, cpuScore = 0, round = 1, roundMax = 3, roundEnded = false;

function startCountdown() {
  const cd = document.getElementById('countdown');
  let t = 3;
  cd.innerText = t;
  const iv = setInterval(() => {
    t--;
    if (t > 0) {
      cd.innerText = t;
    } else {
      clearInterval(iv);
      cd.style.display = 'none';
      document.getElementById('result').innerText = '請出拳！';
    }
  }, 1000);
}

function play(playerMove) {
  if (roundEnded) return;
  const moves = ['rock','paper','scissors'];
  const cpuMove = moves[Math.floor(Math.random()*3)];

  document.getElementById('cpu-rock').style.visibility = cpuMove==='rock' ? 'visible' : 'hidden';
  document.getElementById('cpu-paper').style.visibility = cpuMove==='paper' ? 'visible' : 'hidden';
  document.getElementById('cpu-scissors').style.visibility = cpuMove==='scissors' ? 'visible' : 'hidden';

  let res = '';
  if (playerMove === cpuMove) {
    res = '平手！';
  } else if (
    (playerMove==='rock' && cpuMove==='scissors') ||
    (playerMove==='scissors' && cpuMove==='paper') ||
    (playerMove==='paper' && cpuMove==='rock')
  ) {
    res = '你贏了！'; playerScore++;
    document.getElementById('playerScore').innerText = playerScore;
  } else {
    res = '你輸了！'; cpuScore++;
    document.getElementById('cpuScore').innerText = cpuScore;
  }
  document.getElementById('result').innerText = res;
  roundEnded = true;
  document.getElementById('continue').style.display = 'block';
}

function resetRound() {
  if (round >= roundMax) {
    document.getElementById('result').innerText = '遊戲結束';
    return;
  }
  round++;
  document.getElementById('round').innerText = round;
  ['cpu-rock','cpu-paper','cpu-scissors'].forEach(id => {
    document.getElementById(id).style.visibility = 'visible';
  });
  document.getElementById('continue').style.display = 'none';
  document.getElementById('countdown').style.display = 'block';
  startCountdown();
  roundEnded = false;
}
