const gravity = 9.81/250;
var toDraw = [];
function engine(){
	this.time = 0;
	this.entities = [];
	this.camera = [];
	this.toDraw = [];
	this.keyMap = [];
	this.paused = false;
	for(var i = 0; i < 223; i++){
		this.keyMap[i] = false;
	}
	this.selection = []; //Used for mouse selecting. 
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
	
	
	//RECTANGLE COLLISION TEST 1\\
	sim.entities.push(new basicRectangle([450, 450], [30, 30], {gravity:false, initialVeloc:[10, 0], density:0.1}));
	//sim.entities.push(new basicRectangle([850, 0], [60, 60], {gravity:false, initialVeloc:[0, 6]}));
	sim.entities.push(new basicRectangle([800, 350], [60, 60], {gravity:false, initialVeloc:[1, 3], density:0.1}));
	sim.entities.push(new basicRectangle([1000, 350], [90, 90], {gravity:false, initialVeloc:[1, 3], density:0.1}));

	/*
	//RECTANGLE COLLISION TEST 2\\
	sim.entities.push(new basicRectangle([-60, 570], [60, 60], {gravity:false, initialVeloc:[5, 0], density:0.1, color:"rgb(255,0,255)"}));
	for(var i = 1; i < 28; i++){
		sim.entities.push(new basicRectangle([30+i*75, 570-5*i], [60, 60+10*i], {gravity:false, initialVeloc:[0, 0], density:0.1, color:"rgb("+Math.round((Math.random()*255))+","+Math.round((Math.random()*255))+","+Math.round((Math.random()*255))+")"}));
	}
	*/

	/*
	//RECTANGLE COLLISION TEST 3 (SPRING CHAOS)\\
	sim.entities.push(new basicRectangle([570, 0], [60, 60], {density:0.1}));
	sim.entities.push(new basicRectangle([100, 250], [60, 60], {density:0.1, initialVeloc: [4, 0], color: "blue"}))
	sim.entities.push(new basicRectangle([1450,800], [60,20], {gravity:false,infiniteMass:true})); //Spring for black
	sim.entities.push(new spring(sim.entities[sim.entities.length-1],90,100,20, 10, {sticky: true}))
	sim.entities.push(new basicRectangle([510,1000], [60,20], {gravity:false,infiniteMass:true})); //Spring for blue
	sim.entities.push(new spring(sim.entities[sim.entities.length-1],90,100,20, 10, {sticky: true}))
	sim.entities.push(new basicRectangle([-60, 1000], [60, 60], {density:0.1, initialVeloc: [6, -10]}))
	sim.entities.push(new basicRectangle([-300, 1500], [30, 30], {density:0.1, initialVeloc: [8, -12]}))
	sim.entities.push(new basicRectangle([-800, 4100], [60, 60], {density:0.1, initialVeloc: [3.5, -16]}))
	*/
	/*
	//SPRING COLLISION TEST 1\\ //BROKEN
	sim.entities.push(new basicRectangle([1200,1300], [60,20], {gravity:false,infiniteMass:true}));
	sim.entities.push(new spring(sim.entities[sim.entities.length-1],90,600,20, 0.1, {sticky: true}))
	sim.entities.push(new basicRectangle([1200, 0], [60, 60], {mass:100, initialVeloc:[0, 10]}));
	sim.entities.push(new basicRectangle([-600, 700], [60, 60], {mass:100, initialVeloc:[10, -5]}));
	*/


	sim.cameras[0] = new cameraConstructor(0, [0, 0], [0, 0], [1200, 600], {sizeMultiplier: 0.45});




	var updateLoop = setInterval(function loop(){
		sim.loop();
	}, 20);
	requestAnimationFrame(drawLoop);
	function drawLoop(){
		cvs.ctx.clearRect(0, 0, cvs.width, cvs.height);
		sim.drawLoop();
		requestAnimationFrame(drawLoop);
	}
	document.addEventListener("keydown", function(event){
		sim.keyMap[event.keyCode] = true;
		if(event.keyCode == 80){ //p
			if(sim.selection[0] != null && sim.selection[1] == null){
				console.log("Selection 1 Momentum: " + (sim.selection[0].mass*(sim.selection[0].veloc[0] + sim.selection[0].veloc[1])));
			}
			if(sim.selection[1] != null && sim.selection[0] == null){
				console.log("Selection 2 Momentum: " + (sim.selection[1].mass*(sim.selection[1].veloc[0] + sim.selection[1].veloc[1])));
			}
			if(sim.selection[0] != null && sim.selection[1] != null){
				console.log("Both Selections Combined Momentum: " + (sim.selection[0].mass*(sim.selection[0].veloc[0] + sim.selection[0].veloc[1]) + sim.selection[1].mass*(sim.selection[1].veloc[0] + sim.selection[1].veloc[1])));
			}
		}
		if(event.keyCode == 32){ // 
			event.preventDefault();
			if(!sim.paused){
				clearInterval(updateLoop);
				sim.paused = true;
			}
			else{
				updateLoop = setInterval(function loop(){
					sim.loop();
				}, 20);
				sim.paused = false;
			}
		}
	});
	document.addEventListener("keyup", function(event){
		sim.keyMap[event.keyCode] = false;
	});
}