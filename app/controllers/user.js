'use strict';

class BaseController {

	/**
	 * Method engages with habdlebars templating
	 */
	templates(cb) {
		var handlebars = require('handlebars');
		var layouts = require('handlebars-layouts');
		var fs = require('fs');

		handlebars.registerHelper(layouts(handlebars));

		function readTemplate(err, data) {
			var template = handlebars.compile(data);
			var html = template({
				title: 'Layout Test',
					items: [
						'apple',
						'orange',
						'banana'
					]
			});
			cb(html);
		}

		function readLayout(err, data) {
			handlebars.registerPartial('layout', data);
			fs.readFile(rootDir + '/app/views/user/list.hbs', 'utf8', readTemplate);
		}

		fs.readFile(rootDir + '/app/views/layouts/layout.hbs', 'utf8', readLayout);
	}

	/**
	 * Render result of html in browser
	 */
	render() {
		this.templates((function(html) {
			this.res.writeHead(200, {"Content-Type": "text/html"});
			this.res.end(html);
		}).bind(this));
	}
}

module.exports = class User extends BaseController {
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
			this.property = data.property;
			this.render();
		});
	}
}