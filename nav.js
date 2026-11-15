// Site menu: one dropdown open at a time; a click outside or Escape closes it.
(function () {
  var drops = Array.prototype.slice.call(document.querySelectorAll(".sitenav details"));
  drops.forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) drops.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });
  document.addEventListener("click", function (e) {
    drops.forEach(function (d) { if (!d.contains(e.target)) d.open = false; });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") drops.forEach(function (d) {
      if (d.open) { d.open = false; d.querySelector("summary").focus(); }
    });
  });
})();
