(function($) {

    $(document).ready(function() {
        window.dataLayer = window.dataLayer || [];

        // item view trigger
        if ($('body').hasClass('single-product') || $('body').hasClass('single-product')) {
            itemViewPush();
        }

        // init checkout trigger
        $('body').on('init_checkout', function() {
            console.log('init checkout: ');
            console.log(GSDL_Vars);
            initCheckoutPush();
        });

        // add to cart ajax trigger
        if ($('body').hasClass('woocommerce-cart')) {
            addToCartPush();
        }

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
        if (window.location.pathname.includes('order-received')) {
            purchasePush();
        }


        /**
         * Add to cart push
         */
        function addToCartPush() {
            var productData = getAddToCartData();
            var quantity = 1;

            if ($('[name="quantity"]').first().length !== 0) {
                quantity = $('[name="quantity"]').first().val();
            }

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
         * Init Checkout push
         */
        function initCheckoutPush() {
            var products = GSDL_Vars.products;

            dataLayer.push({ ecommerce: null });
            dataLayer.push({
                'event': 'checkout',
                'ecommerce': {
                    'checkout': {
                        'actionField': {'step': 1},
                        'products': products
                    }
                }
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
                    'purchase': {
                        'actionField': actionField,
                        'products': products
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