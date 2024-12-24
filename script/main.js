import { Sprite, SpriteImage } from "./sprite.js";
import { EASING, Timeline, Animation } from "./animationEngine.js"
import { InputHandler } from "./InputHandler.js";

import { Card } from "./card.js";
import { Board } from "./board.js";
import { CursorPointer } from "./cursor.js";



var game = null;

class Game {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.canvas.width = 512;
        this.canvas.height = 512;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = "high";

        this.clock = 0;

        this.sprites = {
            card_back: new SpriteImage("img/cardback.png"),
            card_face: new SpriteImage("img/card.png"),
            cursor: new SpriteImage("img/cursor.png"),
            symbols: [
                new SpriteImage("img/s0.png"),
                new SpriteImage("img/s1.png"),
                new SpriteImage("img/s2.png")
            ]
        };

        this.inputHandler = new InputHandler(true);

        this.EASINGS = EASING;
        this.ANIMATION = Animation;
        this.TL = Timeline;

        this.SPRITE = Sprite;

        this.CARD = Card;
        this.pointer = new CursorPointer(this);
        this.board = new Board(this, 4);


        this.inputHandler.onMousedown = () => {
            this.board.click();
        }
    }

    update(timestamp) {
        this.clock = timestamp;

        this.board.update();

        this.pointer.update();
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.board.render();

        this.pointer.render();
    }
    
}

function mainLoop(timestamp) {

    game.update(timestamp);

    game.render();
    
    requestAnimationFrame(mainLoop);
}

window.addEventListener("DOMContentLoaded", () => {
    game = new Game();
    requestAnimationFrame(mainLoop);
});