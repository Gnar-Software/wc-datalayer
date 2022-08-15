<?php

/*
 * Plugin Name: Datalayer Events for WooCommerce
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

        // Register & add data to script
        add_action( 'wp_enqueue_scripts', [$this, 'enqueueScripts'] );

        // Add data to add to cart button
        //add_filter( 'woocommerce_loop_add_to_cart_link', [$this, 'addToAddToCartBtn'] );

        // Add to cart
        add_action( 'woocommerce_add_to_cart', [$this, 'addToCartTest'] );

    }


    /**
     * Enqueue Scripts
     */
    public function enqueueScripts() {

        // bail if WC isn't active
        if (!class_exists('WooCommerce')) {
            return;
        }

        // enqueue script
        wp_enqueue_script( 'gsdl_wc_datalayer', GSDL_JS_DIR . '/gsdl_wc_datalayer.js', array( 'jquery' ), '1.0.0' );

        // setup vars
        $GSDL_Vars = [];

        if (is_product()) {
            $GSDL_Vars = $this->getProductData();
        }

        if (is_order_received_page()) {
            $GSDL_Vars = $this->getOrderData();
        }

        // add vars to script
        wp_add_inline_script( 'gsdl_wc_datalayer', 'const GSDL_Vars = ' . json_encode($GSDL_Vars), 'before' );
    }


    /**
     * Get product data for item view
     * 
     * @return array $GSDL_Vars
     */
    public function getProductData() {
        global $product;

        $productData = get_page_by_path( $product, OBJECT, 'product' );
        $productObj  = wc_get_product($productData->ID);

        $GSDL_Vars = [
            'name'     => $productObj->get_name(),
            'id'       => $productObj->get_sku(),
            'price'    => $productObj->get_price(),
            'category' => $this->getProductCat($productData->ID),
            'currency' => get_woocommerce_currency()
        ];

        return $GSDL_Vars;
    }


    /**
     * Get order data for purchase
     * 
     * @return array $GSDL_Vars
     */
    public function getOrderData() {

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


    // /**
    //  * Add additional product data to add to cart button
    //  */
    // public function addToAddToCartBtn($buttonHTML, $product, $args) {

    //     $newStr = sprintf('data-product-currency="%s" data-product-category="%s" data-product-price="%s" data-product-sku',
    //         get_woocommerce_currency(),
    //         $this->getProductCat($product->get_id()),
    //         $product->get_price()
    //     );
        
    //     //str_replace()

    //     return $buttonHTML;
    // }


    /**
     * Add to cart - echo data layer push
     */
    public function addToCartTest() {

        ?>
        <script>
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
            'event': 'new_subscriber',
            'formLocation': 'footer'
            });
        </script>
        <?php

    }
}

new GSDL_datalayer_wc();

?>