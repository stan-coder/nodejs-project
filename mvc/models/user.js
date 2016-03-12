'use strict';

class baseModel {
	constructor() {}
}

module.exports = class UserModel {
	constructor() {}

	static getList(cb) {
		var mysql = require('mysql');
		var connection = mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : 'root',
			database : 'nodejs', 
			multipleStatements: true
		});

		connection.connect();
		// SELECT email, name FROM users
		let query = `
			PREPARE stmt1 FROM 'SELECT ? + ? AS sum_result';
			SET @a = 3;
			SET @b = 9;
			EXECUTE stmt1 USING @a, @b;`;
		connection.query(query, function(err, rows, fields) {
			console.log(err);
			console.log(rows);

			connection.end(() => {
				cb({property: 20});
			});
		});
	}
}