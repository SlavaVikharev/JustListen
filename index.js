;
(function () {

    var Game = function () {
        this.paused = false;
        this.score = 0;
        this.highscore = 0;
        this.level = 1;
        this.ball = new Ball(this.level);
        this.target = new Target(this.level);
        this.walls = [new Wall(0), new Wall(1), new Wall(2), new Wall(3)];
    };

    Game.prototype.nextLevel = function () {
        clearInterval(this.ball.moving);
        this.ball.show = true;
        this.paused = true;
        setTimeout(function (self) {
            var x = canvas.width * (self.target.x - self.ball.x) / 100;
            var y = canvas.height * (self.target.y - self.ball.y) / 100;
            var r = Math.min(canvas.height, canvas.width) *
                self.target.radius / 100;
            if (x * x + y * y > r * r) {
                self.score = 0;
                self.level = 1;
            } else {
                self.score++;
                self.highscore = Math.max(self.highscore, self.score);
                self.level++;
            }
            document.getElementById('score').innerHTML = self.score;
            document.getElementById('highscore').innerHTML = self.highscore;
            self.ball = new Ball(self.level);
            self.target = new Target(self.level);
            self.paused = false;
        }, 800, this);
    };

    var Ball = function (level) {
        this.x = 0;
        this.y = 100;
        this.radius = 1.5;
        this.show = false;
        this.goesUp = false;
        this.vector = [1, 0];
        this.speed = 20 - Math.floor(4 * Math.log(level));
        this.moving = setInterval(this.move, this.speed, this);
    };

    Ball.prototype.move = function (self) {
        self.x += self.vector[0];
        self.y += self.vector[1];
        if (self.x < 0) {
            game.walls[0].ttl = 10;
            self.vector = [1, 0];
            hit.play();
        } else if (self.y < 0) {
            game.walls[1].ttl = 10;
            self.vector = [0, 1];
            hit.play();
        } else if (self.x > 100) {
            game.walls[2].ttl = 10;
            self.vector = [-1, 0];
            hit.play();
        } else if (self.y > 100) {
            game.walls[3].ttl = 10;
            self.vector = [0, -1];
            hit.play();
        }
    };

    Ball.prototype.draw = function () {
        if (!this.show) {
            return;
        }
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(canvas.width * this.x / 100,
            canvas.height * this.y / 100,
            this.radius * canvas.height / 100,
            0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
    };

    var Target = function (level) {
        this.radius = 20 - Math.floor(4 * Math.log(level));
        this.x = Math.floor(Math.random() * (100 - 2 * this.radius)) + this.radius;
        this.y = Math.floor(Math.random() * (100 - 2 * this.radius)) + this.radius;
    };

    Target.prototype.draw = function () {
        ctx.strokeStyle = '#f32';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(canvas.width * this.x / 100,
            canvas.height * this.y / 100,
            this.radius * Math.min(canvas.height, canvas.width) / 100,
            0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.lineWidth = 1;
    };

    var Wall = function (side) {
        this.side = side;
        this.ttl = 0;
    };

    Wall.prototype.draw = function () {
        if (!this.ttl) {
            return;
        }
        var down = canvas.height;
        var right = canvas.width;
        var thinkness = 10;
        ctx.fillStyle = '#f32';
        switch (this.side) {
        case 0:
            ctx.fillRect(0, 0, thinkness, down);
            break;
        case 1:
            ctx.fillRect(0, 0, right, thinkness);
            break;
        case 2:
            ctx.fillRect(right - thinkness, 0, right, down);
            break;
        case 3:
            ctx.fillRect(0, down - thinkness, right, down);
            break;
        }
        this.ttl--;
    };

    var canvas = document.getElementById('game_canvas');
    var ctx = canvas.getContext("2d");

    var fps = 60;

    var game = new Game();
    var hit = new Audio('hit.mp3');

    window.scroll(0, 1);
    resizeCanvas();
    requestAnimationFrame(draw);
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('click', onClicked)

    function draw() {
        setTimeout(function () {
            requestAnimationFrame(draw);
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            game.target.draw();
            game.ball.draw();
            ctx.font = "20px Arial";
            ctx.fillStyle = '#fff';
            for (var i = 0; i < game.walls.length; i++) {
                game.walls[i].draw();
            }
        }, 1000 / fps);
    }

    function onKeyDown(e) {
        if (e.keyCode == 32) {
            onClicked();
        }
    }

    function onClicked() {
        if (game.paused) {
            return;
        }
        if (game.ball.goesUp) {
            game.nextLevel();
        } else {
            game.ball.goesUp = true;
            game.ball.vector = [0, -1];
        }
    }

    function resizeCanvas() {
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight - 30;
    }

})();
