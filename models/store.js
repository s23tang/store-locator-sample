/* Requires */
var Promise = require('bluebird'),	// Promises module (make MongoDB methods async)
	mongo = Promise.promisifyAll(require('mongodb')).MongoClient; // Async MongoDB methods

/*
 *	@desc 	Connects with MongoDB on localhost for database 'tsdb',
 *			and finds all data in collection 'locationData', uses
 *			promise to allow handling of retrieved data (in array form)
 *	@param	undefined
 *	@return	{Object} Promise - a Promise of the found data array
 */
exports.getAll = function () {
	return new Promise( function(resolve) {
		mongo.connectAsync('mongodb://localhost:27017/tsdb')
			.then( function(db) {	// Once connected, find and return all data in cursor form
				return db.collection('locationData').findAsync({});
			})
			.then( function(cursor) {	// Once data found, convert cursor to array form
				return cursor.toArrayAsync();
			})
			.then( function(dataArr) {	// Once converted, promise can be fulfilled
				resolve(dataArr);
			})
			.catch( function(err) {	// In case of error, simply throw (no handling ;> )
				throw err;
			});
	});
};