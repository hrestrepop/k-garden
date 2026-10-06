(function () {
  try {
    var m = localStorage.getItem("color-mode");
    if (m !== "light") {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
