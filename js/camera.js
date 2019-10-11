function cameraConstructor(number, pos=[0,0], screenPos=[0,0], dim=[600,300], options){
    this.number = number;
	this.pos = pos;
	this.screenPos = screenPos;
	this.sizeMultiplier = 1;
    this.dim = dim;
    if(typeof(options.sizeMultiplier) != 'undefined'){
        this.sizeMultiplier = options.sizeMultiplier;
    }
    this.loop = function(){
        this.drawAll();
    }
    this.onScreen = function(x, y, width, height){
        if(x + width > this.pos[0] && x < this.pos[0] + this.dim[0]/this.sizeMultiplier
        && y + height > this.pos[1] - this.dim[1]/this.sizeMultiplier && y < this.pos[1] + this.dim[1]/this.sizeMultiplier){
            return true;
        }
        return false;
    }
    this.drawAll = function(){
		function caseDraw(obj, thisCam){ //Slightly convoluted way of doing this, but I really don't want to write this function twice
            switch(obj.type){
                case "block":
                    thisCam.drawRect(obj);
					break;
				case "spring":
					thisCam.drawSpring(obj);
					break;
                // case "circle":
                //     thisCam.drawCircle(obj);
                //     break;
                // case "text":
                //     thisCam.drawText(obj);
                //     break;
                default:
                    console.log("Error: toDraw[" + i + "] does not have a defined shape type.");
                    break;
            }
		}
        for(var i = 0; i < sim.entities.length; i++){
			caseDraw(sim.entities[i], this);
		}
		for(var i = 0; i < sim.selection.length; i++){
			if(sim.selection[i] != null){
				var copy = {
					pos : sim.selection[i].pos,
					dim : sim.selection[i].dim,
					type : sim.selection[i].type,
					color : "black",
					fill : false,
					lineWidth : 4,
				}
				if(i == 0){
					copy.color = "blue";
				}
				if(i == 1){
					copy.color = "red";
				}
				caseDraw(copy, this);
			}
		}
        this.boarder();
        if(this.number != sim.cameras.length){
            for(var i = this.number+1; i < sim.cameras.length; i++){
                cvs.ctx.clearRect(sim.cameras[i].screenPos[0], sim.cameras[i].screenPos[1], sim.cameras[i].dim[0], sim.cameras[i].dim[1]);
            }
        }
    }
    this.boarder = function(){
        this.overlayRect(0, 0, this.dim[0], this.dim[1], {color: "black", fill: false})
    }
    this.drawRect = function(obj){
        if(this.onScreen(obj.pos[0], obj.pos[1], obj.dim[0], obj.dim[1])){
            var color = "black";
			var fill = false;
			if(typeof(obj.color) != 'undefined'){
				color = obj.color
			}
			if(typeof(obj.fill) != 'undefined'){
				fill = obj.fill
			}
            cvs.ctx.save();
                cvs.ctx.beginPath();
                cvs.ctx.rect(this.screenPos[0], this.screenPos[1], this.dim[0], this.dim[1]);
                cvs.ctx.clip();

                cvs.ctx.beginPath();
                if(fill == true){
                    cvs.ctx.fillStyle = color;
                    cvs.ctx.fillRect(this.screenPos[0]+this.sizeMultiplier*(obj.pos[0]-this.pos[0]), this.screenPos[1]+this.sizeMultiplier*(obj.pos[1]-this.pos[1]), this.sizeMultiplier*obj.dim[0], this.sizeMultiplier*obj.dim[1], color);
                }
                else{
					if(typeof(obj.lineWidth) != 'undefined'){
						cvs.ctx.lineWidth = obj.lineWidth;
					}
					else{
						cvs.ctx.lineWidth = 1;
					}
                    cvs.ctx.strokeStyle = color;
                    cvs.ctx.rect(this.screenPos[0]+this.sizeMultiplier*(obj.pos[0]-this.pos[0]), this.screenPos[1]+this.sizeMultiplier*(obj.pos[1]-this.pos[1]), this.sizeMultiplier*obj.dim[0], this.sizeMultiplier*obj.dim[1], color);
                    cvs.ctx.stroke();
                }
            cvs.ctx.restore();
        }
	}
	this.drawSpring = function(obj){
		if(obj.angle == 90){
			var springCount = Math.round(Math.log(obj.k)*5);
			if(springCount < 5){
				springCount = 5;
			}
			var springHeight = obj.dim[1]/(1+0.8*(springCount-1));
            cvs.ctx.save();
                cvs.ctx.beginPath();
                cvs.ctx.rect(this.screenPos[0], this.screenPos[1], this.dim[0], this.dim[1]);
                cvs.ctx.clip();
			for(var i = 0; i < springCount; i++){
				if(this.sizeMultiplier*obj.dim[0]/2 > 0){
					cvs.ctx.strokeStyle = "black";
					cvs.ctx.beginPath();
					cvs.ctx.ellipse(this.screenPos[0]+this.sizeMultiplier*(obj.pos[0]+obj.dim[0]/2-this.pos[0]), this.screenPos[1]+this.sizeMultiplier*(obj.pos[1]+springHeight/2+i*springHeight*0.8-this.pos[1]), this.sizeMultiplier*obj.dim[0]/2, this.sizeMultiplier*springHeight/2, 0, 0, 2*Math.PI);
					cvs.ctx.stroke();
				}
			}
			cvs.ctx.restore();
		}
	}
    this.drawCircle = function(obj){
        if(this.onScreen(obj.pos[0]-obj.radius, obj.pos[1]-obj.radius, obj.radius*2, obj.radius*2)){
            if(obj.color){
                color = obj.color;
            }
            cvs.ctx.save();
                cvs.ctx.beginPath();
                cvs.ctx.rect(this.screenPos[0], this.screenPos[1], this.dim[0], this.dim[1]);
                cvs.ctx.clip();

                cvs.ctx.beginPath();
                cvs.ctx.fillStyle=color;
                cvs.ctx.arc(this.screenPos[0]+this.sizeMultiplier*(obj.pos[0] - this.pos[0]), this.screenPos[1]+this.sizeMultiplier*(obj.pos[1] - this.pos[1]), this.sizeMultiplier*obj.radius, 0, 2*Math.PI);
                cvs.ctx.fill();
            cvs.ctx.restore();
        }
    }
    this.drawLine = function(startx, starty, endx, endy, color="black"){
        if(this.onScreen(startx, starty, endx-startx, endy-starty)){
            cvs.ctx.save();
                cvs.ctx.beginPath();
                cvs.ctx.rect(this.screenPos[0], this.screenPos[1], this.dim[0], this.dim[1]);
                cvs.ctx.clip();

                cvs.ctx.beginPath();
                cvs.ctx.strokeStyle=color;
                cvs.ctx.moveTo(this.screenPos[0]+this.sizeMultiplier*(startx - this.pos[0]), this.screenPos[1]+this.sizeMultiplier*(starty - this.pos[1]));
                cvs.ctx.lineTo(this.screenPos[0]+this.sizeMultiplier*(endx - this.pos[0]), this.screenPos[1]+this.sizeMultiplier*(endy - this.pos[1]));
                cvs.ctx.stroke();
            cvs.ctx.restore();
        }
    }
    this.drawText = function(obj){
        var text = "Filler Text";
        var textSize = 16;
        var color = "black";
        var textAlign = "center";
        if(obj.text){
            text = obj.text;
        }
        if(obj.textSize){
            textSize = obj.textSize;
        }
        if(obj.color){
            color = obj.color;
        }
        if(obj.textAlign){
            textAlign = obj.textAlign;
        }
        cvs.ctx.save();
            cvs.ctx.beginPath();
            cvs.ctx.rect(this.screenPos[0], this.screenPos[1], this.dim[0], this.dim[1]);
            cvs.ctx.clip();

            cvs.ctx.fillStyle = color;
            cvs.ctx.textAlign = textAlign;
            cvs.ctx.font = this.sizeMultiplier*textSize + "px Arial";
            cvs.ctx.fillText(text, this.screenPos[0]+this.sizeMultiplier*(obj.x - this.pos[0]), this.screenPos[1]+this.sizeMultiplier*(obj.y - this.pos[1])); 
        cvs.ctx.restore();
    }
    this.overlayRect = function(x, y, width, height, options){
        color = "black";
        fill = false;
        if(typeof(options.color) != 'undefined'){
            color = options.color;
        }
        if(typeof(options.fill) != 'undefined'){
            fill = options.fill;
        }
        cvs.ctx.beginPath();
        if(fill){
            cvs.ctx.fillStyle = color;
            cvs.ctx.fillRect(this.screenPos[0]+x, this.screenPos[1]+y, width, height);
        }
        else{
            cvs.ctx.strokeStyle = color;
            cvs.ctx.rect(this.screenPos[0]+x, this.screenPos[1]+y, width, height);
            cvs.ctx.stroke();
        }
    }
}