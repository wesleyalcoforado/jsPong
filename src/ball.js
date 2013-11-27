define(function(){
    var HORIZONTAL_VELOCITY = 100;
    var VERTICAL_VELOCITY = 100;
    var RADIUS = 5;
    var DEFAULT_COLOR = "black";

    var Ball = function(leftBar, rightBar, color){
        if(!color){
            color = DEFAULT_COLOR;
        }

        this.init(leftBar, rightBar, color);
    }

    Ball.prototype = new createjs.Shape();
    Ball.prototype.init = function(leftBar, rightBar, color) {
        var that = this;

        that.initialize();
        
        that.radius = RADIUS;
        that.verticalVelocity = VERTICAL_VELOCITY;
        that.horizontalVelocity = HORIZONTAL_VELOCITY;
        that.leftBar = leftBar;
        that.rightBar = rightBar;

        that.graphics.beginFill(color).drawCircle(0, 0, that.radius);
    };

    Ball.prototype.reset = function(){
        this.x = this.getStage().canvas.width / 2;
        this.y = this.getStage().canvas.height / 2;
    }

    Ball.prototype.tick = function(event){
        delta = event.delta;
        canvas = this.getStage().canvas;
        diameter = this.radius / 2;

        topBound = this.y - diameter + this.getDeltaY(delta);
        bottomBound = this.y + diameter + this.getDeltaY(delta);
        leftBound = this.x - diameter + this.getDeltaX(delta);
        rightBound = this.x + diameter + this.getDeltaX(delta);

        if(rightBound < 0 || leftBound > canvas.width){
            escapedFromLeftSide = rightBound < 0;
            this.outOfBounds(escapedFromLeftSide);
            return;
        }else{
            if(bottomBound >= canvas.height || topBound <= 0){
                this.verticalVelocity *= -1;
            }

            ballAndLeftBarOnSameVerticalPoint = (bottomBound >= this.leftBar.y) && (topBound <= this.leftBar.y + this.leftBar.height);
            ballAndLeftBarOnSameHorizontalPoint = (rightBound >= this.leftBar.x) && (leftBound <= this.leftBar.x + this.leftBar.width);
            ballIsHittingLeftBar = ballAndLeftBarOnSameVerticalPoint && ballAndLeftBarOnSameHorizontalPoint;

            ballAndRightBarOnSameVerticalPoint = (bottomBound >= this.rightBar.y) && (topBound <= this.rightBar.y + this.rightBar.height);
            ballAndRightBarOnSameHorizontalPoint = (rightBound >= this.rightBar.x) && (leftBound <= this.rightBar.x + this.rightBar.width);
            ballIsHittingRightBar = ballAndRightBarOnSameVerticalPoint && ballAndRightBarOnSameHorizontalPoint;

            if(ballIsHittingLeftBar || ballIsHittingRightBar){
                this.horizontalVelocity *= -1;
            }

            this.x += this.getDeltaX(delta);;
            this.y += this.getDeltaY(delta);
        }
    }

    Ball.prototype.getDeltaX = function(deltaTime){
        return (deltaTime/1000) * this.horizontalVelocity;
    }

    Ball.prototype.getDeltaY = function(deltaTime){
        return (deltaTime/1000) * this.verticalVelocity;
    }

    Ball.prototype.outOfBounds = function(isLeftSide) {
        event = new createjs.Event("outOfBounds");
        event.isLeftSide = isLeftSide;
        this.dispatchEvent(event);
    };

    return Ball;
});