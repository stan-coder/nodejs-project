'use strict';

class Router {

	/**
	 * Start router class
	 */
	constructor(req, res) {
		this.req = req;
		this.res = res;
		this.cotrollersPath = `${rootDir}/mvc/controllers/`;
		this.routeListPath = `${rootDir}/config/route.json`;
	}

	/**
	 * Prevent to answer on favicon.ico queries
	 */
	isFavicon() {
		if (this.url === 'favicon.ico') {
			this.res.writeHead(200, {"Content-Type": "image/x-icon"});
			this.res.end();
			return true;
		}
	}

	/**
	 * Show "Page not found"
	 */
	showPage404() {
		this.res.writeHead(200, {"Content-Type": "text/plain"});
		this.res.end("Page not found");
	}

	/**
	 * Response css, js files
	 */
	isExternalFile() {
		
		if (this.url.indexOf('/src/') === 0) {
			let extension = this.url.substr(this.url.lastIndexOf('.') + 1, this.url.length);
			
			if (['css', 'js'].indexOf(extension) > -1) {

				let fileName = this.url.substr(this.url.lastIndexOf('/') + 1);
				require('fs').readFile(`${rootDir}/src/${fileName}`, 'utf8', (err, data) => {
					if (err) {
						this.showPage404();
						return;
					}

					let type = {css: "css", js: "javascript"};
					this.res.writeHead(200, {'Content-Type': 'text/' + type[extension]});
					this.res.end(data);
				});
				return true;
			}
		}
	}

	/**
	 * Initilize router module
	 */
	init() {
		this.url = require('url').parse(this.req.url).path;

		if (this.isFavicon() || this.isExternalFile()) {
			return;
		}

		let loadlist = (err, data) => {
			if (errorHandler(err)) return;

			let list = JSON.parse(data);

			if (typeof list[this.url] === "undefined") {
				this.showPage404(this.res);
				return;
			}

			/**
			 * Init controller and run action
			 */
			let controller = require(this.cotrollersPath + list[this.url][0]);
			let instance = new controller();

			let action = list[this.url][1];
			instance.view = action;
			instance.res = this.res;
			instance[action]();
		}

		require('fs').readFile(this.routeListPath, 'utf8', loadlist);
	}
}

module.exports = Router;