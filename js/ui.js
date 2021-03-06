const widthMultiplierThing = 9.7; //For 16px
//Ok I coded this really poorly, and instead of labeling things I put everything in terms of indices. Which makes sense when you're running the code, but if I want to shift something (for example, a button) up or down one, I have to change all references to that index. So here's some impotant ones
const settingsIndex = 4; //Relating to hoveredElement
var vacMenu = {
	firstVacIndex: 4,
	nthHeader: 5,
}
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
	this.fillStyle = "rgb(153, 0, 255)";
	//this.fillStyle = "rgba(0, 0, 0, 0.2)";
	//this.fillStyle = cvs.ctx.createPattern(patterns.smiley, 'repeat');
	this.selectedTextFieldIndex = -1;
	this.textFields = [];
	this.checkboxFields = [];
	this.sideMenuDim = [0, 0]; //Increases to meet max
	this.minSideMenuDim = [200, 500]; //Constant, except when it's changed for different header amounts
	this.maxSideMenuDim = [this.minSideMenuDim[0], this.minSideMenuDim[1]]; //Changes based on text field size
	this.hoverText = "";
	this.ticksSinceLastMove = 0;

	this.scrollPos = 0; //Always positive. 
	this.moveDrag = false;
	//Creating text fields
	this.headers = [[]];
	this.headerTypes = [[]]; //I'm so sorry this is getting convoluted
	this.headerDescriptions = [[]];
	this.defaultValues = [[]]; //This is so much worse
	this.headers[0] = ["- Preset Search -", "Chapter:", "Problem:", "Tags:"];
	this.headerDescriptions[0] = ["Search for premade simulations. Click on a thumbnail to load the preset", "Search by chapter number", "Search by problem number", "Search by topic, ex: momentum, projectile"]
	this.headerTypes[0] = ["none", "int", "int", "string"];
	this.headers[1] = ["Color:", "Mass:", "X Velocity:", "Y Velocity:", "Gravity:", "X VAC[0]:", "Y VAC[0]:"]; //Color must come first
	this.headerTypes[1] = ["color", "intNullX", "int", "int", "bool", "intNullX", "intNullX"];
	this.headerDescriptions[1] = ["Color for created block", "Mass of created block", "Velocity in the x direction", "Velocity in the y direction", "Enable gravity for the block", "Velocity after the 1st collision in the x-direction", "Velocity after the 1st collision in the y-direction", "Velocity after the 2nd collision in the x-direction", "Velocity after the 2nd collision in the y-direction", "Velocity after the 3rd collision in the x-direction", "Velocity after the 3rd collision in the y-direction", "Velocity after the 4th collision in the x-direction", "Velocity after the 4th collision in the y-direction", "Velocity after the 5th collision in the x-direction", "Velocity after the 5th collision in the y-direction"];
	this.headers[2] = ["Color:", "Mass:", "X Velocity:", "Y Velocity:", "Gravity:", "X VAC[0]:", "Y VAC[0]:"];
	this.headerTypes[2] = ["color", "intNullX", "int", "int", "bool", "intNullX", "intNullX"];
	this.headerDescriptions[2] = ["Color for created block", "Mass of created block", "Velocity in the x direction", "Velocity in the y direction", "Enable gravity for the block", "Velocity after the 1st collision in the x-direction", "Velocity after the 1st collision in the y-direction", "Velocity after the 2nd collision in the x-direction", "Velocity after the 2nd collision in the y-direction", "Velocity after the 3rd collision in the x-direction", "Velocity after the 3rd collision in the y-direction", "Velocity after the 4th collision in the x-direction", "Velocity after the 4th collision in the y-direction", "Velocity after the 5th collision in the x-direction", "Velocity after the 5th collision in the y-direction"];
	this.headers[settingsIndex] = ["- Settings -", "Background Color:", "Show Parameters", "Parameters Size"];
	this.headerTypes[settingsIndex] = ["none", "color", "bool", "int"];
	this.headerDescriptions[settingsIndex] = ["Settings for the simulator and UI", "Background color for the user interface", "Shows the properties of all blocks on the screen", "Modifies the size of the boxes showing block properties"]
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
	var t = findStartIndex(settingsIndex, this.textFields);
	this.textFields[t].value = "Grey"; //Sets background color and changes the text value
	this.textFields[t+1].value = "2";
	this.checkboxFields[findStartIndex(settingsIndex, this.checkboxFields)].value = true;
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
		this.drawHover();
	}
	this.drawMenu = function(){
		//Looking at text field to see what the background color should be
		var t = findStartIndex(settingsIndex, ui.textFields);
		this.fillStyle = scrubColor(ui.textFields[t].value);
		if(this.fillStyle == "Black"){
			this.fillStyle = "Grey";
		}

		if(this.menu == 0 && sim.keyMap[9]){ //Developer options using tab. Not the most intelligent solution to this
			this.menu = 3;
		}
		if(this.menu == 3 && !sim.keyMap[9]){
			this.menu = 0;
		}
		var sourceArray = [];
		if(this.menu == 0){ //Regular menu
			sourceArray = ["images/icons/search.png", "images/icons/block.png", "images/icons/circle.png", "images/icons/camera.png", "images/icons/gear.png", "images/icons/question_mark.png"];
		}
		if(this.menu == 1){ //Menu for having 1 selected
			sourceArray = ["images/icons/x.png"];
		}
		if(this.menu == 2){
			sourceArray = ["images/icons/x.png"];
		}
		if(this.menu == 3){
			sourceArray = ["images/icons/save.png", "images/icons/saveButRed.png", "images/icons/saveButPurple.png", "images/icons/load.png"];
		}

		function hasDropdown(hoveredElement){ //Returns true if there's a dropdown for that element
			var elementsWithDropdown = [0, 1, 2, 4];
			for(var i = 0; i < elementsWithDropdown.length; i++){
				if(hoveredElement == elementsWithDropdown[i] || hoveredElement == elementsWithDropdown[i]+1000){
					return true;
				}
			}
			return false;
		}
		//Changing menu size based on number of headers
		if(this.headers[this.hoveredElement] != null){
			this.maxSideMenuDim[1] = 10+30*this.headers[this.hoveredElement].length;
			if(this.hoveredElement == 0){
				this.maxSideMenuDim[1] = 560;
			}
			if(this.hoveredElement == settingsIndex){
				this.maxSideMenuDim[1] += 50; //Room for move button
			}
		}
		else{
			this.maxSideMenuDim[1] = 500;
		}
		const menuSpeedFactor = 5; //bigger = slower
		if(Math.abs(this.sideMenuDim[0] - this.maxSideMenuDim[0]) > 0.01 || Math.abs(this.sideMenuDim[1] - this.maxSideMenuDim[1]) > 0.01){
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
				if(this.hoveredElement == 0){ //Handles search and scrolling
					var dim = [100, 50];
					var numPerRow = Math.floor(this.maxSideMenuDim[0]/(dim[0]+20)); //Added constant makes it comfier - more space between tight images
					var numPerColumn = 8;
					var widthMargin = (this.maxSideMenuDim[0]-numPerRow*dim[0])/(numPerRow+1); //Width between edges of images
					var heightMargin = 10;
					var leftMargin = this.menuPos[0]+this.iconDimensions[0]+this.margin/2;
					var topMargin = 0.55*30+(this.margin+this.iconDimensions[1])*(this.hoveredElement%100)+this.menuPos[1]+30*this.headers[this.hoveredElement].length; //Taken from above (see above)
					const scrollUpperLim = 0;
					const scrollLowerLim = Math.floor(searchDisplayPresets.length/numPerRow)*(heightMargin+dim[1])-0.7*this.sideMenuDim[1];
					if(ui.scrollPos < scrollUpperLim){ //Upper limit
						ui.scrollPos -= 0.6*ui.scrollPos;
					}
					if(ui.scrollPos > scrollLowerLim){ //Lower limit
						ui.scrollPos += 0.6*(scrollLowerLim-ui.scrollPos);
					}
					var scrollPercent = ui.scrollPos/Math.abs(scrollUpperLim-scrollLowerLim);
					var scrollBar = {
						x: leftMargin+this.sideMenuDim[0]-15,
						y: topMargin,
						w: 10,
						h: this.sideMenuDim[1]-topMargin-1,
						miniBarH: 300/searchDisplayPresets.length,
					}
					//Drawing border for scroll bar
					/*
					cvs.ctx.beginPath();
					cvs.ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
					cvs.ctx.rect(scrollBar.x, scrollBar.y, scrollBar.w, scrollBar.h);
					cvs.ctx.stroke();
					*/
					//Drawing actual scroll bar itself
					cvs.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
					cvs.ctx.fillRect(scrollBar.x, scrollBar.y+scrollPercent*(scrollBar.h-scrollBar.miniBarH), scrollBar.w, scrollBar.miniBarH);
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
				if(this.hoveredElement == settingsIndex){
					var shift = [0, 80];
					this.drawImage(shift[0]+this.sideMenuDim[0]-(this.iconDimensions[0]+this.margin)+this.menuPos[0]+this.iconDimensions[0]+this.margin, shift[1]+(this.margin+this.iconDimensions[1])*(this.hoveredElement%100)+this.menuPos[1], this.iconDimensions, "images/icons/move.png");
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
	this.drawHover = function(){
		const startShowingHover = 50; //Measured in ticks
		if(this.hoverText != "" && this.ticksSinceLastMove > startShowingHover){
			var x = this.mousePos[0]+10;
			var y = this.mousePos[1]+10;
			cvs.ctx.save();
			cvs.ctx.globalAlpha = Math.min((this.ticksSinceLastMove-startShowingHover)/40, 1);
			cvs.ctx.fillStyle = "#ffffb3";
			cvs.ctx.fillRect(x, y, this.hoverText.length*widthMultiplierThing+2.5, 18);
			cvs.ctx.textAlign = "left";
			cvs.ctx.font = "16px Courier New";
			cvs.ctx.fillStyle = "black";
			cvs.ctx.fillText(this.hoverText, x+2.5, y+12.5);
			cvs.ctx.restore();
		}
	}
	this.mouseMoveTrigger = function(newMousePos){
		this.ticksSinceLastMove = 0;
		if(this.moveDrag){ //Uses where the mouse WAS relative to menu coords, then updates menu coords to have same displacement from the new mouse pos
			var oldMenuPos = this.menuPos;
			var displacement = [oldMenuPos[0]-this.mousePos[0], oldMenuPos[1]-this.mousePos[1]];
			this.menuPos = [displacement[0]+newMousePos[0], displacement[1]+newMousePos[1]];
			if(this.menuPos[0] < -this.iconDimensions[0]/2){
				this.menuPos[0] = -this.iconDimensions[0]/2;
			}
			var yLimit = -(settingsIndex*(this.iconDimensions[1]+this.margin)+this.iconDimensions[1]/2); //Making it so the settings icon can't go completely off screen
			if(this.menuPos[1] < yLimit){
				this.menuPos[1] = yLimit;
			}
			var actualDisplacement = [this.menuPos[0]-oldMenuPos[0], this.menuPos[1]-oldMenuPos[1]]; //Corrects for the issue of hitting x or y limit. This is the actual displacement. 
			for(var i = 0; i < this.textFields.length; i++){ //Moving all the text and checkbox fields by the same amount. It would've been smarter to draw these fields based relative to the ui position, instead of giving them a coordinate position
				this.textFields[i].pos[0] += actualDisplacement[0];
				this.textFields[i].pos[1] += actualDisplacement[1];
			}
			for(var i = 0; i < this.checkboxFields.length; i++){
				this.checkboxFields[i].pos[0] += actualDisplacement[0];
				this.checkboxFields[i].pos[1] += actualDisplacement[1];
			}
		}
		this.mousePos = newMousePos;

		//Checks and updates hover info
		if(this.hoveredElement != -1){
			var foundDescription = false;
			if(this.headers[this.hoveredElement] != null && this.headerTypes[this.hoveredElement] != null){
				for(var i = 0; i < this.headers[this.hoveredElement].length; i++){ //Scans through text headers
					var minX = this.menuPos[0]+this.iconDimensions[0]+this.margin;
					var minY = 0.55*30+(this.margin+this.iconDimensions[1])*(this.hoveredElement%100)+this.menuPos[1]+30*i-15;
					var width = this.sideMenuDim[0];
					var height = 30;
					if(this.mousePos[0] > minX && this.mousePos[0] < minX+width && this.mousePos[1] > minY && this.mousePos[1] < minY+height){
						this.hoverText = this.headerDescriptions[this.hoveredElement][i];
						foundDescription = true;
						break;
					}
				}
			}
			if(!foundDescription){ //If you're hovered over an element but not over one of the text fields
				var iconDescriptions = [];
				iconDescriptions[0] = this.headerDescriptions[0][0];
				iconDescriptions[1] = "Click to enable block creation mode. Drag and drop in the simulation to create block";
				iconDescriptions[2] = "Click to enable circle-block creation mode. Drag and drop in the simulation to create circle-block";
				iconDescriptions[3] = "Take and download a screenshot of the simulator without the user interface";
				iconDescriptions[4] = this.headerDescriptions[4][0];
				iconDescriptions[100] = "Delete selected block"
				iconDescriptions[200] = "Delete selected blocks"
				iconDescriptions[300] = "Developer tool: Copies entity text string"
				iconDescriptions[301] = "Developer tool: Copies camera text string"
				iconDescriptions[302] = "Developer tool: Copies combined entity and camera text string"
				iconDescriptions[303] = "Developer tool: Loads a specific preset"

				if(iconDescriptions[this.hoveredElement] == null){
					this.hoverText = "";
				}
				else{
					this.hoverText = iconDescriptions[this.hoveredElement];
				}
			}
		}
		else{
			this.hoverText = "";
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
			this.hoveredElement = -1;
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
		if(this.hoveredElement == 5){
			window.open("documentation.html")
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
	this.mouseDownTrigger = function(){
		if(this.hoveredElement == settingsIndex){
			var shift = [0, 80]; //Same as the other shift
			var moveButtonX = this.sideMenuDim[0]-(this.iconDimensions[0]+this.margin)+this.menuPos[0]+this.iconDimensions[0]+this.margin+shift[0];
			var moveButtonY = (this.margin+this.iconDimensions[1])*(this.hoveredElement%100)+this.menuPos[1]+shift[1];
			if(this.mousePos[0] > moveButtonX && this.mousePos[0] < moveButtonX + this.iconDimensions[0] && this.mousePos[1] > moveButtonY && this.mousePos[1] < moveButtonY + this.iconDimensions[1]){
				this.moveDrag = true;
			}
		}
	}
	this.mouseUpTrigger = function(){
		this.moveDrag = false;
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

		function getVac(hoveredElement){ //Handling reading of vac and translating it.
			var vac = [];
			var tVacStart = findStartIndex(hoveredElement, ui.textFields)+vacMenu.firstVacIndex;
			var tVacEnd = findEndIndex(hoveredElement, ui.textFields);
			for(var i = tVacStart; i <= tVacEnd; i+=2){
				var vacX = ui.textFields[i].value;
				var vacY = ui.textFields[i+1].value;
				if(vacX == "x"){
					vacX = null;
				}
				else{
					vacX = parseFloat(vacX)
				}
				if(vacY == "x"){
					vacY = null;
				}
				else{
					vacY = parseFloat(vacY);
				}
				vac.push([vacX, vacY]);
				if(vacX == null && vacY == null){
					break;
				}
			}
			return vac;
		}
		if(this.selectionType == "block" && Math.abs(this.selectionCoordsA[0]-this.selectionCoordsB[0]) > 10 && Math.abs(this.selectionCoordsA[1]-this.selectionCoordsB[1]) > 10){ //summons block. Also checks to make sure it isn't stupidly small
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
			var mass = parseFloat(ui.textFields[t+1].value);
			if(ui.textFields[t+1].value == "x"){mass=0;}
			var initialVeloc = [parseFloat(ui.textFields[t+2].value), -parseFloat(ui.textFields[t+3].value)];
			var vac = getVac(1);

			var rect = new basicObject("block", selectionInEngineA, dim, {color:color, gravity:gravity, mass:mass, initialVeloc:initialVeloc, vac:vac});
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
		if(this.selectionType == "circle" && Math.sqrt(Math.pow(this.selectionCoordsA[0]-this.selectionCoordsB[0], 2)+Math.pow(this.selectionCoordsA[1]-this.selectionCoordsB[1], 2) > 5)){ //summons circle
			var dim = [Math.sqrt(Math.pow(selectionInEngineA[0]-selectionInEngineB[0], 2) + Math.pow(selectionInEngineA[1]-selectionInEngineB[1], 2))];
			var t = findStartIndex(2, ui.textFields);
			var c = findStartIndex(2, ui.checkboxFields);

			var color = scrubColor(ui.textFields[t].value)
			var gravity = ui.checkboxFields[c].value;
			var mass = parseFloat(ui.textFields[t+1].value);
			if(ui.textFields[t+1].value == "x"){mass=0;}
			var initialVeloc = [parseFloat(ui.textFields[t+2].value), -parseFloat(ui.textFields[t+3].value)];
			var vac = getVac(2);

			var circ = new basicObject("circle", selectionInEngineA, dim, {color:color, gravity:gravity, mass:mass, initialVeloc:initialVeloc, vac:vac});
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
	this.keyDownTrigger = function(){
		if(this.hoveredElement != this.textFields[this.selectedTextFieldIndex].hoveredElement){
			this.selectedTextFieldIndex = -1;
		}
		//Handling vac
		function checkAndAddVac(hoveredElement, firstVacIndex, nthHeader){ //Checks and adds additional vac spots
			//var firstVacIndex; //Slots vac should be lowered. ui.textFields[t+firstVacIndex] should be x vac[0]
			var t = findStartIndex(hoveredElement, ui.textFields)+firstVacIndex;
			var endT = findEndIndex(hoveredElement, ui.textFields);
			var nthVac = (1+endT - t)/2;
			var text = " VAC[" + nthVac + "]:";
			if(ui.textFields[endT-1].value != "x" || ui.textFields[endT].value != "x"){
				//Copied from above and modified
				if(nthVac <= 5){ //Max number you can fit in the textbox without overflowing. I'm NOT adding a scroll bar. Honestly, I don't think anyone will need more than 2 of these ever.
					ui.headers[hoveredElement].push("X" + text); //Note: these headers are out of the conventional order. It shouldn't matter, since I never use header order for anything (I don't think)
					ui.headers[hoveredElement].push("Y" + text);
					for(var i = 0; i < 2; i++){
						var newTF = new textField([8+widthMultiplierThing*("X" + text).length+ui.menuPos[0]+ui.iconDimensions[0]+ui.margin, (ui.margin+ui.iconDimensions[1])*(hoveredElement%100)+ui.menuPos[1]+30*(i+nthHeader+2*nthVac)], hoveredElement, "intNullX", {});
						ui.textFields.splice(i+endT+1, 0, newTF);
					}
				}
			}
			if(nthVac > 0){
				if(ui.textFields[endT-3].value == "x" && ui.textFields[endT-2].value == "x"){
					ui.textFields.splice(endT-1, 2);
					//Removes the end two headers in hoveredElement
					ui.headers[hoveredElement].splice(-2, 2);
				}
			}
		}
		if(this.hoveredElement == 1 || this.hoveredElement == 2){
			checkAndAddVac(this.hoveredElement, vacMenu.firstVacIndex, vacMenu.nthHeader);
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
function findEndIndex(hoveredElement, fields){ //Used for finding end of field arrays because I still coded this in a convoluted and stupid way
	var startIndex = findStartIndex(hoveredElement, fields);
	for(var i = startIndex; i < fields.length; i++){
		if(fields[i].hoveredElement != hoveredElement){
			return i-1;
		}
		if(i == fields.length-1){
			return i;
		}
	}
}