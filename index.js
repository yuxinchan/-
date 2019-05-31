
var scoreBox = document.getElementById('scoreBox');
var score = document.getElementById('score');
var continueAndPause = document.getElementById('continueAndPause');
var content = document.getElementById('content');
var startPage = document.getElementById('startPage');
var startBtn = document.getElementById('startBtn');
var over = document.getElementById('over');
var loserScore = document.getElementById('loserScore');
var close = document.getElementById('close');
var startBoll = true;
var pauseBoll = true;
var snakeMove;
var speed = 200;

init();

// 初始化函数
function init() {

    //地图
    this.mapW = parseInt(getComputedStyle(content).width);
    this.mapH = parseInt(getComputedStyle(content).height);
    this.mapDiv = content;

    //美金
    this.dollarW = 40;
    this.dollarH = 40;
    this.dollarX = 0;
    this.dollarY = 0;

    //蛇
    this.snakeW = 40;
    this.snakeH = 40;
    this.snakeBody = [[3,1,'head'],[2,1,'body'],[1,1,'body']];

    //游戏属性
    this.count = 0;
    this.direct = 'right';
    this.left_right = false;
    this.up_down = true;

    //初始化绑定事件
    bindEvent();
}

//绘制金币
function createDollar() {
    var dollar = document.createElement('div');
    dollar.style.width = this.dollarW + 'px';
    dollar.style.height = this.dollarH + 'px';
    dollar.style.position = 'absolute';
    this.dollarX = Math.floor(Math.random() * (this.mapW / 40));
    this.dollarY = Math.floor(Math.random() * (this.mapH / 40));
    dollar.style.left = this.dollarX * 40 + 'px';
    dollar.style.top = this.dollarY * 40 + 'px';
    mapDiv.appendChild(dollar).setAttribute('class','dollar');
}

//绘制蛇
function createSnake() {
    for(var i = 0; i < this.snakeBody.length; i++) {
        var snake = document.createElement('div');
        snake.style.width = this.snakeW + 'px';
        snake.style.height = this.snakeH + 'px';
        snake.style.position = 'absolute';
        snake.style.left = this.snakeBody[i][0] * 40 +'px';
        snake.style.top = this.snakeBody[i][1] * 40 +'px';
        snake.classList.add(this.snakeBody[i][2]);
        this.mapDiv.appendChild(snake).classList.add('snake');
        switch (this.direct) {
            case 'left':
                snake.style.transform = 'rotate(180deg)';
                break;
            case 'up':
                snake.style.transform = 'rotate(270deg)';
                break;
            case 'right':
                break;
            case 'down':
                snake.style.transform = 'rotate(90deg)';
                break;
            default:
                break;
        }
    }
}

//方向识别
function setDirect(code) {
    switch(code) {
        case 37:
            if(this.left_right) {
                this.direct = 'left';
                this.left_right = false;
                this.up_down = true;
            }
            break;
        case 38:
            if(this.up_down) {
                this.direct = 'up';
                this.left_right = true;
                this.up_down = false;
            }
            break;
        case 39:
            if(this.left_right) {
                this.direct = 'right';
                this.left_right = false;
                this.up_down = true;
            }
            break;
        case 40:
            if(this.up_down) {
                this.direct = 'down';
                this.left_right = true;
                this.up_down = false;
            }
            break;
        default:
            break;
    }
}

//移动
function move() {
    for(var i = this.snakeBody.length-1; i > 0; i--) {
        this.snakeBody[i][0] = this.snakeBody[i - 1][0];
        this.snakeBody[i][1] = this.snakeBody[i - 1][1];
    }
    switch(this.direct) {
        case 'right':
            this.snakeBody[0][0] += 1;
            break;
        case 'up':
            this.snakeBody[0][1] -= 1;
            break;
        case 'left':
            this.snakeBody[0][0] -= 1;
            break;
        case 'down':
            this.snakeBody[0][1] += 1;
            break;
        default:
            break;
    }
    removeClass('snake');
    createSnake();
    if(this.snakeBody[0][0] == this.dollarX && this.snakeBody[0][1] == this.dollarY) {
        var snakeEndX = this.snakeBody[this.snakeBody.length - 1][0];
        var snakeEndY = this.snakeBody[this.snakeBody.length - 1][1];
        switch(this.direct) {
            case 'right':
                this.snakeBody.push([snakeEndX + 1,snakeEndY,'body']);
                break;
            case 'up':
                this.snakeBody.push([snakeEndX,snakeEndY - 1,'body']);
                break;
            case 'left':
                this.snakeBody.push([snakeEndX - 1,snakeEndY,'body']);
                break;
            case 'down':
                this.snakeBody.push([snakeEndX,snakeEndY + 1,'body']);
                break;
            default:
                break;
        }
        this.count += 1;
        score.innerHTML = 'SCORE: ' + this.count;
        removeClass('dollar');
        createDollar();
    }

    //游戏结束判断
    if(this.snakeBody[0][0] < 0 || this.snakeBody[0][0] >= this.mapW/40) {
        reloadGame();
    }
    if(this.snakeBody[0][1] < 0 || this.snakeBody[0][1] >= this.mapH/40) {
        reloadGame();
    }
    var snakeHX = this.snakeBody[0][0];
    var snakeHY = this.snakeBody[0][1];
    for(var i = 1; i < this.snakeBody.length; i++) {
        if(snakeHX == snakeBody[i][0] && snakeHY == snakeBody[i][1]) {
            reloadGame();
        }
    }
}

//开始游戏
function startGame() {
    startPage.style.display = 'none';
    continueAndPause.style.display = 'inline-block';
    createDollar();
    createSnake();
}

//开始与暂停控制
function startAndPause() {
    if(pauseBoll) {
        if(startBoll) {
            over.style.display = 'none';
            startGame();
            startBoll = false;
        }
        continueAndPause.setAttribute('src','img/pause.png');
        document.onkeydown = function(e) {
            var code = e.keyCode;
            setDirect(code);
        };
        snakeMove = setInterval(function(){
            move();
        },speed);
        pauseBoll = false;
    }else {
        clearInterval(snakeMove);
        continueAndPause.setAttribute('src','img/start.png');
        document.onkeydown = function(e) {
            e.returnValue = false;
            return false;
        };
        pauseBoll = true;
    }
}

//绑定事件
function bindEvent() {
    startBtn.onclick = function() {
        startAndPause();
    }
    continueAndPause.onclick = function() {
        startAndPause();
    }
    var over = document.getElementById('over');
    close.onclick = function() {
        over.style.display = 'none';
        startPage.style.display = 'inline-block';
        score.innerHTML = 'JUST EAT';
    }
}

//删除元素
function removeClass(className) {
    var ele = document.getElementsByClassName(className);
    while(ele.length > 0) {
        ele[0].parentNode.removeChild(ele[0]);
    }
}

//游戏结束
function reloadGame() {
    removeClass('snake');
    removeClass('dollar');
    clearInterval(snakeMove);
    this.snakeBody = [[3,1,'head'],[2,1,'body'],[1,1,'body']];
    this.direct = 'right';
    this.left_right = false;
    this.up_down = true;
    over.style.display = 'block';
    loserScore.innerHTML = 'FINAL: ' + this.count;
    this.count = 0;
    score.innerHTML = "";
    startBoll = true;
    pauseBoll = true;
    continueAndPause.setAttribute('src','img/start.png');
}