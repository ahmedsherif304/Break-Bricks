class Paddle {
    constructor(GameWidth, GameHeight) {
        this.speed = 0;
        this.MaxSpeed = 5;
        this.width = 150;
        this.height = 20;
        this.position = {
            x: GameWidth / 2 - this.width / 2,
            y: GameHeight - this.height * 2
        }
        this.Sticky = 0;
    }



    draw(ctx) {
        ctx.fillStyle = "#F0F";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    release() {
        for (var i = 0; i < Balls.length; i++) {
            if (Balls[i] != null && Balls[i].state == 0) {
                Balls[i].state = 1;
                Balls[i].Speed.x = ballInitialSpeed;
                Balls[i].Speed.y = ballInitialSpeed;
                if (Balls[i].position.x > GameWidth / 2) {
                    Balls[i].Speed.x = -ballInitialSpeed;
                    Balls[i].Speed.y = ballInitialSpeed;
                }
            }

        }
    }

    Update() {
        this.position.x += this.speed;
        if (this.position.x <= 5)
            this.position.x = 5;
        else if (this.position.x >= GameWidth - this.width - 5)
            this.position.x = GameWidth - this.width - 5;
        else {
            for (var i = 0; i < Balls.length; i++) {
                if (Balls[i] != null && Balls[i].state == 0)
                    Balls[i].position.x += this.speed;

            }
        }

    }

}