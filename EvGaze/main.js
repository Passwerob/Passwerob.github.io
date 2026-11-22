"use strict";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ==========================================================================
   Hero scope: a small event-camera simulation.
   Edges come from a real frame. Each edge fires with probability proportional
   to |gradient . image velocity|; velocity = natural pan + prism circle.
   A toy controller spins the prism up when the scene is still and down when
   the scene already moves, which is the idea of the paper in one loop.
   ========================================================================== */
function startScope() {
  const canvas = document.getElementById("scope");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const N = 360; // event buffer resolution (square)

  const hud = {
    scene: document.querySelector('[data-hud="scene"]'),
    rpm: document.querySelector('[data-hud="rpm"]'),
    steps: [...document.querySelectorAll("[data-step]")]
  };

  // Phases of the toy demo. nat = natural horizontal image speed (0..1).
  const phases = [
    { name: "Still", nat: 0.0, cmd: 360, dur: 5200 },
    { name: "Slow pan", nat: 0.32, cmd: 180, dur: 4600 },
    { name: "Fast pan", nat: 1.0, cmd: 0, dur: 4600 },
    { name: "Slow pan", nat: 0.32, cmd: 180, dur: 3600 }
  ];
  const cycle = phases.reduce((s, p) => s + p.dur, 0);

  // edge field
  let count = 0;
  let ex, ey, ux, uy, ew;
  let ghost = null;

  const buf = document.createElement("canvas");
  buf.width = N;
  buf.height = N;
  const bctx = buf.getContext("2d");
  const img = bctx.createImageData(N, N);
  const accOn = new Float32Array(N * N);
  const accOff = new Float32Array(N * N);

  function buildEdges(source, sw, sh) {
    // cover-fit source into N x N
    const c = document.createElement("canvas");
    c.width = N;
    c.height = N;
    const g = c.getContext("2d", { willReadFrequently: true });
    const s = Math.max(N / sw, N / sh);
    const dw = sw * s;
    const dh = sh * s;
    g.drawImage(source, (N - dw) / 2, (N - dh) / 2, dw, dh);
    const data = g.getImageData(0, 0, N, N).data; // may throw on file://
    const L = new Float32Array(N * N);
    for (let i = 0; i < N * N; i++) {
      L[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
    }
    // normalise contrast so dark frames still give edges
    let lo = 255, hi = 0;
    for (let i = 0; i < L.length; i += 7) { if (L[i] < lo) lo = L[i]; if (L[i] > hi) hi = L[i]; }
    const span = Math.max(1, hi - lo);
    for (let i = 0; i < L.length; i++) L[i] = (L[i] - lo) / span;
    ghost = L;

    const mags = new Float32Array(N * N);
    const GX = new Float32Array(N * N);
    const GY = new Float32Array(N * N);
    for (let y = 1; y < N - 1; y++) {
      for (let x = 1; x < N - 1; x++) {
        const i = y * N + x;
        const gx = (L[i - N + 1] + 2 * L[i + 1] + L[i + N + 1]) - (L[i - N - 1] + 2 * L[i - 1] + L[i + N - 1]);
        const gy = (L[i + N - 1] + 2 * L[i + N] + L[i + N + 1]) - (L[i - N - 1] + 2 * L[i - N] + L[i - N + 1]);
        GX[i] = gx;
        GY[i] = gy;
        mags[i] = Math.hypot(gx, gy);
      }
    }
    // threshold at the 84th percentile
    const sorted = Array.from(mags.filter((_, i) => i % 3 === 0)).sort((a, b) => a - b);
    const th = Math.max(0.04, sorted[Math.floor(sorted.length * 0.84)]);
    const idx = [];
    for (let i = 0; i < mags.length; i++) if (mags[i] > th) idx.push(i);
    const maxPts = 26000;
    const step = Math.max(1, idx.length / maxPts);
    count = Math.min(idx.length, maxPts);
    ex = new Uint16Array(count);
    ey = new Uint16Array(count);
    ux = new Float32Array(count);
    uy = new Float32Array(count);
    ew = new Float32Array(count);
    for (let k = 0; k < count; k++) {
      const i = idx[Math.floor(k * step)];
      const m = mags[i];
      ex[k] = i % N;
      ey[k] = (i / N) | 0;
      ux[k] = GX[i] / m;
      uy[k] = GY[i] / m;
      ew[k] = Math.min(1, m / (th * 2.5));
    }
  }

  function syntheticScene() {
    // fallback (e.g. when the page is opened from file:// and the frame taints the canvas)
    const c = document.createElement("canvas");
    c.width = 640;
    c.height = 640;
    const g = c.getContext("2d");
    g.fillStyle = "#222";
    g.fillRect(0, 0, 640, 640);
    g.fillStyle = "#cfcfcf";
    let x = 20;
    const rnd = mulberry(7);
    while (x < 620) {
      const w = 30 + rnd() * 60;
      const h = 120 + rnd() * 300;
      g.fillRect(x, 520 - h, w, h);
      x += w + 8 + rnd() * 20;
    }
    g.fillStyle = "#111";
    for (let i = 0; i < 140; i++) g.fillRect(30 + rnd() * 580, 160 + rnd() * 340, 6, 10);
    g.beginPath();
    g.arc(470, 150, 50, 0, Math.PI * 2);
    g.fillStyle = "#e8e8e8";
    g.fill();
    g.fillStyle = "#777";
    g.fillRect(0, 520, 640, 120);
    buildEdges(c, 640, 640);
  }

  function mulberry(a) {
    return () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // state
  let theta = -Math.PI / 2;
  let omega = 0; // rpm, follows command with a slew limit
  let natural = 0;
  let clock = 0;
  let last = 0;
  let shownPhase = -1;
  let shownCmd = -1;
  let shownRpm = -1;

  function phaseAt(t) {
    let m = t % cycle;
    for (let i = 0; i < phases.length; i++) {
      if (m < phases[i].dur) return i;
      m -= phases[i].dur;
    }
    return 0;
  }

  function simulate(dt) {
    clock += dt * 1000;
    const pi = phaseAt(clock);
    const ph = phases[pi];
    // motor slew ~ 420 rpm/s, natural motion eases in
    const slew = 420 * dt;
    omega += Math.max(-slew, Math.min(slew, ph.cmd - omega));
    natural += (ph.nat - natural) * Math.min(1, dt * 2.2);
    // visual rotation: 360 rpm drawn at ~1.1 rev/s
    theta += (omega / 360) * 1.1 * Math.PI * 2 * dt;

    const pr = omega / 360;
    const vx = natural * 1.15 - Math.sin(theta) * pr;
    const vy = Math.cos(theta) * pr;

    const decay = Math.exp(-dt / 0.11);
    for (let i = 0; i < accOn.length; i++) {
      accOn[i] *= decay;
      accOff[i] *= decay;
    }
    if (count) {
      const k = 0.55 * Math.min(2, dt * 60);
      for (let j = 0; j < count; j++) {
        const d = (ux[j] * vx + uy[j] * vy) * ew[j];
        const p = (d < 0 ? -d : d) * k;
        if (Math.random() < p) {
          const i = ey[j] * N + ex[j];
          if (d > 0) accOn[i] += 1;
          else accOff[i] += 1;
        }
      }
    }

    if (pi !== shownPhase) {
      shownPhase = pi;
      hud.scene.textContent = ph.name;
    }
    if (ph.cmd !== shownCmd) {
      shownCmd = ph.cmd;
      hud.steps.forEach((s) => s.classList.toggle("on", Number(s.dataset.step) === ph.cmd));
    }
    const r = Math.round(omega / 5) * 5;
    if (r !== shownRpm) {
      shownRpm = r;
      hud.rpm.textContent = String(r);
    }
  }

  function paintBuffer() {
    const d = img.data;
    for (let i = 0, p = 0; i < accOn.length; i++, p += 4) {
      const a = accOn[i] > 1 ? 1 : accOn[i];
      const b = accOff[i] > 1 ? 1 : accOff[i];
      const gh = ghost ? ghost[i] * 16 : 0;
      d[p] = 6 + gh + a * 255 + b * 58;
      d[p + 1] = 8 + gh + a * 58 + b * 110;
      d[p + 2] = 12 + gh * 1.3 + a * 92 + b * 255;
      d[p + 3] = 255;
    }
    bctx.putImageData(img, 0, 0);
  }

  function size() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const W = Math.round(w * dpr);
    const H = Math.round(h * dpr);
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
    }
    return { w, h, dpr };
  }

  function draw() {
    const { w, h, dpr } = size();
    if (!w) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * 0.39;
    const pr = omega / 360;

    // glow behind the aperture
    const glow = ctx.createRadialGradient(cx, cy, R * 0.8, cx, cy, R * 1.35);
    glow.addColorStop(0, "rgba(63,116,255,0.16)");
    glow.addColorStop(1, "rgba(63,116,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // aperture content
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(buf, cx - R, cy - R, R * 2, R * 2);

    // rotating sweep (prism orientation)
    if (ctx.createConicGradient) {
      const span = 1.1;
      const f = span / (Math.PI * 2);
      const cg = ctx.createConicGradient(theta - span, cx, cy);
      const a = 0.05 + 0.14 * pr;
      cg.addColorStop(0, "rgba(255,255,255,0)");
      cg.addColorStop(f * 0.999, `rgba(200,215,255,${a})`);
      cg.addColorStop(f, "rgba(255,255,255,0)");
      cg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = cg;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    }
    // lens vignette
    const vig = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = vig;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

    // reticle
    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - R, cy); ctx.lineTo(cx - R * 0.12, cy);
    ctx.moveTo(cx + R * 0.12, cy); ctx.lineTo(cx + R, cy);
    ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy - R * 0.12);
    ctx.moveTo(cx, cy + R * 0.12); ctx.lineTo(cx, cy + R);
    ctx.stroke();
    ctx.restore();

    // circular image motion: orbit + dot
    const orb = R * 0.075;
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.arc(cx, cy, orb, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(cx + Math.cos(theta) * orb, cy + Math.sin(theta) * orb, 2.4, 0, Math.PI * 2);
    ctx.fill();

    // rim
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.beginPath();
    ctx.arc(cx, cy, R + 0.5, 0, Math.PI * 2);
    ctx.stroke();

    // encoder ticks
    const t0 = R + 9;
    for (let i = 0; i < 120; i++) {
      const a = (i / 120) * Math.PI * 2;
      const major = i % 10 === 0;
      const len = major ? 9 : 4;
      const rel = Math.cos(a - theta);
      const lit = rel > 0.985 ? (rel - 0.985) / 0.015 : 0;
      ctx.strokeStyle = major
        ? `rgba(255,255,255,${0.42 + 0.5 * lit})`
        : `rgba(255,255,255,${0.14 + 0.7 * lit})`;
      ctx.lineWidth = major ? 1.2 : 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * t0, cy + Math.sin(a) * t0);
      ctx.lineTo(cx + Math.cos(a) * (t0 + len), cy + Math.sin(a) * (t0 + len));
      ctx.stroke();
    }
    // degree labels
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = `500 ${Math.max(8, R * 0.045)}px ui-monospace, Consolas, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < 4; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 2;
      const rr = t0 + 22;
      ctx.fillText(String(i * 90), cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    }

    // polarity arcs trailing the prism angle (brightness follows speed)
    const trail = 0.25 + 0.6 * pr;
    ctx.lineCap = "round";
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = `rgba(255,61,99,${0.25 + 0.7 * pr})`;
    ctx.beginPath();
    ctx.arc(cx, cy, R + 3.5, theta - trail, theta);
    ctx.stroke();
    ctx.strokeStyle = `rgba(63,116,255,${0.25 + 0.7 * pr})`;
    ctx.beginPath();
    ctx.arc(cx, cy, R - 3, theta - trail * 0.8, theta);
    ctx.stroke();
    ctx.lineCap = "butt";

    // pointer
    const px = cx + Math.cos(theta) * (t0 + 12);
    const py = cy + Math.sin(theta) * (t0 + 12);
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(theta);
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.lineTo(3, -4);
    ctx.lineTo(3, 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function init() {
    if (reduceMotion) {
      // one representative still frame: prism at full speed, events integrated
      omega = 360;
      clock = 0;
      for (let i = 0; i < 24; i++) simulate(1 / 60);
      paintBuffer();
      draw();
      window.addEventListener("resize", draw);
      return;
    }
    let running = true;
    let raf = 0;
    const loop = (now) => {
      if (!running) { raf = 0; return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      simulate(dt);
      paintBuffer();
      draw();
      raf = requestAnimationFrame(loop);
    };
    const resume = () => {
      if (running && !raf && !document.hidden) { last = 0; raf = requestAnimationFrame(loop); }
    };
    new IntersectionObserver((entries) => {
      running = entries[0].isIntersecting;
      resume();
    }).observe(canvas);
    document.addEventListener("visibilitychange", resume);
    resume();
  }

  const photo = new Image();
  photo.decoding = "async";
  photo.onload = () => {
    try {
      buildEdges(photo, photo.naturalWidth, photo.naturalHeight);
    } catch (_) {
      syntheticScene();
    }
    init();
  };
  photo.onerror = () => { syntheticScene(); init(); };
  photo.src = "assets/compare/dsec-rgb.png";
}

/* ==========================================================================
   Video slot. Set data-src on #video-slot (see the comment in index.html).
   ========================================================================== */
function mountVideo() {
  const slot = document.getElementById("video-slot");
  if (!slot) return;
  const src = (slot.dataset.src || "").trim();
  if (!src) return;
  let el;
  if (/youtube\.com|youtu\.be|vimeo\.com|bilibili\.com/i.test(src)) {
    el = document.createElement("iframe");
    el.src = src;
    el.title = "EvGaze overview video";
    el.loading = "lazy";
    el.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    el.allowFullscreen = true;
    el.referrerPolicy = "strict-origin-when-cross-origin";
  } else {
    el = document.createElement("video");
    el.src = src;
    el.controls = true;
    el.playsInline = true;
    el.preload = "metadata";
    if (slot.dataset.poster) el.poster = slot.dataset.poster;
  }
  slot.replaceChildren(el);
  slot.classList.add("has-video");
}

/* ==========================================================================
   Before / after comparison
   ========================================================================== */
const scenes = {
  dsec: {
    ratio: "1280 / 924",
    note: "DSEC street. Passive simulators fire where the car is already moving. EvGaze also draws the houses and the far curb.",
    sources: [
      { name: "RGB", src: "assets/compare/dsec-rgb.png", w: 1280, h: 924 },
      { name: "DVS-Voltmeter", src: "assets/compare/dsec-volt.png", w: 1280, h: 924 },
      { name: "v2e", src: "assets/compare/dsec-v2e.png", w: 1280, h: 924 }
    ],
    ours: { src: "assets/compare/dsec-ours.png", w: 1280, h: 924 },
    initial: 1
  },
  dl: {
    ratio: "614 / 332",
    maxw: "880px",
    note: "DL3DV temple courtyard. Passive simulators trace only fragments of the roof; EvGaze draws the eaves, columns and stairs as continuous edges.",
    sources: [
      { name: "RGB", src: "assets/compare/temple-rgb.png", w: 614, h: 332 },
      { name: "DVS-Voltmeter", src: "assets/compare/temple-volt.png", w: 614, h: 332 },
      { name: "v2e", src: "assets/compare/temple-v2e.png", w: 614, h: 332 }
    ],
    ours: { src: "assets/compare/temple-ours.png", w: 614, h: 332 },
    initial: 1
  },
  sim: {
    ratio: "960 / 540",
    note: "EvMotion simulation, co-motion. Without the prism the passive camera barely fires. Constant 180 RPM gives sparser, noisier edges; the EvGaze panel (360 RPM optics with per-event compensation) traces the car and the building fronts cleanly.",
    sources: [
      { name: "RGB", src: "assets/compare/sim-rgb.png", w: 960, h: 540 },
      { name: "No prism", src: "assets/compare/sim-base.png", w: 960, h: 540 },
      { name: "Fixed-180", src: "assets/compare/sim-fixed.png", w: 960, h: 540 }
    ],
    ours: { src: "assets/compare/sim-ours.png", w: 960, h: 540 },
    initial: 2
  },
  real: {
    ratio: "464 / 261",
    maxw: "820px",
    note: "Real X target on the prototype, matched 66.7 ms windows. Without the prism the camera barely fires; constant 360 RPM thickens the contours; EvGaze recovers the target without the blur.",
    sources: [
      { name: "RGB", src: "assets/compare/real-rgb.png", w: 464, h: 261 },
      { name: "No prism", src: "assets/compare/real-base.png", w: 464, h: 261 },
      { name: "Fixed-360", src: "assets/compare/real-fixed.png", w: 464, h: 261 }
    ],
    ours: { src: "assets/compare/real-ours.png", w: 464, h: 261 },
    initial: 2
  }
};

function startCompare() {
  const stage = document.getElementById("compare");
  if (!stage) return;
  const leftImg = stage.querySelector(".layer-left");
  const oursImg = stage.querySelector(".layer-ours");
  const note = document.querySelector("[data-scene-note]");
  const leftName = document.querySelector("[data-left-name]");
  const sourceButtons = [...document.querySelectorAll("[data-source]")];
  const sceneButtons = [...document.querySelectorAll("[data-scene]")];

  let sceneId = "dsec";
  let shown = 50;
  let goal = 50;
  let raf = 0;
  let dragging = false;
  let loadToken = 0;
  let introPlayed = false;

  function paint() {
    stage.style.setProperty("--pos", shown.toFixed(2));
    stage.setAttribute("aria-valuenow", String(Math.round(shown)));
    stage.dataset.near = shown < 16 ? "left" : shown > 84 ? "right" : "";
  }
  function tick() {
    const delta = goal - shown;
    if (Math.abs(delta) < 0.1) {
      shown = goal; paint(); raf = 0; return;
    }
    shown += delta * 0.2;
    paint();
    raf = requestAnimationFrame(tick);
  }
  function moveTo(next, immediate) {
    goal = Math.min(100, Math.max(0, next));
    if (immediate || reduceMotion) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0; shown = goal; paint(); return;
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function setSourceButtons(scene, active) {
    sourceButtons.forEach((button, i) => {
      const src = scene.sources[i];
      button.hidden = !src;
      if (src) button.textContent = src.name;
      button.setAttribute("aria-checked", i === active ? "true" : "false");
      button.tabIndex = i === active ? 0 : -1;
    });
  }

  function setSource(index) {
    const scene = scenes[sceneId];
    const source = scene.sources[index];
    if (!source) return;
    setSourceButtons(scene, index);
    leftName.textContent = source.name;
    if (leftImg.getAttribute("src") !== source.src) {
      leftImg.width = source.w;
      leftImg.height = source.h;
      leftImg.src = source.src;
    }
  }

  async function showScene(id) {
    const scene = scenes[id];
    const token = ++loadToken;
    sceneId = id;
    sceneButtons.forEach((b) => {
      const on = b.dataset.scene === id;
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    });
    stage.style.aspectRatio = scene.ratio;
    stage.style.maxWidth = scene.maxw || "";   // low-resolution frames are not stretched past their detail
    const [rw, rh] = scene.ratio.split("/").map(Number);
    stage.style.setProperty("--ar", (rw / rh).toFixed(4));
    note.textContent = scene.note;
    stage.classList.add("is-fading", "is-busy");
    const source = scene.sources[scene.initial];
    setSourceButtons(scene, scene.initial);
    leftName.textContent = source.name;
    leftImg.width = source.w; leftImg.height = source.h; leftImg.src = source.src;
    oursImg.width = scene.ours.w; oursImg.height = scene.ours.h; oursImg.src = scene.ours.src;
    try {
      await Promise.all([leftImg.decode(), oursImg.decode()]);
    } catch (_) {
      if (token === loadToken) note.textContent = "This frame did not load. Refresh the page and try again.";
    }
    if (token !== loadToken) return;
    stage.classList.remove("is-fading", "is-busy");
    moveTo(50, false);
  }

  function posFromPointer(event) {
    const rect = stage.getBoundingClientRect();
    const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
    return (x / rect.width) * 100;
  }
  stage.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    dragging = true;
    introPlayed = true;
    stage.classList.add("is-drag");
    stage.setPointerCapture(event.pointerId);
    moveTo(posFromPointer(event), event.pointerType !== "mouse");
  });
  stage.addEventListener("pointermove", (event) => {
    if (dragging) moveTo(posFromPointer(event), true);
  });
  const endDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove("is-drag");
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
  };
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);
  stage.addEventListener("dragstart", (e) => e.preventDefault());

  stage.addEventListener("keydown", (event) => {
    const step = event.shiftKey ? 10 : 2;
    const map = { ArrowLeft: goal - step, ArrowRight: goal + step, Home: 0, End: 100 };
    if (event.key in map) {
      event.preventDefault();
      introPlayed = true;
      moveTo(map[event.key], false);
    }
  });

  // tabs: click + arrow-key roving focus
  sceneButtons.forEach((button, i) => {
    button.addEventListener("click", () => {
      if (button.dataset.scene !== sceneId) showScene(button.dataset.scene);
    });
    button.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      const next = sceneButtons[(i + d + sceneButtons.length) % sceneButtons.length];
      next.focus();
      next.click();
    });
  });
  sourceButtons.forEach((button, i) => {
    button.addEventListener("click", () => setSource(Number(button.dataset.source)));
    button.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      const visible = sourceButtons.filter((b) => !b.hidden);
      const at = visible.indexOf(button);
      const next = visible[(at + d + visible.length) % visible.length];
      next.focus();
      next.click();
    });
  });

  // a short sweep the first time the slider scrolls into view, to show it moves
  if (!reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      const seq = [[200, 28], [900, 72], [1600, 50]];
      seq.forEach(([t, v]) => setTimeout(() => { if (!introPlayed) moveTo(v, false); }, t));
    }, { threshold: 0.6 });
    io.observe(stage);
  }

  paint();
  // warm the cache for the other scenes once the page is idle
  const warm = () => ["dl", "sim", "real"].forEach((id) => {
    const s = scenes[id];
    [s.ours, ...s.sources].forEach((spec) => { const im = new Image(); im.src = spec.src; });
  });
  if ("requestIdleCallback" in window) requestIdleCallback(warm, { timeout: 4000 });
  else setTimeout(warm, 2500);
}

/* ==========================================================================
   Result table tabs
   ========================================================================== */
function startTableTabs() {
  const tabs = [...document.querySelectorAll(".table-tabs [role=tab]")];
  const select = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      const next = tabs[(i + d + tabs.length) % tabs.length];
      next.focus();
      select(next);
    });
  });
}

/* ==========================================================================
   Zoom dialog, BibTeX copy, nav spy, reveal
   ========================================================================== */
function startZoom() {
  const dialog = document.getElementById("zoom-dialog");
  const zoomImg = document.getElementById("zoom-img");
  if (!dialog || !dialog.showModal) return;
  document.querySelectorAll("[data-zoom]").forEach((button) => {
    button.addEventListener("click", () => {
      zoomImg.src = button.dataset.zoom;
      zoomImg.alt = button.dataset.alt || "";
      dialog.showModal();
    });
  });
  dialog.querySelector(".close-zoom").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog || event.target === zoomImg) dialog.close();
  });
  dialog.addEventListener("close", () => zoomImg.removeAttribute("src"));
}

function startCopy() {
  const button = document.getElementById("copy-bib");
  const state = document.querySelector(".copy-state");
  if (!button) return;
  const label = button.querySelector("span");
  button.addEventListener("click", async () => {
    const bib = document.getElementById("bibtex");
    try {
      await navigator.clipboard.writeText(bib.textContent.trim());
      label.textContent = "Copied";
      button.classList.add("is-done");
      state.textContent = "BibTeX copied to the clipboard.";
    } catch (_) {
      const range = document.createRange();
      range.selectNodeContents(bib);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      state.textContent = "Clipboard is blocked. The BibTeX is selected, press Ctrl+C.";
    }
    setTimeout(() => {
      label.textContent = "Copy";
      button.classList.remove("is-done");
    }, 1800);
  });
}

function startNavSpy() {
  const links = [...document.querySelectorAll(".nav-links a")];
  const sections = links
    .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
    .filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        if (link.getAttribute("href") === "#" + entry.target.id) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));
}

function startReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".reveal").forEach((n) => io.observe(n));
}

mountVideo();
startScope();
startCompare();
startTableTabs();
startZoom();
startCopy();
startNavSpy();
startReveal();
