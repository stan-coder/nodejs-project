'use strict';

class Sessions {

  /**
  * Get connection
  */
  connect(cb) {
    this.mongoClient.connect(this.url, cb);
  }

  /**
   * Constructor method
   */
  constructor(req, res) {
    this.req = req;
    this.res = res;

    var Cookies = require('cookies');
    this.cookies = new Cookies(this.req, this.res);

    this.mongoClient = require('mongodb').MongoClient;
    this.url = 'mongodb://localhost:27017/nodejs';
  }

  initSession(cb) {
    var rs = require('../mvc/models/tools').getRandomString();
    var sid;

    var create = () => {      
      // create cookie
      this.cookies.set('sid', sid, {httpOnly: false});

      // create document in mongoDB
      this.connect((err, db) => {
        db.collection('sessions').insertOne({sid}, (err, result) => {
          console.log(result);
          db.close();
          cb();
        });
      });
    };

    // check already exists
    var checker = () => {
      sid = require('crypto').createHmac('sha256', rs).update(settings.unipid).digest('hex').toUpperCase();

      this.connect((err, db) => {
        db.collection('sessions').findOne({sid}, (err, result) => {
          db.close();

          if (result === null) {
            create();
            return;
          }
          checker();
        });
      });
    };

    checker();
  }

  /**
   * Set value
   */
  set(field, value, cb) {
    if (this.cookies.get('sid') === undefined) {
      this.initSession(cb);
    }    
  }

  /**
   * Get value
   */
  get(field) {}

  exists() {}

}

module.exports = Sessions;