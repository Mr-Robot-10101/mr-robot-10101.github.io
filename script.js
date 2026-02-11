const board = document.getElementById("board");
const player = document.getElementById("player");
const food = document.getElementById("food");
const scoreEl = document.getElementById("score");
const winOverlay = document.getElementById("winOverlay");
const restartBtn = document.getElementById("restartBtn");
const heartRain = document.getElementById("heartRain");

const snacks = ["🍔", "🍕", "🍟", "🍩", "🍉", "🌮", "🍗", "🍦", "🍿", "🥪"];

const state = {
  x: 20,
  y: 20,
  foodX: 0,
  foodY: 0,
  score: 0,
  speed: 20,
  won: false,
  heartsTimer: null
};

function boardSize() {
  const width = board.clientWidth;
  const height = board.clientHeight;
  return { width, height };
}

function movePlayer() {
  player.style.left = `${state.x}px`;
  player.style.top = `${state.y}px`;
}

function placeFood() {
  const { width, height } = boardSize();
  const maxX = Math.max(0, width - 48);
  const maxY = Math.max(0, height - 48);

  state.foodX = Math.floor(Math.random() * (maxX + 1));
  state.foodY = Math.floor(Math.random() * (maxY + 1));

  food.style.left = `${state.foodX}px`;
  food.style.top = `${state.foodY}px`;
  food.textContent = snacks[Math.floor(Math.random() * snacks.length)];
}

function isColliding() {
  const dx = state.x - state.foodX;
  const dy = state.y - state.foodY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < 40;
}

function updateScore() {
  scoreEl.textContent = String(state.score);
}

function makeHeart() {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = Math.random() > 0.5 ? "💖" : "❤️";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDuration = `${3 + Math.random() * 3}s`;
  heart.style.fontSize = `${16 + Math.random() * 24}px`;
  heartRain.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 6200);
}

function startHeartRain() {
  stopHeartRain();
  for (let i = 0; i < 12; i += 1) {
    setTimeout(makeHeart, i * 120);
  }
  state.heartsTimer = setInterval(makeHeart, 180);
}

function stopHeartRain() {
  if (state.heartsTimer) {
    clearInterval(state.heartsTimer);
    state.heartsTimer = null;
  }
  heartRain.innerHTML = "";
}

function winGame() {
  state.won = true;
  winOverlay.classList.add("active");
  startHeartRain();
}

function onSnackCollected() {
  state.score += 1;
  updateScore();

  if (state.score >= 10) {
    winGame();
    return;
  }

  placeFood();
}

function clampPosition() {
  const { width, height } = boardSize();
  const maxX = Math.max(0, width - 48);
  const maxY = Math.max(0, height - 48);
  state.x = Math.max(0, Math.min(maxX, state.x));
  state.y = Math.max(0, Math.min(maxY, state.y));
}

function step(direction) {
  if (state.won) return;

  if (direction === "up") state.y -= state.speed;
  if (direction === "down") state.y += state.speed;
  if (direction === "left") state.x -= state.speed;
  if (direction === "right") state.x += state.speed;

  clampPosition();
  movePlayer();

  if (isColliding()) {
    onSnackCollected();
  }
}

function handleKeyboard(event) {
  const keyMap = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right"
  };

  const direction = keyMap[event.key];
  if (!direction) return;

  event.preventDefault();
  step(direction);
}

function resetGame() {
  const { width, height } = boardSize();
  state.x = Math.floor(width / 2 - 24);
  state.y = Math.floor(height / 2 - 24);
  state.score = 0;
  state.won = false;
  winOverlay.classList.remove("active");
  stopHeartRain();
  updateScore();
  movePlayer();
  placeFood();
}

document.addEventListener("keydown", handleKeyboard);

restartBtn.addEventListener("click", resetGame);

document.querySelectorAll("[data-move]").forEach((button) => {
  button.addEventListener("click", () => {
    step(button.dataset.move);
  });
});

window.addEventListener("resize", () => {
  clampPosition();
  movePlayer();
  placeFood();
});

resetGame();
