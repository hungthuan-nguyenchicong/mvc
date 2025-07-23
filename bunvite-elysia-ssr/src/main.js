// src/main.js
console.log('[Client] main.js loaded and hydrating.');

const rootElement = document.getElementById('root');
let count = window.__INITIAL_STATE__ ? window.__INITIAL_STATE__.count : 0;

function updateUI() {
  const countDisplay = document.getElementById('count-display');
  if (countDisplay) {
    countDisplay.textContent = `Count: ${count}`;
  }
}

function hydrate() {
  const incrementButton = document.getElementById('increment-button');
  if (incrementButton) {
    incrementButton.addEventListener('click', () => {
      count++;
      updateUI();
    });
  }
  updateUI(); // Cập nhật UI lần đầu
  console.log('Client-side app hydrated and running.');
}

document.addEventListener('DOMContentLoaded', hydrate);
export { hydrate };