'use strict';

class ToolsModel {

  /**
   * Get ip address
   */
  getIp() {
    return ('x-forwarded-for' in this.req.headers && this.req.headers['x-forwarded-for'] ?
      this.req.headers['x-forwarded-for'] :
      this.req.connection.remoteAddress
    )
  }
}

module.exports = ToolsModel;
