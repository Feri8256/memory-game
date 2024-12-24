export class Board {
    /**
     * Manages the game's main logic
     * @param {*} game 
     * @param {*} size 
     */
    constructor(game, size) {
        this.game = game;

        this.size = size ?? 2;
        this.gridSizePx = this.game.canvas.width / this.size;

        this.cards = [];

        this.selections = [];

        for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {

            let r = [];
            for (let columnIndex = 0; columnIndex < this.size; columnIndex++) {
                r.push(
                    new this.game.CARD(
                        this.game,
                        0,
                        this.gridSizePx * columnIndex,
                        this.gridSizePx * rowIndex,
                        this.gridSizePx
                    )
                );
            }

            this.cards.push(r);
        }

        console.log(this.cards, this.gridSizePx);
    }

    update() {
        for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.size; columnIndex++) {
                this.cards[rowIndex][columnIndex].update();
            }
        }
    }

    render() {
        for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.size; columnIndex++) {
                this.cards[rowIndex][columnIndex].render();
            }
        }
    }

    click() {
        // Converting cursor coordinates to corresponding indexes in the cards array
        let xIndex = Math.trunc(this.minmax(this.game.pointer.x, 0, this.game.canvas.width - 1) / this.gridSizePx);
        let yIndex = Math.trunc(this.minmax(this.game.pointer.y, 0, this.game.canvas.height - 1) / this.gridSizePx);

        // You can't select a card that is already despawned
        if (this.cards[yIndex][xIndex].despawned) return;

        // Add the index to the selection accumulator, and perform select on the card itself
        this.selections.push({ xi: xIndex, yi: yIndex });
        this.cards[yIndex][xIndex].select();

        // When we have two cards selected
        if (this.selections.length === 2) {
            let aSelect = this.selections.at(0);
            let bSelect = this.selections.at(1);

            // When the two selections are equal, it means undoing the selection
            if (aSelect.xi === bSelect.xi && aSelect.yi === bSelect.yi) {
                this.cards[aSelect.yi][aSelect.xi].unselect();
                this.selections.length = 0;
                return;
            }

            let aCard = this.cards[aSelect.yi][aSelect.xi];
            let bCard = this.cards[bSelect.yi][bSelect.xi];

            // Check for symbol match, and despawn
            if (aCard.symbolId === bCard.symbolId) {
                console.log("match!");
                this.cards[aSelect.yi][aSelect.xi].despawn();
                this.cards[bSelect.yi][bSelect.xi].despawn();
            } else {
                // No match, unselect
                this.cards[aSelect.yi][aSelect.xi].unselect();
                this.cards[bSelect.yi][bSelect.xi].unselect();
                console.log("no match");
            }

            // Clear the selection accumulator
            this.selections.length = 0;
        }
    }

    minmax(x, min, max) {
        return Math.max(min, Math.min(x, max));
    }
}