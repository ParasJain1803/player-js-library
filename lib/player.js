import {
  muteSvg,
  volumeSvg,
  playSvg,
  pauseSvg,
  exitFullSvg,
  fullSvg,
} from "./svgs.js";

function videoPlayer(elem) {
  const body = document.querySelector("body");
  const video = document.querySelector(elem);
  video.controls = false;

  const wrapper = document.createElement("div");
  wrapper.classList.add("video-wrapper");

  const controls = document.createElement("div");
  controls.classList.add("controls");

  const controlsTop = document.createElement("div");
  controlsTop.classList.add("controls--top");

  const controlsBottom = document.createElement("div");
  controlsBottom.classList.add("controls--bottom");

  // Progress bar
  const progress = document.createElement("input");
  progress.classList.add("progress");
  progress.type = "range";
  progress.min = 0;
  progress.max = 100;
  progress.value = 0;

  video.addEventListener("timeupdate", () => {
    progress.value = (video.currentTime / video.duration) * 100 || 0;
  });

  progress.addEventListener("input", () => {
    video.currentTime = (progress.value / 100) * video.duration;
  });

  // play button
  const playBtn = document.createElement("span");
  playBtn.innerHTML = playSvg;

  function videoPlayPause() {
     if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  playBtn.addEventListener("click", videoPlayPause);
  video.addEventListener("click", videoPlayPause);
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      videoPlayPause();
    }
  });

  video.addEventListener("play", () => {
    playBtn.innerHTML = pauseSvg;
  });

  video.addEventListener("pause", () => {
    playBtn.innerHTML = playSvg;
  });

  // Time display
  const timeDisplay = document.createElement("span");
  timeDisplay.textContent = "00:00 / 00:00";

  video.addEventListener("loadedmetadata", () => {
    timeDisplay.textContent = `00:00 / ${formatTime(video.duration)}`;
  });

  video.addEventListener("timeupdate", () => {
    timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  });

  function formatTime(time) {
  if (isNaN(time)) return "00:00";
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  // mute + volume

  const muteBtn = document.createElement("span");
  muteBtn.innerHTML = muteSvg;

  const volume = document.createElement("input");
  volume.type = "range";
  volume.min = 0;
  volume.max = 100;
  volume.value = 100;

  let lastVolume = 1;

  volume.addEventListener("input", () => {
    video.volume = volume.value / 100;
  });

  muteBtn.addEventListener("click", () => {
    if (video.muted) {
      video.muted = false;
      video.volume = lastVolume;
      volume.value = lastVolume * 100;
      muteBtn.innerHTML = muteSvg;
    } else {
      lastVolume = video.volume;
      video.muted = true;
      volume.value = 0;
      muteBtn.innerHTML = volumeSvg;
    }
  });

  const fullBtn = document.createElement("span");
  fullBtn.innerHTML = fullSvg;
  fullBtn.classList.add("fullScreen");

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  fullBtn.addEventListener("click", toggleFullscreen);
  document.addEventListener("keydown", (e) => {
    if (e.code === "KeyF") {
      toggleFullscreen();
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement === wrapper) {
      fullBtn.innerHTML = exitFullSvg;
    } else {
      fullBtn.innerHTML = fullSvg;
    }
  });

  // Speed control
  const speedBtn = document.createElement("select");
  speedBtn.classList.add("speed-control");
  const speeds = [0.5, 0.75, 1, 1.5, 2];
  
  speeds.forEach(speed => {
    const option = document.createElement("option");
    option.value = speed;
    option.textContent = `${speed}x`;
    if (speed === 1) option.selected = true;
    speedBtn.appendChild(option);
  });

  speedBtn.addEventListener("change", () => {
    video.playbackRate = parseFloat(speedBtn.value);
  });

  controlsTop.appendChild(progress);

  controlsBottom.appendChild(playBtn);
  controlsBottom.appendChild(timeDisplay);
  controlsBottom.appendChild(muteBtn);
  controlsBottom.appendChild(volume);
  controlsBottom.appendChild(speedBtn);
  controlsBottom.appendChild(fullBtn);

  controls.appendChild(controlsTop);
  controls.appendChild(controlsBottom);

  wrapper.appendChild(video);
  wrapper.appendChild(controls);

  body.appendChild(wrapper);
}



export { videoPlayer };
