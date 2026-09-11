export class AudioManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
    }

    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.ctx.suspend();
        } else {
            this.ctx.resume();
        }
    }

    playTone(freq, type, duration) {
        if (!this.enabled) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playCollect() {
        this.playTone(880, 'sine', 0.1);
    }

    playPowerUp() {
        this.playTone(1200, 'square', 0.2);
    }

    playHit() {
        this.playTone(150, 'sawtooth', 0.3);
    }

    playWin() {
        this.playTone(523.25, 'sine', 0.1);
        setTimeout(() => this.playTone(659.25, 'sine', 0.1), 100);
        setTimeout(() => this.playTone(783.99, 'sine', 0.2), 200);
    }
}
