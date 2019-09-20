var cvs = {
	width : 1200,
	height : 600,
	pos : [0, 0],
	sizeMultiplier : 1,
	init : function(){
		this.canvas = document.getElementById("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.canvas.addEventListener("wheel", function(event){
			event.preventDefault();
			var canvasCoords = cvs.canvas.getBoundingClientRect();
			var mouseX = event.x - canvasCoords.left;
			var mouseY = event.y - canvasCoords.top;
			for(var i = 0; i < sim.cameras.length; i++){
				if(mouseX > sim.cameras[i].screenPos[0] && mouseX < sim.cameras[i].screenPos[0]+sim.cameras[i].dim[0] && mouseY > sim.cameras[i].screenPos[1] && mouseY < sim.cameras[i].screenPos[1]+sim.cameras[i].dim[1]){
					if((sim.cameras[i].sizeMultiplier > 0.2 && event.deltaY > 0) || (sim.cameras[i].sizeMultiplier < 2 && event.deltaY < 0)){
						var shift = event.deltaY/100;
						var centerInEngineX = (sim.cameras[i].dim[0]/2)/sim.cameras[i].sizeMultiplier + sim.cameras[i].pos[0];
						var centerInEngineY = (sim.cameras[i].dim[1]/2)/sim.cameras[i].sizeMultiplier + sim.cameras[i].pos[1];
						sim.cameras[i].sizeMultiplier -= shift;
	
						sim.cameras[i].pos[0] = centerInEngineX - sim.cameras[i].dim[0]/(2*sim.cameras[i].sizeMultiplier)
						sim.cameras[i].pos[1] = centerInEngineY - sim.cameras[i].dim[1]/(2*sim.cameras[i].sizeMultiplier)

					}
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
			var canvasCoords = cvs.canvas.getBoundingClientRect();
			var mouseX = event.x - canvasCoords.left;
			var mouseY = event.y - canvasCoords.top;
			for(var i = 0; i < sim.cameras.length; i++){
				if(mouseX > sim.cameras[i].screenPos[0] && mouseX < sim.cameras[i].screenPos[0]+sim.cameras[i].dim[0] && mouseY > sim.cameras[i].screenPos[1] && mouseY < sim.cameras[i].screenPos[1]+sim.cameras[i].dim[1]){
					var mouseOnCamX = mouseX - sim.cameras[i].screenPos[0];
					var mouseOnCamY = mouseY - sim.cameras[i].screenPos[1];
					var mouseInEngineX = mouseOnCamX/sim.cameras[i].sizeMultiplier + sim.cameras[i].pos[0];
					var mouseInEngineY = mouseOnCamY/sim.cameras[i].sizeMultiplier + sim.cameras[i].pos[1];
					console.log("X: " + mouseInEngineX + "\nY: " + mouseInEngineY);
				}
			}
		});
	}
}
