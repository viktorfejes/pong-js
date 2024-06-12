const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const PADDLE_WIDTH = 14;
const PADDLE_HEIGHT = 80;
const PADDLE_SPEED = 6;
const PADDLE_PADDING = canvas.width * 0.1;

const BALL_SIZE = 20;
const BALL_SPEED = 4;
const BALL_INIT_DIR = normalize_vec(Math.random() * 1.5, Math.random());

const LINE_THICKNESS = 6;
const LINE_DASH_PATTERN = [5, 5];
const CENTER_LINE_THICKNESS = 2;

const AI_SPEED = 0.29;

const PLAYING = 1;

const audio_hit = new Audio("assets/hit.wav");

const game_state = {
    state: PLAYING,
    score: [ 0, 0 ],
    paddles: [
        {
            x: PADDLE_PADDING,
            y: canvas.height / 2 - PADDLE_HEIGHT / 2,
        },
        {
            x: canvas.width - PADDLE_PADDING,
            y: canvas.height / 2 - PADDLE_HEIGHT / 2,
        }
    ],
    ball: {
        position: {
            x: canvas.width / 2 - BALL_SIZE / 2,
            y: canvas.height / 2 - BALL_SIZE / 2,
        },
        direction: BALL_INIT_DIR
    },
    last_key: "",
};

key_state = {};

function draw_paddles() {
    for (let paddle of game_state.paddles) {
        draw_rect(ctx, paddle.x, paddle.y, PADDLE_WIDTH, PADDLE_HEIGHT, "#ebdbb2");
    }
}

function draw_ball() {
    // draw_rect(ctx, game_state.ball.position.x, game_state.ball.position.y, BALL_SIZE, BALL_SIZE, "#b16286");
    draw_circle(ctx, game_state.ball.position.x, game_state.ball.position.y, BALL_SIZE / 2, "#b16286");
}

function draw_score() {
    draw_text(ctx, game_state.score[0], canvas.width * 0.25, 40, "40px", "Monospace", "white");
    draw_text(ctx, game_state.score[1], canvas.width * 0.75, 40, "40px", "Monospace", "white");
}

function draw_walls() {
    // TOP
    draw_line(ctx, 0, LINE_THICKNESS / 2, canvas.width, LINE_THICKNESS / 2, LINE_THICKNESS, "#aaa", LINE_DASH_PATTERN);
    // BOTTOM
    draw_line(ctx, 0, canvas.height - LINE_THICKNESS / 2, canvas.width, canvas.height - LINE_THICKNESS / 2, LINE_THICKNESS, "#aaa", LINE_DASH_PATTERN);
}

function reset_ball() {
    const ball = game_state.ball;
    ball.position.x =  canvas.width / 2 - BALL_SIZE / 2;
    ball.position.y = canvas.height / 2 - BALL_SIZE / 2;
    ball.direction = normalize_vec(random_min_max(-1, 1) * 2, random_min_max(-1, 1));
}

function score(side) {
    // Right side (score against player)
    if (side > 0) {
        game_state.score[0]++;
    } else {
        game_state.score[1]++;
    }

    reset_ball();
}

function update() {
    const paddles = game_state.paddles;
    const ball = game_state.ball;

    // Paddles update
    if (key_state["ArrowUp"] && paddles[1].y > 0) {
        paddles[1].y -= PADDLE_SPEED;
    }
    if (key_state["ArrowDown"] && paddles[1].y < canvas.height - PADDLE_HEIGHT) {
        paddles[1].y += PADDLE_SPEED;
    }

    // AI paddle update
    if (ball.direction.x < 0) {
        const ball_pos_cmp = Math.sign((paddles[0].y + PADDLE_HEIGHT / 2) - ball.position.y);
        paddles[0].y = clamp(lerp(paddles[0].y, paddles[0].y + (-ball_pos_cmp * PADDLE_SPEED), AI_SPEED), 0, canvas.height - PADDLE_HEIGHT);
    }

    // Ball update
    if (ball.position.x <= BALL_SIZE / 2 || ball.position.x >= canvas.width - BALL_SIZE) {
        const side = Math.sign(ball.position.x - (canvas.width - canvas.width / 2));
        score(side);
        // ball.direction = normalize_vec(-ball.direction.x, ball.direction.y);
    }
    else if (ball.position.y <= BALL_SIZE / 2 || ball.position.y >= canvas.height - BALL_SIZE) {
        ball.direction = normalize_vec(ball.direction.x, -ball.direction.y);
    }

    for (let paddle of game_state.paddles) {
        if (
            ball.position.x + BALL_SIZE / 2 >= paddle.x && 
            ball.position.x - BALL_SIZE / 2 <= paddle.x + PADDLE_WIDTH && 
            ball.position.y + BALL_SIZE / 2 >= paddle.y && 
            ball.position.y - BALL_SIZE / 2 <= paddle.y + PADDLE_HEIGHT
        ) {

            // Add slight randomness to avoid predictable patterns
            ball.direction = normalize_vec(
                -ball.direction.x,
                ball.direction.y + (Math.random() - 0.5) * 0.5);

            audio_hit.play();
        }
    }

    ball.position.x += ball.direction.x * BALL_SPEED;
    ball.position.y += ball.direction.y * BALL_SPEED;
    
}

function render() {
    reset_canvas(ctx);
    draw_rect(ctx, 0, 0, canvas.width, canvas.height, "#101014");
    draw_line(
        ctx,
        canvas.width / 2 - LINE_THICKNESS / 2,
        0,
        canvas.width / 2 - LINE_THICKNESS / 2,
        canvas.height,
        LINE_THICKNESS,
        "#aaa",
        LINE_DASH_PATTERN
    );
    draw_walls();

    draw_score();

    draw_paddles();
    draw_ball();
}

function run() {
    window.requestAnimationFrame(run);

    update();
    render();

    // setTimeout(run, 1000 / 60);
}

document.addEventListener("keydown", (e) => {
    key_state[e.code] = true;
});

document.addEventListener("keyup", (e) => {
    key_state[e.code] = false;
});

document.addEventListener("DOMContentLoaded", (e) => {
    run();
});