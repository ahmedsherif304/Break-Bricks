class PowerUp {
    constructor(type, positionX, positionY) {
        this.position = {
            x: positionX,
            y: positionY
        }
        this.type = type;
        this.image = new Image();
        switch (type) {
            case 1:
                this.image.src = "images/two.png";
                break;
            case 2:
                this.image.src = "images/gun.png";
                break;
            case 3:
                this.image.src = "images/increaseSize.png";
                break;
            case 4:
                this.image.src = "images/decreaseSize.png";
                break;
            case 5:
                this.image.src = "images/red.png";
                break;
            case 6:
                this.image.src = "images/green.png";
                break;
            case 7:
                this.image.src = "images/magnet.png";
                break;
        }
        this.time = 0;
        this.active = 0;
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, powerUpSize, powerUpSize);
    }
    update(paddle) {
        this.position.y += 5;
        if (this.position.x + powerUpSize >= paddle.position.x && this.position.x <= paddle.position.x + paddle.width &&
            this.position.y + powerUpSize >= paddle.position.y && this.position.y <= paddle.position.y + PaddleHeight) {
            this.active = 1;
            return this.type;
        }
        if (this.position.y > GameHieght)
            return -1;
        return 0;
    }
    caught() {
        this.time++;
        if (this.time % 100 == 0 && this.type == 2) {
            return 2;
        }
        if (this.time > 400) {
            return 1;
        }

    }
}