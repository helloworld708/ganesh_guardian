export class Input {
    constructor() {
        this.keys = {};
        this.touchX = null;
        this.touchY = null;
        this.isTouching = false;

        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        window.addEventListener('touchstart', (e) => {
            this.isTouching = true;
            this.updateTouch(e);
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            this.updateTouch(e);
        }, { passive: false });

        window.addEventListener('touchend', () => {
            this.isTouching = false;
            this.touchX = null;
            this.touchY = null;
        });
    }

    updateTouch(e) {
        if (e.touches.length > 0) {
            this.touchX = e.touches[0].clientX;
            this.touchY = e.touches[0].clientY;
        }
    }

    isKeyDown(code) {
        return !!this.keys[code];
    }

    getMovementVector() {
        let vx = 0;
        let vy = 0;

        if (this.isKeyDown('ArrowLeft') || this.isKeyDown('KeyA')) vx -= 1;
        if (this.isKeyDown('ArrowRight') || this.isKeyDown('KeyD')) vx += 1;
        if (this.isKeyDown('ArrowUp') || this.isKeyDown('KeyW')) vy -= 1;
        if (this.isKeyDown('ArrowDown') || this.isKeyDown('KeyS')) vy += 1;

        if (this.isTouching && this.touchX !== null && this.touchY !== null) {
            // We'll handle touch differently in Player.js or by calculating
            // a vector from a center point. For now, we prioritize keys.
        }

        return { vx, vy };
    }

    getTouchPosition() {
        return { x: this.touchX, y: this.touchY, isTouching: this.isTouching };
    }
}
