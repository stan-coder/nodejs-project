'use strict';

module.exports = class User extends require(`${rootDir}/app/baseController`) {

	/**
	 * Constructor method
	 */
	constructor() {
		super();
		this.res = arguments[0];
	}

	/**
	 * Listing users
	 */
	list() {
		var model = require('../models/user');
		model.getList((data) => {
			
			this.title = 'My best title';
			this.data = {items: ['apple11', 'orange', 'banana']};
			this.property = data.property;
			this.render();
		});
	}
}