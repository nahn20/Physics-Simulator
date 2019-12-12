const gravity = 9.81/500; //Should be 50
function engine(){
	this.time = 0;
	this.entities = [];
	this.camera = [];
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
function userInterface(){
	this.toDraw = [];
	this.selectionType = "none";
	this.mousePos = [0, 0];
	this.mouseDown = false;
	this.selectionCoordsA = [0, 0];
	this.selectionCoordsB = [0, 0];
	this.drawUI = function(){
		this.drawMouse();
	}
	this.drawMouse = function(){
		if(this.selectionType == "block"){
			if(this.mouseDown){ //Draws large rect while holding
				cvs.ctx.beginPath();
				cvs.ctx.strokeStyle = "black";
				cvs.ctx.lineWidth = 1;
				cvs.ctx.rect(this.selectionCoordsA[0], this.selectionCoordsA[1], this.mousePos[0]-this.selectionCoordsA[0], this.mousePos[1]-this.selectionCoordsA[1]);
				cvs.ctx.stroke();
			}
			else{ //Draw tiny cursor rect otherwise
				cvs.ctx.beginPath();
				cvs.ctx.strokeStyle = "black";
				cvs.ctx.lineWidth = 1;
				cvs.ctx.rect(this.mousePos[0]-15, this.mousePos[1]+15, 10, 10);
				cvs.ctx.stroke();
			}
		}
		if(this.selectionType == "circle"){
			if(this.mouseDown){ //Big draggy circle
				var radius = Math.sqrt(Math.pow(this.selectionCoordsA[0]-this.mousePos[0], 2) + Math.pow(this.selectionCoordsA[1]-this.mousePos[1], 2));
                cvs.ctx.beginPath();
                cvs.ctx.strokeStyle="black";
                cvs.ctx.arc(this.selectionCoordsA[0], this.selectionCoordsA[1], radius, 0, 2*Math.PI);
                cvs.ctx.stroke();
			}
			else{
                cvs.ctx.beginPath();
                cvs.ctx.strokeStyle="black";
                cvs.ctx.arc(this.mousePos[0]-10.5, this.mousePos[1]+19.5, 5, 0, 2*Math.PI);
                cvs.ctx.stroke();
			}
		}
	}
	this.mouseUpTrigger = function(){
		var selectionInEngineA;
		var selectionInEngineB;
		for(var i = 0; i < sim.cameras.length; i++){
			if(this.selectionCoordsA[0] > sim.cameras[i].screenPos[0] && this.selectionCoordsA[0] < sim.cameras[i].screenPos[0]+sim.cameras[i].dim[0] && this.selectionCoordsA[1] > sim.cameras[i].screenPos[1] && this.selectionCoordsA[1] < sim.cameras[i].screenPos[1]+sim.cameras[i].dim[1]){
				var x = (this.selectionCoordsA[0]-sim.cameras[i].screenPos[0])/sim.cameras[i].sizeMultiplier + sim.cameras[i].pos[0];
				var y = (this.selectionCoordsA[1]-sim.cameras[i].screenPos[1])/sim.cameras[i].sizeMultiplier + sim.cameras[i].pos[1];
				selectionInEngineA = [x, y];
				x = (this.selectionCoordsB[0]-sim.cameras[i].screenPos[0])/sim.cameras[i].sizeMultiplier + sim.cameras[i].pos[0];
				y = (this.selectionCoordsB[1]-sim.cameras[i].screenPos[1])/sim.cameras[i].sizeMultiplier + sim.cameras[i].pos[1];
				selectionInEngineB = [x, y];
			}
		}
		if(this.selectionType == "block"){
			var dim = [selectionInEngineB[0]-selectionInEngineA[0], selectionInEngineB[1]-selectionInEngineA[1]];
			if(dim[0] < 0){
				var temp = selectionInEngineA[0];
				selectionInEngineA[0] = selectionInEngineB[0];
				selectionInEngineB[0] = temp;
				dim = [selectionInEngineB[0]-selectionInEngineA[0], selectionInEngineB[1]-selectionInEngineA[1]];
			}
			if(dim[1] < 0){
				var temp = selectionInEngineA[1];
				selectionInEngineA[1] = selectionInEngineB[1];
				selectionInEngineB[1] = temp;
				dim = [selectionInEngineB[0]-selectionInEngineA[0], selectionInEngineB[1]-selectionInEngineA[1]];
			}
			var rect = new basicObject("block", selectionInEngineA, dim, {gravity:true, density:0.1});
			var collidingWithAnything = false;
			for(var i = 0; i < sim.entities.length; i++){
				if(isCollision(0, sim.entities[i], rect).both){
					collidingWithAnything = true;
					break;
				}
			}
			if(!collidingWithAnything){
				sim.entities.push(rect);
			}
			else{
				console.log("Error: Block summoned inside of existing entity.")
			}
		}
		if(this.selectionType == "circle"){
			var dim = [Math.sqrt(Math.pow(selectionInEngineA[0]-selectionInEngineB[0], 2) + Math.pow(selectionInEngineA[1]-selectionInEngineB[1], 2))];
			var circ = new basicObject("circle", selectionInEngineA, dim, {gravity:true, density:0.1});
			var collidingWithAnything = false;
			for(var i = 0; i < sim.entities.length; i++){
				if(isCollision(0, sim.entities[i], circ).both){
					collidingWithAnything = true;
					break;
				}
			}
			if(!collidingWithAnything){
				sim.entities.push(circ);
			}
			else{
				console.log("Error: Block summoned inside of existing entity.")
			}
		}
	}
}
function startEngine(){
	cvs.init();
	sim = new engine();
	ui = new userInterface();
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
		sim.entities.push(new basicObject("block", [60+150*i,580], [60,20], {gravity:false,infiniteMass:true}));
		sim.entities.push(new spring(sim.entities[sim.entities.length-1],90,300,20, k[i], {sticky: true}))
		sim.entities.push(new basicObject("block", [0+150*i,20], [60,60], {gravity:true,infiniteMass:false,initialVeloc:[1000/2500,0]}));
	}
	sim.entities.push(new basicObject("block", [0, 279], [cvs.width, 1], {gravity:false,infiniteMass:true,interactable:false}));
	sim.cameras[0] = new cameraConstructor(0, [0, 0], [0, 0], [600, 300], {sizeMultiplier: 0.5});
	sim.cameras[1] = new cameraConstructor(1, [0, 0], [0, 300], [600, 300], {sizeMultiplier: 0.5});
	sim.cameras[2] = new cameraConstructor(2, [0, -200], [600, 0], [600, 600], {sizeMultiplier: 0.5});
	*/
	
	/*
	//RECTANGLE COLLISION TEST 1\\
	
	sim.entities.push(new basicObject("block", [450, 450], [30, 30], {gravity:false, initialVeloc:[10, 0], density:0.1}));
	//sim.entities.push(new basicObject("block", [850, 0], [60, 60], {gravity:false, initialVeloc:[0, 6]}));
	sim.entities.push(new basicObject("block", [800, 450], [60, 60], {gravity:false, initialVeloc:[1, 0], density:0.1}));
	//sim.entities.push(new basicObject("block", [1000, 350], [90, 90], {gravity:true, initialVeloc:[1, 3], density:0.1}));
	*/


	/*
	//RECTANGLE COLLISION TEST 2\\
	sim.entities.push(new basicObject("block", [-60, 570], [60, 60], {gravity:false, initialVeloc:[5, 0], density:0.1, color:"rgb(255,0,255)"}));
	for(var i = 1; i < 28; i++){
		sim.entities.push(new basicObject("block", [30+i*75, 570-5*i], [60, 60+10*i], {gravity:false, initialVeloc:[0, 0], density:0.1, color:"rgb("+Math.round((Math.random()*255))+","+Math.round((Math.random()*255))+","+Math.round((Math.random()*255))+")"}));
	}
	*/

	/*
	//RECTANGLE COLLISION TEST 3 (SPRING CHAOS)\\
	sim.entities.push(new basicObject("block", [570, 0], [60, 60], {density:0.1}));
	sim.entities.push(new basicObject("block", [100, 250], [60, 60], {density:0.1, initialVeloc: [4, 0], color: "blue"}))
	sim.entities.push(new basicObject("block", [1450,800], [60,20], {gravity:false,infiniteMass:true})); //Spring for black
	sim.entities.push(new spring(sim.entities[sim.entities.length-1],90,100,20, 10, {sticky: true}))
	sim.entities.push(new basicObject("block", [510,1000], [60,20], {gravity:false,infiniteMass:true})); //Spring for blue
	sim.entities.push(new spring(sim.entities[sim.entities.length-1],90,100,20, 10, {sticky: true}))
	sim.entities.push(new basicObject("block", [-60, 1000], [60, 60], {density:0.1, initialVeloc: [6, -10]}))
	sim.entities.push(new basicObject("block", [-300, 1500], [30, 30], {density:0.1, initialVeloc: [8, -12]}))
	sim.entities.push(new basicObject("block", [-800, 4100], [60, 60], {density:0.1, initialVeloc: [3.5, -16]}))
	*/
	/*
	//SPRING COLLISION TEST 1\\ //BROKEN
	sim.entities.push(new basicObject("block", [1200,1300], [60,20], {gravity:false,infiniteMass:true}));
	sim.entities.push(new spring(sim.entities[sim.entities.length-1],90,600,20, 0.1, {sticky: true}))
	sim.entities.push(new basicObject("block", [1200, 0], [60, 60], {mass:100, initialVeloc:[0, 10]}));
	sim.entities.push(new basicObject("block", [-600, 700], [60, 60], {mass:100, initialVeloc:[10, -5]}));
	*/

	/*
	//RECTANGLE MULTI BOUNCE PI TEST\\
	sim.entities.push(new basicObject("block", [0, 1201], [10000, 300], {gravity:false,infiniteMass:true,color:"green"}));
	//sim.entities.push(new basicObject("block", [0, 700], [100, 500], {gravity:false,infiniteMass:true}));
	//sim.entities.push(new basicObject("block", [300, 1100], [100, 100], {gravity:false,mass:1,displayNumCollision:true}));
	//sim.entities.push(new basicObject("block", [500, 900], [300, 300], {gravity:false,mass:1,initialVeloc:[-.0001,0]}));
	//sim.entities.push(new basicObject("block", [500, 900], [300, 300], {gravity:false,mass:100,initialVeloc:[-.0001,0]}));
	//sim.entities.push(new basicObject("block", [500, 900], [300, 300], {gravity:false,mass:10000,initialVeloc:[-.0001,0]}));
	//sim.entities.push(new basicObject("block", [500, 900], [300, 300], {gravity:false,mass:1000000,initialVeloc:[-0.0001,0]}));
	//sim.entities.push(new basicObject("block", [500, 900], [300, 300], {gravity:false,mass:100000000,initialVeloc:[-0.0001,0]}));
	//sim.entities.push(new basicObject("block", [500, 900], [300, 300], {gravity:false,mass:10000000000,initialVeloc:[-0.0001,0]}));
	//sim.entities.push(new basicObject("block", [500, 900], [300, 300], {gravity:false,mass:1000000000000,initialVeloc:[-0.0001,0]}));
	//sim.entities.push(new basicObject("block", [500, 900], [300, 300], {gravity:false,mass:100000000000000,initialVeloc:[-0.00001,0]})); //Works but slow af
	for(var i = 0; i < 6; i++){
		var k = 0;
		var q = i;
		var s = i;
		if(i > 3){
			k=1;
			q-=4;
		}
		sim.cameras.push(new cameraConstructor(i, [1000*i, 400], [300*q, 300*k], [300, 300], {sizeMultiplier: 0.3}));
		sim.entities.push(new basicObject("block", [1000*i, 700], [100, 500], {gravity:false,infiniteMass:true}));
		sim.entities.push(new basicObject("block", [200+1000*i, 1100], [100, 100], {gravity:false,mass:1,displayNumCollision:true}));
		sim.entities.push(new basicObject("block", [400+1000*i, 1100-s*100], [100+s*100, 100+s*100], {gravity:false,mass:Math.pow(10,2*i),initialVeloc:[-.0001,0],color:"gray"}));
	}
	*/
	/*
	//Circle Collision Test\\
	sim.entities.push(new basicObject("circle", [100, 100], [90], {initialVeloc: [3, 2],gravity:true, density:0.1}));
	sim.entities.push(new basicObject("circle", [500, 400], [50], {gravity:true, density:0.1}));
	*/

	/*
	//Rotation Collision Test\\
	//sim.entities.push(new basicObject("block", [450, 450], [100, 100], {gravity:false, initialVeloc:[2, 0], density:0.1, rAngle:0, interactable:false}));
	//sim.entities.push(new basicObject("circle", [450, 450], [15], {gravity:false, initialVeloc:[2, 0], density:0.1, interactable:false}));
	sim.entities.push(new basicObject("block", [600, 400], [100, 100], {gravity:false, initialVeloc:[10, 0], rAngle:0, rInitialVeloc:5, autoReturnColor:"black", collisionFlash:"red"}));
	sim.entities.push(new basicObject("block", [1100, 400], [200, 100], {gravity:false, initialVeloc:[5, 0], rAngle:0, rInitialVeloc:3, autoReturnColor:"black", collisionFlash:"red"}));
	sim.entities.push(new basicObject("block", [300, 0], [50, 1000], {gravity:false, initialVeloc:[0, 0], rAngle:0, rInitialVeloc:0, infiniteMass:true, infiniteI:true, autoReturnColor:"black", collisionFlash:"red"}));
	sim.entities.push(new basicObject("block", [1500, 0], [50, 1000], {gravity:false, initialVeloc:[0, 0], rAngle:0, rInitialVeloc:0, infiniteMass:true, infiniteI:true, autoReturnColor:"black", collisionFlash:"red"}));
	//sim.entities.push(new basicObject("block", [100, 150], [300, 10], {gravity:false, density:0.1, rAngle:0, interactable:true, rInitialVeloc:-5}));
	*/

	sim.entities.push(new basicObject("block", [600, 200], [50, 50], {gravity:false, initialVeloc:[10, 0], rAngle:1, rInitialVeloc:10,autoReturnColor:"black", collisionFlash:"red"}));
	sim.entities.push(new basicObject("block", [1100, 400], [400, 50], {gravity:false, initialVeloc:[0, 0], rAngle:60, rInitialVeloc:0, autoReturnColor:"black", collisionFlash:"red"}));
	/*
	//Basic Rotation Collision Test\\
	sim.entities.push(new basicObject("block", [10, -5], [1, 1], {gravity:false, initialVeloc:[0, .2], rInitialVeloc: 1}))
	sim.entities.push(new basicObject("block", [0, 0], [1, 1], {gravity:false, initialVeloc:[.35, 0], rAngle:0, rInitialVeloc:5, autoReturnColor:"black", collisionFlash:"red"}));
	sim.cameras[0] = new cameraConstructor(0, [-30, -20], [0, 0], [1200, 600], {sizeMultiplier: 12});
	*/
	sim.cameras[0] = new cameraConstructor(0, [0, 0], [0, 0], [1200, 600], {sizeMultiplier: 0.6});
	


	var updateLoop = setInterval(function loop(){
		sim.loop();
	}, 20);
	requestAnimationFrame(drawLoop);
	function drawLoop(){
		cvs.ctx.clearRect(0, 0, cvs.width, cvs.height);
		sim.drawLoop();
		ui.drawUI();
		requestAnimationFrame(drawLoop);
	}
	document.addEventListener("keydown", function(event){
		sim.keyMap[event.keyCode] = true;
		if(event.keyCode == 80){ //p
			var a = sim.selection[0];
			var b = sim.selection[1];
			if(a != null && b == null){
				console.log("Selection 1 Momentum \nX: " + a.mass*a.veloc[0] + "\nY: " + a.mass*a.veloc[1]);
			}
			if(b != null && a == null){
				console.log("Selection 2 Momentum \nX: " + b.mass*b.veloc[0] + "\nY: " + b.mass*b.veloc[1]);
			}
			if(a != null && b != null){
				console.log("Both Selections Combined Momentum \nX: " + (a.mass*a.veloc[0]+b.mass*b.veloc[0]) + "\nY: " + (a.mass*a.veloc[1]+b.mass*b.veloc[1]));
			}
		}
		if(event.keyCode == 74){ //j
			var a = sim.selection[0];
			var b = sim.selection[1];
			if(a != null && b == null){
				console.log("Selection 1 Kinetic Energy: " + a.mass*Math.pow(findMag(a.veloc), 2));
			}
			if(b != null && a == null){
				console.log("Selection 2 Kinetic Energy: " + b.mass*Math.pow(findMag(b.veloc), 2));
			}
			if(a != null && b != null){
				console.log("Both Selections Combined Kinetic Energy: " + (a.mass*Math.pow(findMag(a.veloc), 2)+b.mass*Math.pow(findMag(b.veloc), 2)));
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
		if(event.keyCode == 66){ //b
			ui.selectionType = "block";
		}
		if(event.keyCode == 67){ //c
			ui.selectionType = "circle";
		}
		if(event.keyCode == 27){ //esc
			ui.selectionType = "none";
		}
	});
	document.addEventListener("keyup", function(event){
		sim.keyMap[event.keyCode] = false;
	});
}