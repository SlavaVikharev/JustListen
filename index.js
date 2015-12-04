;(function() {

    var Game = function() {
        this.score = 0;
        this.level = 1;
        this.ball = new Ball(this.level);
        this.target = new Target(this.level);
    };

    Game.prototype.nextLevel = function() {
        var x = canvas.width * (this.target.x - this.ball.x) / 100;
        var y = canvas.height * (this.target.y - this.ball.y) / 100;
        var r = canvas.height * this.target.radius / 100;
        if (x * x + y * y > r * r) {
            this.score = 0;
            this.level = 1;
        } else {
            this.score++;
            this.level++;
        }
        this.ball = new Ball(this.level);
        this.target = new Target(this.level);
        hit.play();
    }

    var Ball = function(level) {
        this.radius = 2;
        this.x = 0;
        this.y = 100;
        this.goesUp = false;
        this.speed = 2;
        this.vector = [1, 0];
        this.moving = setInterval(this.move, 30, this);
    };

    Ball.prototype.move = function(self) {
        self.x += self.vector[0] * self.speed;
        self.y += self.vector[1] * self.speed;
        if (self.x > 100 || self.x < 0 || self.y > 100 || self.y < 0) {
            self.vector = [-self.vector[0], -self.vector[1]];
            hit.play();
        }
    };

    Ball.prototype.draw = function() {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(canvas.width * this.x / 100,
                canvas.height * this.y / 100,
                this.radius * canvas.height / 100,
                0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = '#000';
    };

    var Target = function(level) {
        this.radius = 20 - Math.floor(4 * Math.log(level));
        this.x = Math.floor(Math.random() * (100 - 2 * this.radius)) + this.radius;
        this.y = Math.floor(Math.random() * (100 - 2 * this.radius)) + this.radius;
    };

    Target.prototype.draw = function() {
        ctx.strokeStyle = '#f32';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(canvas.width * this.x / 100,
                canvas.height * this.y / 100,
                this.radius * canvas.height / 100,
                0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000';
    }

    var canvas = document.getElementById('game_canvas');
    var ctx = canvas.getContext("2d");
    var fps = 60;

    var game = new Game();
    var hit = new Audio('hit.mp3');
    hit.play();    

    resizeCanvas();
    requestAnimationFrame(draw);
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('keydown', onKeyDown);

    function draw() {
        setTimeout(function() {
            requestAnimationFrame(draw);
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#000';
            game.target.draw();
            // game.ball.draw();
            ctx.font = "30px Tahoma";
            ctx.fillStyle = '#fff';
            ctx.fillText(game.score, 100, 100);
            ctx.fillStyle = '#000';
        }, 1000 / fps);
    }
    
    function onKeyDown(e) {
        if (e.keyCode == 32) {
            if (game.ball.goesUp) {
                clearInterval(game.ball.moving);
                game.nextLevel();
            } else {
                game.ball.goesUp = true;
                game.ball.vector = [0, -1];
                hit.play();
            }
        }
    }
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

})();