(function () {
  const state = { designer: "all", category: "all" };

  const groups = document.querySelectorAll("[data-filter-group]");
  const items = document.querySelectorAll(".portfolio-item");

  function applyFilters() {
    items.forEach((item) => {
      const matchesDesigner = state.designer === "all" || item.dataset.designer === state.designer;
      const matchesCategory = state.category === "all" || item.dataset.category === state.category;
      item.hidden = !(matchesDesigner && matchesCategory);
    });
  }

  function setPressed(group, value) {
    group.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.filterValue === value));
    });
  }

  groups.forEach((group) => {
    const key = group.dataset.filterGroup;
    group.addEventListener("click", (event) => {
      const button = event.target.closest(".filter-btn");
      if (!button) return;

      state[key] = button.dataset.filterValue;
      setPressed(group, button.dataset.filterValue);
      applyFilters();
    });
  });

  // Allow deep links like /portfolio/?designer=mitchell to preselect a filter.
  const params = new URLSearchParams(window.location.search);
  groups.forEach((group) => {
    const key = group.dataset.filterGroup;
    const value = params.get(key);
    if (!value) return;

    const button = group.querySelector(`.filter-btn[data-filter-value="${value}"]`);
    if (!button) return;

    state[key] = value;
    setPressed(group, value);
  });

  applyFilters();
})();
