/* jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
 * http://benalman.com/
 * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL */
(function(a){var b=a({});a.subscribe=function(){b.on.apply(b,arguments)},a.unsubscribe=function(){b.off.apply(b,arguments)},a.publish=function(){b.trigger.apply(b,arguments)}})(jQuery)

/*
 *  @desc   Create the map object, rendered behind navigation overlay
 *  @param  undefined
 *  @return undefined
 */
var Map = (function () {
    /*
     *  {Object} map - the Google map object, that will be displayed
     *  {Object} heatMap - the Google Heatmap layer, to show heat map
     *  [Array] markerArray - array of Google Marker objects, to track all markers (for toggling)
     *  [Array] locations - array of JSON objects containg data of every store
     *  {Object} selectedMarker - for holding the currently selected location Marker object
     */
    var _map, 
        _heatmap, 
        _markerArray = [],
        _locations = [],
        _selectedMarker = null;

    /*
     *  @desc   Show or hides all markers on the map
     *  @param  Boolean onOff - 'true' for show all markers,
     *                          'false' for hide all markers
     *  @return undefined
     */
    var _showAllMarkers = function (onOrOff) {
        // Finds every marker, from marker array, and toggles visibility
        for ( var i = 0; i < _markerArray.length; i++ ) {
            _markerArray[i].setMap( onOrOff ? _map : null );
        }
    };

    /*
     *  @desc   Turn on standard map, and show all markers
     *  @param  undefined
     *  @return undefined
     */
    var _standardModeSwitch = function() {
        _heatmap.setMap(null);
        _showAllMarkers(true);
    };

    /*
     *  @desc   Turn on heat map, and hide all markers
     *  @param  undefined
     *  @return undefined
     */
    var _heatMapModeSwitch = function() {
        _heatmap.setMap(_map);
        _showAllMarkers(false);
    };

    // Available modes for the map (and the functions to execute on switch)
    var _modes = {
        standard : _standardModeSwitch,
        heatmap : _heatMapModeSwitch
    };

    // Update the navigation menu info with the data provided by info object
    var _updateNavInfo = function (event, info) {
        var $content = $('.content');

         // Update the displayed info with the selected store (matches each field)
        $content.find('.store-id').text(info.id);
        $content.find('.city').text(info.city);
        $content.find('.country').text(info.country);
        $content.find('.total-visitors').text(info.total_visitors);
        $content.find('.visit-duration').text(info.visit_duration_keep_fraction);
        $content.find('.start-of-day').text(info.start_of_day);
        $content.find('.tz').text(info.tz);
        $content.find('.tz-index').text(info.tz_index);
        $content.find('.rss-campaign').text(info.rss_campaign);
        $content.find('.campaign-duration').text(info.campaign_duration);
        $content.find('.rss-walkby').text(info.rss_walkby);
        $content.find('.rss-range').text(info.rss_range);
    };

    // Subscribe to /nav/info topic, update the navigation menu on data receive
    $.subscribe("/nav/info", _updateNavInfo);

    /*
     *  @desc   Renders the markers for the retrieved location data, and for heatmap
     *  @param  undefined
     *  @return undefined
     */
    var _processLocations = function() {
        var heatMapLocs = [];       // Array containing Google LatLng object for all locations,
                                    //  to be used to create the Heatmap layer

        /*
         *  Plot all stores on map using Markers, and push all location data
         *  (latitude, longitude) into heatmap array for later use
         */
        for ( var i = 0; i < _locations.length; i++ ) {

            // Create Google LatLng object from data of store
            var locationPosition = new google.maps.LatLng(_locations[i].latitude, _locations[i].longitude);

            // Push to heatmap array
            heatMapLocs.push(locationPosition);

            // Create marker using LatLng object
            var marker = new google.maps.Marker({
                position: locationPosition,
                map: _map
            });

            // Setup click function on marker: will update display with store information
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {

                    // Let the subscriber know of the data to update the view
                    $.publish('/nav/info', [_locations[i]]);

                    // Move map to center on the selected marker
                    _map.setCenter(marker.getPosition());

                    // Cancel selected animation on previous marker, if there was one
                    if ( _selectedMarker ) {
                        _selectedMarker.setAnimation(null);
                    } else {    // No previous marker, show the hidden 'return to marker' link
                        $('.return-container').fadeIn( function() {

                            // Fade out the help tooltip after 3 seconds
                            setTimeout( function() {
                                $('.tooltip').fadeOut();
                            }, 3000);
                         });
                    }

                    // Update currently selected marker, and animate bounce on marker
                    _selectedMarker = marker;
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }
            })(marker, i));

            // Push created marker into marker array
            _markerArray.push(marker);
        }

        // Setup the heatmap layer using the locations of every store,
        //  and with custom colors and radius (color display radius)
        _heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatMapLocs,
            gradient: [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)',
                'rgba(0, 0, 191, 1)',
                'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)',
                'rgba(63, 0, 91, 1)',
                'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)',
                'rgba(255, 0, 0, 1)'
            ],
            radius: 50,
            map: _map
        });

        // Hide heatmap layer by default
        _heatmap.setMap(null);
    };

    /*
     *  @desc   HTTP GET request (async) to server for store locations
     *  @param  undefined
     *  @return undefined
     */
    var _getAllStores = function() {
        var req = new XMLHttpRequest(); // Create new request Object
        req.onreadystatechange = function() {
            // On retrieval and success of data, begin processing
            if ( req.readyState == 4 && req.status == 200 ) {
                _locations = JSON.parse(req.responseText);
                _processLocations();
            }
        }
        req.open("GET", '/api/stores', true);
        req.send( null );
    };

    /*
     *  @desc   Initialization code for Google Map
     *  @param  undefined
     *  @return undefined
     */
    var init = function initialize() {
        // Create custom style, currently only styles the color of the water
        var customMapType = new google.maps.StyledMapType([
            {
                "featureType": "water",
                "stylers": [
                    { "color": "#72cbf4" }
                ]
            }
        ], {
            name : "Alt Style"
        });

        // Get the map DOM from HTML
        var mapCanvas = document.getElementById('map');

        // Setup map options
        var mapOptions = {
            mapTypeControl: false,  // Disable default Google map control buttons
            center: new google.maps.LatLng(43.53324544343535, -79.72113307714847),
                                    // Setup center near Toronto
            zoom: 10,               // Setup zoom level
            mapTypeId: 'alt_style'  // Using the custom map style 'Alt Style'
        };

        // Initialize the map, with the custom style
        _map = new google.maps.Map(mapCanvas, mapOptions);
        _map.mapTypes.set('alt_style', customMapType);

        // Retrieve the store locations from the server
        _getAllStores();
    };

    /*
     *  @desc   Center the map on the currently selected marker
     *  @param  undefined
     *  @return undefined
     */
    var centerMapOnSelectedMarker = function() {
        google.maps.event.trigger(_selectedMarker, 'click');
    };

    /*
     *  @desc   Changes map mode to standard or heat map mode
     *  @param  String mode - executes the switch function inside the object literal
     *                        '_modes'
     *  @return undefined
     */
    var switchMode = function( mode ) {
        _modes[mode]();
    };

    return {
        init: init,
        centerMapOnSelectedMarker : centerMapOnSelectedMarker,
        switchMode : switchMode
    };

})();

// Initialize the map
google.maps.event.addDomListener(window, 'load', Map.init);