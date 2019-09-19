function basicRectangle(pos=[0,0],dim=[10,10],options){
	this.type = "block";
	this.pos = pos;
	this.previousPos = pos;
	this.veloc = [0, 0];
	this.accel = [0, 0];
	this.force = [[0], [0]];
	this.dim = dim;
	this.mass = 1000;
	this.gravity = true;
	this.infiniteMass = false;
	this.color = "black";
	this.fill = true;
	if(options.gravity || !options.gravity){
		this.gravity = options.gravity;
	}
	if(options.infiniteMass || !options.infiniteMass){
		this.infiniteMass = options.infiniteMass;
	}
	this.clearForces = function(){
		this.force = [[], []];
	}
	this.updateForces = function(){
		this.color = "black";
		if(this.gravity){
			this.force[1].push(gravity*this.mass);
		}
		for(var i = 0; i < sim.entities.length; i++){
			if(sim.entities[i] != this){
				if(rectCollisionTest(this, sim.entities[i]) && sim.entities[i].type == "spring"){
					var force = sumArray(this.force[0]);
					sim.entities[i].force[0].push(force);
					this.force[0].push(-force);
					var force = sumArray(this.force[1]);
					sim.entities[i].force[1].push(force);
					this.force[1].push(-force);
				}
			}
		}
	}
	this.updatePos = function(){
		if(!this.infiniteMass){
			this.accel[0] = sumArray(this.force[0]) / this.mass;
			this.accel[1] = sumArray(this.force[1]) / this.mass;
		}
		//STANDARD
		this.veloc[0] += this.accel[0];
		this.veloc[1] += this.accel[1];
		this.pos[0] += this.veloc[0];
		this.pos[1] += this.veloc[1];
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
	this.equilibrium = equilibrium; //Always positive
	this.pos = [0, 0];
	this.dim = [0, 0];
	this.attachedTime = 0;
	this.amplitude = 0;
	if(options.sticky || !options.sticky){
		this.sticky = options.sticky;
	}
	this.clearForces = function(){
		this.force = [[], []];
	}
	this.updateForces = function(){
		var attached = false;
		if(!this.stuck){
			for(var i = 0; i < sim.entities.length; i++){
				if(sim.entities[i].type == "block" && sim.entities[i] != this.supportBlock){
					if(rectCollisionTest(this, sim.entities[i])){
						if(this.angle == 90){
							if(this.sticky){
								this.stuck = sim.entities[i];
								if(this.angle == 90){
									var shift = this.stuck.mass*gravity/this.k;
									this.amplitude = Math.sqrt(this.stuck.mass*(2*gravity*shift+this.stuck.veloc[1]*this.stuck.veloc[1])/this.k);
									this.equilibrium -= shift;
									this.attachedTime = -Math.asin(shift/this.amplitude)/(Math.sqrt(this.k/this.stuck.mass));
									this.stuck.veloc[1] = 0;
								}
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
		}
		if(!attached && !this.stuck){
			this.attachedTime = 0;
		}
	}
	this.updatePos = function(){
		if(this.angle == 90){
			if(this.stuck){
				var angle = this.attachedTime*Math.sqrt(this.k/this.stuck.mass);
				this.extension = this.amplitude*Math.sin(angle);
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
function rectCollisionTest(entity1, entity2){
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
	if(((e1.x1 >= e2.x1 && e1.x1 <= e2.x2) || (e1.x2 >= e2.x1 && e1.x2 <= e2.x2)) || ((e2.x1 >= e1.x1 && e2.x1 <= e1.x2) || (e2.x2 >= e1.x1 && e2.x2 <= e1.x2))){
		if(((e1.y1 >= e2.y1 && e1.y1 <= e2.y2) || (e1.y2 >= e2.y1 && e1.y2 <= e2.y2)) || ((e2.y1 >= e1.y1 && e2.y1 <= e1.y2) || (e2.y2 >= e1.y1 && e2.y2 <= e1.y2))){
			//entity1.color = "red";
			return true;
		}
	}
	return false;
}
function sumArray(array){
	return array.reduce((a, b) => a + b, 0);
}