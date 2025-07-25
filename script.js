function play(playerMove) {
  const moves=['rock','paper','scissors']; const cpuMove=moves[Math.floor(Math.random()*3)];
  document.getElementById('cpu-rock').style.visibility=cpuMove==='rock'?'visible':'hidden';
  document.getElementById('cpu-paper').style.visibility=cpuMove==='paper'?'visible':'hidden';
  document.getElementById('cpu-scissors').style.visibility=cpuMove==='scissors'?'visible':'hidden';
  let result='';
  if(playerMove===cpuMove) result='平手！';
  else if((playerMove==='rock'&&cpuMove==='scissors')||(playerMove==='scissors'&&cpuMove==='paper')||(playerMove==='paper'&&cpuMove==='rock')) result='你贏了！';
  else result='你輸了！';
  document.getElementById('result').innerText=result;
}