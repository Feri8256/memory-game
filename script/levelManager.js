export class LevelManager {
    constructor(game) {
        this.game = game;

        this.currentBoardSize = 2;

        this.game.board = new this.game.BOARD(this.game, this.currentBoardSize);
    }

    createNextLevel() {
        this.game.celebration.start();
        this.currentBoardSize += 2;
        this.game.board = new this.game.BOARD(this.game, this.currentBoardSize);
    }

}