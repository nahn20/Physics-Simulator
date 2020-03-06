//Format is columns in little array, rows in big array
//[[a, b], [c, d]]
//= [a, c]
//= [b, d]
function multiplyMatrices2x2and2x1(a, x){
	if(a.length == 2 && a[0].length == 2 && x.length == 2){
		var output = [0, 0];
		output[0] = a[0][0]*x[0] + a[1][0]*x[1];
		output[1] = a[0][1]*x[0] + a[1][1]*x[1];	
		return output;
	}
	else{
		console.log("Matrix Multiplication Error: Wrong Function")
	}
}
function findInverse2x2(a){
	var b = [[a[1][1], -a[1][0]], [-a[0][1], a[0][0]]];
	var determinant = 1/(a[0][0]*a[1][1]-a[0][1]*a[1][0]);
	var inverse = scalarMult(determinant, b);
	return inverse;
}
function scalarMult(c, a){
	for(var i = 0; i < a.length; i++){
		for(var q = 0; q < a[i].length; q++){
			a[i][q] *= c;
		}
	}
	return a;
}
function sqr(a){
	return a*a;
}
function findMag(v){
	return Math.sqrt(v[0]*v[0]+v[1]*v[1]);
}
function pythag(a, b){
	return Math.sqrt(sqr(a)+sqr(b));
}
function removeElement(elementIndex, array){
	for(var i = elementIndex; i < array.length-1; i++){
		array[i] = array[i+1];
	}
	array = array.splice(0, array.length-1);
	return array;
}