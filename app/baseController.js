'use strict';

module.exports = class BaseController {

	/**
	 * Constructor method
	 */
	constructor() {
		this.layout = 'layout';
		this.title = 'Title not specified'
		this.data = {};
		this.controllerName = this.constructor.name.slice(0, -10).toLowerCase();
	}

	/**
	 * Get model instance
	 */
	model(name) {
		var model = require(`${rootDir}/mvc/models/` + (name || this.controllerName));
		return new model();
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
		if (helpers !== undefined && helpers.constructor === Object && Object.keys(helpers).length > 0) {
			for (let helperName in helpers) {
				hbs.registerHelper(helperName, helpers[helperName].bind({hbs}));
			}
		}

		var template = `${rootDir}/mvc/views/${this.controllerName}/${this.view}.hbs`;

		var readTemplate = (err, data) => {
			if (panic(err)) return;

			let info = Object.assign(this.data, {title: this.title});
			let html = hbs.compile(data)(info);
			cb(html);
		}

		var readLayout = () => {
			var layout = `${rootDir}/mvc/views/layouts/${this.layout}.hbs`;

			fs.readFile(layout, 'utf8', (err, data) => {
				if (panic(err)) return;
				
				hbs.registerPartial('layout', data);
				fs.readFile(template, 'utf8', readTemplate);
			});
		};

		this.layout ? readLayout() : fs.readFile(template, 'utf8', readTemplate);
	}

	/**
	 * Render result of html in browser
	 */
	render(helpers) {
		var next = () => {
			this.templates((html) => {
				this.res.writeHead(200, {'Content-Type': 'text/html'});
				this.res.end(html);
			}, helpers);
		};

		(this.checkFlash === true) ? this.getFlash((mes) => {this.data.flashMessage = mes; next();}) : next();
	}

	/**
	 * Show 404 page
	 */
	page404() {
		let router = require(`${rootDir}/app/router`);
		(new router).page404.call(this);
	}

	/**
	 * Redirecto to url
	 */
	redirect(url) {
		this.res.writeHead(302, {'Location': url});
		this.res.end();
	}

	/**
	 * Set Flash message
	 */
	setFlash(message, cb) {
		var session = require('./sessions');
		(new session(this.req, this.res)).set({flashMessage: message}, cb || () => {});
	}

	/**
	 * Check Flash message
	 */
	getFlash(cb) {
		var session = require('./sessions');
		(new session(this.req, this.res)).getAndUnset('flashMessage', cb);
	}
}
