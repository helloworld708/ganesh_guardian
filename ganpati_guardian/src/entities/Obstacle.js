import { Entity } from './Entity.js';
import { COLORS } from '../core/Constants.js';

export class Obstacle extends Entity {
    constructor(x, y, width, height, speed) {
        super(x, y, width, height, COLORS.MAROON);
        this.speed = speed;
    }

    update(dt) {
        this.y += this.speed * (dt / 1000);
        if (this.y > 640) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;

        // Draw as a cart/barrier
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Add some detail to make it look like a cart
        ctx.fillStyle = COLORS.GOLD;
        ctx.fillRect(this.x + 5, this.y + this.height - 10, 10, 10);
        ctx.fillRect(this.x + this.width - 15, this.y + this.height - 10, 10, 10);

        ctx.restore();
    }
}
