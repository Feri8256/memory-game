export class Card {
    constructor(game, symbolId, x, y, gridSizePx) {
        this.effectDurationMs = 300;

        this.game = game;
        this.symbolId = symbolId ?? 0;

        this.selected = false;
        this.despawned = false;

        this.x = x;
        this.y = y;
        this.gridSizePx = gridSizePx;

        this.gridCenterX = this.x + (this.gridSizePx * 0.5);
        this.gridCenterY = this.y + (this.gridSizePx * 0.5);

        this.cardSizePx = 256;
        this.cardScale = this.gridSizePx / this.cardSizePx;

        this.currentScale = this.cardScale;

        this.backSide = new this.game.SPRITE(
            this.game.sprites.card_back
        );
        this.backSide.x = this.gridCenterX;
        this.backSide.y = this.gridCenterY;
        this.backSide.scale = this.cardScale;
        this.backSide.opacity = 0.5;

        this.symbol = new this.game.SPRITE(
            this.game.sprites.symbols[this.symbolId]
        );
        this.symbol.x = this.gridCenterX;
        this.symbol.y = this.gridCenterY;
        this.symbol.scale = this.cardScale;

        this.despawnAnimation = new this.game.ANIMATION(
            0,
            0,
            this.cardScale,
            this.cardScale,
            this.game.EASINGS.Linear
        );

        this.selectAnimation = new this.game.TL();
        this.selectAnimation.appendAnimation(
            new this.game.ANIMATION(
                0,
                this.effectDurationMs,
                -1,
                1,
                this.game.EASINGS.SineInOut,
                false,
                "cvx"
            )
        );
        this.selectAnimation.appendAnimation(
            new this.game.ANIMATION(
                0,
                this.effectDurationMs* 0.5,
                0,
                0,
                this.game.EASINGS.SineIn,
                false,
                "svx"
            )
        );
        this.selectAnimation.appendAnimation(
            new this.game.ANIMATION(
                this.effectDurationMs* 0.5,
                this.effectDurationMs,
                0,
                1,
                this.game.EASINGS.SineIn,
                false,
                "svx"
            )
        );
    }

    update() {
        this.selectAnimation.update(this.game.clock);
        this.despawnAnimation.update(this.game.clock);
        this.currentScale = this.despawnAnimation.currentValue;

        this.backSide.scale = this.currentScale;
        this.backSide.scale_x = this.selectAnimation.getValueOf("cvx") ?? 1;

        this.symbol.scale = this.currentScale;
        this.symbol.scale_x = this.selectAnimation.getValueOf("svx") ?? 1;

    }

    render() {
        this.backSide.render(this.game.ctx);

        if (this.selected) this.symbol.render(this.game.ctx);

    }

    despawn() {
        this.despawned = true;
        this.despawnAnimation = new this.game.ANIMATION(
            this.game.clock + this.effectDurationMs,
            this.game.clock + this.effectDurationMs*2,
            this.cardScale,
            0,
            this.game.EASINGS.BackIn
        );
    }

    select() {
        this.selected = true;
        this.selectAnimation.play();
    }

    unselect() {
        this.selected = false;
        this.selectAnimation.play();
        console.log("unselected");
    }
}