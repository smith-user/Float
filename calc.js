const { conv } = require('./conv.js');

module.exports.calc = function (input) {	
	let operationIndex = Math.max(input.indexOf('+'), input.indexOf('-', 1));
	if (operationIndex == -1)
		return conv(input);
	
	let firstFloat = new Float(input.substring(0, operationIndex));
	let secondFloat = new Float(input.substring(operationIndex + 1));
	if(input[operationIndex] == '-') {
		secondFloat.signBit = (1 - parseInt(secondFloat.signBit)).toString();
	}
	let resultFloat = new Float(conv('0'));
	
	let decDegree1 = parseInt(firstFloat.degree, 2);
	let decDegree2 = parseInt(secondFloat.degree, 2);
	if (decDegree1 >= decDegree2) {
		resultFloat.degree = firstFloat.degree;
		secondFloat.mantissa = ('0'.repeat(decDegree1 - decDegree2) + secondFloat.mantissa).substring(0, firstFloat.mantissa.length); 
	}
	else {
		resultFloat.degree = secondFloat.degree;
		firstFloat.mantissa = ('0'.repeat(decDegree2 - decDegree1) + firstFloat.mantissa).substring(0, firstFloat.mantissa.length);
	}
	
	firstFloat.twosComplement();
	secondFloat.twosComplement();
	
	let resultMantissa = add(firstFloat.signBit + firstFloat.mantissa, secondFloat.signBit + secondFloat.mantissa);
	
	resultFloat.signBit = resultMantissa[0];
	resultMantissa = resultMantissa.substring(1);
	
	let index = resultMantissa.indexOf('1');
	
	if (index != -1 && parseInt(resultFloat.degree) != 0 && resultFloat.degree != '11111110' && resultFloat.degree != '11111111') {
		//console.log(t.toString(2));
		let t = parseInt(resultFloat.degree, 2) - index + 1;
		resultFloat.degree = '0'.repeat(8 - t.toString(2).length) + t.toString(2);
		let s = resultMantissa.substring(index + 1) + '0'.repeat(index);
		resultFloat.mantissa = s.substring(0, 23);
		return resultFloat.signBit + ' ' + resultFloat.degree + ' ' + resultFloat.mantissa;
	} else if (parseInt(resultFloat.degree) == 0) {
		if (resultMantissa[1] == 1)
			resultFloat.degree = '00000001';
		resultFloat.mantissa = resultMantissa.substring(2, 25) + '0';
		
	} else if (resultFloat.degree == '11111110') {
		if (resultMantissa[1] == 1) {
			resultFloat.degree = '11111111';
			resultFloat.mantissa = '0'.repeat(23);
		}
		else
			resultFloat.mantissa = resultMantissa.substring(2, 25) + '0';
	} else if (resultFloat.degree == '11111111') {
		resultFloat.mantissa = '0'.repeat(23);
	} else 
		return conv('0');

	return resultFloat.signBit + ' ' + resultFloat.degree + ' ' + resultFloat.mantissa;
	
	
	
	
}

function Float(input) {
	let arrayInput = conv(input).split(' ');
	this.signBit = arrayInput[0];
	this.degree = arrayInput[1];
	
	let imaginaryDigit;
	if (Number.parseInt(this.degree, 2) == 0)
		imaginaryDigit = 0;
	else
		imaginaryDigit = 1;
	this.mantissa = imaginaryDigit.toString() + arrayInput[2];
}

Float.prototype.twosComplement = function () {
	if ((this.signBit == '0') || (parseInt(this.mantissa, 2) == 0))
		return;
	let intMantissa = Math.pow(2, this.mantissa.length) - parseInt(this.mantissa, 2);
	let sMantissa = intMantissa.toString(2);
	this.mantissa = '0'.repeat(this.mantissa.length - sMantissa.length) + sMantissa;
	
}

function add(num1, num2) { //num.length = signBit + ImaginaryDigit + mantissa(23)
	let result = new Array(26);
	num1 = num1[0] + num1[0] + num1.substring(1);
	num2 = num2[0] + num2[0] + num2.substring(1);
	for (let i = 0; i < result.length; i++)
		result[i] = 0;
	let temp;
	for (let i = 25; i > 0; i--) {
		temp = result[i] + parseInt(num1[i]) + parseInt(num2[i]);
		result[i] = temp % 2;
		result[i - 1] = parseInt(temp / 2);
	}
	result[0] = ( result[0] + parseInt(num1[0]) + parseInt(num2[0]) ) % 2;

	let sResult = result.join('').substring(0, 25);
	
	let tempFloat = new Float(conv('0'));
	tempFloat.signBit = sResult[0];
	tempFloat.mantissa = sResult.substring(1);
	tempFloat.twosComplement();
	
	return tempFloat.signBit + tempFloat.mantissa;
	
	
}
