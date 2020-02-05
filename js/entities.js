function basicObject(type="block", pos=[0,0],dim=[10,10],options){
	this.type = type;
	this.pos = pos;
	this.veloc = [0, 0];
	this.accel = [0, 0];
	this.force = [[0], [0]];
	//Rotational Stuff\\
	this.rAngle = 0; //Degrees, sorry. Also positive is clockwise
	this.rVeloc = 0;
	this.rAccel = 0;
	this.rTorque = [0];
	this.rcom = [0, 0]; //Rotational Center of Mass. Based relative to the object's position. 
	this.rI = 1;
	//\\
	this.dim = dim;
	this.mass = 0;
	this.density = 0;
	this.gravity = true;
	this.infiniteMass = false;
	this.infiniteI = false;
	this.interactable = true;
	this.color = "black";
	this.autoReturnColor = false; //Color the object returns to after every draw cycle. 
	this.collisionFlash = false; //Define this with a color
	this.fill = true;
	this.sticky = false;
	this.energyLossCoefficient = 1;
	this.updatePosOverride = false;
	this.collisionCounter = 0;
	this.displayNumCollision = false;
	this.pointMass = true;
	if(typeof(options.gravity) != 'undefined'){
		this.gravity = options.gravity;
	}
	if(typeof(options.infiniteMass) != 'undefined'){
		this.infiniteMass = options.infiniteMass;
	}
	if(typeof(options.infiniteI) != 'undefined'){
		this.infiniteI = options.infiniteI;
	}
	if(typeof(options.pointMass) != 'undefined'){
		this.pointMass = options.pointMass;
	}
	if(typeof(options.mass) != 'undefined'){ //Checks for set mass first
		this.mass = options.mass;
		if(this.type == "block"){
			this.density = this.mass/(this.dim[0]*this.dim[1]);
		}
		if(this.type == "circle"){
			this.density = this.mass/(Math.PI*this.dim[0]*this.dim[0]);
		}
	}
	else{
		var density = 0.1;
		if(typeof(options.density) != 'undefined'){ //Otherwise uses a density choice, or 0.1 for density
			density = options.density;
		}
		if(this.type == "block"){
			this.mass = density*this.dim[0]*this.dim[1];
		}
		if(this.type == "circle"){
			this.mass = density*Math.PI*this.dim[0]*this.dim[0];
		}
		this.density = density;
	}
	if(typeof(options.rAngle) != 'undefined'){
		this.rAngle = options.rAngle;
	}
	if(typeof(options.rInitialVeloc) != 'undefined'){
		this.rVeloc = options.rInitialVeloc;
	}
	if(typeof(options.rcom) != 'undefined'){ //Handling center of mass
		this.rcom = options.rcom;
	}
	else{
		if(this.type == "block"){
			this.rcom = [this.dim[0]/2, this.dim[1]/2];
		}
		if(this.type == "circle"){
			this.rcom = [0, 0];
		}
	}
	if(typeof(options.rI) != 'undefined'){ //Takes given rotational inertia, otherwise it calculates its own
		this.rI = options.rI;
	}
	else{
		if(this.shape == "block"){
			this.rI = (1/12)*this.mass*(this.dim[0]*this.dim[0]+this.dim[1]*this.dim[1]);
		}
		if(this.shape == "circle"){
			this.rI = (1/2)*this.mass*this.dim[0]*this.dim[0];
		}
	}
	if(typeof(options.initialVeloc) != 'undefined'){
		this.veloc = options.initialVeloc;
	}
	if(typeof(options.interactable) != 'undefined'){
		this.interactable = options.interactable;
	}
	if(typeof(options.sticky) != 'undefined'){
		this.sticky = options.sticky;
	}
	if(typeof(options.velocLossCoefficient) != 'undefined'){
		this.velocLossCoefficient = options.velocLossCoefficient;
	}
	if(typeof(options.color) != 'undefined'){
		this.color = options.color;
	}
	if(typeof(options.autoReturnColor) != 'undefined'){
		this.autoReturnColor = options.autoReturnColor;
	}
	if(typeof(options.collisionFlash) != 'undefined'){
		this.collisionFlash = options.collisionFlash;
		if(this.autoReturnColor == false){
			this.autoReturnColor = this.color;
		}
	}
	if(typeof(options.displayNumCollision) != 'undefined'){
		this.displayNumCollision = options.displayNumCollision;
	}
	this.clearForces = function(){
		this.force = [[], []];
		this.rTorque = [];
	}
	this.updateForces = function(){
		if(this.gravity){
			this.force[1].push(gravity*this.mass);
		}
		for(var i = 0; i < sim.entities.length; i++){
			if(sim.entities[i] != this && sim.entities[i].interactable == true){
				var collisionReturns = isCollision(0, this, sim.entities[i]);
				if(isRectRectCollision(0, this, sim.entities[i]).both && sim.entities[i].type == "spring"){ //Spring block collision
					var force = sumArray(this.force[0]);
					sim.entities[i].force[0].push(force);
					this.force[0].push(-force);
					var force = sumArray(this.force[1]);
					sim.entities[i].force[1].push(force);
					this.force[1].push(-force);
				} //Redo the structure below: It runs all the checks
				else if(collisionReturns.both){
					if(collisionReturns.margin < 0){
						//console.log("Split Error: Margin " + collisionReturns.margin);
					}
					if(this.collisionFlash != false){
						this.color = this.collisionFlash;
					}
					if(!this.sticky && !sim.entities[i].sticky){ //No stick
						var vxFinal;
						var vyFinal;
						var vrFinal;
						this.collisionCounter++;
						//Need to fix directionality of rotationCoords
						if(!this.infiniteMass && !sim.entities[i].infiniteMass){ //Translational conservation of momentum
							var a = {
								m : this.mass,
								v : this.veloc[0],
							}; //Using variable names from my equation, sorry for bad naming convention
							var b = {
								m : sim.entities[i].mass,
								v : sim.entities[i].veloc[0],
							};
							var k = this.energyLossCoefficient*sim.entities[i].energyLossCoefficient;
							vxFinal = this.bigCollisionMomentumEquation(a, b, k);
							a.v = this.veloc[1];
							b.v = sim.entities[i].veloc[1];
							vyFinal = this.bigCollisionMomentumEquation(a, b, k);
						}
						else if(sim.entities[i].infiniteMass){
							vxFinal = -this.veloc[0];
							vyFinal = -this.veloc[1];
						}
						if(!this.infiniteI && !sim.entities[i].infiniteI){ //Rotational conservation of momentum
							function findVelocFromRotation(obj, collisionCoords){
								var deltaX = collisionCoords[0]-obj.pos[0]+obj.rcom[0];
								var deltaY = collisionCoords[1]-obj.pos[1]+obj.rcom[1];
								var rCoords = [deltaY, -deltaX];
								var mag = findMag(rCoords);
								rCoords[0] /= mag; //Turning into unit vector
								rCoords[1] /= mag;
								var distance = Math.sqrt(sqr(deltaX)+sqr(deltaY));
								var stuff = {
									x : distance*obj.rVeloc*rCoords[0],
									y : distance*obj.rVeloc*rCoords[1],
									distance : distance,
								}
								return stuff;
							}
							var k = this.energyLossCoefficient*sim.entities[i].energyLossCoefficient;
							var aStuff = findVelocFromRotation(this, collisionReturns.collisionCoords);
							var bStuff = findVelocFromRotation(sim.entities[i], collisionReturns.collisionCoords);
							var a = {
								m : this.density,
								v : aStuff.x+this.veloc[0],
							}; //Using variable names from my equation, sorry for bad naming convention
							var b = {
								m : sim.entities[i].density,
								v : bStuff.x+sim.entities[i].veloc[0],
							}
							var vx = this.bigCollisionMomentumEquation(a, b, k);
							a.v = aStuff.y + this.veloc[1];
							b.v = bStuff.y + sim.entities[i].veloc[1];
							var vy = this.bigCollisionMomentumEquation(a, b, k);
							vx -= this.veloc[0];
							vy -= this.veloc[1];
							var vr = [vx, vy];
							var u = [aStuff.x, aStuff.y];
							var mag = findMag(u);
							if(mag != 0){
								u[0] /= mag;
								u[1] /= mag;
							}
							var projScalar = vr[0]*u[0]+vr[1]*u[1];
							vr = scalarMult(projScalar, u);
							vrFinal = findMag(vr)/aStuff.distance;
						}
						else if(sim.entities[i].infiniteI){
							vrFinal = -this.rVeloc;
						}
						//console.log(this.color + "'s\nDelta V: " + (vxFinal-this.veloc[0])+ "\nPos: " + this.pos[0]);
						this.force[0].push(this.mass*(vxFinal-this.veloc[0]));
						this.force[1].push(this.mass*(vyFinal-this.veloc[1]));
						this.rTorque.push(this.rI*(vrFinal-this.rVeloc));
					}
				}
			}
		}
	}
	this.bigCollisionMomentumEquation = function(a, b, k){
		//Third Try\\
		var alpha = (a.m*a.v)+(b.m*b.v);
		var c = (a.m*b.m)+(a.m*a.m);
		var d = -2*a.m*alpha
		var blob = (k*a.m*b.m*a.v*a.v)+(k*b.m*b.m*b.v*b.v)-(alpha*alpha)+(d*d/(4*c));
		var coefficient = 1;
		if(b.v-a.v < 0){
			coefficient = -1;
		}
		var velocFinal = (coefficient*Math.sqrt(blob)-(d/(2*Math.sqrt(c))))/Math.sqrt(c);

		//ELASTIC VERSION\\
		//var velocFinal = a.v*(a.m-b.m)/(a.m+b.m)+2*b.v*b.m/(a.m+b.m);
		return velocFinal;
	}
	this.updatePos = function(split){
		if(!this.infiniteMass){
			this.accel[0] = sumArray(this.force[0]) / this.mass;
			this.accel[1] = sumArray(this.force[1]) / this.mass;
		}
		if(!this.infiniteI){
			this.rAccel = sumArray(this.rTorque) / this.rI;
		}
		//STANDARD
		this.veloc[0] += split*this.accel[0];
		this.veloc[1] += split*this.accel[1];
		this.rVeloc += split*this.rAccel;
		if(!this.updatePosOverride){
			this.pos[0] += split*this.veloc[0];
			this.pos[1] += split*this.veloc[1];
			this.rAngle += split*this.rVeloc;
		}
		for(var i = 0; i < sim.entities.length; i++){
			if(this != sim.entities[i]){ //This is incredibly unintelligent. TODO: Fix this and the other place you do this
				var collisionReturns = isCollision(0, this, sim.entities[i]);
				while(collisionReturns.both){
					var objiCenter = findCenterOf(sim.entities[i]);
					var nudgeVector = normalizeVector([this.pos[0]-objiCenter[0], this.pos[1]-objiCenter[1]]);
					//TODO: Fix. This only happens for entity i=0 since it gets nudged and entity i=1 doesn't collide. 
					this.pos = addVectors(this.pos, nudgeVector);
					collisionReturns = isCollision(0, this, sim.entities[i]);
				}
			}
		}
	}
	this.determineTickSplit = function(split){
		const collisionSplitAmount = 1/2; //Splits time by this amount when there's a collision
		function velocFlipCheck(veloc, accel, split){
			var newVeloc = veloc + split*accel;
			if((veloc > 0 && newVeloc < 0) || (veloc < 0 && newVeloc > 0)){
				console.log("Split By Veloc")
				if(Math.abs(veloc/accel) > split){
					console.log("ERROR LOOK HERE ASDF")
				}
				return Math.abs(veloc/accel);
			}
			return 1;
		}
		var splitAmount = [1, 1, 1]; //1 means doesn't need split
		splitAmount[0] = velocFlipCheck(this.veloc[0], this.accel[0], split);
		splitAmount[1] = velocFlipCheck(this.veloc[1], this.accel[1], split);
		splitAmount[2] = velocFlipCheck(this.rVeloc, this.rAccel, split);
		var lowestSplit = lowestValueInArray(splitAmount);
		function modelPos(entity, k, s){ //1 for adding, -1 for undoing
			if(k == 1){
				entity.veloc[0] += s*entity.accel[0];
				entity.veloc[1] += s*entity.accel[1];
				entity.rVeloc += s*entity.rAccel;
				if(!entity.updatePosOverride){
					entity.pos[0] += s*entity.veloc[0];
					entity.pos[1] += s*entity.veloc[1];
					entity.rAngle += s*entity.rVeloc;
				}
			}
			if(k == -1){
				if(!entity.updatePosOverride){
					entity.pos[0] -= s*entity.veloc[0];
					entity.pos[1] -= s*entity.veloc[1];
					entity.rAngle -= s*entity.rVeloc;
				}	
				entity.veloc[0] -= s*entity.accel[0];
				entity.veloc[1] -= s*entity.accel[1];
				entity.rVeloc -= s*entity.rAccel;
			}
		}
		modelPos(this, 1, split);
		for(var i = 0; i < sim.entities.length; i++){
			if(sim.entities[i] != this && sim.entities[i].interactable == true){
				modelPos(sim.entities[i], 1, split);
				var collisionReturns = isCollision(0, this, sim.entities[i]);
				modelPos(sim.entities[i], -1, split);
				if(collisionReturns.margin < 0){
					modelPos(this, -1, split);
					return collisionSplitAmount*split;
				}
			}
		}
		if(lowestSplit != 1){
		}
		modelPos(this, -1, split);
		return lowestSplit;
	}
}
function spring(supportBlock,angle=90,equilibrium=100,otherDim=30,k=30, options){
	this.type = "spring";
	this.supportBlock = supportBlock;
	this.extension = 0; //Amount extended from equilibrium. Towards base is negative
	this.otherDim = otherDim; //Height for horizontal spring
	this.angle = angle;
	this.force = [[], []];
	this.k = k;
	this.sticky = false;
	this.stuck = null;
	this.initialEquilibrium = equilibrium;
	this.equilibrium = equilibrium; //Always positive
	this.pos = [0, 0];
	this.dim = [0, 0];
	this.attachedTime = 0;
	this.amplitude = 0;
	if(typeof(options.sticky) != 'undefined'){
		this.sticky = options.sticky;
	}
	this.clearForces = function(){
		this.force = [[], []];
	}
	this.updateForces = function(){
		var attached = false;
		if(!this.stuck){
			for(var i = 0; i < sim.entities.length; i++){
				if(sim.entities[i].type == "block" && sim.entities[i] != this.supportBlock && sim.entities[i].interactable == true){
					if(isRectRectCollision(0, this, sim.entities[i]).both){
						if(this.angle == 90){
							if(this.sticky){
								this.stuck = sim.entities[i];
								this.stuck.updatePosOverride = true;
								var shift = this.stuck.mass*gravity/this.k;
								this.amplitude = Math.sqrt(this.stuck.mass*(2*gravity*shift+this.stuck.veloc[1]*this.stuck.veloc[1])/this.k);
								this.equilibrium -= shift;
								this.attachedTime = -Math.asin(shift/this.amplitude)/(Math.sqrt(this.k/this.stuck.mass));
								this.stuck.veloc[1] = 0;
							}
							else{
								this.attachedTime++;
							}
						}
					}
				}
			}
		}
		if(this.stuck){
			this.attachedTime++;
			if(!isRectRectCollision(0, this, this.stuck).x){
				if(this.angle == 90){
					var angle = this.attachedTime*Math.sqrt(this.k/this.stuck.mass);
					this.stuck.veloc[1] = this.amplitude*Math.cos(angle)*(angle/this.attachedTime); //Derivative of position
					this.stuck.updatePosOverride = false;
				}
				this.stuck = null;
			}
		}
		if(!attached && !this.stuck){
			if(this.equilibrium != this.initialEquilibrium){ //Note releasing makes no sense for sticky. Make sticky set x veloc to 0
				this.equilibrium += (this.k/15)*(this.initialEquilibrium-this.equilibrium)
				if(Math.abs(this.initialEquilibrium - this.equilibrium) < 0.1){
					this.equilibrium = this.initialEquilibrium;
				}
			}
			if(this.extension != 0){
				this.extension -= (this.k/15)*this.extension
				if(Math.abs(this.extension) < 0.1){
					this.extension = 0;
				}
			}
			this.attachedTime = 0;
		}
	}
	this.updatePos = function(){
		if(this.angle == 90){
			if(this.stuck){
				var angle = this.attachedTime*Math.sqrt(this.k/this.stuck.mass);
				this.extension = this.amplitude*Math.sin(angle);
				this.stuck.pos[0] += this.stuck.veloc[0]; //Since position control is disabled in the block
				this.stuck.veloc[1] = this.amplitude*Math.cos(angle)*(angle/this.attachedTime);
			}
			var baseX = this.supportBlock.pos[0] + this.supportBlock.dim[0]/2 - this.otherDim/2;
			var baseY = this.supportBlock.pos[1] - this.equilibrium + this.extension;
			this.pos = [baseX, baseY];
			this.dim = [this.otherDim, this.equilibrium - this.extension];
			if(this.stuck){
				this.stuck.pos[1] = this.pos[1] - this.stuck.dim[1];
			}

		}
	}
}
function findCenterOf(obj){ //Returns as [x, y] the approximate center coords of the shape
	if(obj.type == "rect"){
		if(typeof(rect1.rAngle) != 'undefined' || rect1.rAngle % 180 == 0){ //standard rect
			return [obj.pos[0]+obj.dim[0]/2, obj.pos[1]+obj.dim[1]/2];
		}
		else{
			console.log("ERROR: findCenterOf(). You didn't code this yet")
		}
	}
	if(obj.type == "circle"){
		return obj.pos;
	}
	console.log("ERROR: findCenterOf(). Shape not found: " + obj.shape)
}
function isCollision(whenCalculate, obj1, obj2){
	var maxMargin = 0.1;
	if(obj1.type == "block" || obj1.type == "spring"){
		if(obj2.type == "block" || obj2.type == "spring"){
			return isRectRectCollision(whenCalculate, obj1, obj2);
		}
		if(obj2.type == "circle"){
			return isCircRectCollision(whenCalculate, obj2, obj1, maxMargin);
		}
	}
	if(obj1.type == "circle"){
		if(obj2.type == "block" || obj2.type == "spring"){
			isCircRectCollision(whenCalculate, obj1, obj2, maxMargin);
		}
		if(obj2.type == "circle"){
			return isCircCircCollision(whenCalculate, obj2, obj1, maxMargin);
		}
	}
}
function isRectRectCollision(whenCalculate, rect1, rect2){ //whenCalculate = 0 for present, 1 for future. //TODO: Add Margin to rectrect Collisions
	var isCollision = {
		x : false,
		y : false,
		both : false,
		collisionCoords : [],
		margin : null,
	}
	var angleCheck = {
		a1 : 0, 
		a2 : 0,
	}
	if(typeof(rect1.rAngle) != 'undefined'){
		angleCheck.a1 = rect1.rAngle;
	}
	if(typeof(rect2.rAngle) != 'undefined'){
		angleCheck.a2 = rect2.rAngle;
	}
	if(Math.abs(angleCheck.a1 % 90) == 0 && Math.abs(angleCheck.a2) % 90 == 0){
		var r1 = {
			x1 : rect1.pos[0],
			y1 : rect1.pos[1],
			x2 : rect1.pos[0]+rect1.dim[0],
			y2 : rect1.pos[1]+rect1.dim[1],
		}
		var r2 = {
			x1 : rect2.pos[0],
			y1 : rect2.pos[1],
			x2 : rect2.pos[0]+rect2.dim[0],
			y2 : rect2.pos[1]+rect2.dim[1],
		}
		if(whenCalculate == 1){
			r1.x1 += rect1.veloc[0];
			r1.y1 += rect1.veloc[1];
			r1.x2 += rect1.veloc[0];
			r1.y2 += rect1.veloc[1];

			r2.x1 += rect2.veloc[0];
			r2.y1 += rect2.veloc[1];
			r2.x2 += rect2.veloc[0];
			r2.y2 += rect2.veloc[1];
		}
		if(((r1.x1 >= r2.x1 && r1.x1 <= r2.x2) || (r1.x2 >= r2.x1 && r1.x2 <= r2.x2)) || ((r2.x1 >= r1.x1 && r2.x1 <= r1.x2) || (r2.x2 >= r1.x1 && r2.x2 <= r1.x2))){
			isCollision.x = true;
		}
		if(((r1.y1 >= r2.y1 && r1.y1 <= r2.y2) || (r1.y2 >= r2.y1 && r1.y2 <= r2.y2)) || ((r2.y1 >= r1.y1 && r2.y1 <= r1.y2) || (r2.y2 >= r1.y1 && r2.y2 <= r1.y2))){
			isCollision.y = true;
		}
		if(isCollision.x && isCollision.y){ //Means I don't have to make an extra variable to not double run this function
			isCollision.both = true;
		}
	}
	else{
		//Variables for calculation
		var sinAngle;
		var cosAngle;
		var matrix;
		/*
		c1-------------c2
		-----------------
		-------rcom------
		-----------------
		c4-------------c3
		var r1 = {
			c1 : multiplyMatrices2x2and2x1(matrix, [-rect1.rcom[0], -rect1.rcom[1]]),
			c2 : multiplyMatrices2x2and2x1(matrix, [rect1.dim[0]-rect1.rcom[0], -rect1.rcom[1]]),
			c3 : multiplyMatrices2x2and2x1(matrix, [rect1.dim[0]-rect1.rcom[0], rect1.dim[1]-rect1.rcom[1]]),
			c4 : multiplyMatrices2x2and2x1(matrix, [-rect1.rcom[0], rect1.dim[1]-rect1.rcom[1]]),
		}
		*/

		//r1\\
		sinAngle = Math.sin(Math.PI*(rect1.rAngle)/180);
		cosAngle = Math.cos(Math.PI*(rect1.rAngle)/180);
		var matrix1 = [[cosAngle, sinAngle], [-sinAngle, cosAngle]];
		var r1 = [multiplyMatrices2x2and2x1(matrix1, [-rect1.rcom[0], -rect1.rcom[1]]), multiplyMatrices2x2and2x1(matrix1, [rect1.dim[0]-rect1.rcom[0], -rect1.rcom[1]]), multiplyMatrices2x2and2x1(matrix1, [rect1.dim[0]-rect1.rcom[0], rect1.dim[1]-rect1.rcom[1]]), multiplyMatrices2x2and2x1(matrix1, [-rect1.rcom[0], rect1.dim[1]-rect1.rcom[1]])]
		for(var i = 0; i < r1.length; i++){
			r1[i][0] += rect1.pos[0]+rect1.rcom[0];
			r1[i][1] += rect1.pos[1]+rect1.rcom[1];
		}
		/*
		for(var i = 0; i < r1.length; i++){ //Draws the four corners
			var pointToDraw = {
				type : "block",
				pos : [r1[i][0]-1, r1[i][1]-1],
				dim : [2, 2],
				color: "pink",
				fill : true,
			}
			toDraw.push(pointToDraw);
		}
		*/
		//\\
		//r2\\
		sinAngle = Math.sin(Math.PI*(rect2.rAngle)/180);
		cosAngle = Math.cos(Math.PI*(rect2.rAngle)/180);
		var matrix2 = [[cosAngle, sinAngle], [-sinAngle, cosAngle]];
		var r2 = [multiplyMatrices2x2and2x1(matrix2, [-rect2.rcom[0], -rect2.rcom[1]]), multiplyMatrices2x2and2x1(matrix2, [rect2.dim[0]-rect2.rcom[0], -rect2.rcom[1]]), multiplyMatrices2x2and2x1(matrix2, [rect2.dim[0]-rect2.rcom[0], rect2.dim[1]-rect2.rcom[1]]), multiplyMatrices2x2and2x1(matrix2, [-rect2.rcom[0], rect2.dim[1]-rect2.rcom[1]])]
		for(var i = 0; i < r2.length; i++){
			r2[i][0] += rect2.pos[0]+rect2.rcom[0];
			r2[i][1] += rect2.pos[1]+rect2.rcom[1];
		}
		//\\
		var foundCollision = false;
		for(var main = 0; main < 4 && foundCollision == false; main++){
			var coord11 = [r1[main][0], r1[main][1]];
			var cycleBack1 = main-1;
			if(cycleBack1 < 0){
				cycleBack1 = 3;
			}
			var coord12 = [r1[cycleBack1][0], r1[cycleBack1][1]];
			var line1 = [coord11, coord12]
			for(var alt = 0; alt < 4 && foundCollision == false; alt++){
				var coord21 = [r2[alt][0], r2[alt][1]];
				var cycleBack2 = alt-1;
				if(cycleBack2 < 0){
					cycleBack2 = 3;
				}
				var coord22 = [r2[cycleBack2][0], r2[cycleBack2][1]];
				var line2 = [coord21, coord22];
				var isLineLineReturn = isLineLineCollision(line1, line2);
				if(isLineLineReturn.both){
					// var pointToDraw = {
					// 	type : "block",
					// 	pos : [isLineLineReturn.x-5, isLineLineReturn.y-5],
					// 	dim : [10, 10],
					// 	color: "purple",
					// 	fill : true,
					// 	rAngle : 0,
					// }
					// toDraw.push(pointToDraw);
					foundCollision = true;
					isCollision.collisionCoords = [isLineLineReturn.x, isLineLineReturn.y];
				}
			}
		}
		if(foundCollision){
			isCollision.both = true;
		}
		else{ //Line intersection test doesn't catch rectangles inside of each other. 
		//Going to invert the previous matrix in order to convert a single point of the second rectangle into the coordinate plane of the first rectangle. One point is enough to check if it's inside at this point. 
			//Checking if 1 is in 2
			var inverseMatrix1 = findInverse2x2(matrix1);
			var coordRect1Center = [rect1.pos[0]+rect1.rcom[0], rect1.pos[1]+rect1.rcom[1]];
			var coordRect2WRTRect1CenterNoAngle = [r2[0][0]-coordRect1Center[0], r2[0][1]-coordRect1Center[1]];
			var modifiedCoord = multiplyMatrices2x2and2x1(inverseMatrix1, coordRect2WRTRect1CenterNoAngle); //Coordinates of rectangle 2 with respect to the center of rectangle 1 including angle
			var coordWRTTopLeft = [rect1.rcom[0]-modifiedCoord[0], rect1.rcom[1]-modifiedCoord[1]];
			if(coordWRTTopLeft[0] > 0 && coordWRTTopLeft[0] < rect1.dim[0] && coordWRTTopLeft[1] > 0 && coordWRTTopLeft[1] < rect1.dim[1]){
				isCollision.both = true;
				isCollision.collisionCoords = coordRect1Center;
			}
			else{
				var inverseMatrix2 = findInverse2x2(matrix2);
				var coordRect2Center = [rect2.pos[0]+rect2.rcom[0], rect2.pos[1]+rect2.rcom[1]];
				var coordRect1WRTRect2CenterNoAngle = [r1[0][0]-coordRect2Center[0], r1[0][1]-coordRect2Center[1]];
				var modifiedCoord = multiplyMatrices2x2and2x1(inverseMatrix2, coordRect1WRTRect2CenterNoAngle); //Coordinates of rectangle 1 with respect to the center of rectangle 2 including angle
				var coordWRTTopLeft = [rect2.rcom[0]-modifiedCoord[0], rect2.rcom[1]-modifiedCoord[1]];
				if(coordWRTTopLeft[0] > 0 && coordWRTTopLeft[0] < rect2.dim[0] && coordWRTTopLeft[1] > 0 && coordWRTTopLeft[1] < rect2.dim[1]){
					isCollision.both = true;
					isCollision.collisionCoords = coordRect2Center;
				}
			}
		}
	}
	return isCollision;
}
function isCircRectCollision(whenCalculate, circ, rect, maxMargin){
	var c = {
		x : circ.pos[0],
		y : circ.pos[1],
		r : circ.dim[0],
	}
	var r = {
		x1 : rect.pos[0],
		y1 : rect.pos[1],
		x2 : rect.pos[0]+rect.dim[0],
		y2 : rect.pos[1]+rect.dim[1],
	}
	if(whenCalculate == 1){
		c.x += c.veloc[0];
		c.y += c.veloc[1];

		r.x1 += r.veloc[0];
		r.y1 += r.veloc[1];
		r.x2 += r.veloc[0];
		r.y2 += r.veloc[1];
	}
	var isCollision = {
		both : false,
		collisionCoords : [],
		margin : null,
	}
	var nearestX = Math.max(r.x1, Math.min(c.x, r.x2)); //Working
	var nearestY = Math.max(r.y1, Math.min(c.y, r.y2));
	// var point = {
	// 	pos : [nearestX, nearestY],
	// 	dim : [5],
	// 	color : "red",
	// 	type : "circle"
	// }
	// toDraw.push(point)
	isCollision.margin = Math.sqrt(Math.pow(nearestX-c.x, 2) + Math.pow(nearestY-c.y, 2)) - c.r;
	if(isCollision.margin < maxMargin){
		isCollision.collisionCoords = [nearestX, nearestY];
		isCollision.both = true;
	}
	else if(c.x > r.x1 && c.x < r.x2 && c.y > r.y1 && c.y < r.y2){ //Circle inside check
		isCollision.both = true;
	}
	return isCollision;
}
function isCircCircCollision(whenCalculate, circ1, circ2, maxMargin){
	var c1 = {
		x : circ1.pos[0],
		y : circ1.pos[1],
		r : circ1.dim[0],
	}
	var c2 = {
		x : circ2.pos[0],
		y : circ2.pos[1],
		r : circ2.dim[0],
	}
	if(whenCalculate == 1){
		c1.x += c1.veloc[0];
		c1.y += c1.veloc[1];

		c2.x += c2.veloc[0];
		c2.y += c2.veloc[1];
	}
	var isCollision = {
		both : false,
		collisionCoords : [],
		margin : null,
	}
	var distance = Math.sqrt(Math.pow(c1.x-c2.x, 2) + Math.pow(c1.y-c2.y, 2));
	isCollision.margin = distance - c1.r - c2.r;
	if(isCollision.margin < maxMargin){
		isCollision.both = true;
		isCollision.collisionCoords = [c1.x+(c1.r/distance)*(c2.x-c1.x), c1.y+(c1.r/distance)*(c2.y-c1.y)];
	}
	return isCollision;
}
function isLineLineCollision(line1, line2){
	//Format:
	//Line1: [[x, y], [x, y]]
	//Line2: [[x, y], [x, y]]
	var m1 = (line1[1][1]-line1[0][1])/(line1[1][0]-line1[0][0]); //I'm so sorry to whoever reads this
	var m2 = (line2[1][1]-line2[0][1])/(line2[1][0]-line2[0][0]);
	var returnVar = {
		both : false,
		x : 0,
		y : 0,
	}

	if(line1[0][0] == line1[1][0] || line2[0][0] == line2[1][0]){ //If infinite slope. Vertical line
		var y; //Y coordinate of intersection pt
		if(line1[0][0] == line1[1][0]){
			y = line2[1][1]+m2*(line1[0][0]-line2[1][0]);
			returnVar.x = line1[0][0];
		}
		if(line2[0][0] == line2[1][0]){
			y = line1[1][1]+m1*(line2[0][0]-line1[1][0]);
			returnVar.x = line2[0][0];
		}
		if(y > Math.min(line1[0][1], line1[1][1]) && y < Math.max(line1[0][1], line1[1][1]) && y > Math.min(line2[0][1], line2[1][1]) && y < Math.max(line2[0][1], line2[1][1])){
			returnVar.y = y;
			returnVar.both = true;
		}
	}
	else{
		var x = ((line2[1][1]-m2*line2[1][0])-(line1[1][1]-m1*line1[1][0]))/(m1-m2);
		if(x >= Math.min(line1[0][0], line1[1][0]) && x <= Math.max(line1[0][0], line1[1][0]) && x >= Math.min(line2[0][0], line2[1][0]) && x <= Math.max(line2[0][0], line2[1][0])){
			returnVar.x = x;
			returnVar.y = m1*(x-line1[0][0])+line1[0][1];
			returnVar.both = true;
		}
	}
	return returnVar;
}
function sumArray(array){
	return array.reduce((a, b) => a + b, 0);
}