const { calc } = require('./calc.js');
const { conv } = require('./conv.js');
let fs = require('fs')


let report = [];
let countFailure = 0;

let val1;
let val2;
let result;


// ------------------------------------ TestCases: ------------------------------------

calcTest(10, 0, '+');
calcTest(10, 0, '-');
calcTest(0, 0, '+');
calcTest(0, 0, '-');
calcTest(17, 22, '+');
calcTest(17, 3, '+');
calcTest(3.1, 16.07, '+');
calcTest(256, 256, '-');
calcTest(25, 30, '-');
calcTest(-30, 25, '+');
calcTest(100, 3, '-');
calcTest(8, 15, '-');
calcTest(4, 7.5, '-');

val1 = Math.pow(2, -5);
val2 = Math.pow(2, -7);
calcTest(val1, val2, '+');

val1 = Math.pow(2, -5);
val2 = Math.pow(2, -7);
calcTest(val1, val2, '-');

val1 = (2 - Math.pow(2, -23)) * Math.pow(2, 127);
val2 = (1 + Math.pow(2, -23) ) * Math.pow(2, 127);
calcTest(val1, val2, '+');

val1 = Math.pow(2, -126);
val2 = Math.pow(2, -131);
calcTest(val1, val2, '+');

val1 = Math.pow(2, -126);
val2 = Math.pow(2, -131);
calcTest(val1, val2, '-');

val1 = 1 
val2 = Math.pow(2, -24);
calcTest(val1, val2, '+');

val1 = Math.pow(2, -120) + Math.pow(2, -125);
val2 = Math.pow(2, -131) + Math.pow(2, -132);
calcTest(val1, val2, '+');

val1 = Math.pow(2, -149);
val2 = Math.pow(2, -131);
calcTest(val1, val2, '+');

val1 = Math.pow(2, -127);
calcTest(val1, val1, '+');

val1 = Math.pow(2, 127);
calcTest(val1, val1, '+');

val1 = Math.pow(2, 128);
calcTest(val1, val1, '+');

val1 = -Math.pow(2, 128);
calcTest(val1, val1, '+');

val1 = Math.pow(2, 128);
val2 = 1024;
calcTest(val1, val2, '+');

// ------------------------------------------------------------------------------------

function calcTest(num1, num2, op) {
	let exp;
	switch (op) {
		case '+':
			exp = num1 + num2;
			break;
		case '-':
			exp = num1 - num2;
			break;
	}
	let input = num1.toString() + op + num2.toString();
	report.push(`${input} calc:`);
	result = calc(input);
	exp = conv(exp.toString());
	if (result == exp) {
		report.push(`\tSuccess! '${result}'`);
	} else {
		report.push(`\tFailed! Value is   '${result}', \n\tbut expectation is '${exp}'.`);
		countFailure += 1;
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
