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

	/**
	 * Parse post data
	 */
	takePost(cb) {
		var body = '';

    this.req.on('data', function (data) {
        body += data;
    });

    this.req.on('end',function(){
        cb(require('querystring').parse(body));
    });
	}

	/**
	 * Redirecto to url
	 */
	redirect(url) {
		this.res.writeHead(302, {"Location": url});
		this.res.end();
	}
}
