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
		var next = () => {
			this.redirect('/sign_in');
		};

		this.validate({
			email: {minLength: 6, maxLength: 30, pattern: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/, required: true},
			password: {minLength: 5, required: true},
			passwordConfirm: {maxLength: 5, required: true},
			rememberMe: {checkbox: true, required: false},
		}, data, next);
	}

	/**
	 * Validate post parameters
	 */
	validate(fields, postData, next) {

		// Object to collect message to render inside flash message
		var flashMsg = {
			value: '', 
			set add(str) {
				this.value += (this.value.length > 0 ? `<br/><br/>${str}` : str);
			}
		};

		// Object that contrans arrays that contain pair of functions: validation and error message constructor
		var errors = {
			required: [
				(fieldName) => !postData.hasOwnProperty(fieldName) && fields[fieldName]['required'] === true,
				(fields) => 'The following fields are required: <br/>' + fields.map(field => `<i>${field}</i>`).join('<br/>')
			],
			maxLength: [
				(fieldName) => postData[fieldName].length > fields[fieldName].maxLength,
				(_fields) => {
					var out = 'The following fields have incorrect length of value: <br/>';
					_fields.forEach(field => {
						out += `<i>"${upperFirstSymbol(field)}" must be less then or equal ` + +fields[field].maxLength + '</i><br/>'
					});
					return out;
				}
			], 
			minLength: [
				(fieldName) => postData[fieldName].length < fields[fieldName].minLength,
				(_fields) => {
					var out = 'The following fields have incorrect length: <br/>';
					_fields.forEach(field => {
						out += `<i>"${upperFirstSymbol(field)}" must be greater or equal then ` + +fields[field].minLength + '</i><br/>'
					});
					return out;
				}
			], 
			pattern: [
				(fieldName) => !fields[fieldName].pattern.test( postData[fieldName] ),
				(fields) => 'The following fields are not correct: <br/>' + fields.map(field => `<i>${field}</i>`).join('<br/>')
			]
		};
		var errorMark = {};

		// Through fields that belongs validation
		for (let fieldName in fields) {
			let conditions = fields[fieldName]; // fieldName - email, password, rememberMe...
			validateField(fieldName, conditions, reverseSort(Object.keys(conditions)));
		}


		// Through errors to join their into single string
		var orderedErrors = getOrderedErrors();		

		for (let conditionName in orderedErrors) {
			flashMsg.add = errors[conditionName][1]( orderedErrors[conditionName] );
		}

		if (flashMsg.value.length > 0) {
			this.setFlash(flashMsg.value);
			this.redirect('/sign_in');
			return;
		}

		next();
		return;


		function getOrderedErrors() {
			var out = {};
			for (let fieldName in errorMark) {
				let conditionName = errorMark[fieldName];

				!out.hasOwnProperty(conditionName) ? out[conditionName] = [fieldName] : out[conditionName].push(fieldName);
			}
			return out;
		}

		function validateField(fieldName, conditions, sortedConditions) {
			sortedConditions.forEach(conditionName => {

				if (validateNecessity(fieldName, conditionName)) {
					errorMark[fieldName] = conditionName;
				}
			});
		}

		function validateNecessity(fieldName, conditionName) {
			return errors.hasOwnProperty(conditionName) && !errorMark.hasOwnProperty(fieldName) && errors[conditionName][0](fieldName);
		}

		function reverseSort(array) {
			return array.sort(function(a, b){
		      if (a > b) return -1;
		      if (a < b) return 1;
		      return 0;
		  });
		}

		function upperFirstSymbol(str) {
			return str[0].toUpperCase() + str.substr(1);
		}
	}
}

module.exports = AuthController;