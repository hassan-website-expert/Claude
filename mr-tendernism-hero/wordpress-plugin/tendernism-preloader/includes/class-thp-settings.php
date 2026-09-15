<?php
/**
 * Admin settings screen for the Tendernism Preloader (Settings → Preloader).
 *
 * @package Tendernism_Preloader
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class THP_Settings {

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'menu' ) );
		add_action( 'admin_init', array( $this, 'register' ) );
	}

	public function menu() {
		add_options_page(
			esc_html__( 'Preloader', 'tendernism-preloader' ),
			esc_html__( 'Preloader', 'tendernism-preloader' ),
			'manage_options',
			'tendernism-preloader',
			array( $this, 'render_page' )
		);
	}

	public function register() {
		register_setting(
			'thp_group',
			TENDERNISM_PRELOADER_OPTION,
			array( 'sanitize_callback' => array( $this, 'sanitize' ) )
		);
	}

	/**
	 * Sanitize every field before saving.
	 *
	 * @param array $input
	 * @return array
	 */
	public function sanitize( $input ) {
		$d   = thp_default_options();
		$out = array();

		$out['enabled']          = empty( $input['enabled'] ) ? 0 : 1;
		$out['once_per_session'] = empty( $input['once_per_session'] ) ? 0 : 1;
		$out['show_crown']       = empty( $input['show_crown'] ) ? 0 : 1;

		$out['scope']   = ( isset( $input['scope'] ) && 'home' === $input['scope'] ) ? 'home' : 'all';
		$out['spinner'] = ( isset( $input['spinner'] ) && in_array( $input['spinner'], array( 'bar', 'ring', 'pulse' ), true ) ) ? $input['spinner'] : 'bar';

		$out['title']   = isset( $input['title'] ) ? sanitize_text_field( $input['title'] ) : $d['title'];
		$out['tagline'] = isset( $input['tagline'] ) ? sanitize_text_field( $input['tagline'] ) : $d['tagline'];
		$out['cue']     = isset( $input['cue'] ) ? sanitize_text_field( $input['cue'] ) : $d['cue'];

		$out['bg_color']   = ( isset( $input['bg_color'] ) && sanitize_hex_color( $input['bg_color'] ) ) ? sanitize_hex_color( $input['bg_color'] ) : $d['bg_color'];
		$out['gold']       = ( isset( $input['gold'] ) && sanitize_hex_color( $input['gold'] ) ) ? sanitize_hex_color( $input['gold'] ) : $d['gold'];
		$out['gold_hi']    = ( isset( $input['gold_hi'] ) && sanitize_hex_color( $input['gold_hi'] ) ) ? sanitize_hex_color( $input['gold_hi'] ) : $d['gold_hi'];
		$out['text_color'] = ( isset( $input['text_color'] ) && sanitize_hex_color( $input['text_color'] ) ) ? sanitize_hex_color( $input['text_color'] ) : $d['text_color'];

		$out['max_wait'] = isset( $input['max_wait'] ) ? min( 20000, max( 500, absint( $input['max_wait'] ) ) ) : $d['max_wait'];
		$out['min_show'] = isset( $input['min_show'] ) ? min( 10000, max( 0, absint( $input['min_show'] ) ) ) : $d['min_show'];

		return $out;
	}

	public function render_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$o   = thp_get_options();
		$opt = TENDERNISM_PRELOADER_OPTION;
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Tendernism Preloader', 'tendernism-preloader' ); ?></h1>
			<p class="description"><?php esc_html_e( 'A branded full-screen loading screen shown on page load, removed once the page is ready. Standalone — works on any theme.', 'tendernism-preloader' ); ?></p>
			<form method="post" action="options.php">
				<?php settings_fields( 'thp_group' ); ?>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><?php esc_html_e( 'Enable preloader', 'tendernism-preloader' ); ?></th>
						<td><label><input type="checkbox" name="<?php echo esc_attr( $opt ); ?>[enabled]" value="1" <?php checked( $o['enabled'], 1 ); ?>> <?php esc_html_e( 'Show the preloader on the front end', 'tendernism-preloader' ); ?></label></td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Where to show', 'tendernism-preloader' ); ?></th>
						<td>
							<label><input type="radio" name="<?php echo esc_attr( $opt ); ?>[scope]" value="all" <?php checked( $o['scope'], 'all' ); ?>> <?php esc_html_e( 'Every page', 'tendernism-preloader' ); ?></label><br>
							<label><input type="radio" name="<?php echo esc_attr( $opt ); ?>[scope]" value="home" <?php checked( $o['scope'], 'home' ); ?>> <?php esc_html_e( 'Homepage only', 'tendernism-preloader' ); ?></label>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Show once per visit', 'tendernism-preloader' ); ?></th>
						<td><label><input type="checkbox" name="<?php echo esc_attr( $opt ); ?>[once_per_session]" value="1" <?php checked( $o['once_per_session'], 1 ); ?>> <?php esc_html_e( 'After the first load, skip it for the rest of the browser session', 'tendernism-preloader' ); ?></label></td>
					</tr>

					<tr><th scope="row"><?php esc_html_e( 'Title / wordmark', 'tendernism-preloader' ); ?></th>
						<td><input type="text" class="regular-text" name="<?php echo esc_attr( $opt ); ?>[title]" value="<?php echo esc_attr( $o['title'] ); ?>"></td></tr>
					<tr><th scope="row"><?php esc_html_e( 'Tagline', 'tendernism-preloader' ); ?></th>
						<td><input type="text" class="regular-text" name="<?php echo esc_attr( $opt ); ?>[tagline]" value="<?php echo esc_attr( $o['tagline'] ); ?>"></td></tr>
					<tr><th scope="row"><?php esc_html_e( 'Small loading label', 'tendernism-preloader' ); ?></th>
						<td><input type="text" class="regular-text" name="<?php echo esc_attr( $opt ); ?>[cue]" value="<?php echo esc_attr( $o['cue'] ); ?>"></td></tr>

					<tr><th scope="row"><?php esc_html_e( 'Crown', 'tendernism-preloader' ); ?></th>
						<td><label><input type="checkbox" name="<?php echo esc_attr( $opt ); ?>[show_crown]" value="1" <?php checked( $o['show_crown'], 1 ); ?>> <?php esc_html_e( 'Show the line-drawn crown', 'tendernism-preloader' ); ?></label></td></tr>

					<tr><th scope="row"><?php esc_html_e( 'Loader style', 'tendernism-preloader' ); ?></th>
						<td>
							<select name="<?php echo esc_attr( $opt ); ?>[spinner]">
								<option value="bar" <?php selected( $o['spinner'], 'bar' ); ?>><?php esc_html_e( 'Gold sweeping bar', 'tendernism-preloader' ); ?></option>
								<option value="ring" <?php selected( $o['spinner'], 'ring' ); ?>><?php esc_html_e( 'Spinning ring', 'tendernism-preloader' ); ?></option>
								<option value="pulse" <?php selected( $o['spinner'], 'pulse' ); ?>><?php esc_html_e( 'Pulsing dots', 'tendernism-preloader' ); ?></option>
							</select>
						</td></tr>

					<tr><th scope="row"><?php esc_html_e( 'Background colour', 'tendernism-preloader' ); ?></th>
						<td><input type="text" name="<?php echo esc_attr( $opt ); ?>[bg_color]" value="<?php echo esc_attr( $o['bg_color'] ); ?>" placeholder="#0e0b09"> <span class="description"><?php esc_html_e( 'Hex, e.g. #0e0b09', 'tendernism-preloader' ); ?></span></td></tr>
					<tr><th scope="row"><?php esc_html_e( 'Gold', 'tendernism-preloader' ); ?></th>
						<td><input type="text" name="<?php echo esc_attr( $opt ); ?>[gold]" value="<?php echo esc_attr( $o['gold'] ); ?>" placeholder="#d4a018"></td></tr>
					<tr><th scope="row"><?php esc_html_e( 'Gold highlight', 'tendernism-preloader' ); ?></th>
						<td><input type="text" name="<?php echo esc_attr( $opt ); ?>[gold_hi]" value="<?php echo esc_attr( $o['gold_hi'] ); ?>" placeholder="#f0c95a"></td></tr>
					<tr><th scope="row"><?php esc_html_e( 'Text colour', 'tendernism-preloader' ); ?></th>
						<td><input type="text" name="<?php echo esc_attr( $opt ); ?>[text_color]" value="<?php echo esc_attr( $o['text_color'] ); ?>" placeholder="#f2efe9"></td></tr>

					<tr><th scope="row"><?php esc_html_e( 'Maximum wait (ms)', 'tendernism-preloader' ); ?></th>
						<td><input type="number" min="500" max="20000" step="100" name="<?php echo esc_attr( $opt ); ?>[max_wait]" value="<?php echo esc_attr( $o['max_wait'] ); ?>"> <span class="description"><?php esc_html_e( 'Hard cap — the preloader is removed after this long even if the page has not finished loading.', 'tendernism-preloader' ); ?></span></td></tr>
					<tr><th scope="row"><?php esc_html_e( 'Minimum on screen (ms)', 'tendernism-preloader' ); ?></th>
						<td><input type="number" min="0" max="10000" step="100" name="<?php echo esc_attr( $opt ); ?>[min_show]" value="<?php echo esc_attr( $o['min_show'] ); ?>"> <span class="description"><?php esc_html_e( 'Keep the brand on screen at least this long so it never just flashes.', 'tendernism-preloader' ); ?></span></td></tr>
				</table>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}
}
