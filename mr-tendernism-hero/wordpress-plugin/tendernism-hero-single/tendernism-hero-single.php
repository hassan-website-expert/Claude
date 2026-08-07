<?php
/**
 * Plugin Name: Tendernism Single Hero
 * Description: The "one iconic moment" cinematic hero for Mr. Tendernism, delivered as a fully editable Elementor widget. Streams a SINGLE continuous clip from their CDN — the action plays once, then either seamlessly loops its smoke-filled tail or holds while the smoke haze keeps rising. Copy animates in on load; a gentle auto-scroll nudge hints at what's below. Runs alongside the multi-scene "Cinematic Hero" plugin without conflict.
 * Version:     1.0.0
 * Author:      Mr. Tendernism
 * Text Domain: tendernism-hero-single
 * Requires PHP: 7.4
 *
 * The heavy lifting lives in includes/. This file only bootstraps: it refuses to
 * load without Elementor, then hands off to the main plugin class.
 *
 * This is a SEPARATE plugin from "Tendernism Cinematic Hero" (the multi-scene
 * version). Every symbol — constants, namespace, asset handles, widget name and
 * CSS class prefix (ths-) — is distinct, so both can be installed and even
 * activated at the same time with no collision.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

define( 'TENDERNISM_HERO_SINGLE_VERSION', '1.0.0' );
define( 'TENDERNISM_HERO_SINGLE_FILE', __FILE__ );
define( 'TENDERNISM_HERO_SINGLE_PATH', plugin_dir_path( __FILE__ ) );
define( 'TENDERNISM_HERO_SINGLE_URL', plugin_dir_url( __FILE__ ) );

/**
 * Boot the plugin on plugins_loaded, but only once Elementor is present. If
 * Elementor is missing we show an admin notice instead of fataling.
 */
function tendernism_hero_single_bootstrap() {
	if ( ! did_action( 'elementor/loaded' ) ) {
		add_action( 'admin_notices', 'tendernism_hero_single_missing_elementor_notice' );
		return;
	}

	require_once TENDERNISM_HERO_SINGLE_PATH . 'includes/class-tendernism-hero-single.php';
	\Tendernism_Hero_Single\Plugin::instance();
}
add_action( 'plugins_loaded', 'tendernism_hero_single_bootstrap' );

/**
 * Admin notice shown when Elementor is not active.
 */
function tendernism_hero_single_missing_elementor_notice() {
	if ( ! current_user_can( 'activate_plugins' ) ) {
		return;
	}
	$message = sprintf(
		/* translators: %s: Elementor plugin name. */
		esc_html__( '“Tendernism Single Hero” requires %s to be installed and active.', 'tendernism-hero-single' ),
		'<strong>Elementor</strong>'
	);
	printf( '<div class="notice notice-warning is-dismissible"><p>%s</p></div>', wp_kses_post( $message ) );
}
