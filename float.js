const { conv } = require('./conv.js');
const { calc } = require('./calc.js');
let fs = require('fs');


let arg = process.argv;
let result;

fs.readFile(arg[3], (err, data) => {
	if (err) {
		console.error(err);
		return;
	}
	
	data = data.toString();
	
	if (data[data.length - 1] == '\n')
		data = data.substring(0, data.length - 1);
	
	let result;
	switch (arg[2]) {
		case 'conv':
			result = conv(data.toString());
			break;
		case 'calc':
			result = calc(data.toString());
			break;
		default:
			throw new Error('Invalid command!');
	}
	
	fs.writeFile('output.txt', result, (err) => {
		if (err){
			console.err(err);
			return;
		}
		console.log('The file has been saved!');
	});
});
