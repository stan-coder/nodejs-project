'use strict';

class AuthController extends require('../../app/baseController') {
	
	constructor() {
		super();
	}

	/**
	 * Sign in render form
	 */
	signIn() {
		//this.model('session').setCookie(this.req, this.res);
		var csrfToken = require('../models/tools').getRandomString();

		var cb = () => {
			if (this.req.method === 'POST') {
				this.signInPost();
				return;
			}

			this.title = 'Authorization';
			this.data.csrfToken = csrfToken;
			this.render();
		};

		var session = require('../../app/sessions');
		(new session(this.req, this.res)).set('csrfToken', csrfToken, cb);
	
	}

	/**
	 * Sign in do authorization
	 */
	signInPost() {
		this.takePost(data => {

			
			//console.log(this.model('session').set({sid: "fiwri2i42"}));

			//console.log(data);
			this.redirect('/sign_in');
		});
	}
}

module.exports = AuthController;