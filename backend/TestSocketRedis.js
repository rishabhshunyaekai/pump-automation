const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const redis = require('redis');
const redisClient = redis.createClient();

// Attach Redis adapter to the socket.io server
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

// On new connection
io.on('connection', (socket) => {
  // Join a room
  socket.join('room1', () => {
    console.log(`Socket ${socket.id} joined room1`);
  });

  // Leave a room
  socket.leave('room1', () => {
    console.log(`Socket ${socket.id} left room1`);
  });
});

server.listen(3000, () => {
  console.log(`Server listening on port 3000`);
});
