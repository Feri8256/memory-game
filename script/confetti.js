class Particle {
    constructor(sprite, x, moveAnimation, fadeAnimation, rotateAnimation) {
        this.sprite = sprite;
        this.x = x;
        this.movement = moveAnimation;
        this.fading = fadeAnimation;
        this.rotation = rotateAnimation;
    }

    update(currentTime) {
        this.movement.update(currentTime);
        this.fading.update(currentTime);
        this.rotation.update(currentTime);

        this.sprite.x = this.x;
        this.sprite.y = this.movement.currentValue;
        this.sprite.opacity = this.fading.currentValue;
        this.sprite.rotation = this.rotation.currentValue;
    }

    render(ctx) {
        this.sprite.render(ctx);
    }
}

export class Celebration {
    constructor(game) {
        this.game = game;

        this.count = 100;
        this.durationMs = 1300;

        this.playing = false;
        this.startedAtMs = 0;
        this.currentTime = 0;

        this.particles = [];

        for (let i = 0; i < this.count; i++) {
            let spriteIndex = Math.floor(Math.random() * this.game.sprites.particles.length);
            let endTime = Math.floor(Math.random() * this.durationMs);
            let startY = Math.floor(Math.random() * (this.game.canvas.height * 0.5));
            let endY = startY + 100;
            let endRotate = (Math.random() * (Math.PI * 2)) - Math.PI;

            let sprite = new this.game.SPRITE(this.game.sprites.particles[spriteIndex]);
            sprite.additiveColor = true;
            sprite.scale = 0.3 + Math.random() * 0.85;

            let x = Math.random() * this.game.canvas.width;
            let f = new this.game.ANIMATION(0, endTime, 1, 0, this.game.EASINGS.Linear);
            let m = new this.game.ANIMATION(0, endTime, startY, endY, this.game.EASINGS.SineIn);
            let r = new this.game.ANIMATION(0, endTime, 0, endRotate, this.game.EASINGS.Linear);

            this.particles.push(
                new Particle(sprite, x, m, f, r)
            );
        }
    }

    update() {
        this.currentTime = this.game.clock - this.startedAtMs;
        if (!this.playing) return;
        if (this.currentTime > this.durationMs) this.playing = false;

        this.particles.forEach((p) => {
            p.update(this.currentTime);
        });
    }

    render() {
        if (!this.playing) return;
        this.particles.forEach((p) => {
            p.render(this.game.ctx);
        });
    }

    start() {
        this.playing = true;
        this.startedAtMs = this.game.clock;
        this.currentTime = 0;
    }
}