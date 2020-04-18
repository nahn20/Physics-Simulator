var cvs = {
	width : 1200,
	height : 600,
	pos : [0, 0],
	sizeMultiplier : 1,
	init : function(){
		this.canvas = document.getElementById("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.ctx.imageSmoothingEnabled = false;
		this.canvas.addEventListener("wheel", function(event){
			event.preventDefault();
			var canvasCoords = cvs.canvas.getBoundingClientRect();
			var mouseX = event.x - canvasCoords.left;
			var mouseY = event.y - canvasCoords.top;
			if(ui.hoveredElement == -1){ //Only if not hoving over UI
				for(var i = 0; i < sim.cameras.length; i++){
					if(mouseX > sim.cameras[i].screenPos[0] && mouseX < sim.cameras[i].screenPos[0]+sim.cameras[i].dim[0] && mouseY > sim.cameras[i].screenPos[1] && mouseY < sim.cameras[i].screenPos[1]+sim.cameras[i].dim[1]){
						var shift = event.deltaY/100;
						var centerInEngineX = (sim.cameras[i].dim[0]/2)/sim.cameras[i].sizeMultiplier + sim.cameras[i].pos[0];
						var centerInEngineY = (sim.cameras[i].dim[1]/2)/sim.cameras[i].sizeMultiplier + sim.cameras[i].pos[1];
						sim.cameras[i].sizeMultiplier -= shift;
						sim.cameras[i].sizeMultiplier = Math.min(Math.max(parseFloat(sim.cameras[i].sizeMultiplier), 0.1), 20); //Restricts size multiplier
	
						sim.cameras[i].pos[0] = centerInEngineX - sim.cameras[i].dim[0]/(2*sim.cameras[i].sizeMultiplier)
						sim.cameras[i].pos[1] = centerInEngineY - sim.cameras[i].dim[1]/(2*sim.cameras[i].sizeMultiplier)
					}
				}
			}
			else if(ui.hoveredElement == 0){
				ui.scrollPos += event.deltaY;
			}
		});
		this.canvas.addEventListener("contextmenu", function(event){
			event.preventDefault();
			var canvasCoords = cvs.canvas.getBoundingClientRect();
			var mouseX = event.x - canvasCoords.left;
			var mouseY = event.y - canvasCoords.top;
			var canvasCoords = cvs.canvas.getBoundingClientRect();
			for(var i = 0; i < sim.cameras.length; i++){
				if(mouseX > sim.cameras[i].screenPos[0] && mouseX < sim.cameras[i].screenPos[0]+sim.cameras[i].dim[0] && mouseY > sim.cameras[i].screenPos[1] && mouseY < sim.cameras[i].screenPos[1]+sim.cameras[i].dim[1]){
					var mouseOnCamX = mouseX - sim.cameras[i].screenPos[0];
					var mouseOnCamY = mouseY - sim.cameras[i].screenPos[1];
					var mouseInEngineX = mouseOnCamX/sim.cameras[i].sizeMultiplier + sim.cameras[i].pos[0];
					var mouseInEngineY = mouseOnCamY/sim.cameras[i].sizeMultiplier + sim.cameras[i].pos[1];

					//sim.cameras[i].dim[0]/2 = sim.cameras[i].sizeMultiplier*(mouseInEngineX-sim.cameras[i].pos[0])
					sim.cameras[i].pos[0] = mouseInEngineX - sim.cameras[i].dim[0]/(2*sim.cameras[i].sizeMultiplier)
					sim.cameras[i].pos[1] = mouseInEngineY - sim.cameras[i].dim[1]/(2*sim.cameras[i].sizeMultiplier)
				}
			}
		});
		this.canvas.addEventListener("click", function(event){
			ui.clickTrigger();
			var canvasCoords = cvs.canvas.getBoundingClientRect();
			var mouseX = event.x - canvasCoords.left;
			var mouseY = event.y - canvasCoords.top;
			if(ui.hoveredElement == -1){ //Only does all this stuff if not hovering over the ui
				for(var i = 0; i < sim.cameras.length; i++){
					if(mouseX > sim.cameras[i].screenPos[0] && mouseX < sim.cameras[i].screenPos[0]+sim.cameras[i].dim[0] && mouseY > sim.cameras[i].screenPos[1] && mouseY < sim.cameras[i].screenPos[1]+sim.cameras[i].dim[1]){
						var mouseOnCamX = mouseX - sim.cameras[i].screenPos[0];
						var mouseOnCamY = mouseY - sim.cameras[i].screenPos[1];
						var mouseInEngineX = mouseOnCamX/sim.cameras[i].sizeMultiplier + sim.cameras[i].pos[0];
						var mouseInEngineY = mouseOnCamY/sim.cameras[i].sizeMultiplier + sim.cameras[i].pos[1];
						console.log("X: " + mouseInEngineX + "\nY: " + mouseInEngineY);
						var mouseEntity = {
							pos : [mouseInEngineX, mouseInEngineY],
							dim : [0,0],
							rcom : [0, 0],
							rAngle : 0,
							type : "block",
						}
						for(var k = 0; k < sim.entities.length; k++){
							if(isCollision(0, mouseEntity,sim.entities[k]).both == true){
								console.log(sim.entities[k]);
								for(var key = 49; key <= 57; key++){ //1-9
									if(sim.keyMap[key]){
										if(sim.selection[key-49] == k){
											sim.selection[key-49] = null;
										}
										else{
											sim.selection[key-49] = k;
											for(var j = 0; j <= 9; j++){ //Checks to see if any other selections are the same key
												if(sim.selection[key-49] == sim.selection[j] && key-49 != j){
													sim.selection[j] = null;
												}
											}
										}
									}
								}
								if(sim.keyMap[16]){ 
									var isRemoved = false;
									for(var q = 0; q <= 9; q++){ //Gets rid of that selection for any color
										if(sim.selection[q] == k){
											sim.selection[q] = null;
											isRemoved = true;
										}
									}
									if(!isRemoved){ //Otherwise highlights with next selection
										for(var q = 0; q <= 9; q++){
											if(sim.selection[q] == null){
												sim.selection[q] = k;
												break;
											}
										}
									}
								}
							}
						}
						//If multiple selected
						var selectedCount = 0;
						for(var i = 0; i < sim.selection.length && selectedCount < 2; i++){
							if(sim.selection[i] != null){
								selectedCount++;
							}
						}
						if(selectedCount >= 2){
							ui.menu = 2;
						}
						else if(selectedCount == 1){
							ui.menu = 1;
						}
						else{
							ui.menu = 0;
						}
					}
				}
			}
		});
		this.canvas.addEventListener("mousemove", function(event){
			var canvasCoords = cvs.canvas.getBoundingClientRect();
			var mouseX = event.x - canvasCoords.left;
			var mouseY = event.y - canvasCoords.top;
			ui.mouseMoveTrigger([mouseX, mouseY]);
		});
		this.canvas.addEventListener("mousedown", function(event){
			var canvasCoords = cvs.canvas.getBoundingClientRect();
			var mouseX = event.x - canvasCoords.left;
			var mouseY = event.y - canvasCoords.top;
			if(!ui.mouseDown){
				ui.selectionCoordsA = [mouseX, mouseY];
				ui.mouseDown = true;
			}
			else{ //If you release click off screen, program treats the next click in the canvas as a release
				ui.selectionCoordsB = [mouseX, mouseY];
				ui.mouseDown = false;
				ui.mouseUpTrigger();
			}
			ui.mouseDownTrigger();
		});
		this.canvas.addEventListener("mouseup", function(event){
			var canvasCoords = cvs.canvas.getBoundingClientRect();
			var mouseX = event.x - canvasCoords.left;
			var mouseY = event.y - canvasCoords.top;
			ui.selectionCoordsB = [mouseX, mouseY];
			ui.mouseDown = false;
			ui.mouseUpTrigger();
		});
	}
}
