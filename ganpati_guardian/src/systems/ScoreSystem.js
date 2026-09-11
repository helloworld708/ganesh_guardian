export class ScoreSystem {
    constructor() {
        this.score = 0;
        this.combo = 1;
        this.maxComboReached = 1;
        this.comboTimer = 0;
        this.maxCombo = 5;
        this.highScore = localStorage.getItem('ganpati_high_score') || 0;
    }

    addPoints(baseValue, dt) {
        const points = baseValue * this.combo;
        this.score += points;
        this.incrementCombo();
        return points;
    }

    incrementCombo() {
        this.combo = Math.min(this.combo + 1, this.maxCombo);
        if (this.combo > this.maxComboReached) {
            this.maxComboReached = this.combo;
        }
        this.comboTimer = 2000; // Reset combo timer to 2 seconds
    }

    update(dt) {
        if (this.comboTimer > 0) {
            this.comboTimer -= dt;
            if (this.comboTimer <= 0) {
                this.combo = 1;
            }
        }
    }

    resetCombo() {
        this.combo = 1;
        this.comboTimer = 0;
    }

    saveHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('ganpati_high_score', this.highScore);
        }
    }
}
