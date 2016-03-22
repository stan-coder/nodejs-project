'use strict';

module.exports = class {
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

		// Extremely uncommon case
		if (params.length > 89) {
			throw new Error('The length of parameters must be less then 90');
		}

		params.forEach(varValue => {

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
			host     : settings.host,
			user     : settings.user,
			password : settings.password,
			database : settings.database,
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
		connection.query(query, function(err, result, fields) {
			
			function connFinish() {
				if (panic(err)) return;
				let out = (params.length > 0 ? result[result.length - 1] : result);
				cb(out);
			}
			connection.end(connFinish);
		});
	}
}