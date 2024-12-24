export class CursorPointer {
    constructor(game) {
        this.game = game;

        this.sprite = new this.game.SPRITE(
            this.game.sprites.cursor
        );
        this.sprite.origin_x = 0;
        this.sprite.origin_y = 0;

        this.x = 0;
        this.y = 0;
        this.down = false;

    }

    update() {
        let m = this.game.inputHandler.getMouse();

        this.x = m.x;
        this.y = m.y;

        this.sprite.x = m.x;
        this.sprite.y = m.y;

        if (m.down) {
            this.down = true;
            this.sprite.rotation = -0.1;
            this.sprite.scale = 0.8;
        } else {
            this.down = false;
            this.sprite.rotation = 0;
            this.sprite.scale = 0.85
        }

    }

    render() {
        this.sprite.render(this.game.ctx);
    }
}