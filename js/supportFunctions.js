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
function toLowerCase(string){ //Untested, idk why I made this
	var newString = "";
	for(var i = 0; i < string.length; i++){
		var charCode = string.charCodeAt(i);
		if(charCode >= 65 && charCode <= 90){
			newString += String.fromCharCode(charCode+32);
		}
		else{
			newString += string[i];
		}
	}
	return newString;
}
function firstLetterToLower(string){
	var newString = "";
	var charCode = string.charCodeAt(i);
	if(charCode >= 65 && charCode <= 90){
		newString += String.fromCharCode(charCode+32);
	}
	for(var i = 1; i < string.length; i++){
		newString += string[i];
	}
	return newString;
}
function scrubColor(color){
	var style = new Option().style;
	style.color = color;
	if(style.color == firstLetterToLower(color)){
		return color;
	}
	//If the match isn't perfect, it'll find something using my handy dandy color dictionary
	if(color.length > 1){ //Doesn't check if too short
		var typos = [["Blac", "Blak", "Lack", "Lac", "Lak"], ["Gray", "Gre", "Gra", "Ray", "Rey"], ["Blu", "Bl"], ["Brow", "Broon", "Br"], ["Re", "Ed", "Reds"], ["Orang", "Range", "Rang", "Ora", "Or"], ["Yell", "Yello", "Ellow"], ["Pin", "Pinc", "Ink"], ["Pupl", "Purpl", "Porpol", "Purp", "Purpoo"], ["Smiley", "Smile", "Happy", "Yay"]];
		var colors = ["Black", "Grey", "Blue", "Brown", "Red", "Orange", "Yellow", "Pink", "Purple", "Smiley"];
		var foundMatch = -1;
		var breakVar = false; //I'm too lazy to check if the built in break works for double for
		for(var q = 0; q < typos.length && !breakVar; q++){
			for(var i = 0; i < typos[q].length; i++){
				if(color == typos[q][i]){
					foundMatch = q;
					breakVar = true;
				}
			}
		}
		if(foundMatch == -1){
			return "Black";
		}
		else if(foundMatch == 9){
			return cvs.ctx.createPattern(patterns.smiley, 'repeat');
		}
		else{
			return colors[foundMatch];
		}
	}
	else{
		return "Black";
	}
}
function replaceAll(string, badChar, newChar){ //Replaces all badChars with newChars in a string
	var newString = "";
	for(var i = 0; i < string.length; i++){
		var char = string.charAt(i);
		if(char != badChar){
			newString += char;
		}
		else{
			newString += newChar;
		}
	}
	return newString;
}
function copyArray(array){
	var newArray = [];
	for(var i = 0; i < array.length; i++){
		newArray[i] = array[i]
	}
	return newArray;
}
function aSimB(a, b){ //Compares two words a and b to see how similar they are
	var sim = 0;
	for(var i = 0; i < a.length; i++){
		if(a.charAt(i) == b.charAt(i) || a.charAt(i) == b.charAt(i-1) || a.charAt(i) == b.charAt(i+1)){
			sim++;
		}
	}
	sim /= a.length;
	return sim;
}
function shiftArrayUp(array){ //Shifts array up one (1 becomes 0, 2 becomes 1, last element is eliminated)
	var newArray = [];
	for(var q = 1; q < array.length; q++){
		newArray[q-1] = array[q];
	}
	return newArray;
}
var patterns = {
	smiley : new Image(),
}
patterns.smiley.src = "images/patterns/smiley.png";
function abbreviateNum(num, lim){ //Lim is maximum number of digits it should be
	if(typeof(num) != 'undefined' && num != null){
		if(num.toString().length > lim){
			var digitsBeforeDecimal = Math.round(num).toString().length;
			var digitsAfterDecimalToKeep = Math.pow(10,lim-digitsBeforeDecimal)
			num = Math.round(digitsAfterDecimalToKeep*num)/digitsAfterDecimalToKeep;
		}
		if((num > Math.pow(10, lim) || num < Math.pow(10, -lim)) && num != 0){
			num = num.toExponential();
		}
	}
	return num;
}