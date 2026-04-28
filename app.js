const screen = document.getElementById("screen");

let currentStage = 0;
let timerInterval = null;
let remaining = 0;
let total = 0;

const sageImages = {
  home: "assets/sage/idle.png",
  plan: "assets/sage/idle.png",
  breath: "assets/sage/breath.png",
  lift: "assets/sage/lift-flow.png",
  flow: "assets/sage/flowing-arms.png",
  gather: "assets/sage/gather-qi.png",
  stillness: "assets/sage/stillness.png",
  closing: "assets/sage/closing.png",
  bow: "assets/sage/bow.png"
};

const stages = [
  {
    title: "Awakening Breath",
    duration: 180,
    sage: "Let the breath rise and fall. There is no rush here.",
    instruction: "Sit tall. Feet grounded. Inhale as your hands rise. Exhale as they settle."
  },
  {
    title: "Flow Practice",
    duration: 240,
    sage: "Move as water, not as effort.",
    instruction: "Slowly guide your hands side to side. Keep the shoulders soft and the breath steady."
  },
  {
    title: "Return to Stillness",
    duration: 90,
    sage: "Pause and listen.",
    instruction: "Rest your hands. Notice your breath. Let the body soften."
  },
  {
    title: "Deep Flow",
    duration: 180,
    sage: "Let still water move through peaceful motion.",
    instruction: "Raise, open, turn, and return. Keep the movement smooth and small."
  },
  {
    title: "Closing Stillness",
    duration: 120,
    sage: "The stillness remains when you rise.",
    instruction: "Hands resting. Slow breathing. Let the session settle."
  }
];

function showHome() {
  clearInterval(timerInterval);
  screen.innerHTML = `
    <h1>🌊 Stillwater</h1>
    <div class="sage">🐼</div>
    <p class="prompt">Welcome to Stillwater.<br>Come as you are.</p>
    <button onclick="showSessionPlan()">Begin</button>
    <p class="small">Guided by Sage the Stillwater Sensei</p>
  `;
}

function showSessionPlan() {
  const list = stages.map(stage => `<li>${stage.title}</li>`).join("");

  screen.innerHTML = `
    <h2>Today’s Path</h2>
    <div class="sage">🐼</div>
    <p class="prompt">Sage has prepared a gentle seated practice.</p>
    <ol class="stage-list">${list}</ol>
    <button onclick="startStage(0)">Begin Session</button>
    <button class="secondary" onclick="showHome()">Return</button>
  `;
}

function startStage(index) {
  clearInterval(timerInterval);

  currentStage = index;

  if (currentStage >= stages.length) {
    showComplete();
    return;
  }

  const stage = stages[currentStage];
  remaining = stage.duration;
  total = stage.duration;

  renderStage(stage);
  timerInterval = setInterval(updateTimer, 1000);
}

function renderStage(stage) {
  screen.innerHTML = `
    <h2>${stage.title}</h2>
    <div class="sage">🐼</div>
    <p class="prompt">“${stage.sage}”</p>
    <p>${stage.instruction}</p>

    <div class="timer" id="timer">${formatTime(remaining)}</div>

    <div class="progress-wrap">
      <div class="progress" id="progress"></div>
    </div>

    <div class="footer-controls">
      <button onclick="pauseTimer()">Pause</button>
      <button class="secondary" onclick="startStage(currentStage + 1)">Next</button>
      <button class="secondary" onclick="showHome()">End</button>
    </div>
  `;
}

function updateTimer() {
  remaining--;

  const timer = document.getElementById("timer");
  const progress = document.getElementById("progress");

  if (timer) timer.textContent = formatTime(remaining);

  if (progress) {
    const percent = ((total - remaining) / total) * 100;
    progress.style.width = `${percent}%`;
  }

  if (remaining <= 0) {
    startStage(currentStage + 1);
  }
}

function pauseTimer() {
  clearInterval(timerInterval);

  const stage = stages[currentStage];

  screen.innerHTML = `
    <h2>Paused</h2>
    <div class="sage">🐼</div>
    <p class="prompt">Stillness is part of the practice.</p>
    <p>${stage.title} has ${formatTime(remaining)} remaining.</p>
    <button onclick="resumeTimer()">Resume</button>
    <button class="secondary" onclick="showHome()">End Session</button>
  `;
}

function resumeTimer() {
  const stage = stages[currentStage];
  renderStage(stage);
  timerInterval = setInterval(updateTimer, 1000);
}

function showComplete() {
  clearInterval(timerInterval);

  screen.innerHTML = `
    <h2>Session Complete</h2>
    <div class="sage">🐼</div>
    <p class="prompt">You arrived.<br>You moved.<br>You return.</p>
    <p class="small">Stillwater is here when you need it.</p>
    <button onclick="showHome()">Return Home</button>
  `;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

showHome();
