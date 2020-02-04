class Ball {

    constructor(positionX, positionY, state) {
        this.Speed = {
            x: state * 4,
            y: state * 4
        }
        this.position = {
            x: positionX,
            y: positionY
        };
        this.image = new Image();
        this.image.src = "images/whiteball.png";
        this.state = state;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, ballSize, ballSize);
    }

    update(paddle) {
        this.position.x += this.Speed.x;
        this.position.y += this.Speed.y;
        let paddleQuarter = paddle.position.x + paddle.width / 4;
        if (this.position.x >= GameWidth - ballSize || this.position.x <= 0)
            this.Speed.x = -this.Speed.x;
        if (this.position.y >= GameHieght)
            return 1;
        if (this.position.y <= 0)
            this.Speed.y = -this.Speed.y;
        //paddle collision
        if (this.position.y + ballSize >= paddle.position.y && this.position.x >= paddle.position.x && this.position.x + ballSize <= paddle.position.x + paddle.width) {
            if (paddle.Sticky == 0) {
                this.position.y = paddle.position.y - ballSize;
                this.Speed.y = -this.Speed.y;
                if (this.position.x >= 3 * paddleQuarter)
                    this.Speed.x += 1;
                else if (this.position.x < paddleQuarter)
                    this.Speed.x -= 1;
            } else {
                this.state = 0;
                this.Speed.x = 0;
                this.Speed.y = 0;
                this.position.y = paddle.position.y - ballSize;
            }

        }
    }

}