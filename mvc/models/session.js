'use strict';

class SessionModel {

  /**
  * Get connection
  */
  connect(cb) {
    let mongoClient = require('mongodb').MongoClient;
    let url = 'mongodb://localhost:27017/nodejs';

    mongoClient.connect(url, cb);
  }

  /**
   * Get value
   */
  get(field) {
    return '1111asdklaksdl';
    /*this.connect((err, db) => {

      db.collection('sessions').findOne({"sid": field}, (err, doc) => {
        console.log(doc.email);
        db.close();
      });
    });*/
  }

  /**
   * Set value
   */
  set(field, value) {
    this.connect((err, db) => {

      db.collection('sessions').findOne({"email": "bob@mail.com"}, (err, doc) => {
        console.log(doc.email);
        db.close();
      });
    });
  }

}

module.exports = SessionModel;
