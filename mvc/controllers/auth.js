'use strict';

class AuthController extends require(`${rootDir}/app/baseController`) {
	
	constructor() {
		super();
	}

	/**
	 * Sign in render form
	 */
	signIn() {
		if (this.req.method === 'POST') {
			this.signInPost();
			return;
		}

		this.title = 'Authoriation';		
		this.render();
	}

	/**
	 * Sign in do authorization
	 */
	signInPost() {
		this.takePost(data => {

			
			console.log(this.model('session').get());

			//console.log(data);
			this.redirect('/sign_in');
		});
	}
}

module.exports = AuthController;