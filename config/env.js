/* Requires */
var util = require(__dirname + '/../libs/util.js');

/*
 *  @desc   Express configuration setup
 *  @param  {Object} express - the exported express module
 *          {Object} app - the express application
 *  @return undefined
 */
module.exports = function (express, app) {

    // Common configuration
    app.configure(function () {

        // Configure ejs template engine and setup directory containing views
        app.set('views', __dirname + '/../views');
        app.set('view engine', 'ejs');

        // Make sure build folders exist
        util.mkdir(__dirname + '/../build');
        util.mkdir(__dirname + '/../build/css');

        // Configure LESS compiler
        app.use('/css', require('less-middleware')(__dirname + '/../src/less', {
            dest: __dirname + '/../build/css'
        }));

        // Create static file servers for the build and public folders
        app.use(express.static(__dirname + '/../build'));
        app.use(express.static(__dirname + '/../public'));

        // Use router to match requested path, this last to allow serving
        //  of static content (in build and public directories)
        app.use(app.router);
    });
};
