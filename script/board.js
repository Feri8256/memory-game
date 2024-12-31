export class Board {
    /**
     * Manages the game's main logic
     * @param {*} game that
     * @param {*} size Width and height of the board
     */
    constructor(game, size) {
        this.game = game;

        this.firstClick = true;
        this.firstClickAtMs = 0;

        this.size = size ?? 2;
        this.renderWidth = this.game.canvas.width;
        this.gridSizePx = this.renderWidth / this.size;

        this.selections = [];

        this.cards = [];
        this.symbols = [];
        let symbol = 0;
        //Creating an array of symbols an shuffle them
        for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
            let r = [];
            for (let columnIndex = 0; columnIndex < this.size; columnIndex++) {
                r.push(symbol);

                if (columnIndex === size - 1) symbol++; // Fill a row with just one symbol then change it
                if (symbol > this.game.sprites.symbols.length - 1) symbol = 0;
            }

            this.symbols.push(r);
        }

        this.symbols = this.shuffle(this.symbols);

        // Creating the cards with the randomized symbols
        for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {

            let r = [];
            for (let columnIndex = 0; columnIndex < this.size; columnIndex++) {
                r.push(
                    new this.game.CARD(
                        this.game,
                        this.symbols[rowIndex][columnIndex],
                        this.gridSizePx * columnIndex,
                        this.gridSizePx * rowIndex,
                        this.gridSizePx
                    )
                );
            }

            this.cards.push(r);
        }
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
        if (this.firstClick) {
            this.firstClickAtMs = this.game.clock;
            this.firstClick = false;
        }

        // Converting cursor coordinates to corresponding indexes in the cards array
        let xIndex = this.minmax(Math.trunc(this.game.pointer.x / this.gridSizePx), 0, this.size - 1);
        let yIndex = this.minmax(Math.trunc(this.game.pointer.y / this.gridSizePx), 0, this.size - 1);

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
                this.cards[aSelect.yi][aSelect.xi].despawn();
                this.cards[bSelect.yi][bSelect.xi].despawn();
            } else {
                // No match, unselect
                this.cards[aSelect.yi][aSelect.xi].unselect(true);
                this.cards[bSelect.yi][bSelect.xi].unselect(true);
            }

            // Clear the selection accumulator
            this.selections.length = 0;

            // When all cards despawned, the game is finished
            let b = [].concat(...this.cards).findIndex((c) => { return !c.despawned }) === -1;
            if (b) {
                //this.game.levelManager.createNextLevel();
                this.game.gameEnd.start(this.game.clock - this.firstClickAtMs);
                console.log(this.game.clock - this.firstClickAtMs);
            } 
        }
    }

    minmax(x, min, max) {
        return Math.max(min, Math.min(x, max));
    }

    /**
     * Array shuffle algorithm based on: https://stackoverflow.com/questions/52241641/shuffling-multidimensional-array-in-js and https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
     * @param {Array[]} arr array to be shuffled
     * @returns {Array[]} shuffled array
     */
    shuffle(arr) {
        for (let k = 0; k < arr.length; k++) {
            let i = arr[k].length;
            while (i--) {
                let j = Math.floor(Math.random() * arr.length);
                let tempi = arr[i][k];
                let tempj = arr[j][k];
                arr[i][k] = tempj;
                arr[j][k] = tempi;
            }
        }
        return arr;
    }
}