// Turntables: each .spin holds a 12x10 sprite of 120 frames (3 degrees apart) rendered in Godot.
// Drawn on a canvas at 60 fps, blending each frame into the next so the turn glides instead of stepping.
// It turns on its own once loaded (about 11 s per turn); drag or use the arrow keys to turn it by hand.
(function () {
  var COLS = 12, ROWS = 10, N = COLS * ROWS, CELL = 360, FRAMES_PER_SEC = 11;
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".spin").forEach(function (el) {
    var pos = 0, held = false, startX = 0, startPos = 0, touched = false, visible = false, last = 0;
    var canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");
    el.appendChild(canvas);
    var img = new Image();
    function size() {
      var px = Math.round(el.clientWidth * (window.devicePixelRatio || 1));
      if (canvas.width !== px) { canvas.width = canvas.height = px; }
    }
    function cell(f) { f = ((f % N) + N) % N; return [(f % COLS) * CELL, Math.floor(f / COLS) * CELL]; }
    function draw() {
      if (!img.complete || !img.naturalWidth) return;
      size();
      var w = canvas.width, base = Math.floor(pos), t = pos - base, a = cell(base), b = cell(base + 1);
      ctx.clearRect(0, 0, w, w);
      ctx.globalAlpha = 1;
      ctx.drawImage(img, a[0], a[1], CELL, CELL, 0, 0, w, w);
      if (t > 0.001) { ctx.globalAlpha = t; ctx.drawImage(img, b[0], b[1], CELL, CELL, 0, 0, w, w); }
    }
    function tick(now) {
      if (last && visible && !touched && !held) { pos = (pos + (now - last) / 1000 * FRAMES_PER_SEC) % N; draw(); }
      last = now;
      requestAnimationFrame(tick);
    }
    img.onload = function () { draw(); if (!still) requestAnimationFrame(tick); };
    img.src = el.dataset.src;
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) draw(); }).observe(el);
    window.addEventListener("resize", draw);
    el.addEventListener("pointerdown", function (e) {
      held = touched = true; startX = e.clientX; startPos = pos;
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", function (e) {
      if (held) { pos = (((startPos - (e.clientX - startX) / 3) % N) + N) % N; draw(); }
    });
    el.addEventListener("pointerup", function () { held = false; });
    el.addEventListener("pointercancel", function () { held = false; });
    el.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowLeft" ? -3 : e.key === "ArrowRight" ? 3 : 0;
      if (d) { touched = true; pos = (((Math.round(pos) + d) % N) + N) % N; draw(); e.preventDefault(); }
    });
  });
})();
