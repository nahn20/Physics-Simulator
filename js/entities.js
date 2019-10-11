function basicRectangle(pos=[0,0],dim=[10,10],options){
	this.type = "block";
	this.pos = pos;
	this.previousPos = pos;
	this.veloc = [0, 0];
	this.futureVeloc = [0, 0];
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
	this.velocLossCoefficient = 1;
	this.updatePosOverride = false;
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
		this.mass = options.density*this.dim[0]*this.dim[1];
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
	this.clearForces = function(){
		this.force = [[], []];
	}
	this.updateForces = function(){
		if(this.gravity){
			this.force[1].push(gravity*this.mass);
		}
		for(var i = 0; i < sim.entities.length; i++){
			if(sim.entities[i] != this && sim.entities[i].interactable == true){
				if(isCurrentRectCollision(this, sim.entities[i]).both && sim.entities[i].type == "spring"){ //Spring block collision
					var force = sumArray(this.force[0]);
					sim.entities[i].force[0].push(force);
					this.force[0].push(-force);
					var force = sumArray(this.force[1]);
					sim.entities[i].force[1].push(force);
					this.force[1].push(-force);
				}
				if(isCurrentRectCollision(this, sim.entities[i]).both && sim.entities[i].type == "block"){ //Block block collision
					if(!this.sticky && !sim.entities[i].sticky){ //No stick
						var k = this.energyLossCoefficient*sim.entities[i].energyLossCoefficient;
						var a = {
							m : this.mass,
							v : this.veloc[0],
						}; //Using variable names from my equation, sorry for bad naming convention
						var b = {
							m : sim.entities[i].mass,
							v : sim.entities[i].veloc[0],
						};
						var vxFinal = this.velocLossCoefficient*this.bigCollisionMomentumEquation(a, b, k);
						a.v = this.veloc[1];
						b.v = sim.entities[i].veloc[1];
						var vyFinal = this.velocLossCoefficient*this.bigCollisionMomentumEquation(a, b, k);
						this.force[0].push(this.mass*(vxFinal-this.veloc[0]));
						this.force[1].push(this.mass*(vyFinal-this.veloc[1]));
						// var k = 1;
						// var a = {
						// 	m : 10,
						// 	v : 10,
						// }; //Using variable names from my equation, sorry for bad naming convention
						// var b = {
						// 	m : 1,
						// 	v : 10,
						// };
						// var vxFinal = this.bigCollisionMomentumEquation(a, b, k);
						// a.v = 0;
						// b.v = 0;
						// var vyFinal = this.bigCollisionMomentumEquation(a, b, k);
						// console.log("Vxfinal: " + vxFinal);
						// console.log("Vyfinal: " + vyFinal);
					}
				}
			}
		}
	}
	this.bigCollisionMomentumEquation = function(a, b, k){
		//OLD VERSION\\
		// var c = k*a.m+k*a.m*a.m/b.m; //Constant used multiple times in big equation
		// var d = -2*k*a.m*a.m*a.v/b.m-2*k*b.v*a.m;
		// var velocFinal = Math.sqrt(a.m*a.v*a.v+(1-k)*b.m*b.v*b.v-2*k*b.v*a.m*a.v-k*a.m*a.m*a.v*a.v/b.m+d*d/(4*c))/Math.sqrt(c)-d/(2*c);

		//NEW VERSION\\
		// var m = a.m/b.m;
		// var c = m+m*m;
		// var d = -2*m*m*a.v-2*m*b.v;
		// var velocFinal = Math.sqrt((k-1)*(m*a.v*a.v+b.v*b.v)-2*m*a.v*b.v+d*d/(2*c))-d/(2*Math.sqrt(c))/Math.sqrt(c);
		//ELASTIC VERSION\\
		var velocFinal = a.v*(a.m-b.m)/(a.m+b.m)+2*b.v*b.m/(a.m+b.m);
		
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
					if(isCurrentRectCollision(this, sim.entities[i]).both){
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
			if(!isCurrentRectCollision(this, this.stuck).x){
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
function isCurrentRectCollision(entity1, entity2){
	var e1 = {
		x1 : entity1.pos[0],
		y1 : entity1.pos[1],
		x2 : entity1.pos[0]+entity1.dim[0],
		y2 : entity1.pos[1]+entity1.dim[1],
	}
	var e2 = {
		x1 : entity2.pos[0],
		y1 : entity2.pos[1],
		x2 : entity2.pos[0]+entity2.dim[0],
		y2 : entity2.pos[1]+entity2.dim[1],
	}
	var isCollision = {
		x : false,
		y : false,
		both : false,
	}
	if(((e1.x1 >= e2.x1 && e1.x1 <= e2.x2) || (e1.x2 >= e2.x1 && e1.x2 <= e2.x2)) || ((e2.x1 >= e1.x1 && e2.x1 <= e1.x2) || (e2.x2 >= e1.x1 && e2.x2 <= e1.x2))){
		isCollision.x = true;
	}
	if(((e1.y1 >= e2.y1 && e1.y1 <= e2.y2) || (e1.y2 >= e2.y1 && e1.y2 <= e2.y2)) || ((e2.y1 >= e1.y1 && e2.y1 <= e1.y2) || (e2.y2 >= e1.y1 && e2.y2 <= e1.y2))){
		isCollision.y = true;
	}
	if(isCollision.x && isCollision.y){ //Means I don't have to make an extra variable to not double run this function
		isCollision.both = true;
	}
	return isCollision;
}
function isFutureRectCollision(entity1, entity2){
	var e1 = {
		x1 : entity1.pos[0]+entity1.veloc[0],
		y1 : entity1.pos[1]+entity1.veloc[1],
		x2 : entity1.pos[0]+entity1.dim[0]+entity1.veloc[0],
		y2 : entity1.pos[1]+entity1.dim[1]+entity1.veloc[1],
	}
	var e2 = {
		x1 : entity2.pos[0]+entity1.veloc[0],
		y1 : entity2.pos[1]+entity1.veloc[1],
		x2 : entity2.pos[0]+entity2.dim[0]+entity1.veloc[0],
		y2 : entity2.pos[1]+entity2.dim[1]+entity1.veloc[1],
	}
	var isCollision = {
		x : false,
		y : false,
		both : false,
	}
	if(((e1.x1 >= e2.x1 && e1.x1 <= e2.x2) || (e1.x2 >= e2.x1 && e1.x2 <= e2.x2)) || ((e2.x1 >= e1.x1 && e2.x1 <= e1.x2) || (e2.x2 >= e1.x1 && e2.x2 <= e1.x2))){
		isCollision.x = true;
	}
	if(((e1.y1 >= e2.y1 && e1.y1 <= e2.y2) || (e1.y2 >= e2.y1 && e1.y2 <= e2.y2)) || ((e2.y1 >= e1.y1 && e2.y1 <= e1.y2) || (e2.y2 >= e1.y1 && e2.y2 <= e1.y2))){
		isCollision.y = true;
	}
	if(isCollision.x && isCollision.y){ //Means I don't have to make an extra variable to not double run this function
		isCollision.both = true;
	}
	return isCollision;
}
function sumArray(array){
	return array.reduce((a, b) => a + b, 0);
}