let canvas = document.getElementById("GameScreen"),
    ctx = canvas.getContext("2d"),
    score = 0,
    Level = 1,
    levelSpan = document.getElementById("LevelSpan"),
    scoreSpan = document.getElementById("ScoreSpan"),
    livesSpan = document.getElementById("LivesSpan"),
    ballSize = 16,
    shotActive = 0,
    Lives = 3,
    sound = document.createElement("audio");

var currentTime = 0;
const GameWidth = 800,
    GameHieght = 500,
    powerUpSize = 25,
    PaddleHeight = 20,
    WhiteBall = 1,
    RedBall = 2,
    bricksInRow = 8,
    bricksColumn = 4,
    MaxHeightOfBlocks = 200,
    BallInitialX = GameWidth / 2,
    BallInitialY = GameHieght - 2 * PaddleHeight - ballSize,
    initialBallSize = 16,
    initialPaddleWidth = 150,
    shotSize = 10,
    ballInitialSpeed = -4;

var Levels = JSON.parse(`[
    [0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0
    ],
    [0, 1, 1, 1, 1, 1, 1, 0,
        0, 1, 1, 1, 1, 1, 1, 0,
        0, 0, 1, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0
    ],
    [0, 0,0,1, 1, 0, 0, 0,
        0, 0, 1, 1, 1, 1, 0, 0,
        0, 1, 1, 1, 1, 1, 1, 0,
        0, 1, 1, 1, 1, 1, 1, 0
    ],
    [2, 2, 2, 2, 2, 2, 2, 2,
        0, 1, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0
    ],
       [0, 2, 2, 2, 2, 2, 2, 0,
        2, 2, 1, 1, 1, 1, 2, 2,
        2, 2, 1, 1, 1, 1, 2, 2,
        0, 2, 2, 2, 2, 2, 2, 0
    ],
    [2, 2, 2, 2, 2, 2, 2, 2,
        1, 1, 1, 1, 1, 1, 1, 1,
        2, 2, 2, 2, 2, 2, 2, 2,
        1, 1, 1, 1, 1, 1, 1, 1
    ]
]`);
var Balls = [];
var powerUps = [];
var shots = [];
let paddle = new Paddle(GameWidth, GameHieght);
new InputHandler(paddle);
let Mainball = new Ball(BallInitialX, BallInitialY, 0);
Balls.push(Mainball);
let brick = new Brick(1);
let goldenBrick = new Brick(2);

function initializeSound(src) {
    sound = document.createElement("audio");
    sound.src = src;
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    sound.style.display = "none";
    document.body.appendChild(sound);
}

function GameLoop() {
    currentTime++;
    ctx.fillStyle = "#fff"
    levelSpan.textContent = Level;
    scoreSpan.textContent = score;
    livesSpan.textContent = Lives;
    ctx.fillRect(0, 0, GameWidth, GameHieght);
    paddle.draw(ctx);
    paddle.Update();
    for (var i = 0; i < Balls.length; i++) {
        if (Balls[i] != null) {
            Balls[i].draw(ctx);
            Delete = Balls[i].update(paddle);
            if (Delete)
                delete Balls[i];
        }
    }

    let numberOfRemainingBricks = 0
    for (var i = 0; i < bricksInRow * bricksColumn; i++) {
        if (Levels[Level - 1][i] != 0) {
            numberOfRemainingBricks++;
            let DeleteBrick = 0;
            for (var j = 0; j < Balls.length; j++) {
                if (Balls[j] != null) {
                    DeleteBrick = brick.collision(Balls[j], i);
                    if (DeleteBrick) {
                        Levels[Level - 1][i]--;
                        score += 100;
                        sound.play();
                        if (currentTime >= 1000) {
                            let brickY = MaxHeightOfBlocks / bricksColumn * i / bricksInRow + MaxHeightOfBlocks / bricksColumn;
                            let brickX = ((i % bricksInRow) * GameWidth / bricksInRow);
                            let Type = Math.floor(Math.random() * 7) + 1;
                            powerUps.push(new PowerUp(Type, brickX, brickY));
                            currentTime = 0;
                        }

                    }
                }
            }
            if (DeleteBrick == 0) {
                for (var j = 0; j < shots.length; j++) {
                    if (shots[j] != null) {
                        DeleteBrick = brick.collisionShot(shots[j], i);
                        if (DeleteBrick) {
                            Levels[Level - 1][i]--;
                            score += 100;
                            delete shots[j];
                            sound.play();
                            if (currentTime >= 1000) {
                                let brickY = MaxHeightOfBlocks / bricksColumn * i / bricksInRow + MaxHeightOfBlocks / bricksColumn;
                                let brickX = ((i % bricksInRow) * GameWidth / bricksInRow);
                                let Type = Math.floor(Math.random() * 7) + 1;
                                powerUps.push(new PowerUp(Type, brickX, brickY));
                                currentTime = 0;
                            }
                        }
                    }
                }
            }

            if (Levels[Level - 1][i] == 1) {
                brick.draw(ctx, i);
            }
            if (Levels[Level - 1][i] == 2) {
                goldenBrick.draw(ctx, i);
            }
        }

    }
    for (var i = 0; i < shots.length; i++) {
        if (shots[i] != null) {
            shots[i].update();
            shots[i].draw(ctx);
        }
    }

    for (var i = 0; i < powerUps.length; i++) {
        if (powerUps[i] != null) {
            if (powerUps[i].active) {
                let finished = powerUps[i].caught();
                if (finished == 1) {
                    switch (powerUps[i].type) {
                        case 2:
                            delete powerUps[i];
                            break;
                        case 3:
                            paddle.width -= 50;
                            delete powerUps[i];
                            break;
                        case 4:
                            paddle.width += 50;
                            delete powerUps[i];
                            break;
                        case 5:
                            ballSize *= 1.5;
                            delete powerUps[i];
                            break;
                        case 6:
                            ballSize /= 1.5;
                            delete powerUps[i];
                            break;
                        case 7:
                            paddle.Sticky = 0;
                            delete powerUps[i];
                            break;
                    }
                }
                if (finished == 2) {
                    shots.push(new Shot(paddle.position.x));
                    shots.push(new Shot(paddle.position.x + paddle.width));
                }
                continue;
            }
            powerUps[i].draw(ctx);
            let caught = powerUps[i].update(paddle);
            switch (caught) {
                case -1:
                    delete powerUps[i];
                    break;
                case 1:
                    let positionBallX = Math.floor(Math.random() * (GameWidth - ballSize + 1));
                    let positionBallY = Math.floor(Math.random() * (GameHieght - ballSize - MaxHeightOfBlocks - 2 * PaddleHeight + 1)) + MaxHeightOfBlocks + 1;
                    Balls.push(new Ball(positionBallX, positionBallY, 1));
                    positionBallX = Math.floor(Math.random() * (GameWidth - ballSize + 1));
                    positionBallY = Math.floor(Math.random() * (GameHieght - ballSize - MaxHeightOfBlocks - 2 * PaddleHeight + 1)) + MaxHeightOfBlocks + 1;
                    Balls.push(new Ball(positionBallX, positionBallY, -1));
                    delete powerUps[i];
                    break;
                case 2:
                    shots.push(new Shot(paddle.position.x));
                    shots.push(new Shot(paddle.position.x + paddle.width));
                    break;
                case 3:
                    paddle.width += 50;
                    if (paddle.width >= GameHieght)
                        paddle.width = GameHieght;
                    break;
                case 4:
                    paddle.width -= 50;
                    if (paddle.width <= 0)
                        paddle.width = 5;
                    break;
                case 5:
                    ballSize /= 1.5;
                    break
                case 6:
                    ballSize *= 1.5;
                    break;
                case 7:
                    paddle.Sticky = 1;
                    break;
            }
        }
    }
    if (numberOfRemainingBricks == 0) {
        Level++;
        for (var i = 0; i < shots.length; i++) {
            delete shots[i];
            shots.pop();
        }
        for (var i = 0; i < Balls.length; i++) {
            delete Balls[i];
            Balls.pop();
        }
        for (var i = 0; i < powerUps.length; i++) {
            delete powerUps[i];
            powerUps.pop();
        }
        paddle.width = initialPaddleWidth;
        ballSize = initialBallSize;
        paddle.Sticky = 0;
        paddle.position.x = GameWidth / 2 - paddle.width / 2;
        let Mainball = new Ball(BallInitialX, BallInitialY, 0);
        Balls.push(Mainball);
    }
    var gOver = 1;
    for (var i = 0; i < Balls.length; i++) {
        if (Balls[i] != null) {
            gOver = 0;
            break;
        }
    }
    if (gOver) {
        Lives--;
        paddle.width = initialPaddleWidth;
        ballSize = initialBallSize;
        paddle.Sticky = 0;
        paddle.position.x = GameWidth / 2 - paddle.width / 2;
        Balls.push(new Ball(BallInitialX, BallInitialY, 0));
    }

    if (Lives == 0 || Level > Levels.length)
        GameOver();
    else
        requestAnimationFrame(GameLoop);
}

function GameOver() {
    livesSpan.textContent = Lives;
    levelSpan.textContent = Level;
    scoreSpan.textContent = score;
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, GameWidth, GameHieght);
    ctx.fillStyle = "#fff"
    ctx.font = "60px Arial";
    if (Level != Levels.length)
        ctx.fillText("Game Over", GameWidth / 2 - 150, GameHieght / 2 - 50);
    else
        ctx.fillText("Conagratulations", GameWidth / 2 - 250, GameHieght / 2 - 50);
    ctx.fillText("Score: " + score, GameWidth / 2 - 120, GameHieght / 2 + 50);

}

initializeSound("audio/break.mp3");
requestAnimationFrame(GameLoop);