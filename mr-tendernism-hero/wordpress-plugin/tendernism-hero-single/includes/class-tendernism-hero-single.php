<?php
/**
 * Main plugin class — registers assets and the single-video Elementor widget.
 *
 * @package Tendernism_Hero_Single
 */

namespace Tendernism_Hero_Single;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Singleton that wires the widget into Elementor and registers the scripts /
 * styles it depends on. Assets are only ENQUEUED by the widget when it actually
 * renders (Elementor calls that automatically), so pages without the hero pay
 * nothing.
 *
 * All handles are prefixed `ths-` so they never clash with the multi-scene
 * "Tendernism Cinematic Hero" plugin, which uses `tendernism-` handles.
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

		// A dedicated widget category so it is easy to find in the panel. Shared
		// with the multi-scene plugin — add_category is safe to call from both.
		add_action( 'elementor/elements/categories_registered', array( $this, 'register_category' ) );
	}

	/**
	 * Register (not enqueue) the JS: the three vendor libraries plus our engine.
	 * The widget declares these as dependencies via get_script_depends(), so
	 * Elementor enqueues them on demand — only on pages containing the hero.
	 *
	 * If the multi-scene plugin is also active it registers its OWN copies of
	 * GSAP/ScrollTrigger/Lenis under different handles; the libraries are
	 * idempotent globals, so loading both is harmless (the browser caches the
	 * identical file). Handles are kept distinct to avoid version-string fights.
	 */
	public function register_frontend_scripts() {
		if ( wp_script_is( 'ths-hero', 'registered' ) ) {
			return;
		}

		wp_register_script(
			'ths-gsap',
			TENDERNISM_HERO_SINGLE_URL . 'assets/vendor/gsap.min.js',
			array(),
			'3.15.0',
			true
		);
		wp_register_script(
			'ths-scrolltrigger',
			TENDERNISM_HERO_SINGLE_URL . 'assets/vendor/ScrollTrigger.min.js',
			array( 'ths-gsap' ),
			'3.15.0',
			true
		);
		wp_register_script(
			'ths-lenis',
			TENDERNISM_HERO_SINGLE_URL . 'assets/vendor/lenis.min.js',
			array(),
			'1.3.25',
			true
		);
		wp_register_script(
			'ths-hero',
			TENDERNISM_HERO_SINGLE_URL . 'assets/js/single-hero.js',
			array( 'ths-gsap', 'ths-scrolltrigger', 'ths-lenis' ),
			TENDERNISM_HERO_SINGLE_VERSION,
			true
		);
	}

	/**
	 * Register (not enqueue) the CSS.
	 */
	public function register_frontend_styles() {
		if ( wp_style_is( 'ths-hero', 'registered' ) ) {
			return;
		}

		wp_register_style(
			'ths-hero',
			TENDERNISM_HERO_SINGLE_URL . 'assets/css/single-hero.css',
			array(),
			TENDERNISM_HERO_SINGLE_VERSION
		);

		// Optional Google Fonts (Bebas Neue, Space Grotesk, Great Vibes) that
		// match the brand. The widget only enqueues this when its "Load brand
		// fonts" switch is on, so themes that already ship the fonts aren't
		// double-loaded.
		wp_register_style(
			'ths-hero-fonts',
			'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Great+Vibes&family=Space+Grotesk:wght@300;400;500;600&display=swap',
			array(),
			TENDERNISM_HERO_SINGLE_VERSION
		);
	}

	/**
	 * Register the Elementor widget.
	 *
	 * @param \Elementor\Widgets_Manager $widgets_manager
	 */
	public function register_widgets( $widgets_manager ) {
		require_once TENDERNISM_HERO_SINGLE_PATH . 'includes/widgets/class-single-hero-widget.php';
		$widgets_manager->register( new Widgets\Single_Hero_Widget() );
	}

	/**
	 * Add a "Tendernism" category to the Elementor panel (shared slug with the
	 * multi-scene plugin — Elementor tolerates the repeated registration).
	 *
	 * @param \Elementor\Elements_Manager $elements_manager
	 */
	public function register_category( $elements_manager ) {
		$elements_manager->add_category(
			'tendernism',
			array(
				'title' => esc_html__( 'Tendernism', 'tendernism-hero-single' ),
				'icon'  => 'eicon-play',
			)
		);
	}
}
