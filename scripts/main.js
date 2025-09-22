// =========================
// Navigation / Hamburger
// =========================
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("show");
  });
}

// =========================
// Rotating quotes
// =========================
const quotes = [
  "Eat healthy, stay healthy.",
  "A healthy mind lives in a healthy body.",
  "Drink water, feel better.",
  "Sleep well, live well.",
  "Your body deserves the best care."
];

const quoteElement = document.getElementById("quote");

if (quoteElement) {
  let i = 0;
  setInterval(() => {
    i = (i + 1) % quotes.length;
    quoteElement.style.opacity = 0;
    setTimeout(() => {
      quoteElement.textContent = quotes[i];
      quoteElement.style.opacity = 1;
    }, 500);
  }, 4000);
}

// =========================
// Health tips cards
// =========================
const healthTips = [
  "Drink at least 8 glasses of water",
  "Take a 10-minute walk",
  "Eat more fruits and vegetables",
  "Practice deep breathing exercises",
  "Get 7-8 hours of sleep"
];

const cardsContainer = document.getElementById("cardsContainer");

if (cardsContainer) {
  const today = new Date();
  const index = today.getDate() % healthTips.length;

  for (let j = 0; j < 3; j++) {
    const card = document.createElement("div");
    card.className = "card";
    const tip = healthTips[(index + j) % healthTips.length];
    card.innerHTML = `<p>${tip}</p>`;
    cardsContainer.appendChild(card);
  }
}

// =========================
// Newsletter subscription
// =========================
const subscribeBtn = document.getElementById("subscribeBtn");
const emailInput = document.getElementById("newsletterEmail");
const subscribeMsg = document.getElementById("subscribeMsg");

if (subscribeBtn && emailInput && subscribeMsg) {
  subscribeBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();

    if (email === "") {
      subscribeMsg.textContent = "Please enter an email.";
      subscribeMsg.style.color = "darkred";
      return;
    }

    localStorage.setItem("newsletterEmail", email);
    subscribeMsg.textContent = "Subscribed successfully!";
    subscribeMsg.style.color = "darkgreen";
    emailInput.value = "";
    console.log(" Subscribed:", email);
  });
}

// =========================
// Recipes section
// =========================
let recipesData = {};
const recipeGrid = document.getElementById("recipeGrid");

if (recipeGrid) {
  fetch("recipes.json")
    .then(res => res.json())
    .then(data => {
      recipesData = data;
      loadRecipes(data);
    })
    .catch(err => console.error("Error loading recipes.json:", err));
}

function loadRecipes(recipes) {
  if (!recipeGrid) return;

  recipeGrid.innerHTML = "";
  Object.keys(recipes).forEach(key => {
    const recipe = recipes[key];

    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      <img src="${recipe.img}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <button class="view-btn">View Recipe</button>
    `;

    card.querySelector(".view-btn").addEventListener("click", () => {
      openRecipe(recipe);
    });

    recipeGrid.appendChild(card);
  });
}

const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = {};

    Object.keys(recipesData).forEach(key => {
      const title = recipesData[key].title.toLowerCase();
      if (title.startsWith(query)) filtered[key] = recipesData[key];
    });

    loadRecipes(filtered);
  });
}

const clearBtn = document.getElementById("clearFilters");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    loadRecipes(recipesData);
  });
}

const modal = document.getElementById("recipe-modal");
const modalText = document.getElementById("modal-text");
const closeModal = document.getElementById("close-modal");

if (closeModal && modal) {
  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
}

function openRecipe(recipe) {
  if (!modalText || !modal) return;

  modalText.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = recipe.title;
  modalText.appendChild(title);

  const desc = document.createElement("p");
  desc.textContent = recipe.description;
  modalText.appendChild(desc);

  if (recipe.ingredients) {
    const hIng = document.createElement("h3");
    hIng.textContent = "Ingredients";
    modalText.appendChild(hIng);

    const ul = document.createElement("ul");
    recipe.ingredients.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });
    modalText.appendChild(ul);
  }

  if (recipe.steps) {
    const hSteps = document.createElement("h3");
    hSteps.textContent = "Steps";
    modalText.appendChild(hSteps);

    const ol = document.createElement("ol");
    recipe.steps.forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      ol.appendChild(li);
    });
    modalText.appendChild(ol);
  }

  if (recipe.nutrition) {
    const hNut = document.createElement("h3");
    hNut.textContent = "Nutrition";
    modalText.appendChild(hNut);

    const table = document.createElement("table");
    for (let key in recipe.nutrition) {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${key}</td><td>${recipe.nutrition[key]}</td>`;
      table.appendChild(row);
    }
    modalText.appendChild(table);
  }

  modal.classList.remove("hidden");
}

// =========================
// Calculator (BMR/TDEE/macros)
// =========================
function animateValue(id, start, end, duration) {
  const obj = document.getElementById(id);
  if (!obj) return;

  let startTime = null;

  function step(currentTime) {
    if (!startTime) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    obj.textContent = Math.floor(progress * (end - start) + start);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function animateBar(id, value, max) {
  const bar = document.getElementById(id);
  if (!bar) return;

  const percentage = Math.min((value / max) * 100, 100);
  bar.style.width = percentage + "%";
}

function calculate() {
  const age = parseInt(document.getElementById("age")?.value);
  const gender = document.getElementById("gender")?.value;
  const height = parseFloat(document.getElementById("height")?.value);
  const weight = parseFloat(document.getElementById("weight")?.value);
  const activity = parseFloat(document.getElementById("activity")?.value);

  if (isNaN(age) || isNaN(height) || isNaN(weight)) {
    alert("Please fill in all fields.");
    return;
  }

  let bmr = 0;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const tdee = bmr * activity;
  const carbs = (tdee * 0.5) / 4;
  const protein = (tdee * 0.2) / 4;
  const fat = (tdee * 0.3) / 9;

  const results = document.getElementById("results");
  if (results) {
    results.classList.remove("hidden");

    animateValue("bmrResult", 0, Math.round(bmr), 1000);
    animateValue("tdeeResult", 0, Math.round(tdee), 1000);
    animateValue("carbsGrams", 0, Math.round(carbs), 1000);
    animateValue("proteinGrams", 0, Math.round(protein), 1000);
    animateValue("fatGrams", 0, Math.round(fat), 1000);

    animateBar("carbsBar", carbs, carbs + protein + fat);
    animateBar("proteinBar", protein, carbs + protein + fat);
    animateBar("fatBar", fat, carbs + protein + fat);
  }
}

function resetResults() {
  const results = document.getElementById("results");
  if (!results) return;

  results.classList.add("hidden");
  results.querySelectorAll("span").forEach(span => (span.textContent = "0"));
  results.querySelectorAll(".progress div").forEach(bar => (bar.style.width = "0%"));
}

// =========================
// Workout generator
// =========================
const workouts = {
  full: {
    none: ["Jumping Jacks", "Burpees", "Mountain Climbers", "Bodyweight Squats"],
    dumbbells: ["Dumbbell Thrusters", "Dumbbell Snatches", "Renegade Rows"]
  },
  arms: {
    none: ["Push-ups", "Arm Circles", "Tricep Dips"],
    dumbbells: ["Bicep Curls", "Overhead Press", "Hammer Curls"]
  },
  legs: {
    none: ["Lunges", "Wall Sit", "Jump Squats"],
    dumbbells: ["Dumbbell Deadlifts", "Goblet Squats", "Dumbbell Lunges"]
  },
  core: {
    none: ["Plank", "Bicycle Crunches", "Leg Raises"],
    dumbbells: ["Russian Twists", "Weighted Sit-ups", "Dumbbell Side Bends"]
  }
};

const generateBtn = document.getElementById("generateBtn");
const bodyPartSelect = document.getElementById("bodyPart");
const equipmentSelect = document.getElementById("equipment");
const workoutDisplay = document.getElementById("workoutDisplay");
const timerSection = document.getElementById("timerSection");
const currentExercise = document.getElementById("currentExercise");
const countdownEl = document.getElementById("countdown");
const startTimerBtn = document.getElementById("startTimer");
const stopTimerBtn = document.getElementById("stopTimer");
const beepSound = document.getElementById("beepSound");

let selectedExercises = [];
let currentIndex = 0;
let interval = null;

if (generateBtn && bodyPartSelect && equipmentSelect && workoutDisplay && timerSection && currentExercise && countdownEl) {
  generateBtn.addEventListener("click", () => {
    const bodyPart = bodyPartSelect.value;
    const equipment = equipmentSelect.value;
    const list = workouts?.[bodyPart]?.[equipment];

    if (!list || list.length === 0) {
      workoutDisplay.innerHTML = `<p>No exercises found for that combo.</p>`;
      timerSection.classList.add("hidden");
      return;
    }

    selectedExercises = shuffle([...list]).slice(0, 3);
    currentIndex = 0;

    workoutDisplay.innerHTML = `
      <h2>Your Workout Plan</h2>
      <p>${selectedExercises.map(ex => `<p>${ex}</p>`).join("")}</p>
      <p>Each exercise: <strong>30 seconds</strong></p>
    `;

    timerSection.classList.remove("hidden");
    currentExercise.textContent = selectedExercises[0];
    countdownEl.textContent = "30";
  });
}

if (startTimerBtn) {
  startTimerBtn.addEventListener("click", () => {
    if (!selectedExercises.length || interval) return;
    startExercise(selectedExercises[currentIndex]);
    startTimerBtn.disabled = true;
  });
}

if (stopTimerBtn) {
  stopTimerBtn.addEventListener("click", () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    currentExercise.textContent = "Timer Stopped";
    countdownEl.textContent = "--";
    startTimerBtn.disabled = false;
  });
}

function startExercise(name) {
  let timeLeft = 30;
  countdownEl.textContent = timeLeft;
  currentExercise.textContent = name;

  interval = setInterval(() => {
    timeLeft--;
    countdownEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      beepSound?.play();
      clearInterval(interval);
      interval = null;
      currentIndex++;

      if (currentIndex < selectedExercises.length) {
        setTimeout(() => startExercise(selectedExercises[currentIndex]), 1000);
      } else {
        currentExercise.textContent = "Workout Complete!";
        countdownEl.textContent = "Done!";
        startTimerBtn.disabled = false;
      }
    }
  }, 1000);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// -------------------
// CONTACT FORM
// -------------------
const contactForm = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      formMsg.textContent = "Please fill in all fields.";
      formMsg.style.color = "red";
      return;
    }

    // Save feedback in localStorage
    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    feedbacks.push({ name, email, message, date: new Date().toLocaleString() });
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

    formMsg.textContent = "Thank you for your feedback!";
    formMsg.style.color = "green";

    contactForm.reset();
  });
}

// -------------------
// FAQ 
// -------------------
const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    const answer = btn.nextElementSibling;
    answer.classList.toggle("show");
  });
});

// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => console.log("Service Worker registered"))
    .catch(err => console.log("Service Worker failed:", err));
}
