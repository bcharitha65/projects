const board = document.getElementById("board");
const statusText = document.getElementById("status");
const rollBtn = document.getElementById("rollBtn");

const snakes = { 99: 21, 65: 45, 87: 57 };
const ladders = { 3: 22, 5: 8, 11: 26, 20: 29 };

let playerPos = 0;
let aiPos = 0;
let playerTurn = true;

// Create the board cells
for (let i = 100; i >= 1; i--) {
  const cell = document.createElement("div");
  cell.id = "cell-" + i;
  cell.innerText = i;
  board.appendChild(cell);
}

// Helper to place a piece
function movePlayer(pos, className, label) {
  document.querySelectorAll("." + className).forEach(e => e.remove());
  const cell = document.getElementById("cell-" + pos);
  if (!cell) return;
  const piece = document.createElement("div");
  piece.classList.add(className);
  piece.innerText = label;
  cell.appendChild(piece);
}

// Handle snakes or ladders
function checkSnakeOrLadder(pos) {
  if (snakes[pos]) {
    alert("🐍 Snake! Down to " + snakes[pos]);
    return snakes[pos];
  }
  if (ladders[pos]) {
    alert("🪜 Ladder! Up to " + ladders[pos]);
    return ladders[pos];
  }
  return pos;
}

// Roll dice and advance player
rollBtn.addEventListener("click", () => {
  if (!playerTurn) return;

  const roll = Math.floor(Math.random() * 6) + 1;
  playerPos += roll;
  if (playerPos > 100) playerPos -= roll;

  playerPos = checkSnakeOrLadder(playerPos);
  movePlayer(playerPos, "player", "P");

  statusText.innerText = "AI's Turn...";
  playerTurn = false;

  setTimeout(aiTurn, 1000);
});

// AI's turn logic
function aiTurn() {
  const roll = aiSmartRoll(aiPos);
  aiPos += roll;
  if (aiPos > 100) aiPos -= roll;

  aiPos = checkSnakeOrLadder(aiPos);
  movePlayer(aiPos, "ai", "A");

  if (aiPos === 100) {
    alert("🤖 AI wins!");
    rollBtn.disabled = true;
    statusText.innerText = "Game Over.";
    return;
  } else if (playerPos === 100) {
    alert("🎉 You win!");
    rollBtn.disabled = true;
    statusText.innerText = "Game Over.";
    return;
  }

  statusText.innerText = "Your Turn!";
  playerTurn = true;
}

// Smarter AI decision-making
function aiSmartRoll(pos) {
  for (let i = 6; i >= 1; i--) {
    const test = pos + i;
    if (ladders[test]) return i;
    if (!snakes[test]) return i;
  }
  return Math.floor(Math.random() * 6) + 1;
}