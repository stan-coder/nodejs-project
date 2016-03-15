'use strict';

class UserModel extends require(`${rootDir}/app/baseModel`) {
	constructor() {
		super();
	}

	/**
	 * Get list of user from DB
	 */
	getList(fromRecord, cb) {
		let sql = `SELECT id, email, name, surname, birthday FROM users LIMIT ?, 2`;
		let params = [fromRecord];

		this.query(sql, params, (data) => {

			// We need separete this query from main query due to possible case when there are some records in DB,
			// but if "limit condition" greater than existing records then the result will be empty
			let sql = 'SELECT COUNT(*) AS value FROM users';

			this.query(sql, [], (usersCount) => {
				cb(data, usersCount[0].value);
			});
		});
	}
}

module.exports = UserModel;
