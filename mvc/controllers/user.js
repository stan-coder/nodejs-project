'use strict';

class UserController extends require(`${rootDir}/app/baseController`) {

	constructor() {
		super();
	}

	/**
	 * Listing users
	 */
	list() {

		let ip = this.model('tools').getIp.call(this);

		var activePage = (this.urlMatch === undefined ? 1 : +this.urlMatch[1]);
		if (activePage < 1) {
			this.page404();
			return;
		}
		var fromRecord = (activePage - 1) * 2;

		/**
		 * Retrieve users
		 */
		this.model().getList(fromRecord, (data, usersCount) => {

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
		var pageCount = Math.ceil(+usersCount / +settings.usersOnPage);

		/**
		 * Invalid page number
		 */
		if (activePage > pageCount || data.length === 0) {
			this.page404();
			return;
		}
		this.data.pagination = this.makeNumberPages(pageCount, activePage);

		var disable = ' class="disabled"';
		this.data.prev = {class: (activePage === 1 ? disable : ''), page: (activePage === 1 ? '' : ' href="/users/page/' + (activePage - 1) + '"' )};
		this.data.next = {class: (activePage === pageCount ? disable : ''), page: (activePage === pageCount ? '' : ' href="/users/page/' + (activePage + 1) + '"' )};
		cb();
	}

	/**
	 * Making proper numeber of pages
	 */
	makeNumberPages(pageCount, activePage) {
		var pagination = '';

		var left = (
			activePage > 3 ?
			[1, null, (activePage - 1), activePage] :
			activePage
		);

		var right = (
			activePage < (pageCount - 2) ?
			[(activePage + 1), null, pageCount] :
			pageCount - activePage
		);

		var pages = (
			Array.isArray(left) ? left : Array(left).fill(1).map((el, key) => {
		  	return ++key;
		}));

		pages = Array.prototype.concat.call([], pages,
			(Array.isArray(right)) ? right : Array(right).fill(1).map((el, key) => {
			  return pageCount - key;
			}).reverse()
		);

		pages.forEach(element => {
			let linkText = (element ? `<a href="/users/page/${element}">${element}</a>` : '<a>..</a>');
			pagination += `<li`+ (activePage === element ? ' class="active"' : (element ? '' : ' class="disabled"')) +`>${linkText}</li>\n`;
		});
		return pagination;
	}
}

module.exports = UserController;
