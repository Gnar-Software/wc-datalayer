(function($) {

    $(document).ready(function() {
        window.dataLayer = window.dataLayer || [];

        // item view trigger
        if ($('body').hasClass('single-product') || $('body').hasClass('single-product')) {
            console.log(GSDL_Vars);
            itemViewPush();
        }

        // init checkout trigger
        $('body').on('init_checkout', function() {
            console.log(GSDL_Vars);
        });

        // add to cart ajax trigger
        $('bpdy').on('added_to_cart', function() {
            console.log(GSDL_Vars);
            addToCartPush();
        });

        // add to cart non-ajax trigger
        $('.single-product .product form').one('submit', function(e) {
            e.preventDefault();

            try {
                addToCartPush();
            }
            catch (err) { }

            $(this).submit();
            return true;
        });

        // purchase trigger
        if (window.location.pathname == 'order-recieved') {
            console.log('Purchase: ' + GSDL_Vars);
            purchasePush();
        }   


        /**
         * Add to cart push
         * 
         */
        function addToCartPush() {
            var productData = getAddToCartData();
            var quantity = $('[name="quantity"]').first().val();
            console.log(productData);

            dataLayer.push({ ecommerce: null });
            dataLayer.push({
                'event': 'addToCart',
                'ecommerce': {
                    'currencyCode': productData.currency,
                    'add': {
                        'products': [{
                            'name': productData.name,
                            'id': productData.id,
                            'price': productData.price,
                            'category': productData.category,
                            'quantity': quantity
                        }]
                    }
                }
            });
        }


        /**
         * Item view push
         */
        function itemViewPush() {
            var productData;

            if (GSDL_Vars.variations !== undefined) {
                productData = GSDL_Vars.parent;
            }
            else {
                productData = GSDL_Vars;
            }

            dataLayer.push({ ecommerce: null });
            window.dataLayer.push({
                'ecommerce': {
                    'detail': {
                        'products': [{
                            'name': productData.name,
                            'id': productData.id,
                            'price': productData.price,
                            'category': productData.category
                        }]
                    }
                }
            });
        }


        /**
         * Purchase push
         */
        function purchasePush() {

            dataLayer.push({ ecommerce: null });
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


        /**
         * Get Add To Cart Data - Product Page DOM
         * 
         * @return object productData
         */
        function getAddToCartData() {

            var productData;

            // get the product ID of the added to cart item
            var productID;
            var variationID = $('[name="variation_id"]').first();
        
            // variable
            if (variationID.length !== 0) {
                productID = $(variationID).val();
                console.log(productID);

                if (GSDL_Vars.variations !== undefined) {
                    productData = GSDL_Vars.variations[productID];
                }
            }
            
            // simple
            else {
                productID = $('[name="add-to-cart"]').first().value;
                productData = GSDL_Vars;
            }

            return productData;
        }

    });

})(jQuery, GSDL_Vars)