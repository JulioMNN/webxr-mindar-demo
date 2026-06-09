
/* =========================
   STATE
========================= */

let selectedMode = null;
let arStarted = false;
let state = "IDLE";

/* =========================
   ELEMENTS
========================= */

const ui = document.getElementById("ui");
const status = document.getElementById("status");
const startBtn = document.getElementById("startBtn");

const model = document.getElementById("modelEntity");
const video = document.getElementById("videoEntity");
const info = document.getElementById("infoEntity");

const videoEl = document.querySelector("#video");
const sceneEl = document.querySelector("a-scene");
const anchor = document.querySelector("#anchor");

/* =========================
   UI LOGIC
========================= */

window.selectMode = function(mode) {
  selectedMode = mode;
  status.innerText = "Modus: " + mode;
  startBtn.disabled = false;
};

window.startAR = async function () {
  if (!selectedMode) return;

  arStarted = true;
  setState("SCANNING");

  status.innerText = "Starte Kamera...";

  try {
    await sceneEl.systems["mindar-image-system"].start();
  } catch (e) {
    console.error("MindAR start error:", e);
  }
};

/* =========================
   STATE MACHINE
========================= */

function setState(newState) {
  state = newState;

  switch (state) {
    case "IDLE":
      status.innerText = "Wähle Modus";
      break;

    case "SCANNING":
      status.innerText = "Suche Infografik...";
      break;

    case "LOCKED":
      status.innerText = "Marker erkannt";
      showContent();
      break;

    case "LOST":
      status.innerText = "Marker verloren – Content bleibt";
      break;
  }
}

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

/* =========================
   TRACKING EVENTS (FIXED)
========================= */

anchor.addEventListener("targetFound", () => {
  if (!arStarted) return;

  setState("LOCKED");
});

anchor.addEventListener("targetLost", () => {
  if (!arStarted) return;

  setState("LOST");
});

/* =========================
   DEBUG (optional but useful)
========================= */

sceneEl.addEventListener("arReady", () => {
  console.log("AR READY");
});

sceneEl.addEventListener("arError", (e) => {
  console.log("AR ERROR", e);
});

/* =========================
   INIT
========================= */

setState("IDLE");