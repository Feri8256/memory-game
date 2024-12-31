export class GameEndView {
    constructor(game) {
        this.game = game;

        this.centerX = this.game.canvas.width * 0.5;
        this.centerY = this.game.canvas.height * 0.5;
        this.light = new this.game.SPRITE(this.game.sprites.light);
        this.light.x = this.centerX;
        this.light.y = this.centerY;
        this.light.additiveColor = true;

        this.lightRotator = new this.game.ANIMATION(0, 20000, 0, Math.PI * 2, this.game.EASINGS.Linear, true);

        this.active = false;
        this.startedAtMs = 0;
        this.currentFading = 0;

        this.completedText = "";
        this.timeText = "";
        this.continueText = this.game.STRINGS.clickToContinue;
        this.completedFading = 0;
        this.completedScaling = 1;
        this.timeFading = 0;
        this.timeMoveY = 0;

        this.timeline = new this.game.TL();
        this.timeline.appendAnimation(
            new this.game.ANIMATION(
                0,
                500,
                0,
                1,
                this.game.EASINGS.Linear,
                false,
                "main_fading"
            )
        )
        this.timeline.appendAnimation(
            new this.game.ANIMATION(
                0,
                500,
                5,
                1,
                this.game.EASINGS.BackOut,
                false,
                "completed_text_scaling"
            )
        )
        this.timeline.appendAnimation(
            new this.game.ANIMATION(
                0,
                500,
                0,
                0,
                this.game.EASINGS.Linear,
                false,
                "time_text_fading"
            )
        )
        this.timeline.appendAnimation(
            new this.game.ANIMATION(
                500,
                750,
                0,
                1,
                this.game.EASINGS.SineOut,
                false,
                "time_text_fading"
            )
        )
        this.timeline.appendAnimation(
            new this.game.ANIMATION(
                500,
                750,
                this.centerY,
                this.game.canvas.height - 200,
                this.game.EASINGS.SineOut,
                false,
                "time_text_moveY"
            )
        )
    }

    update() {
        this.lightRotator.update(this.game.clock);
        this.light.rotation = this.lightRotator.currentValue;

        this.timeline.update(this.game.clock);
        if (this.active) {
            this.currentFading = this.timeline.getValueOf("main_fading") ?? 1;
        } else {
            this.currentFading = 0;
        }

        this.completedScaling = this.timeline.getValueOf("completed_text_scaling") ?? 1;

        this.timeFading = this.timeline.getValueOf("time_text_fading") ?? 1;
        this.timeMoveY = this.timeline.getValueOf("time_text_moveY") ?? this.game.canvas.height - 200;

        this.light.opacity = this.currentFading;
        this.completedFading = this.currentFading;
    }

    render() {
        if (!this.active) return;

        this.light.render(this.game.ctx);
        this.renderCompletedText();
        this.renderContinueText();
        this.renderTimeText()
    }

    timeStringFormatter(ms) {
        let d = new Date(ms);
        this.timeText = this.game.STRINGS.levelTime.replace("MIN", d.getMinutes()).replace("SEC", d.getSeconds()).replace("MS", d.getMilliseconds());
    }

    start(levelTimeMs) {
        this.active = true;
        this.startedAtMs = this.game.clock;

        this.timeStringFormatter(levelTimeMs);

        this.completedText = this.game.STRINGS.levelCompleted.replace("0", this.game.levelManager.currentLevel);
        this.timeline.play();
        this.game.celebration.start();
    }

    click() {
        if (!this.active) return;
        if (this.game.clock < this.startedAtMs + 500) return;
        this.active = false;
        this.game.levelManager.createNextLevel();
    }

    renderCompletedText() {
        this.game.ctx.save();
        this.game.ctx.translate(this.centerX, this.centerY);
        this.game.ctx.globalAlpha = this.completedFading;
        this.game.ctx.scale(this.completedScaling, this.completedScaling);
        this.game.ctx.fillStyle = "#fff";
        this.game.ctx.strokeStyle = "#000";
        this.game.ctx.font = "64px Arial";
        this.game.ctx.textAlign = "center";
        this.game.ctx.fillText(this.completedText, 0, 0);
        this.game.ctx.strokeText(this.completedText, 0, 0);
        this.game.ctx.resetTransform();
        this.game.ctx.restore();
    }

    renderContinueText() {
        this.game.ctx.save();
        this.game.ctx.translate(this.centerX, this.game.canvas.height - 10);
        this.game.ctx.globalAlpha = this.currentFading;
        this.game.ctx.fillStyle = "#fff";
        this.game.ctx.strokeStyle = "#000";
        this.game.ctx.font = "24px Arial";
        this.game.ctx.textAlign = "center";
        this.game.ctx.fillText(this.continueText, 0, 0);
        this.game.ctx.strokeText(this.continueText, 0, 0);
        this.game.ctx.resetTransform();
        this.game.ctx.restore();
    }

    renderTimeText() {
        this.game.ctx.save();
        this.game.ctx.translate(this.centerX, this.timeMoveY);
        this.game.ctx.globalAlpha = this.timeFading;
        this.game.ctx.fillStyle = "#fff";
        this.game.ctx.strokeStyle = "#000";
        this.game.ctx.font = "32px Arial";
        this.game.ctx.textAlign = "center";
        this.game.ctx.fillText(this.timeText, 0, 0);
        this.game.ctx.strokeText(this.timeText, 0, 0);
        this.game.ctx.resetTransform();
        this.game.ctx.restore();
    }
} 