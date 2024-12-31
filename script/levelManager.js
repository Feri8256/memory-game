export class LevelManager {
    constructor(game) {
        this.game = game;

        this.currentBoardSize = 2;
        this.currentLevel = 1;

        this.board = new this.game.BOARD(this.game, this.currentBoardSize);
    }

    createNextLevel() {
        //this.game.celebration.start();
        this.currentLevel += 1;
        this.currentBoardSize = this.currentLevel * 2;
        this.board = new this.game.BOARD(this.game, this.currentBoardSize);
    }

}