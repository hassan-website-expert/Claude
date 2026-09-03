<?php
/**
 * Plugin Name: Tendernism Cinematic Hero
 * Description: Scroll-driven cinematic heroes for Mr. Tendernism, delivered as fully editable Elementor widgets. Ships TWO options: "Cinematic Hero" (clips play/loop as you scroll) and "Cinematic Hero — Scroll" (the footage itself is scrubbed by scroll — every frame tied to the scroll position, never ends or loops). Both stream the AI-generated clips from their CDN and are built on GSAP + ScrollTrigger + Lenis.
 * Version:     1.5.0
 * Author:      Mr. Tendernism
 * Text Domain: tendernism-hero
 * Requires PHP: 7.4
 *
 * The heavy lifting lives in includes/. This file only bootstraps: it refuses to
 * load without Elementor, then hands off to the main plugin class.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

define( 'TENDERNISM_HERO_VERSION', '1.5.0' );
define( 'TENDERNISM_HERO_FILE', __FILE__ );
define( 'TENDERNISM_HERO_PATH', plugin_dir_path( __FILE__ ) );
define( 'TENDERNISM_HERO_URL', plugin_dir_url( __FILE__ ) );

/**
 * Boot the plugin on plugins_loaded, but only once Elementor is present. If
 * Elementor is missing we show an admin notice instead of fataling.
 */
function tendernism_hero_bootstrap() {
	if ( ! did_action( 'elementor/loaded' ) ) {
		add_action( 'admin_notices', 'tendernism_hero_missing_elementor_notice' );
		return;
	}

	require_once TENDERNISM_HERO_PATH . 'includes/class-tendernism-hero.php';
	\Tendernism_Hero\Plugin::instance();
}
add_action( 'plugins_loaded', 'tendernism_hero_bootstrap' );

/**
 * Admin notice shown when Elementor is not active.
 */
function tendernism_hero_missing_elementor_notice() {
	if ( ! current_user_can( 'activate_plugins' ) ) {
		return;
	}
	$message = sprintf(
		/* translators: %s: Elementor plugin name. */
		esc_html__( '“Tendernism Cinematic Hero” requires %s to be installed and active.', 'tendernism-hero' ),
		'<strong>Elementor</strong>'
	);
	printf( '<div class="notice notice-warning is-dismissible"><p>%s</p></div>', wp_kses_post( $message ) );
}
