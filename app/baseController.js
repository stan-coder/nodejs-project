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
	templates(cb, helpers) {
		var hbs = require('handlebars');
		var layouts = require('handlebars-layouts');
		var fs = require('fs');

		hbs.registerHelper(layouts(hbs));

		/**
		 * Registering helpers
		 */
		if (helpers.constructor === Object && Object.keys(helpers).length > 0) {
			for (let helperName in helpers) {
				hbs.registerHelper(helperName, helpers[helperName].bind({hbs}));
			}
		}

		var readTemplate = (err, data) => {
			let info = Object.assign(this.data, {title: this.title});
			let html = hbs.compile(data)(info);
			cb(html);
		}

		var readLayout = (err, data) => {
			hbs.registerPartial('layout', data);
			fs.readFile(`${rootDir}/mvc/views/user/` +this.view+ '.hbs', 'utf8', readTemplate);
		}

		fs.readFile(`${rootDir}/mvc/views/layouts/` +this.layout+ '.hbs', 'utf8', readLayout);
	}

	/**
	 * Render result of html in browser
	 */
	render(helpers) {
		function tmHandler(html) {
			this.res.writeHead(200, {"Content-Type": "text/html"});
			this.res.end(html);
		}
		this.templates(tmHandler.bind(this), helpers);
	}

	/**
	 * Show 404 page
	 */
	 page404() {
		 let router = require(`${rootDir}/app/router`);
		 (new router).page404.call(this);
	 }
}
