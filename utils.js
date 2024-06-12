const tau = 2 * Math.PI;

function reset_canvas(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw_rect(ctx, x, y, w, h, color, stroke_width = 0, stroke_color = "") {
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fill();
    if (stroke_width > 0) {
        ctx.lineWidth = stroke_width;
        ctx.strokeStyle = stroke_color;
        ctx.stroke();
    }
}

function draw_circle(ctx, x, y, r, color, stroke_width = 0, stroke_color = "") {
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, tau);
    ctx.fill();
    if (stroke_width > 0) {
        ctx.lineWidth = stroke_width;
        ctx.strokeStyle = stroke_color;
        ctx.stroke();
    }
}

function draw_line(ctx, x1, y1, x2, y2, thickness, color, dash_pattern = []) {
    ctx.beginPath();
    ctx.setLineDash(dash_pattern);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function draw_text(ctx, text, x, y, font_size, font_family, color) {
    ctx.font = `${font_size} ${font_family}`;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

function normalize_vec(x, y) {
    const mag = Math.sqrt(x * x + y * y);
    return { x: x / mag, y: y / mag };
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function random(max) {
    return Math.floor(Math.random() * max);
}

function random_min_max(min, max) {
    return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
