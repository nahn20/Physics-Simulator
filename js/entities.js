function basicRectangle(x=0,y=0){
	this.dim = [10, 10];
	this.pos = [x, y];
	this.previousPos = [x, y];
	this.veloc = [0, 0];
	this.accel = [0, 0];
	this.force = [0, 0];
	this.mass = 10;
	this.loop = function(){
		this.updatePos();
	}
	this.updatePos = function(){
		this.veloc[0] += this.accel[0];
		this.veloc[1] += this.accel[1];
		this.pos[0] += this.veloc[0];
		this.pos[1] += this.veloc[1];
	}
	this.draw = function(){
		drawRect(this.pos, this.dim);
	}
}