/* Desktop window controls; the mobile sheet keeps its existing controls. */
(() => {
  let bounds = null;
  const desktop = () => matchMedia("(min-width: 1101px)").matches;
  const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
  function apply(panel, next) {
    const width = clamp(next.width, Math.min(340, innerWidth - 32), innerWidth - 32);
    const height = clamp(next.height, Math.min(220, innerHeight - 32), innerHeight - 32);
    panel.dataset.positioned = "true";
    const minimized = panel.classList.contains("is-minimized");
    const visibleWidth = minimized ? Math.min(380, width) : width;
    const visibleHeight = minimized ? panel.getBoundingClientRect().height : height;
    bounds = { width, height, left: clamp(next.left, 16, innerWidth - visibleWidth - 16), top: clamp(next.top, 16, innerHeight - visibleHeight - 16) };
    for (const [key, value] of Object.entries(bounds)) panel.style.setProperty(`--viewer-${key}`, `${value}px`);
  }
  function rectangle(panel) {
    const { left, top, width, height } = panel.getBoundingClientRect();
    return panel.classList.contains("is-minimized") && bounds
      ? { ...bounds, left, top }
      : { left, top, width, height };
  }
  function reset(panel) {
    bounds = null;
    delete panel.dataset.positioned;
    for (const key of ["left", "top", "width", "height"]) panel.style.removeProperty(`--viewer-${key}`);
  }
  function setup(panel) {
    const move = panel.querySelector("[data-move-viewer]");
    const resize = panel.querySelector("[data-resize-viewer]");
    const minimize = panel.querySelector("[data-minimize-viewer]");
    const text = (key) => window.ParliamentStreamsViewerI18n.message(panel.lang, key);
    move.textContent = panel.querySelector("#detail-title").textContent;
    function minimized(value) {
      if (value && !panel.classList.contains("is-minimized") && !bounds) bounds = rectangle(panel);
      panel.classList.toggle("is-minimized", value);
      minimize.setAttribute("aria-expanded", String(!value));
      minimize.setAttribute("aria-label", text(value ? "restore" : "minimize"));
      minimize.title = minimize.getAttribute("aria-label");
      minimize.textContent = value ? "+" : "−";
      if (!value && bounds && desktop()) apply(panel, bounds);
    }
    minimized(panel.classList.contains("is-minimized"));
    minimize.addEventListener("click", () => minimized(!panel.classList.contains("is-minimized")));
    move.addEventListener("dblclick", () => reset(panel));
    for (const [handle, resizing] of [[move, false], [resize, true]]) {
      let origin;
      handle.addEventListener("pointerdown", (event) => {
        if (!desktop() || event.button !== 0 || (resizing && panel.classList.contains("is-minimized"))) return;
        origin = { ...rectangle(panel), x: event.clientX, y: event.clientY };
        handle.setPointerCapture(event.pointerId);
      });
      handle.addEventListener("pointermove", (event) => {
        if (!origin || !handle.hasPointerCapture(event.pointerId)) return;
        const dx = event.clientX - origin.x;
        const dy = event.clientY - origin.y;
        apply(panel, resizing
          ? { left: origin.left + dx, top: origin.top + dy, width: origin.width - dx, height: origin.height - dy }
          : { ...origin, left: origin.left + dx, top: origin.top + dy });
      });
      const release = () => { origin = null; };
      handle.addEventListener("pointerup", release);
      handle.addEventListener("pointercancel", release);
      handle.addEventListener("lostpointercapture", release);
      handle.addEventListener("keydown", (event) => {
        if (!desktop()) return;
        if (event.key === "Home") { event.preventDefault(); reset(panel); return; }
        const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
        if (!directions[event.key]) return;
        event.preventDefault();
        const step = event.shiftKey ? 40 : 10;
        const [x, y] = directions[event.key].map((value) => value * step);
        const box = rectangle(panel);
        apply(panel, resizing
          ? { ...box, left: box.left - x, top: box.top - y, width: box.width + x, height: box.height + y }
          : { ...box, left: box.left + x, top: box.top + y });
      });
    }
  }
  window.addEventListener("resize", () => {
    const panel = document.querySelector("#detail-panel");
    if (bounds && panel && desktop()) apply(panel, bounds);
  });
  window.ParliamentStreamsViewerControls = { setup };
})();
