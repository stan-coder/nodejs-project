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
			this.checkFlash = true;
			this.render();
		};

		var session = require('../../app/sessions');
		(new session(this.req, this.res)).set({csrfToken}, cb);
	}

	/**
	 * Sign in do authorization
	 */
	signInPost(data) {
		this.validate({
			email: {length: 30, pattern: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/},
			password: {length: 100},
			csrfToken: {pattern: /^[a-z\+\=\d]{50}$/i},
			rememberMe: {checkbox: true}
		}, data);
	}

	/**
	 * Validate post parameters
	 */
	validate(params, data) {
		for (let key in params) {

			if (!data.hasOwnProperty(key)) {
				this.setFlash(`The key ${key} is required`);
			}
			this.redirect('/sign_in');
		}
	}
}

module.exports = AuthController;