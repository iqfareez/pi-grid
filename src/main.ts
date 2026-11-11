import "./style.css";
import { piDigitCount, setupPiGrid } from "./pi-grid.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <main class="visualizer" aria-label="Pi digit visualization">
    <div id="pi-grid-container"></div>
  </main>
  <aside class="sidebar" aria-labelledby="app-title">
    <header class="sidebar-header">
      <img class="app-icon" src="/pi.svg" width="36" height="36" alt="" />
      <h1 id="app-title">Pi Grid</h1>
    </header>

    <section class="settings" aria-labelledby="settings-title">
      <h2 id="settings-title">Settings</h2>
      <div class="setting-label">
        <label for="grid-size">Grid size</label>
        <output id="grid-size-value" for="grid-size">20 columns</output>
      </div>
      <input type="range" id="grid-size" min="5" max="200" step="1" value="20" />
      <div class="range-labels" aria-hidden="true"><span>Fewer cells</span><span>More cells</span></div>
      <label class="palette-toggle" for="bright-colors">
        <span>Bright colors</span>
        <input type="checkbox" id="bright-colors" role="switch" />
      </label>
    </section>

    <section class="legend" aria-labelledby="legend-title">
      <h2 id="legend-title">Color legend</h2>
      <div class="legend-items">
        ${Array.from(
          { length: 10 },
          (_, digit) => `
          <span class="legend-color" style="background-color: var(--digit-${digit}-color)" aria-label="Digit ${digit}">${digit}</span>
        `,
        ).join("")}
      </div>
    </section>

    <footer class="sidebar-footer">
      <p class="pi-preview" aria-label="Pi begins 3.141592653589793">3.141592653589793…</p>
      <p id="grid-dimensions"></p>
      <p>Made by <a href="https://iqfareez.com">iqfareez</a></p>
    </footer>
  </aside>
`;

const gridContainer =
  document.querySelector<HTMLDivElement>("#pi-grid-container")!;
const gridSizeInput = document.querySelector<HTMLInputElement>("#grid-size")!;
const gridSizeValue =
  document.querySelector<HTMLOutputElement>("#grid-size-value")!;
const gridDimensions =
  document.querySelector<HTMLParagraphElement>("#grid-dimensions")!;
const brightColorsToggle =
  document.querySelector<HTMLInputElement>("#bright-colors")!;
const preferredDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
let paletteChosen = false;

function updatePalette() {
  document.documentElement.dataset.palette = brightColorsToggle.checked
    ? "bright"
    : "muted";
  scheduleGridUpdate();
}

brightColorsToggle.addEventListener("change", () => {
  paletteChosen = true;
  updatePalette();
});

preferredDarkMode.addEventListener("change", () => {
  if (!paletteChosen) {
    brightColorsToggle.checked = !preferredDarkMode.matches;
  }
  updatePalette();
});

function updatePiGrid() {
  const columns = Number(gridSizeInput.value);
  const { width, height } = gridContainer.getBoundingClientRect();
  if (width <= 0 || height <= 0) return;

  const desiredRows = Math.max(1, Math.round(height / (width / columns)));
  const rows = Math.min(desiredRows, Math.floor(piDigitCount / columns));
  const columnsLabel = `${columns.toLocaleString()} columns`;
  gridSizeValue.value = columnsLabel;
  gridSizeInput.setAttribute("aria-valuetext", columnsLabel);
  gridDimensions.textContent = `${columnsLabel} × ${rows.toLocaleString()} rows`;
  gridDimensions.title =
    rows < desiredRows
      ? `Rows are limited to the ${piDigitCount.toLocaleString()} available digits of π.`
      : "";

  setupPiGrid(gridContainer, { columns, rows });
}

let renderFrame = 0;
function scheduleGridUpdate() {
  cancelAnimationFrame(renderFrame);
  renderFrame = requestAnimationFrame(updatePiGrid);
}

gridSizeInput.addEventListener("input", scheduleGridUpdate);
new ResizeObserver(scheduleGridUpdate).observe(gridContainer);
brightColorsToggle.checked = !preferredDarkMode.matches;
updatePalette();
