'use strict';

class User extends require(`${rootDir}/app/baseController`) {

	constructor() {
		super();
	}

	/**
	 * Listing users
	 */
	list() {
		var activePage = (this.urlMatch === undefined ? 1 : +this.urlMatch[1]);
		if (activePage < 1) {
			this.page404();
			return;
		}
		var fromRecord = (activePage - 1) * 2;

		var UserModel = new require('../models/user');
		var model = new UserModel();

		/**
		 * Retrieve users
		 */
		model.getList(fromRecord, (data, usersCount) => {
			this.title = 'List of users';
			this.data = {users: data};

			let response = () => {
				/**
				 * Registration helper "pretty format date"
				 */
				let helper = {prettyDate: function (date) {
					let d = new Date(date);
					let result = d.getDate() + '.' + (+d.getUTCMonth() + 1) + '.' + d.getFullYear();
					return new this.hbs.SafeString(result);
				}};
				this.render(helper);
			}
			usersCount > settings.usersOnPage ? this.pagination(data, activePage, usersCount, response) : response;
		});
	}

	/**
	 * Pagination preparation
	 */
	pagination(data, activePage, usersCount, cb) {
		var pagination = '';
		var pageCount = Math.ceil(+usersCount / +settings.usersOnPage);

		/**
		 * Invalid page number
		 */
		if (activePage > pageCount || data.length === 0) {
			this.page404();
			return;
		}

		for (let a = 1; a <= pageCount; a++) {
			pagination += `<li`+ (activePage === a ? ' class="active"' : '') +`><a href="/users/page/${a}">${a}</a></li>\n`;
		}
		this.data.pagination = pagination;
		cb();
	}
}

module.exports = User;
