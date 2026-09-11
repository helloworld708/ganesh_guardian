import { Entity } from './Entity.js';
import { GAME_CONFIG, COLORS } from '../core/Constants.js';

export class Player extends Entity {
    constructor(input) {
        super(GAME_CONFIG.CANVAS_WIDTH / 2 - GAME_CONFIG.PLAYER_SIZE / 2,
               GAME_CONFIG.CANVAS_HEIGHT - 100 - GAME_CONFIG.PLAYER_SIZE,
               GAME_CONFIG.PLAYER_SIZE,
               GAME_CONFIG.PLAYER_SIZE,
               COLORS.SAFFRON);

        this.input = input;
        this.vx = 0;
        this.vy = 0;
        this.friction = 0.8;
        this.acceleration = 1.2;

        this.isInvincible = false;
        this.invincibilityTimer = 0;
        this.bobTimer = 0;
    }

    update(dt) {
        const move = this.input.getMovementVector();

        this.vx += move.vx * this.acceleration;
        this.vy += move.vy * this.acceleration;

        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;

        // Boundary checks
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > GAME_CONFIG.CANVAS_WIDTH) this.x = GAME_CONFIG.CANVAS_WIDTH - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > GAME_CONFIG.CANVAS_HEIGHT) this.y = GAME_CONFIG.CANVAS_HEIGHT - this.height;

        // Animation timers
        this.bobTimer += dt * 0.005;

        if (this.isInvincible) {
            this.invincibilityTimer -= dt;
            if (this.invincibilityTimer <= 0) this.isInvincible = false;
        }
    }

    draw(ctx) {
        ctx.save();

        // Bobbing effect
        const bob = Math.sin(this.bobTimer) * 5;
        ctx.translate(0, bob);

        // Divine Glow
        if (this.isInvincible) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = COLORS.GOLD;
        }

        // Stylized Ganesha Shape (simplified as an oval/circle composite)
        ctx.fillStyle = this.color;

        // Body
        ctx.beginPath();
        ctx.ellipse(this.centerX, this.centerY, this.width/2, this.height/2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.beginPath();
        ctx.arc(this.centerX, this.y + 10, this.width/3, 0, Math.PI * 2);
        ctx.fill();

        // Trunk
        ctx.beginPath();
        ctx.lineWidth = 6;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.centerX, this.y + 10);
        ctx.quadraticCurveTo(this.centerX + 10, this.y + 20, this.centerX, this.y + 30);
        ctx.stroke();

        ctx.restore();
    }

    setInvincible(duration) {
        this.isInvincible = true;
        this.invincibilityTimer = duration;
    }
}
