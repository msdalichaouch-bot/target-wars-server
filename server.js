const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

let players = [];

server.on('connection', socket => {
  players.push(socket);
  console.log("Nouveau joueur connecté !");

  socket.on('message', msg => {
    players.forEach(p => {
      if(p.readyState === WebSocket.OPEN) {
        p.send(msg);
      }
    });
  });

  socket.on('close', () => {
    players = players.filter(p => p !== socket);
  });
});
