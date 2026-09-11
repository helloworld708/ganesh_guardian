import { GameState, GAME_CONFIG, COLORS, COLLECTIBLES, POWERUPS } from './Constants.js';
import { Input } from './Input.js';
import { UIManager } from '../ui/UIManager.js';
import { Player } from '../entities/Player.js';
import { Collectible } from '../entities/Collectible.js';
import { Obstacle } from '../entities/Obstacle.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { ScoreSystem } from '../systems/ScoreSystem.js';
import { LevelManager } from '../systems/LevelManager.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { AudioManager } from '../systems/AudioManager.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = GAME_CONFIG.CANVAS_WIDTH;
        this.canvas.height = GAME_CONFIG.CANVAS_HEIGHT;

        this.input = new Input();
        this.ui = new UIManager(this);
        this.scoreSystem = new ScoreSystem();
        this.levelManager = new LevelManager();
        this.particles = new ParticleSystem();
        this.audio = new AudioManager();

        this.state = GameState.MENU;
        this.player = null;
        this.entities = [];
        this.lastTime = 0;
        this.lives = GAME_CONFIG.LIVES_START;
        this.shakeTime = 0;

        this.ui.showScreen(this.state);
        requestAnimationFrame(this.loop.bind(this));
    }

    setState(newState) {
        this.state = newState;
        this.ui.showScreen(this.state);

        if (this.state === GameState.PLAYING) {
            this.initLevel();
        }
    }

    initLevel() {
        this.player = new Player(this.input);
        this.entities = [];
        this.levelManager.startLevel();
    }

    restart() {
        this.lives = GAME_CONFIG.LIVES_START;
        this.scoreSystem.score = 0;
        this.scoreSystem.combo = 1;
        this.levelManager.currentLevelIndex = 0;
        this.setState(GameState.PLAYING);
    }

    nextLevel() {
        this.levelManager.nextLevel();
        this.setState(GameState.PLAYING);
    }

    toggleSound() {
        this.audio.toggle();
    }

    get soundEnabled() {
        return this.audio.enabled;
    }

    loop(timestamp) {
        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;

        if (this.state === GameState.PLAYING) {
            this.update(dt);
            this.draw();
        } else {
            this.drawBackground();
            this.draw(); // Draw static stuff if any
        }

        requestAnimationFrame(this.loop.bind(this));
    }

    update(dt) {
        this.player.update(dt);
        this.scoreSystem.update(dt);
        this.particles.update();

        if (this.shakeTime > 0) {
            this.shakeTime -= dt;
        }

        // Ambience: Floating petals
        if (Math.random() < 0.05) {
            this.particles.emit(
                Math.random() * GAME_CONFIG.CANVAS_WIDTH,
                -10,
                '#FFC0CB',
                1
            );
        }

        // Level management & spawning
        if (this.levelManager.update(dt)) {
            this.spawnRandomEntity();
        }

        // Update entities
        this.entities.forEach(e => e.update(dt));
        this.entities = this.entities.filter(e => e.active);

        // Collision detection
        this.entities.forEach(e => {
            if (CollisionSystem.check(this.player, e)) {
                if (e.isPowerUp) {
                    this.handlePowerUp(e);
                } else if (e instanceof Collectible) {
                    this.handleCollection(e);
                } else if (e instanceof Obstacle) {
                    this.handleHit(e);
                }
            }
        });

        // UI Update
        this.ui.updateHUD(
            this.scoreSystem.score,
            this.scoreSystem.combo,
            this.levelManager.levelTime,
            this.lives
        );

        // Win/Loss conditions
        if (this.lives <= 0) {
            this.gameOver();
        } else if (this.levelManager.levelTime <= 0) {
            this.levelComplete();
        }
    }

    spawnRandomEntity() {
        const level = this.levelManager.getCurrentLevel();

        // Decide what to spawn in this wave
        const rand = Math.random();

        // Calculate dynamic obstacle speed based on current score
        // Base speed * level multiplier + score bonus
        const currentObstacleSpeed = (GAME_CONFIG.OBSTACLE_SPEED_BASE * level.obstacleSpeed) + (this.scoreSystem.score * 0.02);

        if (rand < 0.4) {
            // Only collectibles wave
            for (let i = 0; i < 2; i++) {
                const x = Math.random() * (GAME_CONFIG.CANVAS_WIDTH - 40);
                const types = Object.values(COLLECTIBLES);
                const type = types[Math.floor(Math.random() * types.length)];
                const speed = GAME_CONFIG.COLLECTIBLE_SPEED_BASE * level.obstacleSpeed;
                this.entities.push(new Collectible(x, -50, type, speed));
            }
        } else if (rand < 0.8) {
            // Mixed wave: Obstacles and Collectibles together
            const obstacleX = Math.random() * (GAME_CONFIG.CANVAS_WIDTH - 60);
            this.entities.push(new Obstacle(obstacleX, -50, 60, 40, currentObstacleSpeed));

            // Spawn collectibles around the obstacle
            for (let i = 0; i < 2; i++) {
                const x = Math.random() * (GAME_CONFIG.CANVAS_WIDTH - 40);
                const types = Object.values(COLLECTIBLES);
                const type = types[Math.floor(Math.random() * types.length)];
                const colSpeed = GAME_CONFIG.COLLECTIBLE_SPEED_BASE * level.obstacleSpeed;
                this.entities.push(new Collectible(x, -50, type, colSpeed));
            }
        } else {
            // Obstacle only wave
            const x = Math.random() * (GAME_CONFIG.CANVAS_WIDTH - 60);
            this.entities.push(new Obstacle(x, -50, 80, 40, currentObstacleSpeed));
        }

        // Occasional PowerUp spawn regardless of wave
        if (Math.random() < 0.1) {
            const x = Math.random() * (GAME_CONFIG.CANVAS_WIDTH - 40);
            const pTypes = Object.values(POWERUPS);
            const type = pTypes[Math.floor(Math.random() * pTypes.length)];
            const pSpeed = GAME_CONFIG.COLLECTIBLE_SPEED_BASE * level.obstacleSpeed;
            const p = new Collectible(x, -50, { ...type, color: '#FFFFFF' }, pSpeed);
            p.isPowerUp = true;
            p.type = type;
            this.entities.push(p);
        }
    }

    handleCollection(e) {
        e.active = false;
        const points = this.scoreSystem.addPoints(e.type.value);
        this.particles.emit(e.centerX, e.centerY, e.color);
        this.audio.playCollect();
    }

    handlePowerUp(e) {
        e.active = false;
        this.audio.playPowerUp();
        this.particles.emit(e.centerX, e.centerY, '#FFFFFF', 20);

        if (e.type.id === 'blessing') {
            this.player.setInvincible(e.type.duration);
        } else if (e.type.id === 'golden_modak') {
            this.scoreSystem.score += e.type.value;
        } else if (e.type.id === 'modak_power') {
            // Modak Power: Temporary score multiplier
            this.scoreSystem.combo = Math.min(this.scoreSystem.combo + 2, this.scoreSystem.maxCombo);
        } else if (e.type.id === 'divine_bell') {
            // Divine Bell: Attract nearby collectibles
            this.entities.forEach(ent => {
                if (ent instanceof Collectible && !ent.isPowerUp) {
                    const dx = this.player.centerX - ent.centerX;
                    const dy = this.player.centerY - ent.centerY;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 200) {
                        ent.x += dx * 0.1;
                        ent.y += dy * 0.1;
                    }
                }
            });
        }
    }

    handleHit(e) {
        if (this.player.isInvincible) return;

        e.active = false;
        this.lives--;
        this.scoreSystem.resetCombo();
        this.particles.emit(this.player.centerX, this.player.centerY, '#FF0000', 20);
        this.audio.playHit();
        this.player.setInvincible(2000);
        this.shakeTime = 500; // Shake for 500ms
    }

    levelComplete() {
        const level = this.levelManager.getCurrentLevel();
        const stats = `
            Level: ${level.name}<br>
            Score: ${this.scoreSystem.score}<br>
            Best Combo: x${this.scoreSystem.maxComboReached}<br>
            Time Bonus: ${Math.ceil(this.levelManager.levelTime) * 10}
        `;
        this.ui.updateLevelComplete(stats);
        this.setState(GameState.LEVEL_COMPLETE);
    }

    gameOver() {
        this.scoreSystem.saveHighScore();
        const stats = `
            Final Score: ${this.scoreSystem.score}<br>
            Best Combo: x${this.scoreSystem.maxComboReached}<br>
            High Score: ${this.scoreSystem.highScore}
        `;
        this.ui.updateGameOver(stats);
        this.setState(GameState.GAME_OVER);
    }

    drawBackground() {
        const level = this.levelManager ? this.levelManager.getCurrentLevel() : { bg: COLORS.GOLD };
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        grad.addColorStop(0, level.bg);
        grad.addColorStop(1, COLORS.MAROON);
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw() {
        this.ctx.save();

        if (this.shakeTime > 0) {
            const intensity = 5;
            this.ctx.translate(
                (Math.random() - 0.5) * intensity,
                (Math.random() - 0.5) * intensity
            );
        }

        this.drawBackground();

        if (this.state === GameState.PLAYING) {
            this.entities.forEach(e => e.draw(this.ctx));
            this.player.draw(this.ctx);
            this.particles.draw(this.ctx);
        }

        this.ctx.restore();
    }
}
