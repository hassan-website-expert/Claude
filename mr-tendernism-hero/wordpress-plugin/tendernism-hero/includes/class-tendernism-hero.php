<?php
/**
 * Main plugin class — registers assets and the Elementor widget.
 *
 * @package Tendernism_Hero
 */

namespace Tendernism_Hero;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Singleton that wires the widget into Elementor and registers the scripts /
 * styles it depends on. Assets are only ENQUEUED by the widget when it actually
 * renders (Elementor calls that automatically), so pages without the hero pay
 * nothing.
 */
final class Plugin {

	/**
	 * @var Plugin|null
	 */
	private static $instance = null;

	/**
	 * Singleton accessor.
	 *
	 * @return Plugin
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		// Register the scripts/styles up front (handles only — no enqueue yet).
		add_action( 'elementor/frontend/after_register_scripts', array( $this, 'register_frontend_scripts' ) );
		add_action( 'elementor/frontend/after_register_styles', array( $this, 'register_frontend_styles' ) );
		// Also register on the standard hooks so the handles resolve in the editor
		// preview and on the front end regardless of entry point.
		add_action( 'wp_enqueue_scripts', array( $this, 'register_frontend_scripts' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'register_frontend_styles' ) );

		// Register the widget itself.
		add_action( 'elementor/widgets/register', array( $this, 'register_widgets' ) );

		// A dedicated widget category so it is easy to find in the panel.
		add_action( 'elementor/elements/categories_registered', array( $this, 'register_category' ) );
	}

	/**
	 * Register (not enqueue) the JS: the three vendor libraries plus our engine.
	 * The widget declares these as dependencies via get_script_depends(), so
	 * Elementor enqueues them on demand — only on pages containing the hero.
	 */
	public function register_frontend_scripts() {
		if ( wp_script_is( 'tendernism-hero', 'registered' ) ) {
			return;
		}

		wp_register_script(
			'tendernism-gsap',
			TENDERNISM_HERO_URL . 'assets/vendor/gsap.min.js',
			array(),
			'3.15.0',
			true
		);
		wp_register_script(
			'tendernism-scrolltrigger',
			TENDERNISM_HERO_URL . 'assets/vendor/ScrollTrigger.min.js',
			array( 'tendernism-gsap' ),
			'3.15.0',
			true
		);
		wp_register_script(
			'tendernism-lenis',
			TENDERNISM_HERO_URL . 'assets/vendor/lenis.min.js',
			array(),
			'1.3.25',
			true
		);
		wp_register_script(
			'tendernism-hero',
			TENDERNISM_HERO_URL . 'assets/js/cinematic-hero.js',
			array( 'tendernism-gsap', 'tendernism-scrolltrigger', 'tendernism-lenis' ),
			TENDERNISM_HERO_VERSION,
			true
		);
	}

	/**
	 * Register (not enqueue) the CSS.
	 */
	public function register_frontend_styles() {
		if ( wp_style_is( 'tendernism-hero', 'registered' ) ) {
			return;
		}

		wp_register_style(
			'tendernism-hero',
			TENDERNISM_HERO_URL . 'assets/css/cinematic-hero.css',
			array(),
			TENDERNISM_HERO_VERSION
		);

		// Optional Google Fonts (Bebas Neue, Space Grotesk, Great Vibes) that
		// match the brand. The widget only enqueues this when its "Load brand
		// fonts" switch is on, so themes that already ship the fonts aren't
		// double-loaded.
		wp_register_style(
			'tendernism-hero-fonts',
			'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Great+Vibes&family=Space+Grotesk:wght@300;400;500;600&display=swap',
			array(),
			TENDERNISM_HERO_VERSION
		);
	}

	/**
	 * Register the Elementor widget.
	 *
	 * @param \Elementor\Widgets_Manager $widgets_manager
	 */
	public function register_widgets( $widgets_manager ) {
		require_once TENDERNISM_HERO_PATH . 'includes/widgets/class-cinematic-hero-widget.php';
		$widgets_manager->register( new Widgets\Cinematic_Hero_Widget() );
	}

	/**
	 * Add a "Tendernism" category to the Elementor panel.
	 *
	 * @param \Elementor\Elements_Manager $elements_manager
	 */
	public function register_category( $elements_manager ) {
		$elements_manager->add_category(
			'tendernism',
			array(
				'title' => esc_html__( 'Tendernism', 'tendernism-hero' ),
				'icon'  => 'eicon-play',
			)
		);
	}
}
