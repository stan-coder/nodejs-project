'use strict';

class AuthController extends require('../../app/baseController') {
	
	constructor() {
		super();
	}

	/**
	 * Sign in render form
	 */
	signIn() {
		var csrfToken = require('../models/tools').getRandomString();

		var cb = () => {
			this.title = 'Authorization';
			this.data.csrfToken = csrfToken;
			this.render();
		};

		var session = require('../../app/sessions');
		(new session(this.req, this.res)).set({csrfToken}, cb);	
	}

	/**
	 * Sign in do authorization
	 */
	signInPost() {
		this.takePost(data => {
			//this.redirect('/sign_in');
			console.log(data);
		});
	}
}

module.exports = AuthController;