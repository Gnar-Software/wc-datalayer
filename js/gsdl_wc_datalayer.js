(function($) {

    $(document).ready(function() {
        console.log('ready!');

        // item view
        if ($('body').hasClass('single-product') || $('body').hasClass('single-product')) {
            console.log(GSDL_Vars);
        }

        // init checkout
        $('body').on('init_checkout', function() {
            console.log(GSDL_Vars);
        });

        // purchase


    });

})(jQuery, GSDL_Vars)