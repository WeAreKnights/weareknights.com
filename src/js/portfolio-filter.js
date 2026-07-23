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

  groups.forEach((group) => {
    const key = group.dataset.filterGroup;
    group.addEventListener("click", (event) => {
      const button = event.target.closest(".filter-btn");
      if (!button) return;

      state[key] = button.dataset.filterValue;

      group.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.setAttribute("aria-pressed", String(btn === button));
      });

      applyFilters();
    });
  });
})();
