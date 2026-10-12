 (function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- 1. Theme toggle (remembers your choice) ---------- */
  var themeBtn = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeBtn.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) { /* storage blocked */ }
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));

  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
  });

  /* ---------- 2. Mobile navigation toggle ---------- */
  var navBtn = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");

  function setNav(open) {
    nav.classList.toggle("is-open", open);
    navBtn.setAttribute("aria-expanded", String(open));
    navBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  navBtn.addEventListener("click", function () {
    setNav(navBtn.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") setNav(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setNav(false);
  });

  /* ---------- 3. Rotating greeting (the languages I speak) ---------- */
  var greeting = document.getElementById("greeting");
  var hellos = ["Hello", "Bonjour", "Hola", "Merhaba"];
  var helloIndex = 0;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion) {
    setInterval(function () {
      helloIndex = (helloIndex + 1) % hellos.length;
      greeting.textContent = hellos[helloIndex];
      greeting.classList.remove("swap");
      void greeting.offsetWidth; // restart the animation
      greeting.classList.add("swap");
    }, 2200);
  }

  /* ---------- 4. Drum kit (sounds are synthesised, no audio files) ---------- */
  var audioCtx = null;
  var noiseBuffer = null;

  function getCtx() {
    if (!audioCtx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
      // one second of white noise, reused for snare and hi-hat
      noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate, audioCtx.sampleRate);
      var data = noiseBuffer.getChannelData(0);
      for (var i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function noise(ctx, filterType, freq, length, volume) {
    var src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    var filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = freq;
    var gain = ctx.createGain();
    var t = ctx.currentTime;
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + length);
    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.start(t); src.stop(t + length);
  }

  function tone(ctx, type, startFreq, endFreq, length, volume) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    var t = ctx.currentTime;
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + length);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + length);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t); osc.stop(t + length);
  }

  var sounds = {
    kick:  function (c) { tone(c, "sine", 150, 40, 0.45, 1); },
    snare: function (c) { noise(c, "highpass", 1500, 0.2, 0.7); tone(c, "triangle", 210, 140, 0.12, 0.5); },
    hat:   function (c) { noise(c, "highpass", 7500, 0.07, 0.45); },
    tom:   function (c) { tone(c, "sine", 220, 100, 0.35, 0.9); }
  };

  var pads = document.querySelectorAll(".pad");
  var padByKey = {};

  function play(name) {
    var ctx = getCtx();
    if (ctx && sounds[name]) sounds[name](ctx);
    var pad = document.querySelector('.pad[data-sound="' + name + '"]');
    if (pad) {
      pad.classList.add("hit");
      setTimeout(function () { pad.classList.remove("hit"); }, 110);
    }
  }

  pads.forEach(function (pad) {
    padByKey[pad.dataset.key] = pad.dataset.sound;
    pad.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      play(pad.dataset.sound);
    });
    // Keyboard activation (Enter / Space) on the focused button
    pad.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(pad.dataset.sound); }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    var tag = (document.activeElement && document.activeElement.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return; // don't drum while typing
    var name = padByKey[e.key.toLowerCase()];
    if (name) play(name);
  });

  // A simple 8-step groove: kick, hi-hat and snare
  var beatBtn = document.getElementById("beat-toggle");
  var groove = [
    ["kick", "hat"], ["hat"], ["snare", "hat"], ["hat"],
    ["kick", "hat"], ["kick", "hat"], ["snare", "hat"], ["hat", "tom"]
  ];
  var beatTimer = null;
  var step = 0;

  function stopBeat() {
    clearInterval(beatTimer);
    beatTimer = null;
    beatBtn.textContent = "Play a beat";
    beatBtn.setAttribute("aria-pressed", "false");
  }

  beatBtn.addEventListener("click", function () {
    if (beatTimer) { stopBeat(); return; }
    step = 0;
    beatBtn.textContent = "Stop the beat";
    beatBtn.setAttribute("aria-pressed", "true");
    beatTimer = setInterval(function () {
      groove[step].forEach(play);
      step = (step + 1) % groove.length;
    }, 300);
  });

  /* ---------- 5. Project filter ---------- */
  var filters = document.querySelectorAll(".filter");
  var projects = document.querySelectorAll(".project");
  var emptyMsg = document.getElementById("no-projects");

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var wanted = btn.dataset.filter;
      var shown = 0;

      filters.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });

      projects.forEach(function (card) {
        var cats = card.dataset.category.split(" ");
        var match = wanted === "all" || cats.indexOf(wanted) !== -1;
        card.hidden = !match;
        if (match) shown++;
      });

      emptyMsg.hidden = shown !== 0;
    });
  });

  /* ---------- 6. Contact form validation ---------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  var EMAIL_TO = "kamangamichele@gmail.com";

  function setError(input, message) {
    var field = input.closest(".field");
    field.classList.toggle("has-error", Boolean(message));
    document.getElementById(input.id + "-error").textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validate(input) {
    var value = input.value.trim();
    var msg = "";
    if (input.id === "name") {
      if (value.length < 2) msg = "Enter your name (at least 2 characters).";
    } else if (input.id === "email") {
      if (!value) msg = "Enter your email address.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) msg = "That email doesn't look right. Try name@example.com.";
    } else if (input.id === "message") {
      if (value.length < 10) msg = "Write a message of at least 10 characters.";
    }
    setError(input, msg);
    return !msg;
  }

  var inputs = form.querySelectorAll("input, textarea");
  inputs.forEach(function (input) {
    input.addEventListener("blur", function () { validate(input); });
    input.addEventListener("input", function () {
      if (input.closest(".field").classList.contains("has-error")) validate(input);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";
    var allGood = true;
    var firstBad = null;

    inputs.forEach(function (input) {
      if (!validate(input)) {
        allGood = false;
        if (!firstBad) firstBad = input;
      }
    });

    if (!allGood) {
      firstBad.focus();
      status.textContent = "Fix the highlighted fields and try again.";
      return;
    }

    // No server needed: open the visitor's email app with the message filled in.
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var message = form.elements.message.value.trim();
    var subject = encodeURIComponent("Portfolio message from " + name);
    var body = encodeURIComponent(message + "\n\nFrom: " + name + " (" + email + ")");

    status.textContent = "Thanks, " + name + "! Opening your email app to send this.";
    window.location.href = "mailto:" + EMAIL_TO + "?subject=" + subject + "&body=" + body;
    form.reset();
  });

  /* ---------- 7. Highlight the nav link for the section in view ---------- */
  var links = document.querySelectorAll(".site-nav a");
  var sections = [];
  links.forEach(function (a) {
    var s = document.querySelector(a.getAttribute("href"));
    if (s) sections.push({ link: a, el: s });
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove("is-current"); l.removeAttribute("aria-current"); });
        var match = sections.filter(function (s) { return s.el === entry.target; })[0];
        if (match) { match.link.classList.add("is-current"); match.link.setAttribute("aria-current", "true"); }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { observer.observe(s.el); });
  }

  /* ---------- 8. Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();