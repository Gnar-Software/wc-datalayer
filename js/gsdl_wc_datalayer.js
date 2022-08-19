(function($) {

    $(document).ready(function() {
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({ ecommerce: null });

        // item view
        if ($('body').hasClass('single-product') || $('body').hasClass('single-product')) {
            console.log(GSDL_Vars);

            window.dataLayer.push({
                'ecommerce': {
                    'detail': {
                        'actionField': {'list': 'Apparel Gallery'},
                        'products': [{
                            'name': 'Triblend Android T-Shirt',
                            'id': '12345',
                            'price': '15.25',
                            'brand': 'Google',
                            'category': 'Apparel',
                            'variant': 'Gray'
                        }]
                    }
                }
            });
        }

        // init checkout
        $('body').on('init_checkout', function() {
            console.log(GSDL_Vars);
        });

        // add to cart
        $('bpdy').on('added_to_cart', function() {
            console.log(GSDL_Vars);

            dataLayer.push({
                'event': 'addToCart',
                'ecommerce': {
                    'currencyCode': 'EUR',
                    'add': {                                // 'add' actionFieldObject measures.
                        'products': [{                        //  adding a product to a shopping cart.
                            'name': 'Triblend Android T-Shirt',
                            'id': '12345',
                            'price': '15.25',
                            'brand': 'Google',
                            'category': 'Apparel',
                            'variant': 'Gray',
                            'quantity': 1
                        }]
                    }
                }
            });
        });

        // purchase
        if (window.location.pathname == 'order-recieved') {
            console.log('Purchase: ' + GSDL_Vars);
        
            dataLayer.push({
                'ecommerce': {
                    'purchase': {
                        'actionField': {
                            'id': 'T12345',                         // Transaction ID. Required for purchases and refunds.
                            'affiliation': 'Online Store',
                            'revenue': '35.43',                     // Total transaction value (incl. tax and shipping)
                            'tax':'4.90',
                            'shipping': '5.99',
                            'coupon': 'SUMMER_SALE'
                        },
                        'products': [{                            // List of productFieldObjects.
                            'name': 'Triblend Android T-Shirt',     // Name or ID is required.
                            'id': '12345',
                            'price': '15.25',
                            'brand': 'Google',
                            'category': 'Apparel',
                            'variant': 'Gray',
                            'quantity': 1,
                            'coupon': ''
                        }]
                    }
                }
            });
        }   


        // Test
        window.dataLayer.push({
            'event': 'hey_babe'
        });
    });

})(jQuery, GSDL_Vars)