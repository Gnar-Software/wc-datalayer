(function($) {

    // document ready
    $(document).ready(function() {
        window.dataLayer = window.dataLayer || [];

        // item view trigger
        if ($('body').hasClass('single-product') || $('body').hasClass('single-product')) {
            itemViewPush();
        }

        // add to cart trigger
        if (GSDL_Vars.products_added !== undefined) {
            addToCartPush();
        }

        // init checkout trigger
        $('body').on('init_checkout', function() {
            initCheckoutPush();
        });

        // purchase trigger
        if (window.location.pathname.includes('order-received')) {
            purchasePush();
        }   

    });


    /**
     * Add to cart push
     */
    function addToCartPush() {
        productData = GSDL_Vars.products_added;
        console.log('DL - added to cart triggered ', productData);

        dataLayer.push({ ecommerce: null });
        dataLayer.push({
            'event': 'addToCart',
            'ecommerce': {
                'currencyCode': productData.currency,
                'add': {
                    'products': [{
                        'name': productData.name,
                        'id': productData.id,
                        'price': parseFloat(productData.price),
                        'category': productData.category,
                        'quantity': productData.quantity
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
                        'price': parseFloat(productData.price),
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
            'revenue': parseFloat(GSDL_Vars.revenue),
            'tax': GSDL_Vars.tax,
            'shipping': GSDL_Vars.shipping
        };

        var products = [];

        GSDL_Vars['products'].forEach(product => {

            var item = {
                'name': product.name,
                'id': product.id,
                'price': parseFloat(product.price),
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