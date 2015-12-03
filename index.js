;(function() {
    var canvas = document.getElementById('game_canvas');
    var ctx = canvas.getContext("2d");

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, false);
    setInterval(draw, 60);
    
    var right = [1, 0],
        left = [-1, 0],
        up = [0, -1],
        down = [0, 1];

    var Game = function() {
        this.score = 0;
        this.level = 1;
    }

    var Ball = function(level, vector) {
        this.x = canvas.width * .1;
        this.y = canvas.height * .9;
        this.radius = 10;
        this.speed = 10;
    }

    Ball.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
    }

    function moveBall(ball, vector) {
        ball.x += vector[0] * ball.speed;
        ball.y += vector[1] * ball.speed;
    }

    var game = new Game();
    var ball = new Ball(game.level);
    setInterval(moveBall, 30, ball, right);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ball.draw();
    }
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
})();