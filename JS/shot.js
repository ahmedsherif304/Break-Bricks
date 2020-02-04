class Shot {
    constructor(positionX) {
        this.position = {
            x: positionX,
            y: GameHieght - 2 * PaddleHeight - shotSize
        };
    }
    draw(ctx) {
        ctx.fillStyle = "#000";
        ctx.fillRect(this.position.x, this.position.y, shotSize / 2, shotSize);
    }
    update() {
        this.position.y -= 10;
        if (this.position.y <= 0)
            return 1;
    }
}