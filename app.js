let state = "IDLE";
let selectedMode = null;
let arStarted = false;

const model = document.getElementById("modelEntity");
const video = document.getElementById("videoEntity");
const info = document.getElementById("infoEntity");

const status = document.getElementById("status");
const startBtn = document.getElementById("startBtn");

const videoEl = document.querySelector("#video");
const anchor = document.querySelector("#anchor");

window.selectMode = function(mode) {
  selectedMode = mode;
  status.innerText = "Modus gewählt: " + mode;

  if (state === "IDLE") {
    startBtn.disabled = false;
  }
};

window.startAR = function() {
  if (!selectedMode) return;

  arStarted = true;
  setState("SCANNING");

  startBtn.innerText = "AR aktiv";
  startBtn.disabled = true;

  videoEl.load();
};

function setState(newState) {
  state = newState;
  console.log("STATE:", state);

  switch(state) {
    case "IDLE":
      status.innerText = "Bitte Modus wählen";
      break;

    case "SCANNING":
      status.innerText = "Suche Infografik (Tag 17)...";
      break;

    case "LOCKED":
      status.innerText = "Marker erkannt";
      showContent();
      break;

    case "LOST":
      status.innerText = "Marker verloren – Content bleibt sichtbar";
      break;

    case "RECOVERY":
      status.innerText = "Marker wieder erkannt – Repositionierung";
      showContent();
      break;
  }
}

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
   TRACKING ENGINE
========================= */

anchor.addEventListener("targetFound", () => {
  if (!arStarted) return;

  if (state === "SCANNING" || state === "LOST") {
    setState("RECOVERY");
  } else {
    setState("LOCKED");
  }
});

anchor.addEventListener("targetLost", () => {
  if (!arStarted) return;

  setState("LOST");

  // WICHTIG:
  // Content bleibt sichtbar (kein hide!)
});