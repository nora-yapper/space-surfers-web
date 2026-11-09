// Turntables: each .spin shows a 6x6 sprite of 36 frames rendered in Godot.
// It turns slowly on its own; drag or use the arrow keys to turn it by hand.
(function () {
  var still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".spin").forEach(function (el) {
    var frame = 0, held = false, startX = 0, startFrame = 0, touched = false;
    el.style.backgroundImage = "url(" + el.dataset.src + ")";
    function show(f) {
      frame = ((f % 36) + 36) % 36;
      el.style.backgroundPosition = (frame % 6) * 20 + "% " + Math.floor(frame / 6) * 20 + "%";
    }
    show(0);
    el.addEventListener("pointerdown", function (e) {
      held = touched = true; startX = e.clientX; startFrame = frame;
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener("pointermove", function (e) {
      if (held) show(startFrame - Math.round((e.clientX - startX) / 8));
    });
    el.addEventListener("pointerup", function () { held = false; });
    el.addEventListener("pointercancel", function () { held = false; });
    el.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { touched = true; show(frame - 1); e.preventDefault(); }
      if (e.key === "ArrowRight") { touched = true; show(frame + 1); e.preventDefault(); }
    });
    if (!still) setInterval(function () { if (!touched && !held) show(frame + 1); }, 320);
  });
})();
