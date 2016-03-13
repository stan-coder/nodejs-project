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

			this.title = 'My best title';
			this.data = {items: ['apple11', 'orange', 'banana']};
			this.property = data.property;
			this.render();
		});
	}
}