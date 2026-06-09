let currentMode = null;
let lastPose = null;

const model = document.getElementById("modelEntity");
const video = document.getElementById("videoEntity");
const info = document.getElementById("infoEntity");
const status = document.getElementById("status");

const anchor = document.querySelector("#anchor");

// MODE SELECTION
window.setMode = function(mode) {
  currentMode = mode;

  model.setAttribute("visible", false);
  video.setAttribute("visible", false);
  info.setAttribute("visible", false);

  status.innerText = "Modus: " + mode;
};

// TRACKING EVENTS
anchor.addEventListener("targetFound", () => {
  status.innerText = "Marker erkannt";

  // restore last mode content
  showCurrentMode();

  // re-apply last known pose if exists
  if (lastPose) {
    anchor.object3D.position.copy(lastPose.position);
    anchor.object3D.quaternion.copy(lastPose.quaternion);
  }
});

anchor.addEventListener("targetLost", () => {
  status.innerText = "Marker verloren – Content bleibt aktiv";

  // SAVE LAST POSE (sticky behavior)
  lastPose = {
    position: anchor.object3D.position.clone(),
    quaternion: anchor.object3D.quaternion.clone()
  };

  // IMPORTANT: DO NOT HIDE CONTENT
});

// SHOW CONTENT
function showCurrentMode() {
  if (currentMode === "model") {
    model.setAttribute("visible", true);
  }

  if (currentMode === "video") {
    video.setAttribute("visible", true);
    document.querySelector("#video").play();
  }

  if (currentMode === "info") {
    info.setAttribute("visible", true);
  }
}