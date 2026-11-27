(function () {
  const card = document.getElementById("card");
  const finalCard = document.getElementById("final");
  const messageEl = document.getElementById("message");
  const buttons = {
    yes: document.querySelector('[data-action="yes"]'),
    no: document.querySelector('[data-action="no"]'),
    option3: document.querySelector('[data-action="option3"]'),
    option4: document.querySelector('[data-action="option4"]'),
  };
  const sweet = document.getElementById("sweet");
  const sweetText = document.getElementById("sweet-text");

  let stage = 1;
  let busy = false;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  document.title = CONFIG.pageTitle;

  function render(stageConfig) {
    messageEl.textContent = stageConfig.message;
    for (const key of Object.keys(buttons)) {
      const label = stageConfig.buttons[key];
      buttons[key].textContent = label || "";
      // Hide the whole slot when this stage has no label for that button.
      buttons[key].parentElement.classList.toggle("hidden", !label);
    }
  }

  async function goToStage2() {
    busy = true;
    card.classList.add("fading");
    await sleep(600);
    Dodge.disable();
    stage = 2;
    render(CONFIG.stage2);
    card.classList.remove("fading");
    busy = false;
  }

  async function showSweetMessage() {
    busy = true;
    sweetText.textContent = CONFIG.noSweetMessage;
    sweet.classList.remove("hidden");
    await new Promise((resolve) => {
      const done = () => { sweet.removeEventListener("click", done); clearTimeout(t); resolve(); };
      const t = setTimeout(done, CONFIG.timings.noSweetMessageMs);
      sweet.addEventListener("click", done);
    });
    sweet.classList.add("hidden");
    busy = false;
  }

  async function celebrate() {
    busy = true;
    Celebration.playSong();
    card.classList.add("fading");
    await sleep(600);
    card.classList.add("hidden");
    await Celebration.run();
    document.getElementById("final-message").textContent = CONFIG.finalMessage;
    finalCard.classList.remove("hidden");
  }

  async function runAnimation(name) {
    busy = true;
    await Animations[name]();
    busy = false;
  }

  function handle(action) {
    if (busy) return;
    if (action === "option3") return runAnimation("error");
    if (action === "option4") return runAnimation("pistachio");
    if (stage === 1) {
      if (action === "yes") return goToStage2();
      return;
    }
    if (action === "yes") return celebrate();
    if (action === "no") return showSweetMessage();
  }

  buttons.yes.addEventListener("click", () => handle("yes"));
  buttons.option3.addEventListener("click", () => handle("option3"));
  buttons.option4.addEventListener("click", () => handle("option4"));
  buttons.no.addEventListener("click", () => handle("no"));

  render(CONFIG.stage1);
  Dodge.enable(buttons.no);
  Celebration.prepareAudio();
})();
