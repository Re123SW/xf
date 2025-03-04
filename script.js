const ws = new WebSocket('ws://localhost:3000');
const clickBtn = document.getElementById('click-btn');
const scoreDiv = document.getElementById('score');
const leaderboardDiv = document.getElementById('leaderboard');

let score = 0;
let playerId = 'player1';  // You might want to generate unique IDs for players

clickBtn.addEventListener('click', () => {
  score++;
  updateScore();
  ws.send(JSON.stringify({ type: 'updateScore', playerId, score }));
});

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'scoreUpdate') {
    updateLeaderboard(data.scores);
  }
};

function updateScore() {
  scoreDiv.textContent = `Score: ${score}`;
}

function updateLeaderboard(scores) {
  leaderboardDiv.innerHTML = '<h2>Leaderboard</h2>';
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  sortedScores.forEach(([id, score]) => {
    const scoreItem = document.createElement('div');
    scoreItem.textContent = `${id}: ${score}`;
    leaderboardDiv.appendChild(scoreItem);
  });
}