const gravity = 9.81/250;
var toDraw = [];
function engine(){
	this.time = 0;
	this.entities = [];
	this.camera = [];
	this.toDraw = [];
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
		for(var i = 0; i < this.cameras.length; i++){
			this.cameras[i].drawAll();
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
	sim.cameras = [];
	var k = [];
	// for(var i = 1; i < 15; i++){
	// 	k.push(i*50);
	// }
	/*
	//BOUNCY SPRINGS\\
	var k = [10, 20, 30, 50, 100, 150, 200, 500, 1000, 1500, 2000, 2500, 3000];
	for(var i = 1; i < 8; i++){
		k.push(0.5);
	}
	for(var i = 0; i < k.length; i++){
		sim.entities.push(new basicRectangle([60+150*i,580], [60,20], {gravity:false,infiniteMass:true}));
		sim.entities.push(new spring(sim.entities[sim.entities.length-1],90,300,20, k[i], {sticky: true}))
		sim.entities.push(new basicRectangle([0+150*i,20], [60,60], {gravity:true,infiniteMass:false,initialVeloc:[1000/2500,0]}));
	}
	sim.entities.push(new basicRectangle([0, 279], [cvs.width, 1], {gravity:false,infiniteMass:true,interactable:false}));
	sim.cameras[0] = new cameraConstructor(0, [0, 0], [0, 0], [600, 300], {sizeMultiplier: 0.5});
	sim.cameras[1] = new cameraConstructor(1, [0, 0], [0, 300], [600, 300], {sizeMultiplier: 0.5});
	sim.cameras[2] = new cameraConstructor(2, [0, -200], [600, 0], [600, 600], {sizeMultiplier: 0.5});
	*/
	
	//RECTANGLE COLLISION TEST\\
	sim.entities.push(new basicRectangle([450, 450], [30, 30], {gravity:false, initialVeloc:[10, 0], density:0.1}));
	//sim.entities.push(new basicRectangle([850, 0], [60, 60], {gravity:false, initialVeloc:[0, 6]}));
	sim.entities.push(new basicRectangle([800, 350], [60, 60], {gravity:false, initialVeloc:[1, 3], density:0.1}));
	sim.entities.push(new basicRectangle([1000, 350], [90, 90], {gravity:false, initialVeloc:[1, 3], density:0.1}));

	sim.cameras[0] = new cameraConstructor(0, [0, 0], [0, 0], [1200, 600], {sizeMultiplier: 0.5});




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