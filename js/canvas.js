var cvs = {
	width : 1200,
	height : 600,
	init : function(){
		this.canvas = document.getElementById("canvas");
		this.ctx = this.canvas.getContext("2d");
	}
}
function drawRect(pos, dim){
	cvs.ctx.fillRect(pos[0], pos[1], dim[0], dim[1]);
}