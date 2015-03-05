var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var path = require('path');
var Promise = require('bluebird');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

// var db = Bookshelf.initialize({
//   client: 'sqlite3',
//   connection: {
//     host: '127.0.0.1',
//     user: 'your_database_user',
//     password: 'password',
//     database: 'shortlydb',
//     charset: 'utf8',
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   }
// });
mongoose.connect('mongodb://localhost:27017/shortlydb');

exports.urlSchema = new Schema({
  id: Schema.Types.ObjectId,
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number
  // timestamps:
});

exports.userSchema = new Schema({
  id: Schema.Types.ObjectId,
  username: String,
  password: String
  //timestamps:
});

exports.userSchema.pre('save', function(next){
  this.hashPassword();
  next();
});

exports.userSchema.methods.comparePassword = function(attemptedPassword, callback){
  return bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
          callback(isMatch);
        });
};

exports.userSchema.methods.hashPassword = function(){
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.password, null, null).bind(this)
      .then(function(hash) {
        this.password = hash);
      });
  };

exports.urlSchema.pre('save', function(next){
    var shasum = crypto.createHash('sha1');
    shasum.update(this.url);
    this.code = shasum.digest('hex').slice(0, 5);
  });
});

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('base_url', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// module.exports = db;
