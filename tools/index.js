/**
 * Created by Ling QiJun on 2019/4/19.
 */
const xlsx = require('node-xlsx');
const async = require("async");
const fs = require("fs");

// fs.readFile('./xlsx/c_item.xlsx', function (err, data) {
// 	let table = [];
// 	if (err) {
// 		console.log(err.stack);
// 		return;
// 	}
//
// 	ConvertToTable(data, function (table) {
// 		console.log(table);
// 	})
// });
// console.log("程序执行完毕");
// //
// function ConvertToTable(data, callBack) {
// 	data = data.toString();
// 	let table = [];
// 	let rows = [];
// 	rows = data.split("\r\n");
// 	for (let i = 0; i < rows.length; i++) {
// 		table.push(rows[i].split(","));
// 	}
// 	callBack(table);
// }

// Parse a buffer
// const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`${__dirname}/xlsx/c_item.xlsx`));
//
// fs.readdirSync(__dirname).filter(function(file) {
// 	return (file.indexOf(".") !== 0) && (file !== "index.js");
// }).forEach(function(file) {

// });


fs.readdirSync(__dirname + '/xlsx/').filter(function(file) {
	return (file.indexOf(".") !== 0) && (file.split('.')[1] === "xlsx");
}).forEach(function(file) {
	const path = __dirname + '/xlsx/'+file;
	const sheets = xlsx.parse(fs.readFileSync(path))[0];
	const name = file.split('.')[0];
	console.log('Name = ',name );
});
console.log('-->');