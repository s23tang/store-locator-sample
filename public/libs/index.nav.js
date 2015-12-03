/*
 *  @desc   Create the navOverlay object
 *  @param  undefined
 *  @return undefined
 */
var NavOverlay = (function (Map) {

    /*
     *  @desc   Initializes the click function on the heat map mode selector
     *  @param  undefined
     *  @return undefined
     */
    var _heatMapClickInit = function() {
        // Setup click function on heat map mode selector, switch to heatmap when clicked
        $('#heatmap-select').click( function() {
            // If not already selected, switch to heatmap mode
            if ( !$(this).hasClass('selected') ) {
                Map.switchMode('heatmap');
                $('.selected').removeClass('selected'); // Deselect standard mode
                $(this).addClass('selected');           // Select heatmap mode
                $('.content').hide();                   // Hide standard content
                $('.heatmap-content').show();           // Show heatmap content
            }
        });
    };

    /*
     *  @desc   Initializes the click function on the standard mode selector
     *  @param  undefined
     *  @return undefined
     */
    var _standardClickInit = function() {
        // Setup click function on standard mode selector, switch to standard when click
        $('#standard-select').click( function() {
            // If not already selected, switch to standard mode
            if( !$(this).hasClass('selected') ) {
                Map.switchMode('standard');
                $('.selected').removeClass('selected'); // Deselect heatmap mode
                $(this).addClass('selected');           // Select standard mode
                $('.heatmap-content').hide();           // Hide heatmap content
                $('.content').show();                   // Show standard mode content
            }
        });
    };

    /*
     *  @desc   Initializes the click function on the expand link 
     *  @param  undefined
     *  @return undefined
     */
    var _expandLinkClickInit = function() {
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
    };

    /*
     *  @desc   Initializes the click function on the button to return to selected
     *  @param  undefined
     *  @return undefined
     */
    var _returnToSelectedClickInit = function() {
        // Setup click function on the return link, will mimic a click on the
        // currently selected marker
        $('#return-link').click( function() {
            Map.centerMapOnSelectedMarker();
        });
    };

    /*
     *  @desc   Initializes the the navigation overlay
     *  @param  undefined
     *  @return undefined
     */
    var init = function() {
        _heatMapClickInit();
        _standardClickInit();
        _expandLinkClickInit();
        _returnToSelectedClickInit();
    }

    init();

})( Map || {} );