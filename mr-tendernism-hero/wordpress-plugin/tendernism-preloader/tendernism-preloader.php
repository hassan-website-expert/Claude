<?php
/**
 * Plugin Name: Tendernism Preloader
 * Description: A premium, branded full-screen site preloader — the kind you see on high-end sites. Shows a cinematic Mr. Tendernism loading screen (crown, gold wordmark, tagline, drifting smoke, animated loader) on page load, then fades out once the page is ready. Completely standalone: no Elementor and no other plugin required. Configure everything under Settings → Preloader.
 * Version:     1.1.0
 * Author:      Mr. Tendernism
 * Text Domain: tendernism-preloader
 * Requires at least: 5.2
 * Requires PHP: 7.0
 *
 * This is an independent plugin. It has nothing to do with the hero widgets — it
 * simply paints a loading overlay over the whole site and removes it when the
 * window has loaded (with a hard maximum wait so slow connections aren't
 * blocked, and an optional "once per session" mode).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

define( 'TENDERNISM_PRELOADER_VERSION', '1.1.0' );
define( 'TENDERNISM_PRELOADER_FILE', __FILE__ );
define( 'TENDERNISM_PRELOADER_PATH', plugin_dir_path( __FILE__ ) );
define( 'TENDERNISM_PRELOADER_URL', plugin_dir_url( __FILE__ ) );
define( 'TENDERNISM_PRELOADER_OPTION', 'tendernism_preloader_options' );

require_once TENDERNISM_PRELOADER_PATH . 'includes/class-thp-settings.php';

/**
 * Default settings — also used to fill any missing keys.
 *
 * @return array
 */
function thp_default_options() {
	return array(
		'enabled'          => 1,
		'scope'            => 'all',        // all | home
		'once_per_session' => 0,
		'title'            => 'Mr. Tendernism',
		'tagline'          => 'Good Energy. Real Moments. Good Food.',
		'cue'              => 'Loading',
		'show_crown'       => 1,
		'spinner'          => 'bar',        // bar | ring | pulse | counter
		'bg_color'         => '#0e0b09',
		'gold'             => '#d4a018',
		'gold_hi'          => '#f0c95a',
		'text_color'       => '#f2efe9',
		'max_wait'         => 6000,         // ms
		'min_show'         => 600,          // ms
	);
}

/**
 * Read merged options (stored over defaults).
 *
 * @return array
 */
function thp_get_options() {
	$saved = get_option( TENDERNISM_PRELOADER_OPTION, array() );
	if ( ! is_array( $saved ) ) {
		$saved = array();
	}
	return wp_parse_args( $saved, thp_default_options() );
}

register_activation_hook( __FILE__, 'thp_activate' );
/**
 * Seed defaults on activation.
 */
function thp_activate() {
	if ( false === get_option( TENDERNISM_PRELOADER_OPTION, false ) ) {
		add_option( TENDERNISM_PRELOADER_OPTION, thp_default_options() );
	}
}

// Admin settings page.
add_action( 'plugins_loaded', function () {
	if ( is_admin() ) {
		new THP_Settings();
	}
} );

/**
 * Should the preloader run on the current request?
 *
 * @return bool
 */
function thp_should_render() {
	if ( is_admin() ) {
		return false;
	}
	// Never in page-builder editors / previews.
	if ( isset( $_GET['elementor-preview'] ) || isset( $_GET['fl_builder'] ) || is_customize_preview() ) {
		return false;
	}
	$o = thp_get_options();
	if ( empty( $o['enabled'] ) ) {
		return false;
	}
	if ( 'home' === $o['scope'] && ! ( is_front_page() || is_home() ) ) {
		return false;
	}
	return true;
}

// ── Head: critical inline CSS (guarantees instant, flash-free cover) ──────────
add_action( 'wp_head', 'thp_print_head', 1 );
/**
 * Print the colour tokens + a minimal critical style so the overlay covers the
 * page the instant the body opens, before the main stylesheet loads. Also the
 * once-per-session skip guard runs here, pre-paint, so a returning visitor never
 * sees a flash.
 */
function thp_print_head() {
	if ( ! thp_should_render() ) {
		return;
	}
	$o = thp_get_options();
	$bg   = sanitize_hex_color( $o['bg_color'] ) ?: '#0e0b09';
	$gold = sanitize_hex_color( $o['gold'] ) ?: '#d4a018';
	$goldhi = sanitize_hex_color( $o['gold_hi'] ) ?: '#f0c95a';
	$text = sanitize_hex_color( $o['text_color'] ) ?: '#f2efe9';
	?>
<style id="thp-critical">
:root{--thp-bg:<?php echo esc_html( $bg ); ?>;--thp-gold:<?php echo esc_html( $gold ); ?>;--thp-gold-hi:<?php echo esc_html( $goldhi ); ?>;--thp-text:<?php echo esc_html( $text ); ?>;}
.thp-preloader{position:fixed;inset:0;z-index:2147483000;background:var(--thp-bg);opacity:1;}
.thp-lock{overflow:hidden !important;}
.thp-skip .thp-preloader{display:none !important;}
</style>
<?php if ( ! empty( $o['once_per_session'] ) ) : ?>
<script>try{if(sessionStorage.getItem('thpSeen')==='1'){document.documentElement.className+=' thp-skip';}}catch(e){}</script>
<?php endif;
}

// ── Enqueue the full stylesheet (head) + the hide script (footer) ─────────────
add_action( 'wp_enqueue_scripts', 'thp_enqueue' );
/**
 * Register the CSS/JS. The CSS is a normal head stylesheet; the critical inline
 * block above already covers the first paint, so a slightly late stylesheet
 * never causes a flash.
 */
function thp_enqueue() {
	if ( ! thp_should_render() ) {
		return;
	}
	// Brand fonts (Bebas Neue wordmark, Great Vibes tagline). The CSS has system
	// fallbacks, so the loader still works if these are blocked.
	wp_enqueue_style(
		'tendernism-preloader-fonts',
		'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Great+Vibes&family=Space+Grotesk:wght@300;400;600&display=swap',
		array(),
		null
	);
	wp_enqueue_style(
		'tendernism-preloader',
		TENDERNISM_PRELOADER_URL . 'assets/css/preloader.css',
		array(),
		TENDERNISM_PRELOADER_VERSION
	);
	wp_enqueue_script(
		'tendernism-preloader',
		TENDERNISM_PRELOADER_URL . 'assets/js/preloader.js',
		array(),
		TENDERNISM_PRELOADER_VERSION,
		true
	);
}

// ── Body: the overlay markup, as early as possible ───────────────────────────
add_action( 'wp_body_open', 'thp_render_overlay', 1 );
/**
 * Print the overlay at the very top of <body>. Falls back to wp_footer for
 * themes that don't fire wp_body_open (guarded so it prints only once).
 */
function thp_render_overlay() {
	static $printed = false;
	if ( $printed || ! thp_should_render() ) {
		return;
	}
	$printed = true;

	$o        = thp_get_options();
	$title    = isset( $o['title'] ) ? $o['title'] : '';
	$tagline  = isset( $o['tagline'] ) ? $o['tagline'] : '';
	$cue      = isset( $o['cue'] ) ? $o['cue'] : '';
	$crown    = ! empty( $o['show_crown'] );
	$spinner  = in_array( $o['spinner'], array( 'bar', 'ring', 'pulse', 'counter' ), true ) ? $o['spinner'] : 'bar';
	$max_wait = max( 500, (int) $o['max_wait'] );
	$min_show = max( 0, (int) $o['min_show'] );
	$once     = ! empty( $o['once_per_session'] ) ? '1' : '0';
	?>
	<div class="thp-preloader thp-preloader--<?php echo esc_attr( $spinner ); ?>" role="status" aria-live="polite"
		aria-label="<?php esc_attr_e( 'Loading', 'tendernism-preloader' ); ?>"
		data-max-wait="<?php echo esc_attr( $max_wait ); ?>"
		data-min-show="<?php echo esc_attr( $min_show ); ?>"
		data-once="<?php echo esc_attr( $once ); ?>">
		<div class="thp-preloader__smoke" aria-hidden="true"></div>
		<div class="thp-preloader__inner">
			<?php if ( $crown ) : ?>
				<svg class="thp-preloader__crown" viewBox="0 0 120 74" aria-hidden="true">
					<path pathLength="1" d="M8 66 L20 22 L42 50 L60 12 L78 50 L100 22 L112 66 Z"></path>
					<path pathLength="1" d="M8 66 L112 66"></path>
				</svg>
			<?php endif; ?>
			<?php if ( '' !== $title ) : ?>
				<div class="thp-preloader__wordmark"><?php echo esc_html( $title ); ?></div>
			<?php endif; ?>
			<?php if ( '' !== $tagline ) : ?>
				<p class="thp-preloader__tagline"><?php echo esc_html( $tagline ); ?></p>
			<?php endif; ?>

			<?php if ( 'ring' === $spinner ) : ?>
				<div class="thp-preloader__ring" aria-hidden="true"></div>
			<?php elseif ( 'pulse' === $spinner ) : ?>
				<div class="thp-preloader__pulse" aria-hidden="true"><span></span><span></span><span></span></div>
			<?php elseif ( 'counter' === $spinner ) : ?>
				<div class="thp-preloader__counter" aria-hidden="true"><span class="thp-preloader__num">0</span><span class="thp-preloader__pct">%</span></div>
				<div class="thp-preloader__track" aria-hidden="true"><span class="thp-preloader__fill"></span></div>
			<?php else : ?>
				<div class="thp-preloader__bar" aria-hidden="true"><span></span></div>
			<?php endif; ?>

			<?php if ( '' !== $cue ) : ?>
				<span class="thp-preloader__cue"><?php echo esc_html( $cue ); ?></span>
			<?php endif; ?>
		</div>
	</div>
	<?php
}

// Fallback for themes without wp_body_open: print at the top of the footer.
add_action( 'wp_footer', function () {
	if ( ! did_action( 'wp_body_open' ) ) {
		thp_render_overlay();
	}
}, 0 );

// Settings link on the Plugins screen.
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), function ( $links ) {
	$url = admin_url( 'options-general.php?page=tendernism-preloader' );
	array_unshift( $links, '<a href="' . esc_url( $url ) . '">' . esc_html__( 'Settings', 'tendernism-preloader' ) . '</a>' );
	return $links;
} );
