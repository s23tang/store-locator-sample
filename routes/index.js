/* Requires */
var Promise = require('bluebird'),	// Promises module (make MongoDB methods async)
	mongo = Promise.promisifyAll(require('mongodb')).MongoClient; // Async MongoDB methods
/*
 * 	@desc	Setup routes, catch all routes and redirect to '/'
 *  @param  {Object} app - the express application
 *  @return undefined
 */
module.exports = function (app) {
	app.get('/', index);			// Index page route, render index page on '/' path

    app.get('*', function(req,res) {
    	res.redirect('/');			// All paths redirect to index page
    });
};

/*
 *	@desc 	Connects with MongoDB on localhost for database 'tsdb',
 *			and finds all data in collection 'locationData', uses
 *			promise to allow handling of retrieved data (in array form)
 *	@param	undefined
 *	@return	{Object} Promise - a Promise of the found data array
 */
var getAllLocations = function () {
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

/*
 *	@desc 	Finds the required MongoDB data by calling 'getAllLocations',
 *			and renders the index page html with that data
 *	@param	{Object} req - HTTP request object
 			{Object} res - HTTP response object
 *	@return	undefined
 */
var index = function (req, res) {

	// Calling 'getAllLocations' to get the data from the database
	getAllLocations()
		.then( function(dataArr) {	// Once promise is fulfilled, pass necessary data to view
			res.render('index', {
									// View Title
									title : 'Store Locations',

									/*
									 *	Array containing displayed labels:
									 *		index(0) - the visible labels
									 *		index(1) - the hidden labels
									 *
									 *	Hidden labels shown when user request more information
									 */
								  	shownInfo : 
							  			[ 
							  				['Store ID', 'City', 'Country', 'Total Visitors', 'Visit Duration'],
							  				['Start of Day', 'TZ', 'TZ Index', 'RSS Campaign', 'Campaign Duration', 'RSS Walkby', 'RSS Range']
							  			],

							  		// Store locations with data, retrieved from database
								  	locations : dataArr 
								});
		})
		.catch( function(err) {	// Error handling, none currently
			throw err;
		});
};