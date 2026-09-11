import { GameState } from '../core/Constants.js';

export class UIManager {
    constructor(game) {
        this.game = game;
        this.initUI();
    }

    initUI() {
        // Main Overlay Container
        this.overlay = document.createElement('div');
        this.overlay.id = 'game-overlay';
        this.overlay.style.position = 'absolute';
        this.overlay.style.top = '0';
        this.overlay.style.left = '0';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        this.overlay.style.display = 'flex';
        this.overlay.style.justifyContent = 'center';
        this.overlay.style.alignItems = 'center';
        this.overlay.style.zIndex = '10';
        this.overlay.style.fontFamily = '"Segoe UI", Roboto, Helvetica, Arial, sans-serif';
        this.overlay.style.color = 'white';
        this.overlay.style.pointerEvents = 'none';
        document.body.appendChild(this.overlay);

        // HUD
        this.hud = document.createElement('div');
        this.hud.id = 'game-hud';
        this.hud.style.position = 'absolute';
        this.hud.style.top = '20px';
        this.hud.style.left = '0';
        this.hud.style.width = '100%';
        this.hud.style.display = 'none';
        this.hud.style.justifyContent = 'space-around';
        this.hud.style.pointerEvents = 'none';
        this.hud.style.fontSize = '20px';
        this.hud.style.fontWeight = 'bold';
        this.hud.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        this.hud.style.zIndex = '5';
        this.hud.innerHTML = `
            <div>Score: <span id="hud-score">0</span></div>
            <div>Combo: <span id="hud-combo">x1</span></div>
            <div>Time: <span id="hud-time">60</span>s</div>
            <div>Lives: <span id="hud-lives">3</span></div>
        `;
        document.body.appendChild(this.hud);

        this.createMenus();
    }

    createMenus() {
        this.screens = {};

        // START MENU
        this.screens.MENU = this.createScreen('menu-screen', `
            <div style="text-align:center; background: rgba(0,0,0,0.7); padding: 40px; border-radius: 20px; border: 4px solid #FFD700; pointer-events: auto;">
                <h3 style="color: #FF9933; margin-bottom: 10px;">🙏 Ganpati Bappa Morya! 🙏</h3>
                <h1 style="font-size: 32px; margin-bottom: 30px; color: #FFD700;">GANPATI:<br>THE FESTIVAL GUARDIAN</h1>
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <button class="menu-btn" id="btn-play">▶ PLAY</button>
                    <button class="menu-btn" id="btn-how">❓ HOW TO PLAY</button>
                    <button class="menu-btn" id="btn-high">🏆 HIGH SCORE</button>
                    <button class="menu-btn" id="btn-sound">🔊 SOUND ON</button>
                </div>
            </div>
        `);

        // HOW TO PLAY
        this.screens.HOW_TO_PLAY = this.createScreen('how-screen', `
            <div style="text-align:center; background: rgba(0,0,0,0.8); padding: 30px; border-radius: 20px; border: 4px solid #FF9933; pointer-events: auto; max-width: 80%;">
                <h2 style="color: #FFD700;">How to Play</h2>
                <div style="text-align: left; line-height: 1.6; margin-bottom: 20px;">
                    <p>🏃 <b>Move:</b> Arrow Keys / WASD or Touch</p>
                    <p>🍬 <b>Collect:</b> Modaks, Flowers, and Diyas for points!</p>
                    <p>⚠️ <b>Avoid:</b> Carts and barriers to stay safe</p>
                    <p>✨ <b>Combo:</b> Collect items quickly to multiply your score!</p>
                    <p>🌟 <b>Power-ups:</b> Use Divine Blessings for invincibility</p>
                </div>
                <button class="menu-btn" id="btn-back">BACK</button>
            </div>
        `);

        // LEVEL COMPLETE
        this.screens.LEVEL_COMPLETE = this.createScreen('complete-screen', `
            <div style="text-align:center; background: rgba(0,0,0,0.8); padding: 40px; border-radius: 20px; border: 4px solid #FFD700; pointer-events: auto;">
                <h2 style="color: #FFD700; font-size: 32px;">🎉 Jai Ganesh! 🎉</h2>
                <div id="level-stats" style="margin: 20px 0; font-size: 20px; line-height: 2;"></div>
                <button class="menu-btn" id="btn-next">NEXT LEVEL</button>
            </div>
        `);

        // GAME OVER
        this.screens.GAME_OVER = this.createScreen('over-screen', `
            <div style="text-align:center; background: rgba(0,0,0,0.8); padding: 40px; border-radius: 20px; border: 4px solid #B22222; pointer-events: auto;">
                <h2 style="color: #FF9933; font-size: 32px;">🙏 The celebration awaits your return! 🙏</h2>
                <div id="final-stats" style="margin: 20px 0; font-size: 20px; line-height: 2;"></div>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button class="menu-btn" id="btn-restart">🔄 PLAY AGAIN</button>
                    <button class="menu-btn" id="btn-home">🏠 HOME</button>
                </div>
            </div>
        `);

        this.setupEventListeners();
    }

    createScreen(id, html) {
        const div = document.createElement('div');
        div.id = id;
        div.style.display = 'none';
        div.innerHTML = html;
        this.overlay.appendChild(div);
        return div;
    }

    setupEventListeners() {
        const bind = (id, fn) => {
            const el = document.getElementById(id);
            if (el) el.onclick = fn;
        };

        bind('btn-play', () => this.game.setState(GameState.PLAYING));
        bind('btn-how', () => this.game.setState(GameState.HOW_TO_PLAY));
        bind('btn-back', () => this.game.setState(GameState.MENU));
        bind('btn-next', () => this.game.nextLevel());
        bind('btn-restart', () => this.game.restart());
        bind('btn-home', () => this.game.setState(GameState.MENU));
        bind('btn-sound', () => {
            const btn = document.getElementById('btn-sound');
            this.game.toggleSound();
            btn.innerText = this.game.soundEnabled ? '🔊 SOUND ON' : '🔇 SOUND OFF';
        });
        bind('btn-high', () => {
            const high = localStorage.getItem('ganpati_high_score') || 0;
            alert('🏆 High Score: ' + high);
        });
    }

    updateHUD(score, combo, time, lives) {
        document.getElementById('hud-score').innerText = score;
        document.getElementById('hud-combo').innerText = 'x' + combo;
        document.getElementById('hud-time').innerText = Math.ceil(time);
        document.getElementById('hud-lives').innerText = lives;
    }

    showScreen(state) {
        Object.values(this.screens).forEach(s => s.style.display = 'none');
        this.hud.style.display = 'none';

        if (this.screens[state]) {
            this.screens[state].style.display = 'block';
        }

        if (state === GameState.PLAYING) {
            this.hud.style.display = 'flex';
        }
    }

    updateLevelComplete(stats) {
        document.getElementById('level-stats').innerHTML = stats;
    }

    updateGameOver(stats) {
        document.getElementById('final-stats').innerHTML = stats;
    }
}
