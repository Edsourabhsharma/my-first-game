const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const players = {};
let coin = spawnCoin();

function spawnCoin() {
  return {
    x: Math.floor(Math.random() * 750) + 25,
    y: Math.floor(Math.random() * 550) + 25
  };
}

io.on('connection', (socket) => {
  players[socket.id] = {
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    score: 0
  };

  socket.emit('coinLocation', coin);

  socket.on('move', (direction) => {
    const player = players[socket.id];
    if (!player) return;

    const speed = 15;
    if (direction === 'up' && player.y > 15) player.y -= speed;
    if (direction === 'down' && player.y < 585) player.y += speed;
    if (direction === 'left' && player.x > 15) player.x -= speed;
    if (direction === 'right' && player.x < 785) player.x += speed;

    const dist = Math.hypot(player.x - coin.x, player.y - coin.y);
    if (dist < 25) {
      player.score += 10;
      coin = spawnCoin();
      io.emit('coinLocation', coin);
    }
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
  });
});

setInterval(() => {
  io.emit('stateUpdate', players);
}, 1000 / 60);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running`);
});