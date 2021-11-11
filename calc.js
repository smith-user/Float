const { conv } = require('./conv.js');

module.exports.calc = function (input) {
	// Определение знака операции
	let operationIndex = -1;
	for (let i = 1; i < input.length; i++)
		if ( (input[i] == '+' || input[i] == '-') && (input[i-1] != 'e') ) {
			operationIndex = i;
			break;
		}
	if (operationIndex == -1)
		return conv(input);
	
	let firstFloat = new Float(input.substring(0, operationIndex));
	let secondFloat = new Float(input.substring(operationIndex + 1));
	if(input[operationIndex] == '-')           // Цель: реализовать вычитание, используя только операцию сложения
		secondFloat.signBit = (1 - parseInt(secondFloat.signBit)).toString();

	let sResult;
	let decDegree1 = parseInt(firstFloat.degree, 2);
	let decDegree2 = parseInt(secondFloat.degree, 2);
	
	if (decDegree1 != 255 && decDegree2 != 255)  // т.е. Нормализованные и Денормализованные числа
		sResult = floatAdd(firstFloat, secondFloat);
	else if (decDegree1 == 255 && decDegree1 == 255) { 
		if ((parseInt(firstFloat.mantissa, 2) == 0 || parseInt(secondFloat.mantissa, 2) == 0) &&
				(firstFloat.signBit == secondFloat.signBit))   // Сложение бесконечностей одного знака
			sResult = firstFloat.signBit + ' 11111111 00000000000000000000000';
		else 
			sResult = conv('Not A Number');	
	} else if (decDegree1 == 255 || decDegree1 == 255) {
		if (parseInt(firstFloat.mantissa, 2) == 0)
			sResult = firstFloat.signBit + ' 11111111 00000000000000000000000';
		else if (parseInt(secondFloat.mantissa, 2) == 0)
			sResult = secondFloat.signBit + ' 11111111 00000000000000000000000';
		else 
			sResult = conv('Not A Number');
	} else 
		sResult = conv('Not A Number');
	
	return sResult;
}


function floatAdd(firstFloat, secondFloat) {
	
	let resultFloat = new Float(conv('0'));
	
	let decDegree1 = parseInt(firstFloat.degree, 2);
	let decDegree2 = parseInt(secondFloat.degree, 2);
	if (decDegree1 != 0 && decDegree2 != 0)  // т.е. Нормализованные числа
	{
		if (decDegree1 >= decDegree2) {
			resultFloat.degree = firstFloat.degree;
			secondFloat.mantissa = ('0'.repeat(decDegree1 - decDegree2) + secondFloat.mantissa).substring(0, 24); 
		} else {
			resultFloat.degree = secondFloat.degree;
			firstFloat.mantissa = ('0'.repeat(decDegree2 - decDegree1) + firstFloat.mantissa).substring(0, 24);
		}
	}
	else if (decDegree1 != 0 || decDegree2 != 0) {   // т.е. одно из чисел Денормализованное
		if (decDegree1 == 0) {
			resultFloat.degree = secondFloat.degree;
			firstFloat.mantissa = ('0'.repeat(decDegree2 - 1) + firstFloat.mantissa).substring(0, 24);
		} else {
			resultFloat.degree = firstFloat.degree;
			secondFloat.mantissa = ('0'.repeat(decDegree1 - 1) + secondFloat.mantissa).substring(0, 24);
		}
	}
	
	firstFloat.twosComplement();
	secondFloat.twosComplement();
	let resultMantissa = add(firstFloat.signBit + firstFloat.mantissa, secondFloat.signBit + secondFloat.mantissa);
	//resultMantissa = signBit + flagDegreeIncrease + ImaginaryDigit + mantissa(23)
	
	resultFloat.signBit = resultMantissa[0];
	resultMantissa = resultMantissa.substring(1); // удаление signBit
	
	let indexOfOne = resultMantissa.indexOf('1');
	if (indexOfOne != -1 && resultFloat.degree != '11111110') {
		let t = Math.max(0, parseInt(resultFloat.degree, 2) - indexOfOne + 1);
		resultFloat.degree = '0'.repeat(8 - t.toString(2).length) + t.toString(2);
		if (t == 0) {
			resultMantissa = resultMantissa.substring(1);  // удаление flagDegreeIncrease
			if (resultMantissa[0] == 1) {
				resultFloat.degree = resultFloat.degree.substring(0,7) + '1'; // ImageDigit стал единицей => число стало нормализованным
				resultFloat.mantissa = resultMantissa.substring(1, 24);
			} else {
				let degree = parseInt(resultFloat.degree, 2);
				let positionFirstDigit = degree + 1; 
				// удаление первых degree нулей (число денормализованное)
				resultFloat.mantissa = (resultMantissa.substring(positionFirstDigit) + '0'.repeat(positionFirstDigit)).substring(0, 23);
			}
		} else {
			let s = resultMantissa.substring(indexOfOne + 1) + '0'.repeat(indexOfOne);
			resultFloat.mantissa = s.substring(0, 23);
		}
	} else if (resultFloat.degree == '11111110') {
		if (resultMantissa[0] == 1) {
			resultFloat.degree = '11111111';
			resultFloat.mantissa = '0'.repeat(23);
		} else
			resultFloat.mantissa = resultMantissa.substring(2, 25);
	} else 
		return conv('0');

	return resultFloat.toString();
}


function Float(input) {
	let arrayInput = conv(input).split(' ');
	this.signBit = arrayInput[0];
	this.degree = arrayInput[1];
	
	let imaginaryDigit;
	if (Number.parseInt(this.degree, 2) == 0 || Number.parseInt(this.degree, 2) == 255)
		imaginaryDigit = 0;
	else
		imaginaryDigit = 1;
	this.mantissa = imaginaryDigit.toString() + arrayInput[2];
}

//Использование дополнительного кода для использования только операции сложения
Float.prototype.twosComplement = function () {
	if (parseInt(this.mantissa, 2) == 0)
		this.signBit = '0';
	if (this.signBit == '0')
		return;
	let intMantissa = Math.pow(2, this.mantissa.length) - parseInt(this.mantissa, 2);
	let sMantissa = intMantissa.toString(2);
	this.mantissa = '0'.repeat(this.mantissa.length - sMantissa.length) + sMantissa;
}


Float.prototype.toString = function () {
	return this.signBit + ' ' + this.degree + ' ' + this.mantissa;
}


function add(num1, num2) { //num.length = signBit + ImaginaryDigit + mantissa(23)
	let result = new Array(26);
	num1 = num1[0] + num1[0] + num1.substring(1);
	num2 = num2[0] + num2[0] + num2.substring(1);
	//num.length = signBit + flagDegreeIncrease + ImaginaryDigit + mantissa(23)
	for (let i = 0; i < result.length; i++)
		result[i] = 0;
	let temp;
	for (let i = 25; i > 0; i--) {
		temp = result[i] + parseInt(num1[i]) + parseInt(num2[i]);
		result[i] = temp % 2;
		result[i - 1] = parseInt(temp / 2);
	}
	result[0] = ( result[0] + parseInt(num1[0]) + parseInt(num2[0]) ) % 2;

	let sResult = result.join('');
	// Преобразование из дополнительного кода обратно в прямой (создаем временный объект tempFloat)
	let tempFloat = new Float(conv('0'));
	tempFloat.signBit = sResult[0];
	tempFloat.mantissa = sResult.substring(1);
	tempFloat.twosComplement();
	return tempFloat.signBit + tempFloat.mantissa;
}
