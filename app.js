let selectedMode = null;
let arStarted = false;

const stateEl = document.getElementById("state");
const qualityEl = document.getElementById("quality");
const startBtn = document.getElementById("startBtn");

const scene = document.querySelector("#scene");
const anchor = document.querySelector("#anchor");

const model = document.querySelector("#modelEntity");
const video = document.querySelector("#videoEntity");
const info = document.querySelector("#infoEntity");

const videoEl = document.querySelector("#video");

/* =========================
   MODE SELECT
========================= */

window.selectMode = function(mode) {
  selectedMode = mode;
  startBtn.disabled = false;

  setState("MODE: " + mode.toUpperCase());
};

/* =========================
   START AR
========================= */

window.startAR = async function() {
  if (!selectedMode) return;

  arStarted = true;

  setState("SCANNING");

  try {
    await scene.systems["mindar-image-system"].start();
  } catch (e) {
    console.log(e);
  }
};

/* =========================
   STATE ENGINE (INDUSTRY STYLE)
========================= */

function setState(text) {
  stateEl.innerText = text;
}

/* =========================
   TRACKING EVENTS
========================= */

anchor.addEventListener("targetFound", () => {
  setState("TRACKING");

  qualityEl.className = "good";

  showContent();
});

anchor.addEventListener("targetLost", () => {
  setState("LOST");

  qualityEl.className = "bad";
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

    videoEl.muted = true;
    videoEl.currentTime = 0;
    videoEl.play().catch(()=>{});
  }

  if (selectedMode === "info") {
    info.setAttribute("visible", true);
  }
}