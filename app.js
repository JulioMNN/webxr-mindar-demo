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
   CAMERA PERMISSION FIRST
========================= */

window.requestCamera = async function () {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true });

    permissionScreen.style.display = "none";
    ui.classList.remove("hidden");

    status.innerText = "Kamera bereit";

  } catch (e) {
    alert("Kamera Zugriff verweigert");
  }
};

/* =========================
   MODE SELECTION
========================= */

window.selectMode = function (mode) {
  selectedMode = mode;
  startBtn.disabled = false;

  status.innerText = "Modus: " + mode;
};

/* =========================
   START AR ENGINE
========================= */

window.startAR = async function () {
  if (!selectedMode) return;

  arStarted = true;

  status.innerText = "Starte AR...";

  try {
    await scene.systems["mindar-image-system"].start();
  } catch (e) {
    console.error("MindAR error:", e);
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
  status.innerText = "Marker verloren – Content bleibt";
});

/* =========================
   CONTENT SYSTEM
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

    const p = videoEl.play();

    if (p) {
      p.catch(err => {
        console.log("Video autoplay blocked:", err);

        setTimeout(() => {
          videoEl.play().catch(()=>{});
        }, 300);
      });
    }
  }

  if (selectedMode === "info") {
    info.setAttribute("visible", true);
  }
}