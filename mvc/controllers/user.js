'use strict';

module.exports = class User extends require(`${rootDir}/app/baseController`) {

	/**
	 * Constructor method
	 */
	constructor() {
		super();
	}

	/**
	 * Listing users
	 */
	list() {
		var UserModel = new require('../models/user');
		var model = new UserModel();
		
		model.getList((data) => {

			this.title = 'List of users';
			this.data = {users: data};

			/**
			 * Pagination preparation
			 */
			if (data.length > 0 && data[0].users_count > settings.usersOnPage) {
				let pg = this.preparePagination(data[0].users_count);
				this.data.pagination = pg;
			}

			/**
			 * Register pretty format date
			 */
			let helper = {prettyDate: function (date) {
				let d = new Date(date);
				let result = d.getDate() + '.' + (+d.getUTCMonth() + 1) + '.' + d.getFullYear();
				return new this.hbs.SafeString(result);
			}};
			this.render(helper);
		});
	}

	/**
	 * Prepare and get pagination like string
	 */
	preparePagination(rCount) {
		var pageCount = Math.ceil(+rCount / +settings.usersOnPage);
		var result = '';

		for (let a = 1; a <= pageCount; a++) {
			result += `<li><a href="/users/page/${a}">${a}</a></li>\n`;
		}
		return result;
	}
}