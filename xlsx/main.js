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
	const fileName = file.split('.')[0];

	if (!sheets.length){
		console.log('xlsx file context is null');
		return ;
	}

	console.log('fileName = ', fileName);

	for (let sheet of sheets){
		let sheetData = sheet.data;

		if (!sheetData.length){
			console.log(sheet.name +' context is null');
			return ;
		}

		let classInfo = sheetData[0];

		let data = null;
		let name = null;
		let className = null;
		let jsonName = null;

		let classType = null;
		for (let i = 0; i < classInfo.length; i++) {
			let context = classInfo[i];
			if (!context || context.indexOf("=") === 0) {
				break
			}
			let contextTable = context.split('=');
			let field = contextTable[0];
			let value = contextTable[1];

			if (field === 'class'){
				classType = value;
			}

			if (field === 'name'){
				name = value;
			}

			if (field === 'className'){
				className = value;
			}

			if (field === 'jsonName'){
				jsonName = value;
			}
		}

		if (classType === 'array' || classType === 'Array' ){
			data = [];
		}
		else if (classType === 'object' || classType === 'Object' ){
			data = {};
		}

		if (!data){
			return console.log('class type is null');
		}

		name = name || fileName;
		className = className || name;
		jsonName = jsonName || name;

		let index = 0;
		let dateTypeArray = null;
		for (let i = 0; i < sheetData.length; i++) {
			let lines = sheetData[i];
			let info = null;

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

				if (!info){
					info = info || {};
					if (classType === 'array' || classType === 'Array') {
						info['index'] = index;
						data.push(info);
						index++;
					}
				}

				if (type === 'ks' || type === 'k'){
					data[context] = info;
					info[key] = String(context);
				}
				else if (type === 'kn') {
					data[context] = info;
					info[key] = Number(context);
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

				if (type === 'a'){

				}

			}



			if (i === 2) {
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

		config[className] = data;

		let jsonString = JSON.stringify(data, null, 4);

		fileContext += 'root.' + className + ' = ' + jsonString + ';\n\t';

		fs.writeFile('./models/' + jsonName + '.json', jsonString, function (err) {
			console.log('err = ', err);
		});
	}

});

fileContext += end;

fs.writeFile('./models/config.js', fileContext, function (err) {
	console.log('err = ', err);
});


