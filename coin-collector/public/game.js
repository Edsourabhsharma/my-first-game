const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let players = {};
let coin = { x: -100, y: -100 };

socket.on('stateUpdate', (serverPlayers) => {
  players = serverPlayers;
  draw();
});

socket.on('coinLocation', (serverCoin) => {
  coin = serverCoin;
});

document.addEventListener('keydown', (event) => {
  if (['ArrowUp', 'KeyW'].includes(event.code)) socket.emit('move', 'up');
  if (['ArrowDown', 'KeyS'].includes(event.code)) socket.emit('move', 'down');
  if (['ArrowLeft', 'KeyA'].includes(event.code)) socket.emit('move', 'left');
  if (['ArrowRight', 'KeyD'].includes(event.code)) socket.emit('move', 'right');
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(coin.x, coin.y, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#f9e2af';
  ctx.fill();
  ctx.closePath();

  for (const id in players) {
    const player = players[id];
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - 15, player.y - 15, 30, 30);
    if (id === socket.id) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(player.x - 15, player.y - 15, 30, 30);
    }
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${player.score}`, player.x, player.y - 22);
  }
}