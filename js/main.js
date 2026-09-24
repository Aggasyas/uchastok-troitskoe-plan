(function () {
  const toggle = document.querySelector("[data-theme-toggle]");
  const root = document.documentElement;
  let theme = matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light";
  root.setAttribute("data-theme", theme);

  function iconFor(t) {
    return t === "dark"
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  if (toggle) {
    toggle.innerHTML = iconFor(theme);
    toggle.addEventListener("click", function () {
      theme = theme === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", theme);
      toggle.setAttribute("aria-label", "Переключить на " + (theme === "dark" ? "светлую" : "тёмную") + " тему");
      toggle.innerHTML = iconFor(theme);
    });
  }

  // Header shadow on scroll
  const header = document.querySelector("[data-header]");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 8) header.classList.add("header--scrolled");
    else header.classList.remove("header--scrolled");
  });

  // House variant toggle (zoning section)
  const houseBtns = document.querySelectorAll("[data-house]");
  const houseDesc = document.getElementById("house-desc");
  const descByKey = {
    A: "Тылом к дороге (грань 3→4, без соседа), фасад на грань 5→1 — к соседу с востока, самой солнечной стороне. Одноэтажный, 12×15 м, ~180 м² под пятном застройки.",
    B: "Тылом к дороге (грань 3→4), фасад на грань 5→1. Двухэтажный, 8×10 м в плане (~80 м² пятна, ~160 м² общей площади) — освобождает больше места под сад и огород."
  };
  houseBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      houseBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      const key = btn.getAttribute("data-house");
      if (window.renderZoningWithHouse) window.renderZoningWithHouse(key);
      if (houseDesc && descByKey[key]) houseDesc.textContent = descByKey[key];
    });
  });
})();
