const spt = 200/1000;
function engine(){
	this.time = 0;
	this.entities = [];
	this.loop = function(){
		for(var i = 0; i < this.entities.length; i++){
			this.entities[i].clearForces();
		}
		for(var i = 0; i < this.entities.length; i++){
			this.entities[i].updateForces();
		}
		for(var i = 0; i < this.entities.length; i++){
			this.entities[i].updatePos();
		}
	}
	this.drawLoop = function(){
		for(var i = 0; i < this.entities.length; i++){
			this.entities[i].draw();
		}
	}
	this.test = function(){
		console.log(this);
	}
}
function startEngine(){
	cvs.init();
	sim = new engine();
	sim.entities = [];
	var k = [];
	for(var i = 1; i < 15; i++){
		k.push(i*50);
	}
	//var k = [10, 20, 30, 50, 100, 150, 200, 500, 1000, 1500, 2000, 2500, 3000];
	for(var i = 0; i < k.length; i++){
		sim.entities.push(new basicRectangle([60+80*i,580], [60,20], {gravity:false,infiniteMass:true}));
		sim.entities.push(new spring(sim.entities[sim.entities.length-1],90,300,20, k[i], {sticky: true}))
		sim.entities.push(new basicRectangle([60+80*i,20], [60,60], {gravity:true,infiniteMass:false}));
	}

	
	




	var updateLoop = setInterval(function loop(){
		sim.loop();
	}, 20);
	requestAnimationFrame(drawLoop);
	function drawLoop(){
		cvs.ctx.clearRect(0, 0, cvs.width, cvs.height);
		sim.drawLoop();
		requestAnimationFrame(drawLoop);
	}
}