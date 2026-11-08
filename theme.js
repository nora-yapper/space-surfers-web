// Light/dark switch for the reading pages. Follows the device setting until the visitor picks one.
(function () {
  var root = document.documentElement, btn = document.querySelector("button.theme");
  if (!btn) return;
  function current() {
    return root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  function label() { btn.setAttribute("aria-label", current() === "dark" ? "Switch to light mode" : "Switch to dark mode"); }
  btn.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    label();
  });
  label();
})();
