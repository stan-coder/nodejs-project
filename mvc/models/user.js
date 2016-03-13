'use strict';

class BaseModel {
	constructor() {}

	/**
	 * Prepare variables for sql
	 */
	prepareVariables(params) {
		var list = '';
		var using = 'EXECUTE stmt1 USING ';
		var symbols = 'abcdefghij';
		var vars = [];
		var rand;
		var varName;

		// Do exception, if array length greater then 89
		params.forEach((varValue) => {

			while(1) {
				rand = Math.random().toString().substr(2, 2);
				varName = symbols[+rand[0]] + symbols[+rand[1]];

				if (vars.indexOf(varName) === -1) {
					vars.push(varName);
					break;
				}
			}
			let value = (typeof varValue === 'string' ? `'${varValue}'` : varValue);
			list += `SET @${varName} = ${value};\n`;
			using += `@${varName}, `;
		});

		using = using.slice(0, -2) + ';';
		return {list, using};
	}

	/**
	 * Main query handler
	 */ 
	query(sql, params, cb) {
		var mysql = require('mysql');
		var connection = mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : 'root',
			database : 'nodejs', 
			multipleStatements: true
		});

		connection.connect();
		var query;

		if (params.length > 0) {
			let prepared = this.prepareVariables(params);
			query = `PREPARE stmt1 FROM '${sql}'; ${prepared.list} ${prepared.using}`;			
		} else {
			query = sql;
		}

		/**
		 * Query to DB
		 */
		connection.query(query, function(err, rows, fields) {
			
			function connFinish() {
				if (errorHandler(err)) return;
				console.log(rows);
				cb({});
			}
			connection.end(connFinish);
		});
	}
}

module.exports = class UserModel extends BaseModel {
	constructor() {
		super();
	}

	/**
	 * Get list of user from DB
	 */
	getList(cb) {
		let sql = 'SELECT * FROM users WHERE email = ?';
		let params = ['markus@gmail.com'];
		this.query(sql, params, (data) => {
			cb({property: 20});
		});
	}
}