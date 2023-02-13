(function($) {

    // document ready
    $(document).ready(function() {
        window.dataLayer = window.dataLayer || [];


        // init checkout trigger
        $('body').on('init_checkout', function() {
            addToCartPush();
        });

        // purchase trigger
        if (window.location.pathname.includes('order-received')) {
            purchasePush();
        }   

    });


    // window load
    $(window).load(function() {

        // add to cart non-ajax trigger
        var cartForm = $('form.cart');

        $(cartForm).one('submit', function(e) {
            //e.preventDefault();

            try {
                addToCartPush();
            }
            catch (err) { }

            //$(this).submit();
            return true;
        });

    });


    /**
     * Add to cart push
     */
    function addToCartPush() {

        var products = [];

        GSDL_Vars['products'].forEach(product => {

            var item = {
                'name': product.name,
                'id': product.id,
                'price': product.price,
                'category': 'tickets',
                'quantity': product.quantity
            };

            products.push(item);
        });


        if ($('[name="quantity"]').first().length !== 0) {
            quantity = $('[name="quantity"]').first().val();
        }

        dataLayer.push({ ecommerce: null });
        dataLayer.push({
            'event': 'addToCart',
            'ecommerce': {
                'currencyCode': GSDL_Vars.currency,
                'add': {
                    'products': products
                }
            },
            'total_add_to_cart_val': GSDL_Vars.totalAddToCartVal
        });

    }


    /**
     * Purchase push
     */
    function purchasePush() {

        var actionField = {
            'id': GSDL_Vars.id,
            'revenue': GSDL_Vars.revenue,
            'tax': GSDL_Vars.tax,
            'shipping': GSDL_Vars.shipping
        };

        var products = [];

        GSDL_Vars['products'].forEach(product => {

            var item = {
                'name': product.name,
                'id': product.id,
                'price': product.price,
                'category': product.category,
                'quantity': product.quantity
            };

            products.push(item);
        });
        
        dataLayer.push({ ecommerce: null });
        dataLayer.push({
            'ecommerce': {
                'currencyCode': GSDL_Vars.currency,
                'purchase': {
                    'actionField': actionField,
                    'products': products
                }
            }
        });
    }


})(jQuery, GSDL_Vars)