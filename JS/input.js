class InputHandler {
    constructor(paddle) {
        document.addEventListener('keydown', event => {
            switch (event.keyCode) {
                case 39:
                    paddle.speed = paddle.MaxSpeed;
                    break;
                case 37:
                    paddle.speed = -paddle.MaxSpeed;
                    break;
                case 80:
                    alert("Pause");
                    break;
                case 32:
                    paddle.release();


            }
        });

        document.addEventListener('keyup', event => {
            if (paddle.speed < 0 && event.keyCode == 37 || paddle.speed > 0 && event.keyCode == 39)
                paddle.speed = 0;
        });
    }
    Right() {

    }
    left() {

    }
    stop() {

    }
}