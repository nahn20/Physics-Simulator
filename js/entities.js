function basicObject(type="block", pos=[0,0],dim=[10,10],options){
	this.type = type;
	this.pos = pos;
	this.veloc = [0, 0];
	this.accel = [0, 0];
	this.force = [[0], [0]];
	this.dim = dim;
	this.mass = 10;
	this.gravity = true;
	this.infiniteMass = false;
	this.interactable = true;
	this.color = "black";
	this.fill = true;
	this.sticky = false;
	this.energyLossCoefficient = 1;
	this.updatePosOverride = false;
	this.collisionCounter = 0;
	this.displayNumCollision = false;
	if(typeof(options.gravity) != 'undefined'){
		this.gravity = options.gravity;
	}
	if(typeof(options.infiniteMass) != 'undefined'){
		this.infiniteMass = options.infiniteMass;
	}
	if(typeof(options.mass) != 'undefined'){
		this.mass = options.mass;
	}
	if(typeof(options.density) != 'undefined'){
		if(this.type == "block"){
			this.mass = options.density*this.dim[0]*this.dim[1];
		}
		if(this.type == "circle"){
			this.mass = options.density*Math.PI*this.dim[0]*this.dim[0];
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
	if(typeof(options.displayNumCollision) != 'undefined'){
		this.displayNumCollision = options.displayNumCollision;
	}
	this.clearForces = function(){
		this.force = [[], []];
	}
	this.updateForces = function(){
		if(this.gravity){
			this.force[1].push(gravity*this.mass);
		}
		for(var i = 0; i < sim.entities.length; i++){
			if(sim.entities[i] != this && sim.entities[i].interactable == true){
				if(isRectRectCollision(0, this, sim.entities[i]).both && sim.entities[i].type == "spring"){ //Spring block collision
					var force = sumArray(this.force[0]);
					sim.entities[i].force[0].push(force);
					this.force[0].push(-force);
					var force = sumArray(this.force[1]);
					sim.entities[i].force[1].push(force);
					this.force[1].push(-force);
				} //Redo the structure below: It runs all the checks
				else if(isCollision(0, this,sim.entities[i]).both){
					if(!this.sticky && !sim.entities[i].sticky){ //No stick
						var vxFinal;
						var vyFinal;
						this.collisionCounter++;
						if(!this.infiniteMass && !sim.entities[i].infiniteMass){
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
							console.log(vxFinal)
						}
						else if(sim.entities[i].infiniteMass){
							vxFinal = -this.veloc[0];
							vyFinal = -this.veloc[1];
						}
						this.force[0].push(this.mass*(vxFinal-this.veloc[0]));
						this.force[1].push(this.mass*(vyFinal-this.veloc[1]));
					}
				}
			}
		}
	}
	this.bigCollisionMomentumEquation = function(a, b, k){
		//Third Try\\
		k = 1;
		var alpha = (a.m*a.v)+(b.m*b.v);
		var c = (a.m*b.m)+(a.m*a.m);
		var d = -2*a.m*alpha
		var blob = (k*a.m*b.m*a.v*a.v)+(k*b.m*b.m*b.v*b.v)-(alpha*alpha)+(d*d/(4*c));
		var coefficient = 1;
		if(b.v-a.v < 0){
			coefficient = -1;
		}
		var velocFinal = (coefficient*Math.sqrt(blob)-(d/(2*Math.sqrt(c))))/Math.sqrt(c);
		console.log(a.v + " " + blob)
		//Elastic but Wack\\
		// var c = a.m*a.v+b.m*b.v;
		// var d = a.m*a.m+a.m*b.m;
		// var e = -2*c*a.m;
		// var coefficient = 1;
		// if(b.v-a.v < 0){
		// 	coefficient = -1;
		// }
		// var velocFinal = (coefficient*Math.sqrt(a.m*b.m*a.v*a.v+b.m*b.m*b.v*b.v-c*c+e*e/(4*d))-e/(2*Math.sqrt(d)))/Math.sqrt(d);

		//ELASTIC VERSION\\
		//var velocFinal = a.v*(a.m-b.m)/(a.m+b.m)+2*b.v*b.m/(a.m+b.m);
		
		return velocFinal;
	}
	this.updatePos = function(){
		if(!this.infiniteMass){
			this.accel[0] = sumArray(this.force[0]) / this.mass;
			this.accel[1] = sumArray(this.force[1]) / this.mass;
		}
		//STANDARD
		this.veloc[0] += this.accel[0];
		this.veloc[1] += this.accel[1];
		if(!this.updatePosOverride){
			this.pos[0] += this.veloc[0];
			this.pos[1] += this.veloc[1];
		}
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
function isCollision(whenCalculate, obj1, obj2){
	if(obj1.type == "block" || obj1.type == "spring"){
		if(obj2.type == "block" || obj2.type == "spring"){
			return isRectRectCollision(whenCalculate, obj1, obj2);
		}
		if(obj2.type == "circle"){
			return isCircRectCollision(whenCalculate, obj2, obj1);
		}
	}
	if(obj1.type == "circle"){
		if(obj2.type == "block" || obj2.type == "spring"){
			return isCircRectCollision(whenCalculate, obj1, obj2);
		}
		if(obj2.type == "circle"){
			return isCircCircCollision(whenCalculate, obj2, obj1);
		}
	}
}
function isRectRectCollision(whenCalculate, rect1, rect2){ //whenCalculate = 0 for present, 1 for future
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
	var isCollision = {
		x : false,
		y : false,
		both : false,
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
	return isCollision;
}
function isCircRectCollision(whenCalculate, circ, rect){
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
	if(Math.sqrt(Math.pow(nearestX-c.x, 2) + Math.pow(nearestY-c.y, 2)) < c.r){
		isCollision.both = true;
	}
	else if(c.x > r.x1 && c.x < r.x2 && c.y > r.y1 && c.y < r.y2){ //Circle inside check
		isCollision.both = true;
	}
	return isCollision;
}
function isCircCircCollision(whenCalculate, circ1, circ2){
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
	}
	if(Math.sqrt(Math.pow(c1.x-c2.x, 2) + Math.pow(c1.y-c2.y, 2)) < c1.r + c2.r){
		isCollision.both = true;
	}
	return isCollision;
}
function sumArray(array){
	return array.reduce((a, b) => a + b, 0);
}