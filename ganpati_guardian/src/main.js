import { Game } from './core/Game.js';
import './../style.css';

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('game-container');
    if (!container) {
        // Create container if it doesn't exist
        const app = document.getElementById('app');
        if (app) app.innerHTML = '';

        const newContainer = document.createElement('div');
        newContainer.id = 'game-container';
        document.body.appendChild(newContainer);

        const canvas = document.createElement('canvas');
        canvas.id = 'game-canvas';
        newContainer.appendChild(canvas);
        new Game(canvas);
    } else {
        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            new Game(canvas);
        } else {
            const newCanvas = document.createElement('canvas');
            newCanvas.id = 'game-canvas';
            container.appendChild(newCanvas);
            new Game(newCanvas);
        }
    }
});
