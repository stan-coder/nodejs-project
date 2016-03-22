'use strict';

class ToolsModel {

	/**
	 * Return randomly generated string
	 */
	static getRandomString(size) {
		size = size || 50;
		var s = '';
		
		for (let a = 0; a < size; a++) {
			let r = Math.random().toString().substr(2, 2);
			r = (r > 94 ? r - 94 : r);
			s += String.fromCharCode(33 + +r); // from: 33, to: 127
		}

		return s;
	}

  /**
   * Get ip address
   */
  static getIp() {
    return ('x-forwarded-for' in this.req.headers && this.req.headers['x-forwarded-for'] ?
      this.req.headers['x-forwarded-for'] :
      this.req.connection.remoteAddress
    )
  }

  /**
   * Make sha256 hash
   */
  static sha256(value) {
  	return require('crypto').createHmac('sha256', value).update(settings.unipid).digest('hex').toUpperCase();
  }
}

module.exports = ToolsModel;