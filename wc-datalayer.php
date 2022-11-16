<?php

/**
 * Description: Ecommerce data layer events for WooCommerce
 * Version: 1.0.0
 * Author: gnar software
 * Author URI: https://www.gnar.co.uk/
 * License: GPLv2 or later
 * Text Domain: wc-datalayer-gs
*/

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'GSDL_PLUGIN_DIR',     plugin_dir_path( __FILE__ ) );
define( 'GSDL_JS_DIR',         plugin_dir_url( __FILE__ ) . '/js' );


class GSDL_datalayer_wc {

    public function __construct() {

        // bail if WC isn't active
        if (!class_exists('WooCommerce')) {
            return;
        }

        // Register scripts
        add_action( 'wp_enqueue_scripts', [$this, 'enqueueScripts'] );

        // Localize scripts
        add_action( 'init', [$this, 'localizeScripts'] );

    }


    /**
     * Enqueue Scripts
     */
    public function enqueueScripts() {

        // enqueue script
        wp_enqueue_script( 'gsdl_wc_datalayer', GSDL_JS_DIR . '/gsdl_wc_datalayer.js', array( 'jquery' ), '1.0.0' );

    }


    /**
     * Localize scripts
     */
    public function localizeScripts() {
        die('got here');

        // setup vars
        $GSDL_Vars = [];

        // product view & add to cart data
        if (is_product()) {
            $GSDL_Vars = $this->getProductData();
        }

        // init checkout
        if (is_checkout()) {
            $GSDL_Vars = $this->getCartData();
        }

        // purchase data
        if (is_order_received_page()) {
            $GSDL_Vars = $this->getOrderData();
        }

        // add vars to script
        wp_add_inline_script( 'gsdl_wc_datalayer', 'const GSDL_Vars = ' . json_encode($GSDL_Vars), 'before' );
        
    }


    /**
     * Get cart data for init checkout
     * 
     * @return array $GSDL_Vars
     */
    public function getCartData() {
        $cart = WC()->cart;

        $GSDL_Vars['products'] = [];

        foreach ( WC()->cart->get_cart() as $key => $item ) {

            $productID = $item['product_id'];

            if (!empty($item['variation_id'])) {
                $productID = $item['variation_id'];
            }

            $productObj = wc_get_product($productID);

            $cartItem = [
                'name'     => $item['data']->get_title(),
                'id'       => $productObj->get_sku(),
                'quantity' => $item['quantity'],
                'price'    => $item['data']->get_price()
            ];

            array_push($GSDL_Vars['products'], $cartItem);
        }

        return $GSDL_Vars;
    }


    /**
     * Get product data for item view
     * 
     * @return array $GSDL_Vars
     */
    public function getProductData() {
        global $product;

        // if (empty($product)) {
        //     return [];
        // }

        //$productData = get_page_by_path( $product, OBJECT, 'product' );
        $productObj = wc_get_product($product);
        die(json_encode($productObj));

        $GSDL_Vars = [];

        // variable
        if (!empty($productObj) && $productObj->is_type('variable')) {

            // parent
            $GSDL_Vars['parent'] = [
                'name'     => $productObj->get_name(),
                'id'       => $productObj->get_sku(),
                'price'    => $productObj->get_price(),
                'category' => $this->getProductCat($product->get_id()),
                'currency' => get_woocommerce_currency()
            ];

            // variations
            $GSDL_Vars['variations'] = [];

            $variations = $productObj->get_children();

            foreach ($variations as $variationID) {
                $variationObj = wc_get_product($variationID);

                $variation = [
                    'name'     => $variationObj->get_name(),
                    'id'       => $variationObj->get_sku(),
                    'price'    => $variationObj->get_price(),
                    'category' => $this->getProductCat($variationID),
                    'currency' => get_woocommerce_currency()
                ];

                $GSDL_Vars['variations'][$variationID] = $variation;
            }
        }

        // simple
        else {
            $GSDL_Vars = [
                'name'     => $productObj->get_name(),
                'id'       => $productObj->get_sku(),
                'price'    => $productObj->get_price(),
                'category' => $this->getProductCat($product->get_id()),
                'currency' => get_woocommerce_currency()
            ];
        }

        return $GSDL_Vars;
    }


    /**
     * Get order data for purchase
     * 
     * @return array $GSDL_Vars
     */
    public function getOrderData() {

        global $wp;

        $orderID = $wp->query_vars['order-received'];
        $order   = wc_get_order($orderID);

        $GSDL_Vars = [
            'id'       => $order->get_id(),
            'revenue'  => $order->get_total(),
            'tax'      => $order->get_total_tax(),
            'shipping' => $order->get_shipping_total(),
            'products' => []
        ];

        foreach ($order->get_items() as $item) {

            $productID  = '';
            $productObj = $item->get_product();

            if ($productObj->is_type('variable')) {
                $productID = $item->get_variation_id();
            }
            else {
                $productID = $item->get_product_id();
            }
            
            $productData = (object) [
                'id'       => $productID,
                'name'     => $item->get_name(),
                'price'    => $item->get_total(),
                'category' => $this->getProductCat($productID),
                'quantity' => $item->get_quantity()
            ];

            array_push($GSDL_Vars['products'], $productData);
        }

        return $GSDL_Vars;
    }


    /**
     * Get first product category
     * 
     * @param int $productID
     * @return string $productFirstCat
     */
    public function getProductCat($productID) {
        $productFirstCat = '';
        $terms = get_the_terms($productID, 'product_cat');

        if (!empty($terms)) {
            $productFirstCat = $terms[0]->name;
        }

        return $productFirstCat;
    }


}

new GSDL_datalayer_wc();

?>