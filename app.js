/* =========================
   STATE MACHINE
========================= */

let state = "IDLE";
let selectedMode = null;
let arStarted = false;

/* =========================
   DOM ELEMENTS
========================= */

const ui = document.getElementById("ui");
const status = document.getElementById("status");

const model = document.getElementById("modelEntity");
const video = document.getElementById("videoEntity");
const info = document.getElementById("infoEntity");

const videoEl = document.querySelector("#video");
const anchor = document.querySelector("#anchor");

/* =========================
   UI TIMER (AUTO HIDE)
========================= */

let uiTimer = null;

function showUI() {
  ui.classList.remove("hide");
  resetUITimer();
}

function hideUI() {
  ui.classList.add("hide");
}

function resetUITimer() {
  if (uiTimer) clearTimeout(uiTimer);

  uiTimer = setTimeout(() => {
    hideUI();
  }, 10000); // 10 Sekunden
}

/* =========================
   INIT UI BEHAVIOR
========================= */

document.addEventListener("click", showUI);
document.addEventListener("touchstart", showUI);

/* =========================
   MODE SELECTION
========================= */

window.selectMode = function (mode) {
  selectedMode = mode;

  status.innerText = "Modus: " + mode;

  showUI();
};

/* =========================
   START AR SESSION
========================= */

window.startAR = function () {
  if (!selectedMode) return;

  arStarted = true;
  setState("SCANNING");

  status.innerText = "AR aktiv – suche Marker...";

  videoEl.load();

  showUI();
};

/* =========================
   STATE MACHINE
========================= */

function setState(newState) {
  state = newState;
  console.log("STATE:", state);

  switch (state) {
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

/* =========================
   CONTENT HANDLING
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

    videoEl.play().catch((err) => {
      console.log("Video blocked:", err);
    });
  }

  if (selectedMode === "info") {
    info.setAttribute("visible", true);
  }
}

/* =========================
   MINDAR TRACKING EVENTS
========================= */

anchor.addEventListener("targetFound", () => {
  if (!arStarted) return;

  if (state === "SCANNING" || state === "LOST") {
    setState("RECOVERY");
  } else {
    setState("LOCKED");
  }

  // UI kommt kurz zurück wenn Marker erkannt wird
  showUI();
});

anchor.addEventListener("targetLost", () => {
  if (!arStarted) return;

  setState("LOST");

  // WICHTIG:
  // kein hideContent -> sticky AR bleibt aktiv
});

/* =========================
   INITIAL STATE
========================= */

setState("IDLE");
showUI();