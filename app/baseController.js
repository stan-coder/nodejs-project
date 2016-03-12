'use strict';

module.exports = class BaseController {

	/**
	 * Constructor method
	 */
	constructor() {
		this.layout = 'layout';
	}

	/**
	 * Method engages with habdlebars templating
	 */
	templates(cb) {
		var handlebars = require('handlebars');
		var layouts = require('handlebars-layouts');
		var fs = require('fs');

		handlebars.registerHelper(layouts(handlebars));

		var readTemplate = (err, data) => {

			let info = Object.assign(this.data, {title: this.title});
			let html = handlebars.compile(data)(info);
			cb(html);
		}

		var readLayout = (err, data) => {
			handlebars.registerPartial('layout', data);
			fs.readFile(`${rootDir}/mvc/views/user/` +this.view+ '.hbs', 'utf8', readTemplate);
		}

		fs.readFile(`${rootDir}/mvc/views/layouts/` +this.layout+ '.hbs', 'utf8', readLayout);
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