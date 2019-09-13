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
	sim.entities = [new basicRectangle([80,20], [60,60], {gravity:true,infiniteMass:false}), new basicRectangle([160,20], [60,60], {gravity:true,infiniteMass:false}), new basicRectangle([240,20], [60,60], {gravity:true,infiniteMass:false}), new basicRectangle([320,20], [60,60], {gravity:true,infiniteMass:false})];
	sim.entities.push(new basicRectangle([80,580], [60,20], {gravity:false,infiniteMass:true}));
	sim.entities.push(new spring(sim.entities[sim.entities.length-1],90,300,20, 1, {sticky: true}))
	
	sim.entities.push(new basicRectangle([160,580], [60,20], {gravity:false,infiniteMass:true}));
	sim.entities.push(new spring(sim.entities[sim.entities.length-1],90,300,20, 1, {sticky: true}))

	sim.entities.push(new basicRectangle([240,580], [60,20], {gravity:false,infiniteMass:true}));
	sim.entities.push(new spring(sim.entities[sim.entities.length-1],90,300,20, 5, {sticky: true}))

	sim.entities.push(new basicRectangle([320,580], [60,20], {gravity:false,infiniteMass:true}));
	sim.entities.push(new spring(sim.entities[sim.entities.length-1],90,300,20, 10, {sticky: true}))

	sim.entities.push(new basicRectangle([0, 20], [cvs.width, 1], {gravity: false,infiniteMass:true}))

	sim.entities.push(new basicRectangle([600,20], [60,60], {gravity:true,infiniteMass:false}))
	sim.entities.push(new basicRectangle([600,580], [60,20], {gravity:false,infiniteMass:true}));
	sim.entities.push(new spring(sim.entities[sim.entities.length-1],90,300,20, 100, {sticky: false}))
	//sim.entities = [new basicRectangle([20, 20], [20, 20], {gravity: false}), new basicRectangle([30, 30], [20, 20], {gravity: false}), new basicRectangle([80, 20], [20, 20], {gravity: false})]
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