'use strict';

module.exports = class UserModel {
	constructor() {}

	static getList(cb) {
		/*var mysql = require('mysql');
		var connection = mysql.createConnection({
		  host     : 'localhost',
		  user     : 'root',
		  password : 'root',
		  database : 'nodejs'
		});

		connection.connect();
		connection.query('SELECT SLEEP(0)', function(err, rows, fields) {	 
		  console.log('The solution is: ', rows);

		  connection.end();
		  cb({property: 20});
		});*/
		cb({property: 20});
	}
}