define(["ball", "bar"], function(Ball, Bar){
    var KEYCODE_UP = 38;
    var KEYCODE_DOWN = 40;
    var DIRECTION_UP = -1;
    var DIRECTION_DOWN = 1;

    var Pong = function(canvasId){
        this.stage = new createjs.Stage(canvasId);
        this.width = this.stage.canvas.width;
        this.height = this.stage.canvas.height;

        this.leftBar = new Bar("red");
        this.rightBar = new Bar("blue");
        this.ball = new Ball(this.leftBar, this.rightBar);
    };

    Pong.prototype.init = function(){
        var that = this;

        document.onkeydown = function(e){ that.handleKeyDown(e); };
        document.onkeyup = function(e){ that.handleKeyUp(e); };

        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", function(event){ that.tick(event); });
        that.ball.addEventListener("outOfBounds", function(event){ that.outOfBoundsHandler(event); });

        //adicionando na cena
        that.stage.addChild(that.ball);
        that.stage.addChild(that.leftBar);
        that.stage.addChild(that.rightBar);

        //posicionando objetos
        that.rightBar.x = that.width - that.rightBar.width;
        that.reset();
    }

    Pong.prototype.tick = function(event){
        if(!createjs.Ticker.getPaused()){
            event.barDirection = this.barDirection;

            if(!this.areBarsStill){
                this.leftBar.tick(event);
                this.rightBar.tick(event);
            }

            this.ball.tick(event);
            this.stage.update();
        }
    }

    Pong.prototype.outOfBoundsHandler = function(event) {
        if(event.isLeftSide){
            console.log("right wins");
        }else{
            console.log("left wins");
        }

        createjs.Ticker.setPaused(true);
    };

    Pong.prototype.reset = function(){
        this.leftBar.reset();
        this.rightBar.reset();
        this.ball.reset();

        this.areBarsStill = true;
        this.barDirection = DIRECTION_UP;
    }

    Pong.prototype.handleKeyDown = function(event){
        if(!event) event = window.event;

        switch(event.keyCode){
            case KEYCODE_UP:
                this.areBarsStill = false;
                this.barDirection = DIRECTION_UP;
                break;
            case KEYCODE_DOWN:
                this.areBarsStill = false;
                this.barDirection = DIRECTION_DOWN;
                break;
        }
    }

    Pong.prototype.handleKeyUp = function(event){
        this.areBarsStill = true;
    }


    return Pong;
})