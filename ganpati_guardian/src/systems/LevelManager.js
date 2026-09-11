import { LEVELS, GAME_CONFIG } from '../core/Constants.js';

export class LevelManager {
    constructor() {
        this.currentLevelIndex = 0;
        this.levelTime = 0;
        this.spawnTimer = 0;
    }

    getCurrentLevel() {
        return LEVELS[this.currentLevelIndex];
    }

    startLevel() {
        const level = this.getCurrentLevel();
        this.levelTime = level.duration;
        this.spawnTimer = 0;
    }

    update(dt) {
        this.levelTime -= dt / 1000;
        this.spawnTimer += dt;

        const level = this.getCurrentLevel();
        const spawnInterval = GAME_CONFIG.SPAWN_RATE_BASE * level.spawnRate;

        if (this.spawnTimer >= spawnInterval) {
            this.spawnTimer = 0;
            return true; // Signal that it's time to spawn
        }
        return false;
    }

    nextLevel() {
        this.currentLevelIndex++;
        if (this.currentLevelIndex >= LEVELS.length) {
            this.currentLevelIndex = 0; // Loop or handle end
        }
        this.startLevel();
    }
}
