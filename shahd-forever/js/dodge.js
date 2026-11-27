window.Dodge = (function () {
  let btn = null;
  let home = null;
  let enabled = false;
  let lastJump = 0;
  const margin = 12;

  function rectOf(el) { return el.getBoundingClientRect(); }

  function distanceToRect(x, y, r) {
    const dx = Math.max(r.left - x, 0, x - r.right);
    const dy = Math.max(r.top - y, 0, y - r.bottom);
    return Math.hypot(dx, dy);
  }

  function overlaps(a, b, pad) {
    return !(a.right + pad < b.left || a.left - pad > b.right || a.bottom + pad < b.top || a.top - pad > b.bottom);
  }

  function otherButtons() {
    return Array.from(document.querySelectorAll("#buttons .btn")).filter((b) => b !== btn);
  }

  function jump(px, py) {
    if (!enabled) return;
    const now = performance.now();
    if (now - lastJump < 90) return;
    lastJump = now;

    const r = rectOf(btn);
    const bw = r.width, bh = r.height;
    const vw = window.innerWidth, vh = window.innerHeight;
    const others = otherButtons().map(rectOf);
    const minDist = CONFIG.dodge.minJumpDistancePx;

    let best = null;
    for (let i = 0; i < 60; i++) {
      const left = margin + Math.random() * Math.max(1, vw - bw - margin * 2);
      const top = margin + Math.random() * Math.max(1, vh - bh - margin * 2);
      const cand = { left, top, right: left + bw, bottom: top + bh };
      if (others.some((o) => overlaps(cand, o, 10))) continue;
      const d = distanceToRect(px, py, cand);
      if (!best || d > best.d) best = { left, top, d };
      if (d >= minDist) break;
    }
    if (!best) best = { left: margin, top: margin, d: 0 };

    if (!btn.classList.contains("dodging")) {
      btn.style.width = bw + "px";
      btn.style.height = bh + "px";
      btn.style.left = r.left + "px";
      btn.style.top = r.top + "px";
      btn.parentElement.style.minHeight = bh + "px";
      btn.parentElement.style.minWidth = bw + "px";
      document.body.appendChild(btn);
      btn.classList.add("dodging");
      void btn.offsetWidth;
    }
    btn.style.left = best.left + "px";
    btn.style.top = best.top + "px";
  }

  function onPointer(e) {
    if (!enabled || !btn) return;
    const trigger = e.pointerType === "mouse" ? CONFIG.dodge.mouseTriggerDistancePx : CONFIG.dodge.touchTriggerDistancePx;
    if (distanceToRect(e.clientX, e.clientY, rectOf(btn)) < trigger) jump(e.clientX, e.clientY);
  }

  function onBlock(e) {
    if (!enabled) return;
    e.preventDefault();
    e.stopPropagation();
    const p = e.touches ? e.touches[0] : e;
    jump(p.clientX, p.clientY);
  }

  function onResize() {
    if (!enabled || !btn.classList.contains("dodging")) return;
    const r = rectOf(btn);
    btn.style.left = Math.min(Math.max(margin, r.left), window.innerWidth - r.width - margin) + "px";
    btn.style.top = Math.min(Math.max(margin, r.top), window.innerHeight - r.height - margin) + "px";
  }

  return {
    enable(button) {
      btn = button;
      home = button.parentElement;
      enabled = true;
      document.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("pointerdown", onPointer, { passive: true });
      btn.addEventListener("pointerdown", onBlock);
      btn.addEventListener("touchstart", onBlock, { passive: false });
      btn.addEventListener("click", onBlock);
      btn.addEventListener("focus", () => jump(-9999, -9999));
      btn.tabIndex = -1;
      window.addEventListener("resize", onResize);
    },
    disable() {
      if (!btn) return;
      enabled = false;
      document.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerdown", onPointer);
      btn.removeEventListener("pointerdown", onBlock);
      btn.removeEventListener("touchstart", onBlock);
      btn.removeEventListener("click", onBlock);
      window.removeEventListener("resize", onResize);
      btn.classList.remove("dodging");
      btn.style.cssText = "";
      home.style.minHeight = "";
      home.style.minWidth = "";
      home.appendChild(btn);
      btn.tabIndex = 0;
    },
  };
})();
