const { conv } = require('./conv.js');
let fs = require('fs')


let report = [];
let countFailure = 0;

let val;


// ------------------------------------ TestCases: ------------------------------------

report.push('~'.repeat(16) + 'НОРМАЛИЗОВАННЫЕ ЧИСЛА' + '~'.repeat(16));

convTest('17').toBe('0 10000011 00010000000000000000000');
convTest('3').toBe('0 10000000 10000000000000000000000');
convTest('0').toBe('0 00000000 00000000000000000000000');
convTest('-0').toBe('1 00000000 00000000000000000000000');
convTest('1').toBe('0 01111111 00000000000000000000000');

report.push('Value: 1 + 2^(-24)');
val = 1 + Math.pow(2, -24);
convTest(val.toString()).toBe('0 01111111 00000000000000000000000');

convTest('0.2').toBe('0 01111100 10011001100110011001100');
convTest('-0.2').toBe('1 01111100 10011001100110011001100');
convTest('1024').toBe('0 10001001 00000000000000000000000');

report.push('MAX: [2 - 2^(-23)] * 2^(127)');
val = (2 - Math.pow(2, -23)) * Math.pow(2, 127);
convTest(val.toString()).toBe('0 11111110 11111111111111111111111');

report.push('MIN: 2^(-126)');
val = Math.pow(2, -126);
convTest(val.toString()).toBe('0 00000001 00000000000000000000000');



report.push('~'.repeat(15) + 'ДЕНОРМАЛИЗОВАННЫЕ ЧИСЛА' + '~'.repeat(15));

report.push('MAX: [1 - 2^(-23)] * 2^(-126)');
val = Math.pow(2, -126) * (1 - Math.pow(2, -23));
convTest(val.toString()).toBe('0 00000000 11111111111111111111111');

report.push('MIN: 2^(-149)');
val = Math.pow(2, -149);
convTest(val.toString()).toBe('0 00000000 00000000000000000000001');

report.push('Ziro: 2^(-150)');
val = Math.pow(2, -150);
convTest(val.toString()).toBe('0 00000000 00000000000000000000000');

report.push('Value: 2^(-127)');
val = Math.pow(2, -127);
convTest(val.toString()).toBe('0 00000000 10000000000000000000000');

report.push('Value: 2^(-131)');
val = Math.pow(2, -131);
convTest(val.toString()).toBe('0 00000000 00001000000000000000000');

report.push('Value: 2^(-127) + 2^(-131)');
val = Math.pow(2, -131) + Math.pow(2, -127);
convTest(val.toString()).toBe('0 00000000 10001000000000000000000');



report.push('~'.repeat(20) + 'БЕСКОНЕЧНОСТИ' + '~'.repeat(20));

report.push('+Infinity: 2^(128)');
val = Math.pow(2, 128);
convTest(val.toString()).toBe('0 11111111 00000000000000000000000');

report.push('-Infinity: -2^(128)');
val = -1 * Math.pow(2, 128);
convTest(val.toString()).toBe('1 11111111 00000000000000000000000');



report.push('~'.repeat(22) + 'НЕ ЧИСЛО' + '~'.repeat(23));
convTest('10 негритят').toBe('0 11111111 10000000000000000000000');

// ------------------------------------------------------------------------------------

/*
convTest(Number.MAX_SAFE_INTEGER.toString()).toBe('0 10110011 11111111111111111111111');
convTest(Number.MIN_SAFE_INTEGER.toString()).toBe('1 10110011 11111111111111111111111');
convTest(Number.MAX_VALUE.toString()).toBe('0 11111111 00000000000000000000000');
convTest(Number.MIN_VALUE.toString()).toBe('0 00000000 00000000000000000000000');
*/

function convTest(input) {
	return {
		toBe: exp => {
			let result;
			report.push(`${input} (conv):`);
			result = conv(input);
			//console.log(input);
			if (result == exp) {
				report.push(`\tSuccess! '${result}'`);
			} else {
				report.push(`\tFailed! Value is   '${result}', \n\tbut expectation is '${exp}'.`);
				countFailure += 1;
			}
		}
	}
}


fs.writeFile('reportConv.txt', report.join('\n'), (err) => {
		if (err){
			console.err(err);
			return;
		}
		console.log(`The tests are finished! Failed tests: ${countFailure}.`);
		console.log('Read more in reportConv.txt');
	});
