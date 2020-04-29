const gravity = 9.81/50; //Should be 50
const defaultDensity = 0.1;
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
	for(var i = 0; i < 10; i++){
		this.selection[i] = null;
	}
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
		for(var i = 0; i < this.entities.length; i++){
			if(this.entities[i].collidedThisTick){ //TODO: Fix multiple vac collisions
				this.entities[i].vac = shiftArrayUp(this.entities[i].vac);
			}
			if(this.entities[i].vac = []){
				this.entities[i].vac = [[null, null]];
			}
			this.entities[i].collidedThisTick = false;
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
	ui = new userInterface();
	sim.entities = [];
	sim.cameras = [];
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
	//RECTANGLE COLLISION TEST 3 (SPRING CHAOS)\\
	sim.entities.push(new basicObject("block", [570, 0], [60, 60], {}));
	sim.entities.push(new basicObject("block", [100, 250], [60, 60], {initialVeloc: [4, 0], color: "blue"}))
	sim.entities.push(new basicObject("block", [1450,800], [60,20], {gravity:false,infiniteMass:true})); //Spring for black
	sim.entities.push(new spring(sim.entities[sim.entities.length-1],90,100,20, 10, {sticky: true}))
	sim.entities.push(new basicObject("block", [510,1000], [60,20], {gravity:false,infiniteMass:true})); //Spring for blue
	sim.entities.push(new spring(sim.entities[sim.entities.length-1],90,100,20, 10, {sticky: true}))
	sim.entities.push(new basicObject("block", [-60, 1000], [60, 60], {initialVeloc: [6, -10]}))
	sim.entities.push(new basicObject("block", [-300, 1500], [30, 30], {initialVeloc: [8, -12]}))
	sim.entities.push(new basicObject("block", [-800, 4100], [60, 60], {initialVeloc: [3.5, -16]}))
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
	//Rotation Collision Test\\
	//sim.entities.push(new basicObject("block", [450, 450], [100, 100], {gravity:false, initialVeloc:[2, 0], rAngle:0, interactable:false}));
	//sim.entities.push(new basicObject("circle", [450, 450], [15], {gravity:false, initialVeloc:[2, 0], interactable:false}));
	sim.entities.push(new basicObject("block", [600, 400], [100, 100], {gravity:false, initialVeloc:[10, 0], rAngle:0, rInitialVeloc:5, autoReturnColor:"black", collisionFlash:"red"}));
	sim.entities.push(new basicObject("block", [1100, 400], [200, 100], {gravity:false, initialVeloc:[5, 0], rAngle:0, rInitialVeloc:3, autoReturnColor:"black", collisionFlash:"red"}));
	sim.entities.push(new basicObject("block", [300, 0], [50, 1000], {gravity:false, initialVeloc:[0, 0], rAngle:0, rInitialVeloc:0, infiniteMass:true, infiniteI:true, autoReturnColor:"black", collisionFlash:"red"}));
	sim.entities.push(new basicObject("block", [1500, 0], [50, 1000], {gravity:false, initialVeloc:[0, 0], rAngle:0, rInitialVeloc:0, infiniteMass:true, infiniteI:true, autoReturnColor:"black", collisionFlash:"red"}));
	//sim.entities.push(new basicObject("block", [100, 150], [300, 10], {gravity:false, rAngle:0, interactable:true, rInitialVeloc:-5}));
	*/
	/*
	sim.cameras[0] = new cameraConstructor(0, [0, 0], [0, 0], [1200, 600], {sizeMultiplier: 0.6});
	sim.entities.push(new basicObject("block", [0, 0], [2000, 50], {gravity:false, infiniteMass:true}));
	sim.entities.push(new basicObject("block", [0, 1000], [2000, 50], {gravity:false, infiniteMass:true}));
	sim.entities.push(new basicObject("block", [-50, 0], [50, 1050], {gravity:false, infiniteMass:true}));
	sim.entities.push(new basicObject("block", [2000, 0], [50, 1050], {gravity:false, infiniteMass:true}));
	sim.entities.push(new basicObject("block", [500, 500], [50, 50], {gravity:false, initialVeloc: [10, 5]}));
	*/
	var preset = 9; //Look here to change default preset
	sim.entities = constructEntitiesFromString(presets[preset].simText);
	sim.cameras = constructCamerasFromString(presets[preset].camText);
	// sim.entities = constructEntitiesFromString(presets[presets.length-1].simText);
	// sim.cameras = constructCamerasFromString(presets[presets.length-1].camText);

	var updateLoop = setInterval(function loop(){
		if(!sim.paused){
			sim.loop();
		}
	}, 20);
	requestAnimationFrame(drawLoop);
	function drawLoop(){
		cvs.ctx.clearRect(0, 0, cvs.width, cvs.height);
		sim.drawLoop();
		ui.drawUI();
		requestAnimationFrame(drawLoop);
	}
	document.addEventListener("keydown", function(event){
		if(ui.selectedTextFieldIndex == -1){ //Means no text box is selected
			sim.keyMap[event.keyCode] = true;
			if(event.keyCode == 80){ //p
				var a = sim.entities[sim.selection[0]];
				var b = sim.entities[sim.selection[1]];
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
				var a = sim.entities[sim.selection[0]];
				var b = sim.entities[sim.selection[1]];
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
				sim.paused = !sim.paused;
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
		}
		else{
			var selectedField = ui.textFields[ui.selectedTextFieldIndex];
			if((selectedField.inputType == "int" || selectedField.inputType == "intNullX") && ((event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode == 189)){
				if(selectedField.value == "0" || selectedField.value == "x"){
					selectedField.value = "";
				}
				if(event.keyCode == 189 && selectedField.value == ""){ //Minus be wack
					selectedField.value += "-";
				}
				else{
					selectedField.value += String.fromCharCode(event.keyCode);
				}
			}
			if(selectedField.inputType == "color" && event.keyCode >= 65 && event.keyCode <= 90){
				if(selectedField.value.length == 0){
					selectedField.value += String.fromCharCode(event.keyCode); //Uper case
				}
				else{
					selectedField.value += String.fromCharCode(event.keyCode+32);
				}
			}
			if(selectedField.inputType == "string" && ((event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode == 189 || event.keyCode == 188)){
				if(event.keyCode >= 65 && event.keyCode <= 90){
					if(selectedField.value.length == 0 || selectedField.value.charAt(selectedField.value.length-1) == " " || selectedField.value.charAt(selectedField.value.length-1) == ","){
						selectedField.value += String.fromCharCode(event.keyCode); //Uper case
					}
					else{
						selectedField.value += String.fromCharCode(event.keyCode+32);
					}
				}
				else{
					selectedField.value += event.key;
				}
			}
			if(event.keyCode == 8){ //Delete
				selectedField.value = selectedField.value.substring(0, selectedField.value.length - 1);
				if(selectedField.value.length == 0){
					if(selectedField.inputType == "int"){
						selectedField.value = "0";
					}
					if(selectedField.inputType == "intNullX"){
						selectedField.value = "x";
					}
				}
			}
			if(ui.hoveredElement == 0){ //Search
				updateSearch();
			}
		}
		if(ui.selectedTextFieldIndex != -1){
			ui.keyDownTrigger();
		}
	});
	document.addEventListener("keyup", function(event){
		sim.keyMap[event.keyCode] = false;
	});
}
function resetEngine(){
	cvs.init();
	sim = new engine();
	sim.entities = [];
	sim.cameras = [];
}