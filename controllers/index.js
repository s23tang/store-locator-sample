/* Requires */
var express = require('express'),
	router = express.Router();

router.use('/api/stores', require('./stores.js'));

router.get('/', function (req, res) {
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
	  	locations : null 
	});
});

module.exports = router;