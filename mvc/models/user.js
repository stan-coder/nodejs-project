'use strict';

module.exports = class UserModel extends require(`${rootDir}/app/baseModel`) {
	constructor() {
		super();
	}

	/**
	 * Get list of user from DB
	 */
	getList(cb) {
		let sql = `SELECT id, email, name, surname, birthday, (SELECT COUNT(*) FROM users) AS users_count FROM users limit 2`;
		let params = [];

		this.query(sql, params, (data) => {
			cb(data);
		});
	}
}