
// Breathing animation

const breathingCircle = document.querySelector(".breathing-circle");
const breathingText = document.getElementById("breathingText");

let breathingPhases = ["Inhale...", "Hold...", "Exhale...", "Hold..."];
let phaseIndex = 0;

function startBreathingCycle() {
  setInterval(() => {
    breathingText.textContent = breathingPhases[phaseIndex];

    if (breathingPhases[phaseIndex] === "Inhale...") {
      breathingCircle.className = "breathing-circle inhale";
    } else if (breathingPhases[phaseIndex] === "Hold...") {
      breathingCircle.className = "breathing-circle hold";
    } else if (breathingPhases[phaseIndex] === "Exhale...") {
      breathingCircle.className = "breathing-circle exhale";
    }

    phaseIndex = (phaseIndex + 1) % breathingPhases.length;
  }, 4000); // 4 seconds per phase
}
startBreathingCycle();


// Timer

const timeDisplay = document.getElementById("timeDisplay");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

let timerDuration = 25 * 60; // 25 minutes default
let timeRemaining = timerDuration;
let timerInterval = null;

function updateDisplay() {
  let minutes = Math.floor(timeRemaining / 60);
  let seconds = timeRemaining % 60;
  timeDisplay.textContent =
    `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        updateDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        logSession(timerDuration); // log completed session
        alert("Meditation session completed!");
      }
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  pauseTimer();
  timeRemaining = timerDuration;
  updateDisplay();
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

updateDisplay(); // initialize display


// ambient sound

document.querySelectorAll(".ambient").forEach(ambient => {
  const button = ambient.querySelector(".toggleSound");
  const audio = ambient.querySelector("audio");

  // Save original button text (e.g., "Open Sky")
  if (!button.dataset.originalText) {
    button.dataset.originalText = button.textContent.replace("Play ", "");
  }

  button.addEventListener("click", () => {
    if (!audio.paused) {
      // If audio is already playing → pause it
      audio.pause();
      button.textContent = "Play " + button.dataset.originalText;
    } else {
      // Pause all other audios first
      document.querySelectorAll("audio").forEach(a => a.pause());
      document.querySelectorAll(".toggleSound").forEach(b => {
        b.textContent = "Play " + b.dataset.originalText;
      });

      // Play selected audio
      audio.play();
      button.textContent = "Pause " + button.dataset.originalText;
    }
  });
});


// SESSION LOG (localStorage)

const sessionList = document.getElementById("sessionList");
const completeSessionBtn = document.getElementById("completeSessionBtn");

let sessionStart = null; // track when session starts

function logSession(durationInSeconds) {
  let sessions = JSON.parse(localStorage.getItem("sessions")) || [];
  let now = new Date();
  let minutes = Math.round(durationInSeconds / 60);

  let formatted = `${now.toLocaleDateString()} - ${minutes} min session`;
  sessions.push(formatted);

  localStorage.setItem("sessions", JSON.stringify(sessions));
  renderSessions();
}

function renderSessions() {
  sessionList.innerHTML = "";
  let sessions = JSON.parse(localStorage.getItem("sessions")) || [];
  sessions.forEach((s) => {
    let li = document.createElement("li");
    li.textContent = s;
    sessionList.appendChild(li);
  });
}

renderSessions(); // load existing sessions


// link time with session log

function startTimer() {
  if (!timerInterval) {
    sessionStart = Date.now(); // mark session start
    timerInterval = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        updateDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        let actualDuration = Date.now() - sessionStart; // ms
        logSession(actualDuration / 1000); // log in seconds
        alert("Meditation session completed!");
      }
    }, 1000);
  }
}

function resetTimer() {
  pauseTimer();
  timeRemaining = timerDuration;
  updateDisplay();
  sessionStart = null; // reset session tracking
}


// manual session log functionality

completeSessionBtn.addEventListener("click", () => {
  if (sessionStart) {
    let actualDuration = Date.now() - sessionStart; // in ms
    logSession(actualDuration / 1000);
    alert("Session manually logged!");
    // Reset tracking
    sessionStart = null;
    pauseTimer();
    timeRemaining = timerDuration;
    updateDisplay();
  } else {
    alert("No active session to complete!");
  }
});
