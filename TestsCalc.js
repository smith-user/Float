const { calc } = require('./calc.js');
const { conv } = require('./conv.js');
let fs = require('fs')


let report = [];
let countFailure = 0;

let val1;
let val2;
let result;


// ------------------------------------ TestCases: ------------------------------------

calcTest('17+22').toBe('0 10000100 00111000000000000000000');
calcTest('17+3').toBe('0 10000011 01000000000000000000000');
calcTest('3.1+16.07').toBe('0 10000011 00110010101110000101000');

calcTest('256-256').toBe(conv('0'));
calcTest('25-30').toBe(conv('-5'));
calcTest('-30+25').toBe(conv('-5'));
calcTest('100-3').toBe(conv('97'));

val1 = Math.pow(2, -130);
val2 = Math.pow(2, -135);
result = val1 + val2;
calcTest(val1.toString() + '+' + val2.toString()).toBe(conv(result.toString()));

val1 = Math.pow(2, -127);
result = val1 + val1;
calcTest(val1.toString() + '+' + val1.toString()).toBe(conv(result.toString()));

val1 = Math.pow(2, 127);
val2 = Math.pow(2, 127);
result = val1 + val2;
calcTest(val1.toString() + '+' + val2.toString()).toBe(conv(result.toString()));


// ------------------------------------------------------------------------------------

function calcTest(input) {
	return {
		toBe: exp => {
			let result;
			report.push(`${input} (conv):`);
			result = calc(input);
			if (result == exp) {
				report.push(`\tSuccess! '${result}'`);
			} else {
				report.push(`\tFailed! Value is   '${result}', \n\tbut expectation is '${exp}'.`);
				countFailure += 1;
			}
		}
	}
}

fs.writeFile('reportCalc.txt', report.join('\n'), (err) => {
		if (err){
			console.err(err);
			return;
		}
		console.log(`The tests are finished! Failed tests: ${countFailure}.`);
		console.log('Read more in reportCalc.txt');
	});
