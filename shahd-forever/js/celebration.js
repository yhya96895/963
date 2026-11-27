window.Celebration = (function () {
  const layer = document.getElementById("hearts-layer");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let audio = null;

  function prepareAudio() {
    const s = CONFIG.song;
    audio = new Audio(s.src);
    audio.preload = "auto";
    audio.loop = !!s.loop;
    audio.volume = s.volume;
    audio.setAttribute("playsinline", "");
    audio.addEventListener("loadedmetadata", () => {
      if (s.startAt > 0) audio.currentTime = s.startAt;
    });
    audio.load();
  }

  function playSong() {
    if (!audio) prepareAudio();
    if (CONFIG.song.startAt > 0 && audio.readyState >= 1) audio.currentTime = CONFIG.song.startAt;
    const p = audio.play();
    if (p && p.catch) p.catch((err) => console.warn("Song could not play:", err.message));
  }

  function spawnHeart(photoUrl) {
    const vw = window.innerWidth, vh = window.innerHeight;
    const size = Math.round(Math.max(vw, vh) * CONFIG.celebrationHeartScreenFraction);
    const el = document.createElement("div");
    el.className = "photo-heart";
    el.style.width = size + "px";
    el.style.height = size * 0.925 + "px";
    el.style.left = Math.random() * Math.max(1, vw - size) + "px";
    el.style.setProperty("--rise", CONFIG.timings.celebrationHeartRiseMs + "ms");
    el.style.setProperty("--sway", 1600 + Math.random() * 1400 + "ms");

    const inner = document.createElement("div");
    inner.className = "inner";
    inner.style.backgroundImage = photoUrl
      ? `url("${photoUrl}")`
      : "linear-gradient(135deg, #ff4d7e, #8e2de2)";
    el.appendChild(inner);
    layer.appendChild(el);
    setTimeout(() => el.remove(), CONFIG.timings.celebrationHeartRiseMs + 200);
  }

  function loadablePhotos() {
    return Promise.all(
      CONFIG.photos.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(null);
            img.src = src;
          })
      )
    ).then((list) => list.filter(Boolean));
  }

  async function run() {
    const photos = await loadablePhotos();
    const T = CONFIG.timings;
    const start = performance.now();
    let i = 0;
    while (performance.now() - start < T.celebrationDurationMs) {
      spawnHeart(photos.length ? photos[i % photos.length] : null);
      i++;
      await sleep(T.celebrationSpawnIntervalMs);
    }
    await sleep(T.celebrationHeartRiseMs * 0.6 + T.celebrationFinalMessageDelayMs);
  }

  return { prepareAudio, playSong, run };
})();
