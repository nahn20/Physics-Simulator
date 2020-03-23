const widthMultiplierThing = 9.7; //For 16px
function textField(pos=[0, 0], hoveredElement, inputType, options){
	this.pos = pos;
	this.dim = [50, 30];
	this.value = "0";
	if(inputType == "color"){
		this.value = "Black";
	}
	if(inputType == "intNullX"){
		this.value = "x";
	}
	if(inputType == "string"){
		this.value = "";
	}
	this.hoveredElement = hoveredElement; //Which dropdown it's a part of
	this.inputType = inputType; //int, bool, color, intNullX (empty is an x), string
	if(typeof(options.value) != 'undefined'){
		this.value = options.value;
	}
	this.draw = function(){
		if(this.hoveredElement == ui.hoveredElement){
			cvs.ctx.save();
			cvs.ctx.beginPath();
			cvs.ctx.rect(ui.menuPos[0]+ui.iconDimensions[0]+ui.margin/2, (ui.iconDimensions[1]+ui.margin)*(ui.hoveredElement%100)+ui.menuPos[1]-ui.margin/2, ui.sideMenuDim[0], ui.sideMenuDim[1]);
			cvs.ctx.clip();{
				this.dim[0] = 10+this.value.length*widthMultiplierThing;
				cvs.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
				cvs.ctx.fillRect(this.pos[0], this.pos[1], this.dim[0], this.dim[1]);
				cvs.ctx.font = "16px Courier New";
				cvs.ctx.fillStyle = "black";
				cvs.ctx.fillText(this.value, 5+this.pos[0], this.pos[1]+0.55*this.dim[1]);
			}
			cvs.ctx.restore();
			if(this.pos[0]+this.dim[0] > ui.menuPos[0]+ui.iconDimensions[0]+ui.margin/2+ui.maxSideMenuDim[0]){
				ui.maxSideMenuDim[0] = 4*ui.margin+this.pos[0]+this.dim[0]-(ui.menuPos[0]+ui.iconDimensions[0]+ui.margin/2);
				if(ui.maxSideMenuDim[0] > 1151){
					ui.maxSideMenuDim[0] = 1150;
				}
			}
		}
	}
}
function checkboxField(pos=[0, 0], hoveredElement, options){
	this.pos = pos;
	this.dim = [20, 20];
	this.value = false;
	this.hoveredElement = hoveredElement; //Which dropdown it's a part of
	if(typeof(options.value) != 'undefined'){
		this.value = options.value;
	}
	this.draw = function(){
		if(this.hoveredElement == ui.hoveredElement){
			cvs.ctx.save();
			cvs.ctx.beginPath();
			cvs.ctx.rect(ui.menuPos[0]+ui.iconDimensions[0]+ui.margin/2, (ui.iconDimensions[1]+ui.margin)*(ui.hoveredElement%100)+ui.menuPos[1]-ui.margin/2, ui.sideMenuDim[0], ui.sideMenuDim[1]);
			cvs.ctx.clip();
			{
				cvs.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
				cvs.ctx.fillRect(this.pos[0], this.pos[1], this.dim[0], this.dim[1]);
				if(this.value == true){
					var margin = [this.dim[0]/8, this.dim[1]/8];
					cvs.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
					cvs.ctx.fillRect(this.pos[0]+margin[0], this.pos[1]+margin[1], this.dim[0]-2*margin[0], this.dim[1]-2*margin[1]);
				}
			}
			cvs.ctx.restore();
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
	this.checkboxFields = [];
	this.sideMenuDim = [0, 0]; //Increases to meet max
	this.minSideMenuDim = [200, 500]; //Constant
	this.maxSideMenuDim = [this.minSideMenuDim[0], this.minSideMenuDim[1]]; //Changes based on text field size

	this.scrollPos = 0; //TODO: Resets on menu switch. Always positive. 
	//Creating text fields
	this.headers = [[]];
	this.headerTypes = [[]]; //I'm so sorry this is getting convoluted
	this.defaultValues = [[]]; //This is so much worse
	this.headers[0] = ["- Preset Search -", "Chapter:", "Problem:", "Tags:"];
	this.headerTypes[0] = ["none", "int", "int", "string"];
	this.headers[1] = ["Color:", "Mass:", "X Velocity:", "Y Velocity:", "Gravity:"]; //Color must come first
	this.headerTypes[1] = ["color", "intNullX", "int", "int", "bool"];
	this.headers[2] = ["Color:", "Mass:", "X Velocity:", "Y Velocity:", "Gravity:"];
	this.headerTypes[2] = ["color", "intNullX", "int", "int", "bool"];
	for(var q = 0; q < this.headers.length; q++){
		if(this.headers[q] != null && this.headerTypes[q] != null){ //Idk if this works. Issue of if you use this.headers[100]
			for(var i = 0; i < this.headers[q].length; i++){
				if(this.headerTypes[q][i] == "intNullX" || this.headerTypes[q][i] == "int" || this.headerTypes[q][i] == "color" || this.headerTypes[q][i] == "string"){
					this.textFields[this.textFields.length] = new textField([8+widthMultiplierThing*this.headers[q][i].length+this.menuPos[0]+this.iconDimensions[0]+this.margin, (this.margin+this.iconDimensions[1])*(q%100)+this.menuPos[1]+30*i], q, this.headerTypes[q][i], {});
				}
				if(this.headerTypes[q][i] == "bool"){
					this.checkboxFields[this.checkboxFields.length] = new checkboxField([8+widthMultiplierThing*this.headers[q][i].length+this.menuPos[0]+this.iconDimensions[0]+this.margin, 4+(this.margin+this.iconDimensions[1])*(q%100)+this.menuPos[1]+30*i], q, {});
				}
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
		this.maxSideMenuDim = [this.minSideMenuDim[0], this.minSideMenuDim[1]];
		for(var i = 0; i < this.textFields.length; i++){
			this.textFields[i].draw();
		}
		for(var i = 0; i < this.checkboxFields.length; i++){
			this.checkboxFields[i].draw();
		}
		cvs.ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
		if(this.selectedTextFieldIndex != -1 && this.hoveredElement == this.textFields[this.selectedTextFieldIndex].hoveredElement){ //Border around if selected
			cvs.ctx.beginPath();
			cvs.ctx.strokeStyle = "pink";
			cvs.ctx.rect(this.textFields[this.selectedTextFieldIndex].pos[0], this.textFields[this.selectedTextFieldIndex].pos[1], this.textFields[this.selectedTextFieldIndex].dim[0], this.textFields[this.selectedTextFieldIndex].dim[1]);
			cvs.ctx.stroke();
		}
	}
	this.drawMenu = function(){
		if(this.menu == 0 && sim.keyMap[16]){ //Not the most intelligent solution to this
			this.menu = 3;
		}
		if(this.menu == 3 && !sim.keyMap[16]){
			this.menu = 0;
		}
		var sourceArray = [];
		if(this.menu == 0){ //Regular menu
			sourceArray = ["images/icons/search.png", "images/icons/block.png", "images/icons/circle.png", "images/icons/camera.png"];
		}
		if(this.menu == 1){ //Menu for having 1 selected
			sourceArray = ["images/icons/x.png"];
		}
		if(this.menu == 2){
			sourceArray = ["images/icons/x.png", "images/icons/circle3.png"];
		}
		if(this.menu == 3){
			sourceArray = ["images/icons/save.png", "images/icons/saveButRed.png", "images/icons/saveButPurple.png", "images/icons/load.png"];
		}

		function hasDropdown(hoveredElement){ //Returns true if there's a dropdown for that element
			var elementsWithDropdown = [0, 1, 2];
			for(var i = 0; i < elementsWithDropdown.length; i++){
				if(hoveredElement == elementsWithDropdown[i] || hoveredElement == elementsWithDropdown[i]+1000){
					return true;
				}
			}
			return false;
		}
		const menuSpeedFactor = 5; //bigger = slower
		if(Math.abs(this.sideMenuDim[0] - this.maxSideMenuDim[0]) > 0.01){
			this.sideMenuDim[0] += (this.maxSideMenuDim[0]-this.sideMenuDim[0])/menuSpeedFactor;
			this.sideMenuDim[1] += (this.maxSideMenuDim[1]-this.sideMenuDim[1])/menuSpeedFactor;
		}


		var isHovering = false;
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
				if(this.mousePos[0] > this.menuPos[0]-this.margin/2 && this.mousePos[0] < this.menuPos[0]+this.iconDimensions[0]+this.margin/2+this.sideMenuDim[0]){ //x
					if(this.mousePos[1] > this.menuPos[1]-this.margin/2+(this.iconDimensions[1]+this.margin)*(this.hoveredElement%100) && this.mousePos[1] < this.menuPos[1]-this.margin/2+(this.iconDimensions[1]+this.margin)*(this.hoveredElement%100)+this.sideMenuDim[1]){ //y
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
			cvs.ctx.fillRect(this.menuPos[0]+this.iconDimensions[0]+this.margin/2, (this.iconDimensions[1]+this.margin)*(this.hoveredElement%100)+this.menuPos[1]-this.margin/2, this.sideMenuDim[0], this.sideMenuDim[1]);
			//Here for dropdown
			cvs.ctx.save();
			cvs.ctx.beginPath();
			cvs.ctx.rect(ui.menuPos[0]+ui.iconDimensions[0]+ui.margin/2, (ui.iconDimensions[1]+ui.margin)*(ui.hoveredElement%100)+ui.menuPos[1]-ui.margin/2, ui.sideMenuDim[0], ui.sideMenuDim[1]);
			cvs.ctx.clip();
			{
				cvs.ctx.font = "16px Courier New";
				cvs.ctx.fillStyle = "black";
				for(var i = 0; i < this.headers[this.hoveredElement].length; i++){ //Writes text headers
					cvs.ctx.fillText(this.headers[this.hoveredElement][i], 5+this.menuPos[0]+this.iconDimensions[0]+this.margin, 0.55*30+(this.margin+this.iconDimensions[1])*(this.hoveredElement%100)+this.menuPos[1]+30*i); //Hi i'm above
				}
			}
			cvs.ctx.restore();
			cvs.ctx.save();
			cvs.ctx.beginPath();
			cvs.ctx.rect(ui.menuPos[0]+ui.iconDimensions[0]+ui.margin/2, -10+0.55*30+30*this.headers[this.hoveredElement].length+(ui.iconDimensions[1]+ui.margin)*(ui.hoveredElement%100)+ui.menuPos[1]-ui.margin/2, ui.sideMenuDim[0], ui.sideMenuDim[1]-(-10+0.55*30+30*this.headers[this.hoveredElement].length));
			cvs.ctx.clip();
			{
				if(this.hoveredElement == 0){
					var dim = [100, 50];
					var numPerRow = Math.floor(this.maxSideMenuDim[0]/(dim[0]+20)); //Added constant makes it comfier - more space between tight images
					var numPerColumn = 7;
					var widthMargin = (this.maxSideMenuDim[0]-numPerRow*dim[0])/(numPerRow+1); //Width between edges of images
					var heightMargin = 10;
					var leftMargin = this.menuPos[0]+this.iconDimensions[0]+this.margin/2;
					var topMargin = 0.55*30+(this.margin+this.iconDimensions[1])*(this.hoveredElement%100)+this.menuPos[1]+30*this.headers[this.hoveredElement].length; //Taken from above (see above)
					if(ui.scrollPos < 0){
						ui.scrollPos -= 0.6*ui.scrollPos;
					}
					var cap = 1000;
					if(ui.scrollPos > cap){
						ui.scrollPos -= 0.6*(ui.scrollPos-cap);
					}
					var min = numPerRow*Math.floor(ui.scrollPos/(dim[1]+heightMargin));
					if(min<0){min=0;}
					for(var i = min; i < ((min+numPerColumn*numPerRow < searchDisplayPresets.length)?(min+numPerColumn*numPerRow):(searchDisplayPresets.length)); i++){
						var x = widthMargin+leftMargin+Math.floor(i % numPerRow)*(widthMargin+dim[0]);
						var y = topMargin+Math.floor(i / numPerRow)*(heightMargin+dim[1])-ui.scrollPos;
						cvs.ctx.beginPath();
						cvs.ctx.strokeStyle = "black";
						cvs.ctx.rect(x, y, dim[0], dim[1]);
						cvs.ctx.stroke();
						ui.drawImage(x, y, dim, presets[searchDisplayPresets[i][0]].imgSrc);

					}
				}
			}
			cvs.ctx.restore();
		}
		else{
			this.sideMenuDim[0] = 0;
			this.sideMenuDim[1] = 0;
		}
		for(var i = 0; i < sourceArray.length; i++){ //Draws images
			ui.drawImage(this.menuPos[0], this.menuPos[1]+i*(this.iconDimensions[1]+this.margin), this.iconDimensions, sourceArray[i]);
		}
	}
	this.drawMouse = function(){
		if(this.selectionType == "block"){
			var t = findStartIndex(1, ui.textFields);
			if(this.mouseDown){ //Draws large rect while holding
				cvs.ctx.beginPath();
				cvs.ctx.strokeStyle = scrubColor(ui.textFields[t].value);
				cvs.ctx.lineWidth = 1;
				cvs.ctx.rect(this.selectionCoordsA[0], this.selectionCoordsA[1], this.mousePos[0]-this.selectionCoordsA[0], this.mousePos[1]-this.selectionCoordsA[1]);
				cvs.ctx.stroke();
			}
			else{ //Draw tiny cursor rect otherwise
				cvs.ctx.beginPath();
				cvs.ctx.strokeStyle = scrubColor(ui.textFields[t].value);
				cvs.ctx.lineWidth = 1;
				cvs.ctx.rect(this.mousePos[0]-15, this.mousePos[1]+15, 10, 10);
				cvs.ctx.stroke();
			}
		}
		if(this.selectionType == "circle"){
			var t = findStartIndex(2, ui.textFields);
			if(this.mouseDown){ //Big draggy circle
				var radius = Math.sqrt(Math.pow(this.selectionCoordsA[0]-this.mousePos[0], 2) + Math.pow(this.selectionCoordsA[1]-this.mousePos[1], 2));
				cvs.ctx.beginPath();
				cvs.ctx.strokeStyle = scrubColor(ui.textFields[t].value);
				cvs.ctx.lineWidth = 1;
                cvs.ctx.arc(this.selectionCoordsA[0], this.selectionCoordsA[1], radius, 0, 2*Math.PI);
				cvs.ctx.stroke();
			}
			else{ //Draws tiny cursor circle otherwise
                cvs.ctx.beginPath();
				cvs.ctx.strokeStyle = scrubColor(ui.textFields[t].value);
				cvs.ctx.lineWidth = 1;
                cvs.ctx.arc(this.mousePos[0]-10.5, this.mousePos[1]+19.5, 5, 0, 2*Math.PI);
                cvs.ctx.stroke();
			}
		}
	}
	this.clickTrigger = function(){
		//Deals with menu selection
		if(this.hoveredElement == 1){
			ui.selectionType = "block";
		}
		if(this.hoveredElement == 2){
			ui.selectionType = "circle";
		}
		if(this.hoveredElement == 3){ //Takes a screenshot of the canvas and downloads it
			//https://stackoverflow.com/questions/16792805/how-to-take-screenshot-of-canvas
			//Can't screenshot the ui because it uses images. Tainted canvas or smth. It's ok I didn't want to screenshot ui anyways. 
			cvs.canvas = document.getElementById("ssCanvas");
			cvs.ctx = cvs.canvas.getContext("2d");
			cvs.ctx.imageSmoothingEnabled = false;
			sim.drawLoop();
			var screenshot = cvs.canvas.toDataURL("png");
			cvs.ctx.clearRect(0, 0, cvs.width, cvs.height);
			cvs.canvas = document.getElementById("canvas");
			cvs.ctx = cvs.canvas.getContext("2d");
			cvs.ctx.imageSmoothingEnabled = false;
			document.getElementById("download").href = screenshot;
			document.getElementById("download").download = (presets.length).toString();
			document.getElementById("download").click();
		}
		if(this.hoveredElement == 100 || this.hoveredElement == 200){ //Delete button
			for(var i = 0; i < sim.selection.length; i++){
				if(sim.selection[i] != null){
					sim.entities = removeElement(sim.selection[i], sim.entities);
					sim.selection[i] = null;
				}
			}
		}
		if(this.hoveredElement == 0){ //Preset seleciton. Copied from line 219
			var dim = [100, 50];
			var numPerRow = Math.floor(this.maxSideMenuDim[0]/(dim[0]+20)); //Added constant makes it comfier - more space between tight images
			var numPerColumn = 7;
			var widthMargin = (this.maxSideMenuDim[0]-numPerRow*dim[0])/(numPerRow+1); //Width between edges of images
			var heightMargin = 10;
			var leftMargin = this.menuPos[0]+this.iconDimensions[0]+this.margin/2;
			var topMargin = 0.55*30+(this.margin+this.iconDimensions[1])*(this.hoveredElement%100)+this.menuPos[1]+30*this.headers[this.hoveredElement].length; //Taken from above (see above)
			var min = numPerRow*Math.floor(ui.scrollPos/(dim[1]+heightMargin));
			if(min<0){min=0;}
			for(var i = min; i < ((min+numPerColumn*numPerRow < searchDisplayPresets.length)?(min+numPerColumn*numPerRow):(searchDisplayPresets.length)); i++){
				var x = widthMargin+leftMargin+Math.floor(i % numPerRow)*(widthMargin+dim[0]);
				var y = topMargin+Math.floor(i / numPerRow)*(heightMargin+dim[1])-ui.scrollPos;
				if(this.mousePos[0] >= x && this.mousePos[0] <= x+dim[0] && this.mousePos[1] >= y && this.mousePos[1] <= y+dim[1]){
					//Clicked on preset presets[searchDisplayPresets[i]]
					sim.entities = constructEntitiesFromString(presets[searchDisplayPresets[i][0]].simText);
					sim.cameras = constructCamerasFromString(presets[searchDisplayPresets[i][0]].camText);
				}
			}
		}
		//Developer tools\\
		if(this.hoveredElement == 300){ //Black. Copies entities
			var copyText = document.getElementById("copyText");
			copyText.value = JSON.stringify(sim.entities);
			copyText.select();
			document.execCommand("copy");
		}
		if(this.hoveredElement == 301){ //Red. Copies cameras
			var copyText = document.getElementById("copyText");
			copyText.value = JSON.stringify(sim.cameras);
			copyText.select();
			document.execCommand("copy");
		}
		if(this.hoveredElement == 302){ //Purple. Copies string for entire simulation
			var copyText = document.getElementById("copyText");
			copyText.value = "presets.push(new preset(presets.length, [], {camText:'" + JSON.stringify(sim.cameras) + "'}, '" + JSON.stringify(sim.entities) + "'));";
			copyText.select();
			document.execCommand("copy");
		}
		if(this.hoveredElement == 303){
			//var rawText = prompt("Enter text:", "");
			sim.entities = constructEntitiesFromString(presets[0].simText);
			sim.cameras = constructCamerasFromString(presets[0].camText);
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
		//Checks to see if it's any checkboxes
		this.selectedTextFieldIndex = -1;
		for(var i = 0; i < this.textFields.length; i++){
			if(this.hoveredElement == this.textFields[i].hoveredElement){ //Checks if the text field is even visible
				if(this.mousePos[0] > this.textFields[i].pos[0] && this.mousePos[0] < this.textFields[i].pos[0]+this.textFields[i].dim[0] && this.mousePos[1] > this.textFields[i].pos[1] && this.mousePos[1] < this.textFields[i].pos[1] + this.textFields[i].dim[1]){
					this.selectedTextFieldIndex = i;
				}
			}
		}
		this.selectedCheckboxFieldIndex = -1;
		for(var i = 0; i < this.checkboxFields.length; i++){
			if(this.hoveredElement == this.checkboxFields[i].hoveredElement){ //Checks if the checkbox field is even visible
				if(this.mousePos[0] > this.checkboxFields[i].pos[0] && this.mousePos[0] < this.checkboxFields[i].pos[0]+this.checkboxFields[i].dim[0] && this.mousePos[1] > this.checkboxFields[i].pos[1] && this.mousePos[1] < this.checkboxFields[i].pos[1] + this.checkboxFields[i].dim[1]){
					this.checkboxFields[i].value = !this.checkboxFields[i].value;
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
		if(this.selectionType == "block"){ //summons block
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
			var t = findStartIndex(1, ui.textFields);
			var c = findStartIndex(1, ui.checkboxFields);

			var color = scrubColor(ui.textFields[t].value)
			var gravity = ui.checkboxFields[c].value;
			var mass = parseInt(ui.textFields[t+1].value);
			if(ui.textFields[t+1].value == "x"){mass=0;}
			var initialVeloc = [parseInt(ui.textFields[t+2].value), -parseInt(ui.textFields[t+3].value)];

			var rect = new basicObject("block", selectionInEngineA, dim, {color:color, gravity:gravity, mass:mass, initialVeloc:initialVeloc});
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
		if(this.selectionType == "circle"){ //summons circle
			var dim = [Math.sqrt(Math.pow(selectionInEngineA[0]-selectionInEngineB[0], 2) + Math.pow(selectionInEngineA[1]-selectionInEngineB[1], 2))];
			var t = findStartIndex(2, ui.textFields);
			var c = findStartIndex(2, ui.checkboxFields);

			var color = scrubColor(ui.textFields[t].value)
			var gravity = ui.checkboxFields[c].value;
			var mass = parseInt(ui.textFields[t+1].value);
			if(ui.textFields[t+1].value == "x"){mass=0;}
			var initialVeloc = [parseInt(ui.textFields[t+2].value), -parseInt(ui.textFields[t+3].value)];

			var circ = new basicObject("circle", selectionInEngineA, dim, {color:color, gravity:gravity, mass:mass, initialVeloc:initialVeloc});
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
function findStartIndex(hoveredElement, fields){ //Used for finding the beginning of the fields arrays because I coded this in a really convoluted and stupid way
	var startIndex = -1;
	for(var i = 0; i < fields.length; i++){
		if(fields[i].hoveredElement == hoveredElement){
			startIndex = i;
			break;
		}
	}
	if(startIndex != -1){
		return startIndex;
	}
	else{
		console.log("ERROR: Looking for hoveredElement start index that does not exist");
	}
}