function engine(){
	this.time = 0;
	this.entities = [];

	this.loop = function(){
		for(var i = 0; i < this.entities.length; i++){
			this.entities[i].loop();
		}
	}
	this.drawLoop = function(){
		for(var i = 0; i < this.entities.length; i++){
			this.entities[i].draw();
		}

		requestAnimationFrame(this.drawLoop);
	}
}
function startEngine(){
	cvs.init();
	sim = new engine();
	sim.entities = [new basicRectangle([0, 0])];
	
	
	requestAnimationFrame(sim.drawLoop);
}