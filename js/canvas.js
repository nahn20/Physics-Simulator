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
						sim.cameras[i].sizeMultiplier -= event.deltaY/100;
					}
				}
			}
		})
	}
}
