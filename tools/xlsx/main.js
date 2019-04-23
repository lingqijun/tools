/**
 * Created by Ling QiJun on 2019/4/23.
 */
/**
 * Created by Ling QiJun on 2019/4/19.
 */
const xlsx = require('node-xlsx');
const async = require("async");
const fs = require("fs");

let config = {};

let start = '(function (root) {\n\t';

let end = '})(Game);';

let fileContext = start;

fs.readdirSync(__dirname + '/config/').filter(function (file) {
	return (file.indexOf(".") !== 0) && (file.split('.')[1] === "xlsx");
}).forEach(function (file) {
	const path = __dirname + '/config/' + file;
	const sheets = xlsx.parse(fs.readFileSync(path)) || [];
	const name = file.split('.')[0];
	console.log('Name = ', name);
	if (sheets.length === 1) {
		let sheet = sheets[0].data;

		let data = {};

		let dateTypeArray = null;

		for (let i = 0; i < sheet.length; i++) {
			let lines = sheet[i];
			let info = {};
			for (let j = 0; j < lines.length; j++) {
				let context = lines[j];
				if (context === undefined || context === null || context[0] === '#') {
					break;
				}

				if (dateTypeArray === null) {
					break;
				}
				let contextTable = dateTypeArray[j];

				if (!contextTable) {
					break;
				}

				let key = contextTable.key;
				let type = contextTable.type;

				if (type === 'kn') {
					data[context] = info;
					info[key] = context;
				}

				if (type === 's') {
					info[key] = String(context);
				}

				if (type === 'n') {
					info[key] = Number(context);
				}

				if (type === 't') {
					let contextObj = eval("(" + context + ")");
					context = JSON.stringify(contextObj);
					info[key] = JSON.parse(context);
				}

			}

			if (i === 1) {
				dateTypeArray = [];
				for (let j = 0; j < lines.length; j++) {
					let context = lines[j];
					if (!context || context.indexOf("_") === 0) {
						break
					}
					let contextTable = context.split('_');
					let key = contextTable[0];
					let type = contextTable[1];

					dateTypeArray.push({key: key, type: type});
				}
			}
		}
		config[name] = data;

		fileContext += 'root.' + name + ' = ' + JSON.stringify(data, null, 5) + ';\n\t';

	}
	else if (sheets.length > 1) {

	}


});

fileContext += end;

fs.writeFile('./models/config.js', fileContext, function (err) {
	console.log('err = ', err);
});
