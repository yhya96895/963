window.Animations = (function () {
  const overlay = document.getElementById("overlay");
  let running = false;
  let skipRequested = false;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Like sleep, but returns early as soon as the user taps the screen.
  async function pause(ms) {
    const end = Date.now() + ms;
    while (!skipRequested && Date.now() < end) {
      await sleep(Math.min(50, end - Date.now()));
    }
  }

  // Tapping anywhere while an animation runs ends it.
  overlay.addEventListener("click", () => {
    if (running) skipRequested = true;
  });

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function gridCells(cellW, cellH) {
    const cols = Math.ceil(window.innerWidth / cellW);
    const rows = Math.ceil(window.innerHeight / cellH);
    const cells = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells.push({ x: c * cellW, y: r * cellH, cellW, cellH });
    return shuffle(cells);
  }

  async function close() {
    overlay.classList.add("leaving");
    await sleep(650);
    overlay.classList.add("hidden");
    overlay.classList.remove("leaving");
    overlay.innerHTML = "";
  }

  async function error() {
    if (running) return;
    running = true;
    skipRequested = false;
    const T = CONFIG.timings;
    const colors = CONFIG.colors.error;
    overlay.innerHTML = "";
    overlay.classList.remove("hidden");

    const fontSize = Math.max(26, Math.min(window.innerWidth / 9, 56));
    const cells = gridCells(fontSize * 3.6, fontSize * 1.25);

    for (let i = 0; i < cells.length; i++) {
      if (skipRequested) break;
      const c = cells[i];
      const el = document.createElement("div");
      el.className = "err-word";
      el.textContent = "ERROR";
      el.style.fontSize = fontSize + "px";
      el.style.left = c.x + (Math.random() * 6 - 3) + "px";
      el.style.top = c.y + "px";
      el.style.color = colors[i % colors.length];
      overlay.appendChild(el);
      await pause(T.errorSpawnIntervalMs);
    }

    await pause(T.errorHoldMs);
    await close();
    skipRequested = false;
    running = false;
  }

  async function pistachio() {
    if (running) return;
    running = true;
    skipRequested = false;
    const T = CONFIG.timings;
    overlay.innerHTML = "";
    overlay.classList.remove("hidden");

    const size = Math.max(54, Math.min(window.innerWidth / 8, 96));
    const cells = gridCells(size * 0.9, size * 1.05);

    const phrase = document.createElement("div");
    phrase.className = "pistachio-phrase";
    phrase.textContent = CONFIG.pistachioPhrase;
    overlay.appendChild(phrase);

    for (let i = 0; i < cells.length; i++) {
      if (skipRequested) break;
      const c = cells[i];
      const el = document.createElement("div");
      el.className = "pistachio";
      const images = CONFIG.pistachioImages || [];
      if (images.length) {
        const img = images[(Math.random() * images.length) | 0];
        el.style.backgroundImage = `url("${img}")`;
      }
      el.style.width = size * 0.85 + "px";
      el.style.height = size * 1.1 + "px";
      el.style.left = c.x + (Math.random() * 8 - 4) + "px";
      el.style.top = c.y + (Math.random() * 8 - 4) + "px";
      el.style.setProperty("--rot", Math.round(Math.random() * 90 - 45) + "deg");
      overlay.appendChild(el);
      await pause(T.pistachioSpawnIntervalMs);
    }

    await pause(T.pistachioHoldMs);
    await close();
    skipRequested = false;
    running = false;
  }

  return { error, pistachio, isRunning: () => running };
})();
