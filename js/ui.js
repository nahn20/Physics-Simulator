const widthMultiplierThing = 9.7; //For 16px
function textField(pos=[0, 0], hoveredElement, options){
	this.pos = pos;
	this.dim = [50, 30];
	this.value = "0";
	this.hoveredElement = hoveredElement; //Which dropdown it's a part of
	this.inputType = "number";
	if(typeof(options.inputType) != 'undefined'){
		this.inputType = inputType;
	}
	if(typeof(options.value) != 'undefined'){
		this.value = options.value;
	}
	this.draw = function(){
		if(this.hoveredElement == ui.hoveredElement){
			this.dim[0] = 10+this.value.length*widthMultiplierThing;
			cvs.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
			cvs.ctx.fillRect(this.pos[0], this.pos[1], this.dim[0], this.dim[1]);
			cvs.ctx.font = "16px Courier New";
			cvs.ctx.fillStyle = "black";
			cvs.ctx.fillText(this.value, 5+this.pos[0], this.pos[1]+0.55*this.dim[1]);
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
	this.menu = 0; //0 is default, 1 is selected
	this.menuPos = [8, 8];
	this.iconDimensions = [32, 32];
	this.margin = 8;
	this.hoveredElement = -1; //Element that is currently being hovered over
	this.fillStyle = "rgba(0, 0, 0, 0.2)";
	this.selectedTextFieldIndex = -1;
	this.textFields = [];
	//Creating text fields
	this.headers = [[]];
	this.headers[0] = ["X Velocity:", "Y Velocity:"];
	this.headers[1] = ["X Velocity:", "Y Velocity:", "Test:"];
	for(var q = 0; q < this.headers.length; q++){
		if(this.headers[q] != null){ //Idk if this works. Issue of if you use this.headers[100]
			for(var i = 0; i < this.headers[q].length; i++){
				this.textFields[this.textFields.length] = new textField([widthMultiplierThing*this.headers[q][i].length+this.menuPos[0]+this.iconDimensions[0]+this.margin, (this.margin+this.iconDimensions[1])*(q%100)+this.menuPos[1]+30*i], q, {});
			}
		}
	}
	// for(var i = 0; i < this.headers[0].length; i++){
	// 	this.textFields[this.textFields.length] = new textField([widthMultiplierThing*this.headers[0][i].length+this.menuPos[0]+this.iconDimensions[0]+this.margin, this.menuPos[1]+30*i], 0, {});
	// }
	// for(var i = 0; i < 3; i++){
	// 	this.textFields[this.textFields.length] = new textField([this.menuPos[0]+this.iconDimensions[0]+this.margin, this.menuPos[1]+this.margin+this.iconDimensions[1]+30*i], 1, {});
	// }
	this.drawImage = function(x, y, dim, source){
		var image = new Image();
		image.src = source;
		cvs.ctx.drawImage(image, x, y, dim[0], dim[1]);
	}
	this.drawUI = function(){
		this.drawMenu();
		this.drawMouse();
		for(var i = 0; i < this.textFields.length; i++){
			this.textFields[i].draw();
		}
		cvs.ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
		if(this.selectedTextFieldIndex != -1 && this.hoveredElement == this.textFields[this.selectedTextFieldIndex].hoveredElement){ //Border around if selected
			cvs.ctx.strokeStyle = "pink";
			cvs.ctx.lineWidth = 1;
			cvs.ctx.rect(this.textFields[this.selectedTextFieldIndex].pos[0], this.textFields[this.selectedTextFieldIndex].pos[1], this.textFields[this.selectedTextFieldIndex].dim[0], this.textFields[this.selectedTextFieldIndex].dim[1]);
			cvs.ctx.stroke();
		}
	}
	this.drawMenu = function(){
		var sourceArray = [];
		if(this.menu == 0){ //Regular menu
			sourceArray = ["images/icons/block.png", "images/icons/circle.png", "images/icons/x.png", "images/icons/circle2.png", "images/icons/circle3.png"]
		}
		if(this.menu == 1){ //Menu for having 1 selected
			sourceArray = ["images/icons/x.png"];
		}
		if(this.menu == 2){
			sourceArray = ["images/icons/x.png", "images/icons/circle3.png"];
		}

		function hasDropdown(hoveredElement){ //Returns true if there's a dropdown for that element
			var elementsWithDropdown = [0, 1];
			for(var i = 0; i < elementsWithDropdown.length; i++){
				if(hoveredElement == elementsWithDropdown[i] || hoveredElement == elementsWithDropdown[i]+1000){
					return true;
				}
			}
			return false;
		}

		var isHovering = false;
		var sideMenuDim = [200, 500];
		if(this.mousePos[0] > this.menuPos[0]-this.margin/2 && this.mousePos[0] < this.menuPos[0]+this.iconDimensions[0]+this.margin/2){ //Possibly over the menu
			for(var i = 0; i < sourceArray.length; i++){
				if(this.mousePos[1] > this.menuPos[1]-this.margin/2+(this.iconDimensions[1]+this.margin)*i && this.mousePos[1] <= this.menuPos[1]-this.margin/2+(this.iconDimensions[1]+this.margin)*(i+1)){
					this.hoveredElement = i+this.menu*100;
					isHovering = true;
					cvs.ctx.fillStyle = this.fillStyle;
					cvs.ctx.fillRect(this.menuPos[0]-this.margin/2, (this.iconDimensions[1]+this.margin)*i+this.menuPos[1]-this.margin/2, this.iconDimensions[0]+this.margin, this.iconDimensions[1]+this.margin);
				}
			}
		}
		else if(this.hoveredElement != -1){ //Maybe more efficient to split? Else if because we only care if mouse is outside of x bounds in a certain way
			if(hasDropdown(this.hoveredElement)){
				if(this.mousePos[0] > this.menuPos[0]-this.margin/2 && this.mousePos[0] < this.menuPos[0]+this.iconDimensions[0]+this.margin/2+sideMenuDim[0]){ //x
					if(this.mousePos[1] > this.menuPos[1]-this.margin/2+(this.iconDimensions[1]+this.margin)*(this.hoveredElement%100) && this.mousePos[1] < this.menuPos[1]-this.margin/2+(this.iconDimensions[1]+this.margin)*(this.hoveredElement%100)+sideMenuDim[1]){ //y
						//Draws the rectangle for the main element on the left
						cvs.ctx.fillStyle = this.fillStyle;
						cvs.ctx.fillRect(this.menuPos[0]-this.margin/2, (this.iconDimensions[1]+this.margin)*(this.hoveredElement%100)+this.menuPos[1]-this.margin/2, this.iconDimensions[0]+this.margin, this.iconDimensions[1]+this.margin);
						isHovering = true;
					}
				}
			}
		}
		if(!isHovering){
			this.hoveredElement = -1;
		}
		if(hasDropdown(this.hoveredElement)){ //ex: 101 for menu 1, 2nd item
			cvs.ctx.fillStyle = this.fillStyle;
			cvs.ctx.fillRect(this.menuPos[0]+this.iconDimensions[0]+this.margin/2, (this.iconDimensions[1]+this.margin)*(this.hoveredElement%100)+this.menuPos[1]-this.margin/2, sideMenuDim[0], sideMenuDim[1]);
			//Here for dropdown
			cvs.ctx.font = "16px Courier New";
			cvs.ctx.fillStyle = "black";
			for(var i = 0; i < this.headers[this.hoveredElement].length; i++){
				cvs.ctx.fillText(this.headers[this.hoveredElement][i], this.menuPos[0]+this.iconDimensions[0]+this.margin, 0.55*30+(this.margin+this.iconDimensions[1])*(this.hoveredElement%100)+this.menuPos[1]+30*i);
			}
		}
		for(var i = 0; i < sourceArray.length; i++){ //Draws images
			ui.drawImage(this.menuPos[0], this.menuPos[1]+i*(this.iconDimensions[1]+this.margin), this.iconDimensions, sourceArray[i]);
		}
	}
	this.drawMouse = function(){
		if(this.selectionType == "block"){ //TODO: Fix issue of selection being grey when highlighting a text field
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
				cvs.ctx.strokeStyle = "black";
				cvs.ctx.lineWidth = 1;
                cvs.ctx.arc(this.selectionCoordsA[0], this.selectionCoordsA[1], radius, 0, 2*Math.PI);
                cvs.ctx.stroke();
			}
			else{
                cvs.ctx.beginPath();
				cvs.ctx.strokeStyle = "black";
				cvs.ctx.lineWidth = 1;
                cvs.ctx.arc(this.mousePos[0]-10.5, this.mousePos[1]+19.5, 5, 0, 2*Math.PI);
                cvs.ctx.stroke();
			}
		}
	}
	this.clickTrigger = function(){
		//Deals with menu selection
		if(this.hoveredElement == 0){
			ui.selectionType = "block";
		}
		if(this.hoveredElement == 1){
			ui.selectionType = "circle";
		}
		if(this.hoveredElement == 100 || this.hoveredElement == 200){
			for(var i = 0; i < sim.selection.length; i++){
				if(sim.selection[i] != null){
					sim.entities = removeElement(sim.selection[i], sim.entities);
					sim.selection[i] = null;
				}
			}
		}
		//Checks to see if it's in any text boxes
		this.selectedTextFieldIndex = -1;
		for(var i = 0; i < this.textFields.length; i++){
			if(this.hoveredElement == this.textFields[i].hoveredElement){ //Checks if the text field is even visible
				if(this.mousePos[0] > this.textFields[i].pos[0] && this.mousePos[0] < this.textFields[i].pos[0]+this.textFields[i].dim[0] && this.mousePos[1] > this.textFields[i].pos[1] && this.mousePos[1] < this.textFields[i].pos[1] + this.textFields[i].dim[1]){
					this.selectedTextFieldIndex = i;
				}
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