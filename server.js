const WebSocket = require("ws");
const PORT = process.env.PORT || 10000;

const wss = new WebSocket.Server({ port: PORT });
let scores = {};
let playerCount = 0;

function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

wss.on("connection", (ws) => {
  // Assigner un ID unique au joueur
  playerCount++;
  ws.id = "Player" + playerCount;
  scores[ws.id] = 0;

  console.log(`${ws.id} connecté`);

  // Envoyer le leaderboard initial
  ws.send(JSON.stringify({ type: "score", scores }));

  ws.on("message", (msg) => {
    if (msg.toString() === "tir") {
      scores[ws.id] += 1;
      console.log(`${ws.id} a tiré → score = ${scores[ws.id]}`);

      // Diffuser le leaderboard mis à jour
      broadcast(JSON.stringify({ type: "score", scores }));
    }
  });

  ws.on("close", () => {
    console.log(`${ws.id} déconnecté`);
    delete scores[ws.id];
    broadcast(JSON.stringify({ type: "score", scores }));
  });
});

console.log(`🎯 Serveur WebSocket Target Wars lancé sur le port ${PORT}`);
