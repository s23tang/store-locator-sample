/*
 *	@desc	Will be called on window load to render the Google map
 *	@param	undefined
 *	@return	undefined
 */
function initialize() {
    
    var heatMapLocs = [];		// Array containing Google LatLng object for all locations,
    							//  to be used to create the Heatmap layer

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
        mapTypeControl: false,	// Disable default Google map control buttons
        center: new google.maps.LatLng(43.53324544343535, -79.72113307714847),
        						// Setup center near Toronto
        zoom: 10,				// Setup zoom level
        mapTypeId: 'alt_style'	// Using the custom map style 'Alt Style'
    };

    // Initialize the map, with the custom style
    map = new google.maps.Map(mapCanvas, mapOptions);
    map.mapTypes.set('alt_style', customMapType);

    /*
     *	Plot all stores on map using Markers, and push all location data
     *  (latitude, longitude) into heatmap array for later use
     *
     *	[Object] locations - passed through ejs, containing every store data
     *						 retrieved from the database
     */
    for ( var i = 0; i < locations.length; i++ ) {

    	// Create Google LatLng object from data of store
        var locationPosition = new google.maps.LatLng(locations[i].latitude, locations[i].longitude);

        // Push to heatmap array
        heatMapLocs.push(locationPosition);

        // Create marker using LatLng object
        var marker = new google.maps.Marker({
            position: locationPosition,
            map: map
        });

        // Setup click function on marker: will update display with store information
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {

            	// Uses jQuery (loaded after) to select area to display to
                var $content = $('.content'),
                        info = locations[i];	//Selected store info

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

                // Move map to center on the selected marker
                map.setCenter(marker.getPosition());

                // Cancel selected animation on previous marker, if there was one
                if ( selectedMarker ) {
                    selectedMarker.setAnimation(null);
                } else {    // No previous marker, show the hidden 'return to marker' link
                    $('.return-container').fadeIn( function() {

                        // Fade out the help tooltip after 3 seconds
                        setTimeout( function() {
                            $('.tooltip').fadeOut();
                        }, 3000);
                     });
                }

                // Update currently selected marker, and animate bounce on marker
                selectedMarker = marker;
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        })(marker, i));

		// Push created marker into marker array
        markerArray.push(marker);
    }

    // Setup the heatmap layer using the locations of every store,
    //	and with custom colors and radius (color display radius)
    heatMap = new google.maps.visualization.HeatmapLayer({
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
        map: map
    });

    // Hide heatmap layer by default
    heatMap.setMap(null);
}

// Initialize the map
google.maps.event.addDomListener(window, 'load', initialize);