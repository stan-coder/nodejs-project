'use strict';

class Sessions {

  /**
  * Get connection
  */
  connect(cb) {
    this.mongoClient.connect(settings.mongoConnect, (err, db) => {
      if (panic(err)) return;
      
      cb(db);
    });
  }

  /**
   * Make mongo-query more neat
   */
  mongoQuery(method, parameters, cb) {
    this.connect(db => {
      db.collection('sessions')[method](parameters, (err, result) => {
        db.close();

        if (panic(err)) return;
        cb(result);
      });
    });
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
    this.tools = require('../mvc/models/tools');
  }

  /**
   * Create cookie and write "sid" into mongoDB
   */
  init(cb) {
    var rs;
    var sh;
    var sid;

    /**
     * Create cookie and write sid into mongoDB
     */
    var create = () => {
      this.cookies.set('sh', sh, {httpOnly: false});

      this.mongoQuery('insertOne', {sid}, result => {
        if (result.insertedCount !== 1 || result.result.ok !== 1) {
          panic({message: 'Sid was not inserted into mongoDB'});
          return;
        }
        
        // Initialization has performed
        this.sid = sid;
        cb();
      });
    };

    /**
     * Check (recursively) if sid in mongoDB already exists
     */
    var cnt = 1;
    var checker = () => {
      rs = this.tools.getRandomString();
      sid = this.getSidBySh(sh = this.tools.sha256(rs));
      
      this.mongoQuery('findOne', {sid}, result => {
        if (result === null) {
          create();
          return;
        }
        checker();
      });
    };

    checker();
  }

  /**
   * Set value
   */
  set(data, cb) {
    var sh = this.cookies.get('sh');
    var doSet = () => {

      // Save data in mongoDB
      this.connect((db) => {
        db.collection('sessions').update({sid: this.sid}, {$set: data}, (err, result) => {
          db.close();

          if (panic(err)) return;
          if (result.result.ok !== 1) {
            panic({sessionSet: 'Value ' + JSON.stringify(data) + ' can\'t be saved'});
            return;
          }
          cb();
        });
      });
    };

    var checkSidBySh = () => {
      var sid = this.getSidBySh(sh);
      
      this.mongoQuery('findOne', {sid}, result => {
        if (result === null) {
          // Do something if "sh" cookie is not correct
        }
        this.sid = result.sid;
        doSet();
      });
    };

    sh === undefined ? this.init(doSet) : checkSidBySh();
  }

  /**
   * Get sid by passed sh
   */
  getSidBySh(sh) {
    return this.tools.sha256(sh + this.tools.getIp.call(this) + this.req.headers['user-agent']);
  }

  /**
   * Get value
   */
  get(field, cb) {
    var sh = this.cookies.get('sh');
    if (sh === undefined) {
      cb();
      return;
    }

    var sid = this.getSidBySh(sh);
    this.mongoQuery('findOne', {sid}, result => {
      if (result === null) {
        cb();
        return;
      }
      cb(result);
    });
  }

  /**
   * Remove existing field
   */
  getAndUnset(unsetField, cb) {

    var sh = this.cookies.get('sh');
    if (sh === undefined) {
      cb();
      return;
    }

    this.connect((db) => {
      db.collection('sessions').findAndModify(
        
        {sid: this.getSidBySh(sh)},
        [],
        {$unset: Object.defineProperty({}, unsetField, {value: '', enumerable: true})},

        (err, doc) => {
          db.close();
          if (panic(err)) return;

          var result = (
            doc !== undefined && 
            doc.constructor === Object && 
            doc.ok === 1 &&
            doc.value.hasOwnProperty(unsetField) ? doc.value[unsetField] : null
          );
          cb(result);
        }

      );
    });
  
  }

}


module.exports = Sessions;