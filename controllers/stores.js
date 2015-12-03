/* Requires */
var express = require('express'),
	router = express.Router(),
	Store = require(__dirname + '/../models/store.js')

router.get('/', function(req, res) {
	Store.getAll()
		.then( function(dataArr) {	// Once promise is fulfilled, pass necessary data to view
			res.json(dataArr);
		})
		.catch( function(err) {
			res.send(err);
		});
});

module.exports = router;