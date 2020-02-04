class Brick {
    constructor(type) {
        this.type = type;
        this.width = parseInt(GameWidth / bricksInRow);
        this.height = parseInt(MaxHeightOfBlocks / bricksColumn);
    }

    draw(ctx, index) {
        let Y = this.height * parseInt(index / bricksInRow);
        let X = (index % bricksInRow) * this.width;
        //draw Liner Gradient Rectangle 
        ctx.fillStyle = "#000";
        let grd = ctx.createLinearGradient(X, Y, X + this.width, Y + this.height);

        if (this.type == 1) {
            grd.addColorStop(0, "cyan");
            grd.addColorStop(1, "grey");
        } else if (this.type == 2) {
            grd.addColorStop(0, "gold");
            grd.addColorStop(0.5, "orange");
            grd.addColorStop(1, "grey");
        }
        ctx.fillStyle = grd;
        ctx.fillRect(X, Y, this.width, this.height);
    }
    collision(ball, index) {
        let Y = this.height * parseInt(index / bricksInRow);
        let X = (index % bricksInRow) * this.width;
        if (((ball.position.x + ballSize >= X && ball.position.x + ballSize <= X + Math.abs(ball.Speed.x)) ||
                (ball.position.x <= X + this.width && ball.position.x >= X - Math.abs(ball.Speed.x) + this.width)) &&
            (ball.position.y + ballSize >= Y && ball.position.y <= Y + this.height)
        ) {
            if (ball.position.x + ballSize >= X && ball.position.x + ballSize <= X + Math.abs(ball.Speed.x))
                ball.position.x = X;
            else
                ball.position.x = X + this.width;
            ball.Speed.x = -ball.Speed.x;
            return 1;
        }
        if (ball.position.x + ballSize >= X && ball.position.x <= X + this.width &&
            ((ball.position.y + ballSize >= Y) && ball.position.y + ballSize <= Y + Math.abs(ball.Speed.y) ||
                (ball.position.y <= Y + this.height && ball.position.y >= Y - Math.abs(ball.Speed.y) + this.height))
        ) {
            if ((ball.position.y + ballSize >= Y) && ball.position.y + ballSize <= Y + Math.abs(ball.Speed.y))
                ball.position.y = Y;
            else
                ball.position.y = Y + this.height;
            ball.Speed.y = -ball.Speed.y;
            return 1;
        }
        return 0;
    }
    collisionShot(shot, index) {
        let Y = this.height * parseInt(index / bricksInRow);
        let X = (index % bricksInRow) * this.width;
        if (shot.position.y <= Y + this.height && shot.position.x >= X && shot.position.x <= X + this.width) {
            return 1;
        }
        return 0;
    }
}