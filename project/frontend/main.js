// frontend/main.js
import './public/style.css'; // Import CSS

document.addEventListener('DOMContentLoaded', () => {
    const h1 = document.querySelector('h1');
    const fetchDataBtn = document.getElementById('fetchDataBtn');
    const dataMessage = document.getElementById('dataMessage');

    h1.textContent = 'Welcome to Bun + Vite App!';

    fetchDataBtn.addEventListener('click', async () => {
        dataMessage.textContent = 'Fetching data...';
        try {
            // 🌟🌟🌟 CHANGE THIS LINE 🌟🌟🌟
            const response = await fetch('http://localhost:3000/api/hello'); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            dataMessage.textContent = `Backend Says: "${data.message}"`;
            console.log('Data from backend:', data);
        } catch (error) {
            dataMessage.textContent = `Error: ${error.message}`;
            console.error('Error fetching data:', error);
        }
    });

    console.log('Frontend script loaded!');
});