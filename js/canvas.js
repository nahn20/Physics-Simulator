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
								if(sim.keyMap[49]){
									if(sim.selection[0] == sim.entities[k]){
										sim.selection[0] = null;
									}
									else{
										sim.selection[0] = sim.entities[k];
										if(sim.selection[0] == sim.selection[1]){
											sim.selection[1] = null;
										}
									}
								}
								if(sim.keyMap[50]){
									if(sim.selection[1] == sim.entities[k]){
										sim.selection[1] = null;
									}
									else{
										sim.selection[1] = sim.entities[k];
										if(sim.selection[0] == sim.selection[1]){
											sim.selection[0] = null;
										}
									}
								}
							}
						}
						if(sim.selection[0] != null && sim.selection[1] != null){
							ui.menu = 2;
						}
						else if(sim.selection[0] != null || sim.selection[1] != null){
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
			ui.mousePos = [mouseX, mouseY];
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
