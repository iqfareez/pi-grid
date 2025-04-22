import './style.css'
import { setupPiGrid } from './pi-grid.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Pi Grid Visualization</h1>
    <p>Each digit of Pi is represented with a unique color</p>
    <div class="legend-container"></div>
    <div class="card">
      <div class="controls">
        <label for="grid-size">Grid Size: </label>
        <input type="number" id="grid-size" min="5" max="50" value="20">
        
        <label for="total-digits">Total Digits: </label>
        <input type="number" id="total-digits" min="10" max="1000" value="200">
        
        <button id="update-grid">Update Grid</button>
      </div>
      <div id="pi-grid-container"></div>
    </div>
    <p class="read-the-docs">
      The mathematical constant π (Pi) visualized as a colorful grid
    </p>
  </div>
`

// Create and append the color legend
const legendContainer = document.querySelector('.legend-container')!;
const legendHTML = `
  <div class="legend">
    <h3>Color Legend</h3>
    <div class="legend-items">
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => `
        <div class="legend-item">
          <div class="legend-color" style="background-color: var(--digit-${digit}-color)"></div>
          <span>${digit}</span>
        </div>
      `).join('')}
    </div>
  </div>
`;
legendContainer.innerHTML = legendHTML;

// Configure and set up the initial Pi grid
const gridContainer = document.querySelector<HTMLDivElement>('#pi-grid-container')!;
const gridSizeInput = document.querySelector<HTMLInputElement>('#grid-size')!;
const totalDigitsInput = document.querySelector<HTMLInputElement>('#total-digits')!;
const updateButton = document.querySelector<HTMLButtonElement>('#update-grid')!;

function updatePiGrid() {
  const gridSize = parseInt(gridSizeInput.value);
  const totalDigits = parseInt(totalDigitsInput.value);
  
  setupPiGrid(gridContainer, {
    gridSize,
    totalDigits
  });
}

// Initial grid setup
updatePiGrid();

// Add event listener for the update button
updateButton.addEventListener('click', updatePiGrid);
