<?php
/**
 * Cinematic Hero — the Elementor widget.
 *
 * Exposes every creative lever (scenes, copy, video URLs, timings, colours,
 * ambient audio) as native Elementor controls, so the whole hero is editable
 * from the panel with no code. render() prints semantic markup + data-* config;
 * all motion is driven by assets/js/cinematic-hero.js.
 *
 * @package Tendernism_Hero
 */

namespace Tendernism_Hero\Widgets;

use Elementor\Widget_Base;
use Elementor\Controls_Manager;
use Elementor\Repeater;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Cinematic_Hero_Widget extends Widget_Base {

	public function get_name() {
		return 'tendernism_cinematic_hero';
	}

	public function get_title() {
		return esc_html__( 'Cinematic Hero', 'tendernism-hero' );
	}

	public function get_icon() {
		return 'eicon-play';
	}

	public function get_categories() {
		return array( 'tendernism' );
	}

	public function get_keywords() {
		return array( 'hero', 'cinematic', 'video', 'scroll', 'tendernism' );
	}

	/**
	 * Scripts this widget needs. Declaring them here lets Elementor enqueue the
	 * engine + GSAP/ScrollTrigger/Lenis only on pages that use the widget.
	 */
	public function get_script_depends() {
		return array( 'tendernism-hero' );
	}

	/**
	 * Styles this widget needs. The optional brand fonts are enqueued
	 * conditionally in render() so a theme that already has them isn't doubled.
	 */
	public function get_style_depends() {
		return array( 'tendernism-hero' );
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Controls
	// ─────────────────────────────────────────────────────────────────────────
	protected function register_controls() {
		$this->register_scenes_section();
		$this->register_motion_section();
		$this->register_audio_section();
		$this->register_chrome_section();
		$this->register_style_section();
	}

	/**
	 * The scenes repeater — the editable "beats" of the film.
	 */
	private function register_scenes_section() {
		$this->start_controls_section(
			'section_scenes',
			array(
				'label' => esc_html__( 'Scenes', 'tendernism-hero' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			)
		);

		$repeater = new Repeater();

		$repeater->add_control(
			'video_desktop',
			array(
				'label'       => esc_html__( 'Desktop video URL (16:9)', 'tendernism-hero' ),
				'type'        => Controls_Manager::TEXT,
				'dynamic'     => array( 'active' => true ),
				'placeholder' => 'https://…/clip.mp4',
				'label_block' => true,
				'description' => esc_html__( 'Direct .mp4 URL (e.g. the Higgsfield CDN link). Streams as-is.', 'tendernism-hero' ),
			)
		);

		$repeater->add_control(
			'video_mobile',
			array(
				'label'       => esc_html__( 'Mobile video URL (9:16)', 'tendernism-hero' ),
				'type'        => Controls_Manager::TEXT,
				'dynamic'     => array( 'active' => true ),
				'placeholder' => 'https://…/clip-portrait.mp4',
				'label_block' => true,
				'description' => esc_html__( 'Optional. Portrait reframe shown on phones (≤640px). Falls back to the desktop clip if empty.', 'tendernism-hero' ),
			)
		);

		$repeater->add_control(
			'align',
			array(
				'label'   => esc_html__( 'Copy alignment', 'tendernism-hero' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'center',
				'options' => array(
					'center' => esc_html__( 'Center', 'tendernism-hero' ),
					'start'  => esc_html__( 'Left', 'tendernism-hero' ),
					'end'    => esc_html__( 'Right', 'tendernism-hero' ),
				),
			)
		);

		$repeater->add_control(
			'variant',
			array(
				'label'       => esc_html__( 'Style variant', 'tendernism-hero' ),
				'type'        => Controls_Manager::SELECT,
				'default'     => '',
				'options'     => array(
					''       => esc_html__( 'Default', 'tendernism-hero' ),
					'finale' => esc_html__( 'Finale (wordmark + gold tagline + CTA)', 'tendernism-hero' ),
					'name'   => esc_html__( 'Name', 'tendernism-hero' ),
					'quote'  => esc_html__( 'Quote', 'tendernism-hero' ),
				),
				'description' => esc_html__( 'The finale renders the only H1 on the page and holds on screen (no fade-out).', 'tendernism-hero' ),
			)
		);

		$repeater->add_control(
			'eyebrow',
			array(
				'label'   => esc_html__( 'Eyebrow', 'tendernism-hero' ),
				'type'    => Controls_Manager::TEXT,
				'dynamic' => array( 'active' => true ),
			)
		);

		$repeater->add_control(
			'headline',
			array(
				'label'       => esc_html__( 'Headline', 'tendernism-hero' ),
				'type'        => Controls_Manager::TEXTAREA,
				'dynamic'     => array( 'active' => true ),
				'rows'        => 3,
				'description' => esc_html__( 'One line per row. Leave a blank row for a deliberate beat of silence between phrases.', 'tendernism-hero' ),
			)
		);

		$repeater->add_control(
			'subtitle',
			array(
				'label'   => esc_html__( 'Subtitle', 'tendernism-hero' ),
				'type'    => Controls_Manager::TEXT,
				'dynamic' => array( 'active' => true ),
			)
		);

		$repeater->add_control(
			'cta_text',
			array(
				'label'   => esc_html__( 'Button text', 'tendernism-hero' ),
				'type'    => Controls_Manager::TEXT,
				'dynamic' => array( 'active' => true ),
			)
		);

		$repeater->add_control(
			'cta_link',
			array(
				'label'       => esc_html__( 'Button link', 'tendernism-hero' ),
				'type'        => Controls_Manager::URL,
				'dynamic'     => array( 'active' => true ),
				'placeholder' => 'https://…',
				'default'     => array( 'url' => '#story' ),
			)
		);

		$repeater->add_control(
			'chapter',
			array(
				'label'   => esc_html__( 'Chapter mark', 'tendernism-hero' ),
				'type'    => Controls_Manager::TEXT,
				'default' => '',
				'description' => esc_html__( 'Small caption, e.g. “I”. Paired with the label below.', 'tendernism-hero' ),
			)
		);

		$repeater->add_control(
			'label',
			array(
				'label'   => esc_html__( 'Chapter label', 'tendernism-hero' ),
				'type'    => Controls_Manager::TEXT,
				'default' => '',
			)
		);

		$repeater->add_control(
			'reveal_at',
			array(
				'label'       => esc_html__( 'Copy reveal point', 'tendernism-hero' ),
				'type'        => Controls_Manager::SLIDER,
				'size_units'  => array( '%' ),
				'range'       => array( '%' => array( 'min' => 0, 'max' => 100, 'step' => 2 ) ),
				'default'     => array( 'unit' => '%', 'size' => 40 ),
				'description' => esc_html__( 'How far into the scene the words rise in. Later = the footage establishes first.', 'tendernism-hero' ),
			)
		);

		$this->add_control(
			'scenes',
			array(
				'label'       => esc_html__( 'Scenes', 'tendernism-hero' ),
				'type'        => Controls_Manager::REPEATER,
				'fields'      => $repeater->get_controls(),
				'title_field' => '{{{ chapter }}} · {{{ label }}}',
				'default'     => $this->default_scenes(),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Global motion / timing controls.
	 */
	private function register_motion_section() {
		$this->start_controls_section(
			'section_motion',
			array(
				'label' => esc_html__( 'Motion & timing', 'tendernism-hero' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			)
		);

		$this->add_control(
			'playback_rate',
			array(
				'label'      => esc_html__( 'Playback speed', 'tendernism-hero' ),
				'type'       => Controls_Manager::SLIDER,
				'range'      => array( 'px' => array( 'min' => 0.5, 'max' => 2, 'step' => 0.05 ) ),
				'default'    => array( 'size' => 1.3 ),
				'description' => esc_html__( 'How fast each clip plays vs. real time. 1 = normal.', 'tendernism-hero' ),
			)
		);

		$this->add_control(
			'scroll_per_scene',
			array(
				'label'      => esc_html__( 'Scroll length per scene', 'tendernism-hero' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'vh' ),
				'range'      => array( 'vh' => array( 'min' => 30, 'max' => 150, 'step' => 5 ) ),
				'default'    => array( 'unit' => 'vh', 'size' => 50 ),
				'description' => esc_html__( 'How much scrolling each scene occupies. Lower = the hero passes quicker.', 'tendernism-hero' ),
			)
		);

		$this->add_control(
			'crossfade',
			array(
				'label'      => esc_html__( 'Crossfade amount', 'tendernism-hero' ),
				'type'       => Controls_Manager::SLIDER,
				'range'      => array( 'px' => array( 'min' => 0.1, 'max' => 1, 'step' => 0.02 ) ),
				'default'    => array( 'size' => 0.66 ),
				'description' => esc_html__( 'How wide the dissolve between clips is (in scene units).', 'tendernism-hero' ),
			)
		);

		$this->add_control(
			'tail_loop',
			array(
				'label'      => esc_html__( 'Idle tail-loop (seconds)', 'tendernism-hero' ),
				'type'       => Controls_Manager::SLIDER,
				'range'      => array( 'px' => array( 'min' => 0, 'max' => 4, 'step' => 0.1 ) ),
				'default'    => array( 'size' => 1.2 ),
				'description' => esc_html__( 'When a clip finishes while its scene is still on screen, the last few seconds gently loop so it never freezes. 0 disables.', 'tendernism-hero' ),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Ambient audio controls.
	 */
	private function register_audio_section() {
		$this->start_controls_section(
			'section_audio',
			array(
				'label' => esc_html__( 'Ambient sound', 'tendernism-hero' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			)
		);

		$this->add_control(
			'enable_sound',
			array(
				'label'        => esc_html__( 'Show sound toggle', 'tendernism-hero' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => 'yes',
				'return_value' => 'yes',
			)
		);

		$this->add_control(
			'ambient_url',
			array(
				'label'       => esc_html__( 'Ambient loop URL', 'tendernism-hero' ),
				'type'        => Controls_Manager::TEXT,
				'dynamic'     => array( 'active' => true ),
				'label_block' => true,
				'placeholder' => 'https://…/ambience.mp3',
				'condition'   => array( 'enable_sound' => 'yes' ),
				'description' => esc_html__( 'A seamless loop (fire crackle / room tone) that plays under the whole hero. The toggle self-hides until the file is playable.', 'tendernism-hero' ),
			)
		);

		$this->add_control(
			'ambient_volume',
			array(
				'label'     => esc_html__( 'Volume', 'tendernism-hero' ),
				'type'      => Controls_Manager::SLIDER,
				'range'     => array( 'px' => array( 'min' => 0, 'max' => 1, 'step' => 0.05 ) ),
				'default'   => array( 'size' => 0.5 ),
				'condition' => array( 'enable_sound' => 'yes' ),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * On-screen chrome (scroll cue, film frame, fonts).
	 */
	private function register_chrome_section() {
		$this->start_controls_section(
			'section_chrome',
			array(
				'label' => esc_html__( 'Chrome & fonts', 'tendernism-hero' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			)
		);

		$this->add_control(
			'show_scroll_cue',
			array(
				'label'        => esc_html__( 'Show scroll cue', 'tendernism-hero' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => 'yes',
				'return_value' => 'yes',
			)
		);

		$this->add_control(
			'scroll_cue_label',
			array(
				'label'     => esc_html__( 'Scroll cue text', 'tendernism-hero' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => esc_html__( 'Scroll', 'tendernism-hero' ),
				'condition' => array( 'show_scroll_cue' => 'yes' ),
			)
		);

		$this->add_control(
			'show_frame',
			array(
				'label'        => esc_html__( 'Show film frame', 'tendernism-hero' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => 'yes',
				'return_value' => 'yes',
			)
		);

		$this->add_control(
			'load_fonts',
			array(
				'label'        => esc_html__( 'Load brand fonts', 'tendernism-hero' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => 'yes',
				'return_value' => 'yes',
				'description'  => esc_html__( 'Loads Bebas Neue, Space Grotesk & Great Vibes from Google Fonts. Turn off if your theme already provides them.', 'tendernism-hero' ),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Colour tokens — exposed so the hero can be re-themed visually. Each maps to
	 * a CSS custom property printed on the widget wrapper.
	 */
	private function register_style_section() {
		$this->start_controls_section(
			'section_colors',
			array(
				'label' => esc_html__( 'Colours', 'tendernism-hero' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);

		$colors = array(
			'color_ink'      => array( esc_html__( 'Background (near-black)', 'tendernism-hero' ), '#0e0b09', '--th-ink' ),
			'color_headline' => array( esc_html__( 'Headline', 'tendernism-hero' ), '#ededea', '--th-headline' ),
			'color_cream'    => array( esc_html__( 'Body / light text', 'tendernism-hero' ), '#f2efe9', '--th-cream' ),
			'color_ash'      => array( esc_html__( 'Muted text', 'tendernism-hero' ), '#c3bcae', '--th-ash' ),
			'color_gold'     => array( esc_html__( 'Gold', 'tendernism-hero' ), '#d4a018', '--th-gold' ),
			'color_gold_hi'  => array( esc_html__( 'Gold highlight', 'tendernism-hero' ), '#f0c95a', '--th-gold-hi' ),
			'color_gold_lo'  => array( esc_html__( 'Gold deep', 'tendernism-hero' ), '#a87c12', '--th-gold-lo' ),
		);

		foreach ( $colors as $key => $meta ) {
			list( $label, $default, $var ) = $meta;
			$this->add_control(
				$key,
				array(
					'label'     => $label,
					'type'      => Controls_Manager::COLOR,
					'default'   => $default,
					'selectors' => array(
						'{{WRAPPER}} .th-hero' => $var . ': {{VALUE}};',
					),
				)
			);
		}

		$this->end_controls_section();
	}

	/**
	 * Seed content matching the approved two-beat cut, so a freshly dropped
	 * widget already shows the real hero (editors then tweak in place).
	 *
	 * @return array
	 */
	private function default_scenes() {
		$cdn = 'https://d8j0ntlcm91z4.cloudfront.net/user_3GdMpDQKnvNT4cwozQAEb1LsUI2';
		return array(
			array(
				'chapter'       => 'I',
				'label'         => esc_html__( 'The Smoker', 'tendernism-hero' ),
				'video_desktop' => $cdn . '/hf_20260806_162553_768d6c90-a6fb-4ec3-afaa-60b0217f661a.mp4',
				'video_mobile'  => $cdn . '/hf_20260806_190604_e2f24175-e5c0-4d68-8649-8b949ac84823.mp4',
				'align'         => 'center',
				'variant'       => '',
				'headline'      => "Some things\ncan’t be rushed.",
				'reveal_at'     => array( 'unit' => '%', 'size' => 52 ),
			),
			array(
				'chapter'       => 'II',
				'label'         => esc_html__( 'The Pitmaster', 'tendernism-hero' ),
				'video_desktop' => $cdn . '/hf_20260806_160825_722e6fa6-12c8-4c3d-b745-632bdefdf6ed.mp4',
				'video_mobile'  => $cdn . '/hf_20260806_190620_7340e685-6aeb-4585-89a8-7a2574c13551.mp4',
				'align'         => 'center',
				'variant'       => 'finale',
				'eyebrow'       => esc_html__( 'Come hungry', 'tendernism-hero' ),
				'headline'      => 'Mr. Tendernism',
				'subtitle'      => esc_html__( 'Good Energy. Real Moments. Good Food.', 'tendernism-hero' ),
				'cta_text'      => esc_html__( 'Book Mr. Tendernism', 'tendernism-hero' ),
				'cta_link'      => array( 'url' => '#story' ),
				'reveal_at'     => array( 'unit' => '%', 'size' => 42 ),
			),
		);
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Render
	// ─────────────────────────────────────────────────────────────────────────
	protected function render() {
		$settings = $this->get_settings_for_display();
		$scenes   = isset( $settings['scenes'] ) && is_array( $settings['scenes'] ) ? $settings['scenes'] : array();

		if ( empty( $scenes ) ) {
			return;
		}

		// Conditionally load the brand fonts.
		if ( isset( $settings['load_fonts'] ) && 'yes' === $settings['load_fonts'] ) {
			wp_enqueue_style( 'tendernism-hero-fonts' );
		}

		$uid = 'th-hero-' . $this->get_id();

		// Global config → data-* on the root (read by the JS engine).
		$playback   = $this->num( $settings, 'playback_rate', 1.3 );
		$per_scene  = $this->num( $settings, 'scroll_per_scene', 50 ) / 100; // vh% → multiple of viewport
		$crossfade  = $this->num( $settings, 'crossfade', 0.66 );
		$tail_loop  = $this->num( $settings, 'tail_loop', 1.2 );

		$ambient_on  = isset( $settings['enable_sound'] ) && 'yes' === $settings['enable_sound'];
		$ambient_url = $ambient_on && ! empty( $settings['ambient_url'] ) ? $settings['ambient_url'] : '';
		$ambient_vol = $this->num( $settings, 'ambient_volume', 0.5 );

		$show_cue   = ! isset( $settings['show_scroll_cue'] ) || 'yes' === $settings['show_scroll_cue'];
		$show_frame = ! isset( $settings['show_frame'] ) || 'yes' === $settings['show_frame'];
		$cue_label  = isset( $settings['scroll_cue_label'] ) && '' !== $settings['scroll_cue_label']
			? $settings['scroll_cue_label']
			: esc_html__( 'Scroll', 'tendernism-hero' );
		?>
		<section
			id="<?php echo esc_attr( $uid ); ?>"
			class="th-hero"
			aria-label="<?php esc_attr_e( 'Cinematic introduction', 'tendernism-hero' ); ?>"
			data-th-hero
			data-playback="<?php echo esc_attr( $playback ); ?>"
			data-scroll-per-scene="<?php echo esc_attr( $per_scene ); ?>"
			data-crossfade="<?php echo esc_attr( $crossfade ); ?>"
			data-tail-loop="<?php echo esc_attr( $tail_loop ); ?>"
		>
			<div class="th-hero__stage" data-th-stage>

				<div class="th-hero__videos">
					<?php foreach ( $scenes as $i => $scene ) : ?>
						<video
							class="th-hero__video"
							data-th-video
							data-video-desktop="<?php echo esc_url( $this->scene_video( $scene, 'video_desktop' ) ); ?>"
							data-video-mobile="<?php echo esc_url( $this->scene_video( $scene, 'video_mobile' ) ); ?>"
							muted
							playsinline
							preload="<?php echo 0 === $i ? 'auto' : 'none'; ?>"
							aria-hidden="true"
						></video>
					<?php endforeach; ?>
				</div>

				<?php // Continuity overlays — constant across every scene. ?>
				<div class="th-hero__tone" aria-hidden="true"></div>
				<div class="th-hero__haze" aria-hidden="true"></div>
				<div class="th-hero__grade" aria-hidden="true"></div>
				<div class="th-hero__grain" aria-hidden="true"></div>

				<div class="th-hero__scenes">
					<?php
					foreach ( $scenes as $i => $scene ) {
						$reveal = isset( $scene['reveal_at']['size'] ) ? floatval( $scene['reveal_at']['size'] ) / 100 : 0.26;
						printf(
							'<div class="th-hero__scene" data-th-scene="%1$d" data-reveal="%2$s">',
							(int) $i,
							esc_attr( $reveal )
						);
						$this->render_scene_copy( $scene );
						echo '</div>';
					}
					?>
				</div>

				<?php if ( $show_frame ) : ?>
					<div class="th-hero__frame" aria-hidden="true"></div>
				<?php endif; ?>

				<?php if ( $show_cue ) : ?>
					<div class="th-hero__cue" aria-hidden="true">
						<span class="th-hero__cue-label"><?php echo esc_html( $cue_label ); ?></span>
						<span class="th-hero__cue-line"></span>
					</div>
				<?php endif; ?>

				<?php if ( '' !== $ambient_url ) : ?>
					<button
						type="button"
						class="th-hero__sound"
						data-th-sound
						aria-pressed="false"
						aria-label="<?php esc_attr_e( 'Play ambient sound', 'tendernism-hero' ); ?>"
					>
						<span class="th-hero__sound-bars" aria-hidden="true"><span></span><span></span><span></span><span></span></span>
						<span class="th-hero__sound-label"><?php esc_html_e( 'Sound', 'tendernism-hero' ); ?></span>
					</button>
					<audio
						data-th-ambient
						src="<?php echo esc_url( $ambient_url ); ?>"
						data-volume="<?php echo esc_attr( $ambient_vol ); ?>"
						loop
						preload="auto"
						playsinline
					></audio>
				<?php endif; ?>

			</div>
		</section>
		<?php
	}

	/**
	 * Render one scene's editorial copy (mirrors the React SceneCopy component).
	 *
	 * @param array $scene
	 */
	private function render_scene_copy( $scene ) {
		$align   = ! empty( $scene['align'] ) ? $scene['align'] : 'center';
		$variant = ! empty( $scene['variant'] ) ? $scene['variant'] : '';
		$is_finale = 'finale' === $variant;
		$is_name   = 'name' === $variant;

		$classes = 'th-scene-copy th-scene-copy--' . sanitize_html_class( $align );
		if ( '' !== $variant ) {
			$classes .= ' th-scene-copy--' . sanitize_html_class( $variant );
		}

		echo '<div class="' . esc_attr( $classes ) . '">';

		// Finale crown (line-drawn logo callback).
		if ( $is_finale ) {
			echo '<svg class="th-scene-copy__crown" viewBox="0 0 120 74" data-th-crown data-th-text aria-hidden="true">'
				. '<path d="M8 66 L20 22 L42 50 L60 12 L78 50 L100 22 L112 66 Z"></path>'
				. '<path d="M8 66 L112 66"></path>'
				. '</svg>';
		}

		if ( ! empty( $scene['eyebrow'] ) ) {
			echo '<span class="th-scene-copy__eyebrow" data-th-text>' . esc_html( $scene['eyebrow'] ) . '</span>';
		}

		if ( 'quote' === $variant ) {
			echo '<span class="th-scene-copy__quote-mark" data-th-text aria-hidden="true">&#8220;</span>';
		}

		// Headline lines (one per row; blank rows = a beat of silence).
		$lines = $this->headline_lines( isset( $scene['headline'] ) ? $scene['headline'] : '' );
		if ( ! empty( $lines ) ) {
			$tag = $is_finale ? 'h1' : 'h2';
			$title_class = 'th-scene-copy__title';
			if ( $is_name ) {
				$title_class .= ' th-scene-copy__title--name';
			}
			if ( $is_finale ) {
				$title_class .= ' th-scene-copy__title--finale';
			}
			echo '<' . esc_html( $tag ) . ' class="' . esc_attr( $title_class ) . '">';
			foreach ( $lines as $line ) {
				if ( '' === $line ) {
					echo '<span class="th-scene-copy__gap" aria-hidden="true" data-th-text></span>';
				} else {
					echo '<span class="th-scene-copy__line" data-th-text>' . esc_html( $line ) . '</span>';
				}
			}
			echo '</' . esc_html( $tag ) . '>';
		}

		if ( ! empty( $scene['subtitle'] ) ) {
			echo '<p class="th-scene-copy__subtitle" data-th-text>' . esc_html( $scene['subtitle'] ) . '</p>';
		}

		if ( ! empty( $scene['cta_text'] ) ) {
			$href   = isset( $scene['cta_link']['url'] ) && '' !== $scene['cta_link']['url'] ? $scene['cta_link']['url'] : '#';
			$target = ! empty( $scene['cta_link']['is_external'] ) ? ' target="_blank"' : '';
			$rel    = ! empty( $scene['cta_link']['nofollow'] ) ? ' rel="nofollow"' : '';
			echo '<div class="th-scene-copy__cta-wrap" data-th-text>';
			echo '<a class="th-scene-copy__cta" href="' . esc_url( $href ) . '"' . $target . $rel . '>'
				. esc_html( $scene['cta_text'] )
				. '<span class="th-scene-copy__cta-line" aria-hidden="true">↗</span>'
				. '</a>';
			echo '</div>';
		}

		if ( ! empty( $scene['chapter'] ) || ! empty( $scene['label'] ) ) {
			$mark = trim( ( isset( $scene['chapter'] ) ? $scene['chapter'] : '' ) . ' · ' . ( isset( $scene['label'] ) ? $scene['label'] : '' ), ' ·' );
			echo '<span class="th-scene-copy__chapter" aria-hidden="true" data-th-text>' . esc_html( $mark ) . '</span>';
		}

		echo '</div>';
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Helpers
	// ─────────────────────────────────────────────────────────────────────────

	/**
	 * Split a headline textarea into trimmed lines, preserving intentional blank
	 * rows (which become a "gap" beat).
	 *
	 * @param string $raw
	 * @return string[]
	 */
	private function headline_lines( $raw ) {
		if ( '' === trim( (string) $raw ) ) {
			return array();
		}
		$lines = preg_split( '/\r\n|\r|\n/', (string) $raw );
		return array_map( 'trim', $lines );
	}

	/**
	 * Resolve a scene video URL, tolerating either a plain string or an
	 * Elementor media array.
	 *
	 * @param array  $scene
	 * @param string $key
	 * @return string
	 */
	private function scene_video( $scene, $key ) {
		if ( empty( $scene[ $key ] ) ) {
			return '';
		}
		$val = $scene[ $key ];
		if ( is_array( $val ) ) {
			return isset( $val['url'] ) ? $val['url'] : '';
		}
		return (string) $val;
	}

	/**
	 * Read a numeric control value (handles slider arrays and plain numbers).
	 *
	 * @param array  $settings
	 * @param string $key
	 * @param float  $fallback
	 * @return float
	 */
	private function num( $settings, $key, $fallback ) {
		if ( ! isset( $settings[ $key ] ) ) {
			return $fallback;
		}
		$val = $settings[ $key ];
		if ( is_array( $val ) ) {
			$val = isset( $val['size'] ) ? $val['size'] : $fallback;
		}
		return is_numeric( $val ) ? (float) $val : $fallback;
	}
}
