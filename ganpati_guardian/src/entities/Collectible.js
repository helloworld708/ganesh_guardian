import { Entity } from './Entity.js';
import { COLLECTIBLES } from '../core/Constants.js';

export class Collectible extends Entity {
    constructor(x, y, type, speed = 200) {
        super(x, y, 25, 25, type.color);
        this.type = type;
        this.speed = speed;
        this.bobOffset = Math.random() * Math.PI * 2;
        this.bobTimer = 0;
    }

    update(dt) {
        this.bobTimer += dt * 0.005;

        // Move downwards
        this.y += this.speed * (dt / 1000);

        // Add a slight side-to-side bobbing effect
        this.x += Math.sin(this.bobTimer + this.bobOffset) * 0.5;

        if (this.y > 640) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        ctx.fillStyle = this.color;

        // Draw based on type
        if (this.type.id === 'modak') {
            // Modak shape (triangle-ish)
            ctx.beginPath();
            ctx.moveTo(this.centerX, this.y);
            ctx.lineTo(this.x + this.width, this.y + this.height);
            ctx.lineTo(this.x, this.y + this.height);
            ctx.closePath();
            ctx.fill();
        } else if (this.type.id === 'flower') {
            // Flower (circle)
            ctx.beginPath();
            ctx.arc(this.centerX, this.centerY, this.width/2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Default square
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        ctx.restore();
    }
}
