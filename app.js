
let selectedMode = null;
let arStarted = false;

const permissionScreen = document.getElementById("permissionScreen");
const ui = document.getElementById("ui");
const status = document.getElementById("status");
const startBtn = document.getElementById("startBtn");

const scene = document.querySelector("#scene");
const anchor = document.querySelector("#anchor");

const model = document.querySelector("#modelEntity");
const video = document.querySelector("#videoEntity");
const info = document.querySelector("#infoEntity");

const videoEl = document.querySelector("#video");

/* =========================
   STEP 1: CAMERA
========================= */

window.requestCamera = async function () {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true });

    permissionScreen.style.display = "none";
    ui.classList.remove("hidden");

    status.innerText = "Kamera aktiv – wähle Modus";

  } catch (err) {
    alert("Kamera Zugriff verweigert!");
    console.error(err);
  }
};

/* =========================
   STEP 2: MODE
========================= */

window.selectMode = function (mode) {
  selectedMode = mode;
  startBtn.disabled = false;

  status.innerText = "Modus: " + mode;
};

/* =========================
   STEP 3: START AR ENGINE
========================= */

window.startAR = async function () {
  if (!selectedMode) return;

  arStarted = true;

  status.innerText = "Starte AR...";

  try {
    await scene.systems["mindar-image-system"].start();
  } catch (e) {
    console.error(e);
  }

  status.innerText = "Suche Infografik...";
};

/* =========================
   TRACKING
========================= */

anchor.addEventListener("targetFound", () => {
  status.innerText = "Marker erkannt";

  showContent();
});

anchor.addEventListener("targetLost", () => {
  status.innerText = "Marker verloren (Content bleibt)";
});

/* =========================
   CONTENT
========================= */

function showContent() {
  model.setAttribute("visible", false);
  video.setAttribute("visible", false);
  info.setAttribute("visible", false);

  if (selectedMode === "model") {
    model.setAttribute("visible", true);
  }

  if (selectedMode === "video") {
    video.setAttribute("visible", true);
    videoEl.play().catch(()=>{});
  }

  if (selectedMode === "info") {
    info.setAttribute("visible", true);
  }
}