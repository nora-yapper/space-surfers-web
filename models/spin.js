// Turntables: each .spin shows a 12x10 sprite of 120 frames (3 degrees apart) rendered in Godot.
// It turns slowly on its own once loaded; drag or use the arrow keys to turn it by hand.
(function () {
  var COLS = 12, ROWS = 10, N = COLS * ROWS, MS_PER_FRAME = 90; // about 11 s per turn
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".spin").forEach(function (el) {
    var frame = 0, held = false, startX = 0, startFrame = 0, touched = false, visible = false, last = 0, acc = 0;
    function show(f) {
      frame = ((f % N) + N) % N;
      el.style.backgroundPosition = (frame % COLS) * 100 / (COLS - 1) + "% " + Math.floor(frame / COLS) * 100 / (ROWS - 1) + "%";
    }
    var img = new Image();
    img.onload = function () {
      el.style.backgroundImage = "url(" + el.dataset.src + ")";
      show(0);
      if (!still) requestAnimationFrame(tick);
    };
    img.src = el.dataset.src;
    function tick(t) {
      if (last && visible && !touched && !held) {
        acc += t - last;
        if (acc >= MS_PER_FRAME) { show(frame + Math.floor(acc / MS_PER_FRAME)); acc %= MS_PER_FRAME; }
      }
      last = t;
      requestAnimationFrame(tick);
    }
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(el);
    el.addEventListener("pointerdown", function (e) {
      held = touched = true; startX = e.clientX; startFrame = frame;
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", function (e) {
      if (held) show(startFrame - Math.round((e.clientX - startX) / 3));
    });
    el.addEventListener("pointerup", function () { held = false; });
    el.addEventListener("pointercancel", function () { held = false; });
    el.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { touched = true; show(frame - 3); e.preventDefault(); }
      if (e.key === "ArrowRight") { touched = true; show(frame + 3); e.preventDefault(); }
    });
  });
})();
