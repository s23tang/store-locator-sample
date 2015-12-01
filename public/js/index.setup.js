/*
 *  @desc   On document ready, setup functions to be executed
 *  @param  undefined
 *  @return undefined
 */
$( document ).ready( function() {
    
    /*
     *  @desc   Toggles visibility of every marker on map
     *  @param  Boolean trueOrFalse - 'true' for toggle to visible,
                                      'false' for toggle to hidden
     *  @return undefined
     */
    function showAllMarkers( trueOrFalse ) {

        // Finds every marker, from global marker array, and toggles visibility
        for ( var i = 0; i < markerArray.length; i++ ) {
            markerArray[i].setMap( trueOrFalse ? map : null );
        }
    }

    // Setup click function on heat map mode selector, switch to heatmap when clicked
    $('#heatmap-select').click( function() {

        // If not already selected, switch to heatmap mode
        if ( !$(this).hasClass('selected') ) {
            showAllMarkers(false);                  // Hide all markers
            heatMap.setMap(map);                    // Show heatmap layer
            $('.selected').removeClass('selected'); // Deselect standard mode
            $(this).addClass('selected');           // Select heatmap mode
            $('.content').hide();                   // Hide standard content
            $('.heatmap-content').show();           // Show heatmap content
        }
    })

    // Setup click function on standard mode selector, switch to standard when click
    $('#standard-select').click( function() {

        // If not already selected, switch to standard mode
        if( !$(this).hasClass('selected') ) {
            showAllMarkers(true);                   // Show every marker
            heatMap.setMap(null);                   // Hide heatmap layer
            $('.selected').removeClass('selected'); // Deselect heatmap mode
            $(this).addClass('selected');           // Select standard mode
            $('.heatmap-content').hide();           // Hide heatmap content
            $('.content').show();                   // Show standard mode content
        }
    })

    // Setup click function on standard mode content expander link,
    //  expand or minimize amount of store info shown when clicked
    $('#expand-link').click( function() {

        // jQuery select the content expander element
        var $additionalContent = $('.additional-content');

        if ( $additionalContent.hasClass('hidden') ) {  // Show more info if minized

            // Update link to minize content on next click
            $additionalContent.removeClass('hidden');
            $(this).text('Show less...');
        } else {                                        // Hide info if expanded

            // Update link to expand content on next click
            $additionalContent.addClass('hidden');
            $(this).text('Show more...');
        }

        return false;
    });

    // Setup click function on the return link, will mimic a click on the
    // currently selected marker
    $('#return-link').click( function() {
        google.maps.event.trigger(selectedMarker, 'click');
    });
});