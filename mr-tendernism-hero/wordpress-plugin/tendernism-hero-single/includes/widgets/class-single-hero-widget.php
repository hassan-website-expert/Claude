<?php
/**
 * Single Hero — the Elementor widget for the "one iconic moment" hero.
 *
 * ONE continuous documentary clip (no multi-scene scrubbing, no clip switching):
 * the action plays once, then either seamlessly loops its smoke-filled tail or
 * holds on the settled frame while a CSS smoke haze keeps rising. The headline +
 * CTA animate in on load over the same shot, and a gentle auto-scroll nudge can
 * hint at what's below once the clip finishes.
 *
 * Every creative lever (video URLs, copy, timings, nudge, colours, ambient audio)
 * is a native Elementor control, so the whole hero is editable from the panel
 * with no code. render() prints semantic markup + data-* config; all motion is
 * driven by assets/js/single-hero.js.
 *
 * @package Tendernism_Hero_Single
 */

namespace Tendernism_Hero_Single\Widgets;

use Elementor\Widget_Base;
use Elementor\Controls_Manager;
use Elementor\Group_Control_Typography;
use Elementor\Group_Control_Border;
use Elementor\Group_Control_Box_Shadow;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Single_Hero_Widget extends Widget_Base {

	public function get_name() {
		return 'tendernism_single_hero';
	}

	public function get_title() {
		return esc_html__( 'Single Hero', 'tendernism-hero-single' );
	}

	public function get_icon() {
		return 'eicon-video-camera';
	}

	public function get_categories() {
		return array( 'tendernism' );
	}

	public function get_keywords() {
		return array( 'hero', 'cinematic', 'video', 'single', 'loop', 'tendernism' );
	}

	/**
	 * Scripts this widget needs. Declaring them here lets Elementor enqueue the
	 * engine + GSAP/ScrollTrigger/Lenis only on pages that use the widget.
	 */
	public function get_script_depends() {
		return array( 'ths-hero' );
	}

	/**
	 * Styles this widget needs. The optional brand fonts are enqueued
	 * conditionally in render() so a theme that already has them isn't doubled.
	 */
	public function get_style_depends() {
		return array( 'ths-hero' );
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Controls
	// ─────────────────────────────────────────────────────────────────────────
	protected function register_controls() {
		$this->register_moment_section();
		$this->register_motion_section();
		$this->register_nudge_section();
		$this->register_audio_section();
		$this->register_chrome_section();
		// Style tab.
		$this->register_style_section();
		$this->register_headline_style_section();
		$this->register_eyebrow_style_section();
		$this->register_subtitle_style_section();
		$this->register_button_style_section();
		$this->register_crown_style_section();
	}

	/**
	 * "The Moment" — the single clip and the copy that rides over it.
	 */
	private function register_moment_section() {
		$cdn = 'https://d8j0ntlcm91z4.cloudfront.net/user_3GdMpDQKnvNT4cwozQAEb1LsUI2';

		$this->start_controls_section(
			'section_moment',
			array(
				'label' => esc_html__( 'The Moment', 'tendernism-hero-single' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			)
		);

		$this->add_control(
			'video_desktop',
			array(
				'label'       => esc_html__( 'Desktop video URL (16:9)', 'tendernism-hero-single' ),
				'type'        => Controls_Manager::TEXT,
				'dynamic'     => array( 'active' => true ),
				'placeholder' => 'https://…/clip.mp4',
				'label_block' => true,
				'default'     => $cdn . '/hf_20260807_113431_a7b7c8de-de25-4946-8874-fbca101e4c8c.mp4',
				'description' => esc_html__( 'Direct .mp4 URL (e.g. the Higgsfield CDN link). Streams as-is. Two stacked copies of THIS one clip drive the seamless loop.', 'tendernism-hero-single' ),
			)
		);

		$this->add_control(
			'video_mobile',
			array(
				'label'       => esc_html__( 'Mobile video URL (9:16)', 'tendernism-hero-single' ),
				'type'        => Controls_Manager::TEXT,
				'dynamic'     => array( 'active' => true ),
				'placeholder' => 'https://…/clip-portrait.mp4',
				'label_block' => true,
				'default'     => $cdn . '/hf_20260807_140743_87816a3f-70e9-4f0d-b4f9-61e986dff8c5.mp4',
				'description' => esc_html__( 'Optional. Portrait (9:16) reframe shown on phones (≤640px). Falls back to the desktop clip if empty.', 'tendernism-hero-single' ),
			)
		);

		$this->add_control(
			'poster_image',
			array(
				'label'       => esc_html__( 'Poster image (desktop)', 'tendernism-hero-single' ),
				'type'        => Controls_Manager::MEDIA,
				'dynamic'     => array( 'active' => true ),
				'description' => esc_html__( 'Optional still shown instantly while the desktop clip decodes — improves perceived load speed and prevents a black flash. Use a frame from the 16:9 clip.', 'tendernism-hero-single' ),
			)
		);

		$this->add_control(
			'poster_image_mobile',
			array(
				'label'       => esc_html__( 'Poster image (mobile)', 'tendernism-hero-single' ),
				'type'        => Controls_Manager::MEDIA,
				'dynamic'     => array( 'active' => true ),
				'description' => esc_html__( 'Optional portrait still shown on phones (≤640px) while the mobile clip decodes. Use a frame from the 9:16 clip. Falls back to the desktop poster if empty.', 'tendernism-hero-single' ),
			)
		);

		$this->add_control(
			'variant',
			array(
				'label'       => esc_html__( 'Style variant', 'tendernism-hero-single' ),
				'type'        => Controls_Manager::SELECT,
				'default'     => 'finale',
				'options'     => array(
					''       => esc_html__( 'Default', 'tendernism-hero-single' ),
					'finale' => esc_html__( 'Finale (crown + wordmark + gold tagline + CTA)', 'tendernism-hero-single' ),
					'name'   => esc_html__( 'Name', 'tendernism-hero-single' ),
					'quote'  => esc_html__( 'Quote', 'tendernism-hero-single' ),
				),
				'description' => esc_html__( 'The finale renders the page H1 and styles the tagline in gold. The crown icon is optional — see the switch below.', 'tendernism-hero-single' ),
			)
		);

		$this->add_control(
			'show_crown',
			array(
				'label'        => esc_html__( 'Show crown icon', 'tendernism-hero-single' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => '',
				'return_value' => 'yes',
				'label_on'     => esc_html__( 'On', 'tendernism-hero-single' ),
				'label_off'    => esc_html__( 'Off', 'tendernism-hero-single' ),
				'condition'    => array( 'variant' => 'finale' ),
				'description'  => esc_html__( 'The small line-drawn crown above the wordmark. Off by default.', 'tendernism-hero-single' ),
			)
		);

		$this->add_control(
			'align',
			array(
				'label'   => esc_html__( 'Copy alignment', 'tendernism-hero-single' ),
				'type'    => Controls_Manager::SELECT,
				'default' => 'center',
				'options' => array(
					'center' => esc_html__( 'Center', 'tendernism-hero-single' ),
					'start'  => esc_html__( 'Left', 'tendernism-hero-single' ),
					'end'    => esc_html__( 'Right', 'tendernism-hero-single' ),
				),
			)
		);

		$this->add_control(
			'eyebrow',
			array(
				'label'   => esc_html__( 'Eyebrow', 'tendernism-hero-single' ),
				'type'    => Controls_Manager::TEXT,
				'dynamic' => array( 'active' => true ),
				'default' => esc_html__( 'Come hungry', 'tendernism-hero-single' ),
			)
		);

		$this->add_control(
			'headline',
			array(
				'label'       => esc_html__( 'Headline', 'tendernism-hero-single' ),
				'type'        => Controls_Manager::TEXTAREA,
				'dynamic'     => array( 'active' => true ),
				'rows'        => 3,
				'default'     => 'Mr. Tendernism',
				'description' => esc_html__( 'One line per row. Leave a blank row for a deliberate beat between phrases.', 'tendernism-hero-single' ),
			)
		);

		$this->add_control(
			'subtitle',
			array(
				'label'   => esc_html__( 'Subtitle', 'tendernism-hero-single' ),
				'type'    => Controls_Manager::TEXT,
				'dynamic' => array( 'active' => true ),
				'default' => esc_html__( 'Good Energy. Real Moments. Good Food.', 'tendernism-hero-single' ),
			)
		);

		$this->add_control(
			'cta_text',
			array(
				'label'   => esc_html__( 'Button text', 'tendernism-hero-single' ),
				'type'    => Controls_Manager::TEXT,
				'dynamic' => array( 'active' => true ),
				'default' => esc_html__( 'Book Mr. Tendernism', 'tendernism-hero-single' ),
			)
		);

		$this->add_control(
			'cta_link',
			array(
				'label'       => esc_html__( 'Button link', 'tendernism-hero-single' ),
				'type'        => Controls_Manager::URL,
				'dynamic'     => array( 'active' => true ),
				'placeholder' => 'https://…',
				'default'     => array( 'url' => '#story' ),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Motion / timing controls for the single clip.
	 */
	private function register_motion_section() {
		$this->start_controls_section(
			'section_motion',
			array(
				'label' => esc_html__( 'Motion & timing', 'tendernism-hero-single' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			)
		);

		$this->add_control(
			'ambient_loop',
			array(
				'label'        => esc_html__( 'Seamless tail loop', 'tendernism-hero-single' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => '',
				'return_value' => 'yes',
				'label_on'     => esc_html__( 'Loop', 'tendernism-hero-single' ),
				'label_off'    => esc_html__( 'Hold', 'tendernism-hero-single' ),
				'description'  => esc_html__( 'On: the clip plays once, then its smoke-filled tail loops forever behind an invisible crossfade. Off: the clip plays once and holds on the final frame while the smoke haze keeps rising over it.', 'tendernism-hero-single' ),
			)
		);

		$this->add_control(
			'loop_tail',
			array(
				'label'       => esc_html__( 'Loop tail (seconds)', 'tendernism-hero-single' ),
				'type'        => Controls_Manager::SLIDER,
				'range'       => array( 'px' => array( 'min' => 0.5, 'max' => 4, 'step' => 0.1 ) ),
				'default'     => array( 'size' => 2 ),
				'condition'   => array( 'ambient_loop' => 'yes' ),
				'description' => esc_html__( 'Length of the clip\'s settled, smoke-filled end segment that loops.', 'tendernism-hero-single' ),
			)
		);

		$this->add_control(
			'crossfade',
			array(
				'label'       => esc_html__( 'Loop crossfade (seconds)', 'tendernism-hero-single' ),
				'type'        => Controls_Manager::SLIDER,
				'range'       => array( 'px' => array( 'min' => 0.2, 'max' => 1.5, 'step' => 0.05 ) ),
				'default'     => array( 'size' => 0.6 ),
				'condition'   => array( 'ambient_loop' => 'yes' ),
				'description' => esc_html__( 'The dissolve at the loop seam. It sits inside the drifting smoke, so it stays invisible.', 'tendernism-hero-single' ),
			)
		);

		$this->add_control(
			'copy_delay',
			array(
				'label'       => esc_html__( 'Copy reveal delay (seconds)', 'tendernism-hero-single' ),
				'type'        => Controls_Manager::SLIDER,
				'range'       => array( 'px' => array( 'min' => 0, 'max' => 4, 'step' => 0.1 ) ),
				'default'     => array( 'size' => 1.4 ),
				'description' => esc_html__( 'How long after the clip starts before the words rise in — after the lid opens, so the footage speaks first.', 'tendernism-hero-single' ),
			)
		);

		$this->add_control(
			'playback_rate',
			array(
				'label'       => esc_html__( 'Playback speed', 'tendernism-hero-single' ),
				'type'        => Controls_Manager::SLIDER,
				'range'       => array( 'px' => array( 'min' => 0.5, 'max' => 1.5, 'step' => 0.05 ) ),
				'default'     => array( 'size' => 1 ),
				'description' => esc_html__( 'How fast the clip plays vs. real time. 1 = normal (recommended — keeps the calm, documentary pace).', 'tendernism-hero-single' ),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Post-clip auto-scroll nudge controls.
	 */
	private function register_nudge_section() {
		$this->start_controls_section(
			'section_nudge',
			array(
				'label' => esc_html__( 'Auto-scroll nudge', 'tendernism-hero-single' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			)
		);

		$this->add_control(
			'nudge_enable',
			array(
				'label'        => esc_html__( 'Nudge after the clip', 'tendernism-hero-single' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => 'yes',
				'return_value' => 'yes',
				'description'  => esc_html__( 'A short beat after the clip settles, gently scroll the page down a touch to hint there\'s more below. Fires once, only if the visitor is still at the top, and any manual scroll cancels it.', 'tendernism-hero-single' ),
			)
		);

		$this->add_control(
			'nudge_delay',
			array(
				'label'      => esc_html__( 'Delay before nudge (seconds)', 'tendernism-hero-single' ),
				'type'       => Controls_Manager::SLIDER,
				'range'      => array( 'px' => array( 'min' => 0.5, 'max' => 8, 'step' => 0.5 ) ),
				'default'    => array( 'size' => 2.5 ),
				'condition'  => array( 'nudge_enable' => 'yes' ),
			)
		);

		$this->add_control(
			'nudge_distance',
			array(
				'label'       => esc_html__( 'Nudge distance', 'tendernism-hero-single' ),
				'type'        => Controls_Manager::SLIDER,
				'size_units'  => array( '%' ),
				'range'       => array( '%' => array( 'min' => 10, 'max' => 90, 'step' => 5 ) ),
				'default'     => array( 'unit' => '%', 'size' => 40 ),
				'condition'   => array( 'nudge_enable' => 'yes' ),
				'description' => esc_html__( 'How far down to glide, as a share of the viewport height.', 'tendernism-hero-single' ),
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
				'label' => esc_html__( 'Ambient sound', 'tendernism-hero-single' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			)
		);

		$this->add_control(
			'enable_sound',
			array(
				'label'        => esc_html__( 'Show sound toggle', 'tendernism-hero-single' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => 'yes',
				'return_value' => 'yes',
			)
		);

		$this->add_control(
			'ambient_url',
			array(
				'label'       => esc_html__( 'Ambient loop URL', 'tendernism-hero-single' ),
				'type'        => Controls_Manager::TEXT,
				'dynamic'     => array( 'active' => true ),
				'label_block' => true,
				'placeholder' => 'https://…/ambience.mp3',
				'condition'   => array( 'enable_sound' => 'yes' ),
				'description' => esc_html__( 'A seamless loop (fire crackle / room tone) that plays under the hero. The toggle self-hides until the file is playable.', 'tendernism-hero-single' ),
			)
		);

		$this->add_control(
			'ambient_volume',
			array(
				'label'     => esc_html__( 'Volume', 'tendernism-hero-single' ),
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
				'label' => esc_html__( 'Chrome & fonts', 'tendernism-hero-single' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			)
		);

		$this->add_control(
			'show_scroll_cue',
			array(
				'label'        => esc_html__( 'Show scroll cue', 'tendernism-hero-single' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => 'yes',
				'return_value' => 'yes',
			)
		);

		$this->add_control(
			'scroll_cue_label',
			array(
				'label'     => esc_html__( 'Scroll cue text', 'tendernism-hero-single' ),
				'type'      => Controls_Manager::TEXT,
				'default'   => esc_html__( 'Scroll', 'tendernism-hero-single' ),
				'condition' => array( 'show_scroll_cue' => 'yes' ),
			)
		);

		$this->add_control(
			'show_frame',
			array(
				'label'        => esc_html__( 'Show film frame', 'tendernism-hero-single' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => 'yes',
				'return_value' => 'yes',
			)
		);

		$this->add_control(
			'load_fonts',
			array(
				'label'        => esc_html__( 'Load brand fonts', 'tendernism-hero-single' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => 'yes',
				'return_value' => 'yes',
				'description'  => esc_html__( 'Loads Bebas Neue, Space Grotesk & Great Vibes from Google Fonts. Turn off if your theme already provides them.', 'tendernism-hero-single' ),
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
				'label' => esc_html__( 'Colours', 'tendernism-hero-single' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);

		$colors = array(
			'color_ink'      => array( esc_html__( 'Background (near-black)', 'tendernism-hero-single' ), '#0e0b09', '--ths-ink' ),
			'color_headline' => array( esc_html__( 'Headline', 'tendernism-hero-single' ), '#ededea', '--ths-headline' ),
			'color_cream'    => array( esc_html__( 'Body / light text', 'tendernism-hero-single' ), '#f2efe9', '--ths-cream' ),
			'color_ash'      => array( esc_html__( 'Muted text', 'tendernism-hero-single' ), '#c3bcae', '--ths-ash' ),
			'color_gold'     => array( esc_html__( 'Gold', 'tendernism-hero-single' ), '#d4a018', '--ths-gold' ),
			'color_gold_hi'  => array( esc_html__( 'Gold highlight', 'tendernism-hero-single' ), '#f0c95a', '--ths-gold-hi' ),
			'color_gold_lo'  => array( esc_html__( 'Gold deep', 'tendernism-hero-single' ), '#a87c12', '--ths-gold-lo' ),
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
						'{{WRAPPER}} .ths-hero' => $var . ': {{VALUE}};',
					),
				)
			);
		}

		$this->end_controls_section();
	}

	/**
	 * Headline typography + colour (fonts, size, weight, spacing, stroke).
	 */
	private function register_headline_style_section() {
		$this->start_controls_section(
			'section_style_headline',
			array(
				'label' => esc_html__( 'Headline', 'tendernism-hero-single' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			array(
				'name'     => 'headline_typography',
				'selector' => '{{WRAPPER}} .ths-scene-copy__title',
			)
		);

		$this->add_control(
			'headline_color',
			array(
				'label'     => esc_html__( 'Colour', 'tendernism-hero-single' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					'{{WRAPPER}} .ths-scene-copy__title' => 'color: {{VALUE}}; -webkit-text-stroke-color: {{VALUE}};',
				),
				'description' => esc_html__( 'Overrides the Headline colour from the Colours section.', 'tendernism-hero-single' ),
			)
		);

		$this->add_control(
			'headline_stroke',
			array(
				'label'      => esc_html__( 'Outline thickness', 'tendernism-hero-single' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px', 'em' ),
				'range'      => array(
					'px' => array( 'min' => 0, 'max' => 4, 'step' => 0.1 ),
					'em' => array( 'min' => 0, 'max' => 0.1, 'step' => 0.002 ),
				),
				'selectors'  => array(
					'{{WRAPPER}} .ths-scene-copy__title' => '-webkit-text-stroke-width: {{SIZE}}{{UNIT}};',
				),
				'description' => esc_html__( 'Set to 0 to remove the letter outline for a flatter look.', 'tendernism-hero-single' ),
			)
		);

		$this->add_group_control(
			\Elementor\Group_Control_Text_Shadow::get_type(),
			array(
				'name'     => 'headline_shadow',
				'selector' => '{{WRAPPER}} .ths-scene-copy__title',
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Eyebrow (the small kicker above the headline) typography + colour.
	 */
	private function register_eyebrow_style_section() {
		$this->start_controls_section(
			'section_style_eyebrow',
			array(
				'label' => esc_html__( 'Eyebrow', 'tendernism-hero-single' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			array(
				'name'     => 'eyebrow_typography',
				'selector' => '{{WRAPPER}} .ths-scene-copy__eyebrow',
			)
		);

		$this->add_control(
			'eyebrow_color',
			array(
				'label'     => esc_html__( 'Colour', 'tendernism-hero-single' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					'{{WRAPPER}} .ths-scene-copy__eyebrow' => 'color: {{VALUE}};',
				),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Subtitle / tagline typography + colour. The colour override also clears the
	 * finale gold-gradient text fill so a chosen colour actually shows.
	 */
	private function register_subtitle_style_section() {
		$this->start_controls_section(
			'section_style_subtitle',
			array(
				'label' => esc_html__( 'Subtitle', 'tendernism-hero-single' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			array(
				'name'     => 'subtitle_typography',
				'selector' => '{{WRAPPER}} .ths-scene-copy__subtitle',
			)
		);

		$this->add_control(
			'subtitle_color',
			array(
				'label'     => esc_html__( 'Colour', 'tendernism-hero-single' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					'{{WRAPPER}} .ths-scene-copy__subtitle' => 'color: {{VALUE}}; -webkit-text-fill-color: {{VALUE}}; background: none;',
				),
				'description' => esc_html__( 'On the Finale variant this replaces the gold-gradient tagline with a solid colour.', 'tendernism-hero-single' ),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Full button styling — typography, normal/hover colours, border, radius,
	 * padding, shadow. Mirrors Elementor's own Button widget controls.
	 */
	private function register_button_style_section() {
		$this->start_controls_section(
			'section_style_button',
			array(
				'label' => esc_html__( 'Button', 'tendernism-hero-single' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			array(
				'name'     => 'button_typography',
				'selector' => '{{WRAPPER}} .ths-scene-copy__cta',
			)
		);

		$this->start_controls_tabs( 'button_tabs' );

		$this->start_controls_tab(
			'button_tab_normal',
			array( 'label' => esc_html__( 'Normal', 'tendernism-hero-single' ) )
		);

		$this->add_control(
			'button_color',
			array(
				'label'     => esc_html__( 'Text colour', 'tendernism-hero-single' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					'{{WRAPPER}} .ths-scene-copy__cta' => 'color: {{VALUE}};',
				),
			)
		);

		$this->add_control(
			'button_bg',
			array(
				'label'     => esc_html__( 'Background', 'tendernism-hero-single' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					'{{WRAPPER}} .ths-scene-copy__cta' => 'background: {{VALUE}}; border-color: {{VALUE}};',
				),
			)
		);

		$this->end_controls_tab();

		$this->start_controls_tab(
			'button_tab_hover',
			array( 'label' => esc_html__( 'Hover', 'tendernism-hero-single' ) )
		);

		$this->add_control(
			'button_color_hover',
			array(
				'label'     => esc_html__( 'Text colour', 'tendernism-hero-single' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					'{{WRAPPER}} .ths-scene-copy__cta:hover, {{WRAPPER}} .ths-scene-copy__cta:focus' => 'color: {{VALUE}};',
				),
			)
		);

		$this->add_control(
			'button_bg_hover',
			array(
				'label'     => esc_html__( 'Background', 'tendernism-hero-single' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					'{{WRAPPER}} .ths-scene-copy__cta:hover, {{WRAPPER}} .ths-scene-copy__cta:focus' => 'background: {{VALUE}}; border-color: {{VALUE}};',
				),
			)
		);

		$this->end_controls_tab();
		$this->end_controls_tabs();

		$this->add_group_control(
			Group_Control_Border::get_type(),
			array(
				'name'      => 'button_border',
				'selector'  => '{{WRAPPER}} .ths-scene-copy__cta',
				'separator' => 'before',
			)
		);

		$this->add_control(
			'button_radius',
			array(
				'label'      => esc_html__( 'Border radius', 'tendernism-hero-single' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => array( 'px', '%', 'em' ),
				'selectors'  => array(
					'{{WRAPPER}} .ths-scene-copy__cta' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				),
			)
		);

		$this->add_control(
			'button_padding',
			array(
				'label'      => esc_html__( 'Padding', 'tendernism-hero-single' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => array( 'px', 'em', '%' ),
				'selectors'  => array(
					'{{WRAPPER}} .ths-scene-copy__cta' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				),
			)
		);

		$this->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			array(
				'name'     => 'button_shadow',
				'selector' => '{{WRAPPER}} .ths-scene-copy__cta',
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Crown icon styling (colour + size). Only meaningful when the crown is shown.
	 */
	private function register_crown_style_section() {
		$this->start_controls_section(
			'section_style_crown',
			array(
				'label'     => esc_html__( 'Crown icon', 'tendernism-hero-single' ),
				'tab'       => Controls_Manager::TAB_STYLE,
				'condition' => array(
					'variant'    => 'finale',
					'show_crown' => 'yes',
				),
			)
		);

		$this->add_control(
			'crown_color',
			array(
				'label'     => esc_html__( 'Colour', 'tendernism-hero-single' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					'{{WRAPPER}} .ths-scene-copy__crown path' => 'stroke: {{VALUE}};',
				),
			)
		);

		$this->add_control(
			'crown_size',
			array(
				'label'      => esc_html__( 'Size', 'tendernism-hero-single' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px', '%' ),
				'range'      => array(
					'px' => array( 'min' => 24, 'max' => 220, 'step' => 2 ),
				),
				'selectors'  => array(
					'{{WRAPPER}} .ths-scene-copy__crown' => 'width: {{SIZE}}{{UNIT}};',
				),
			)
		);

		$this->end_controls_section();
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Render
	// ─────────────────────────────────────────────────────────────────────────
	protected function render() {
		$settings = $this->get_settings_for_display();

		$src_desktop = $this->url_val( $settings, 'video_desktop' );
		$src_mobile  = $this->url_val( $settings, 'video_mobile' );

		if ( '' === $src_desktop && '' === $src_mobile ) {
			return; // Nothing to play.
		}
		if ( '' === $src_desktop ) {
			$src_desktop = $src_mobile;
		}

		// Conditionally load the brand fonts.
		if ( isset( $settings['load_fonts'] ) && 'yes' === $settings['load_fonts'] ) {
			wp_enqueue_style( 'ths-hero-fonts' );
		}

		$uid = 'ths-hero-' . $this->get_id();

		// Config → data-* on the root (read by the JS engine).
		$ambient_loop = isset( $settings['ambient_loop'] ) && 'yes' === $settings['ambient_loop'] ? 1 : 0;
		$loop_tail    = $this->num( $settings, 'loop_tail', 2.0 );
		$crossfade    = $this->num( $settings, 'crossfade', 0.6 );
		$copy_delay   = $this->num( $settings, 'copy_delay', 1.4 );
		$playback     = $this->num( $settings, 'playback_rate', 1.0 );

		$nudge_on   = ! isset( $settings['nudge_enable'] ) || 'yes' === $settings['nudge_enable'] ? 1 : 0;
		$nudge_ms   = (int) round( $this->num( $settings, 'nudge_delay', 2.5 ) * 1000 );
		$nudge_dist = $this->num( $settings, 'nudge_distance', 40 ) / 100; // % → fraction

		$ambient_on  = isset( $settings['enable_sound'] ) && 'yes' === $settings['enable_sound'];
		$ambient_url = $ambient_on && ! empty( $settings['ambient_url'] ) ? $settings['ambient_url'] : '';
		$ambient_vol = $this->num( $settings, 'ambient_volume', 0.5 );

		$show_cue   = ! isset( $settings['show_scroll_cue'] ) || 'yes' === $settings['show_scroll_cue'];
		$show_frame = ! isset( $settings['show_frame'] ) || 'yes' === $settings['show_frame'];
		$cue_label  = isset( $settings['scroll_cue_label'] ) && '' !== $settings['scroll_cue_label']
			? $settings['scroll_cue_label']
			: esc_html__( 'Scroll', 'tendernism-hero-single' );

		// Poster stills — shown instantly while the clip decodes (faster first
		// paint, no black flash). Separate desktop / mobile frames; the JS picks
		// the right one at the ≤640px breakpoint, same as the video source.
		$poster        = ! empty( $settings['poster_image']['url'] ) ? $settings['poster_image']['url'] : '';
		$poster_mobile = ! empty( $settings['poster_image_mobile']['url'] ) ? $settings['poster_image_mobile']['url'] : '';
		// No-JS fallback: prefer the desktop still, else the mobile one.
		$poster_fallback = '' !== $poster ? $poster : $poster_mobile;

		// Warm the TCP/TLS handshake to the video host before the <video> requests
		// it — shaves latency off the opening frame with no cost if unused.
		$origin = '';
		$parts  = wp_parse_url( $src_desktop );
		if ( ! empty( $parts['scheme'] ) && ! empty( $parts['host'] ) ) {
			$origin = $parts['scheme'] . '://' . $parts['host'];
		}
		if ( '' !== $origin ) {
			printf(
				'<link rel="preconnect" href="%1$s" crossorigin><link rel="dns-prefetch" href="%1$s">',
				esc_url( $origin )
			);
		}
		?>
		<section
			id="<?php echo esc_attr( $uid ); ?>"
			class="ths-hero"
			aria-label="<?php esc_attr_e( 'Cinematic introduction', 'tendernism-hero-single' ); ?>"
			data-ths-hero
			data-ambient-loop="<?php echo esc_attr( $ambient_loop ); ?>"
			data-loop-tail="<?php echo esc_attr( $loop_tail ); ?>"
			data-crossfade="<?php echo esc_attr( $crossfade ); ?>"
			data-copy-delay="<?php echo esc_attr( $copy_delay ); ?>"
			data-playback="<?php echo esc_attr( $playback ); ?>"
			data-nudge-enabled="<?php echo esc_attr( $nudge_on ); ?>"
			data-nudge-delay="<?php echo esc_attr( $nudge_ms ); ?>"
			data-nudge-distance="<?php echo esc_attr( $nudge_dist ); ?>"
		>
			<div class="ths-hero__stage" data-ths-stage>

				<?php // Two stacked copies of the SAME clip drive the seamless loop. ?>
				<div class="ths-hero__videos">
					<?php
					// The SECOND layer is only needed in loop mode. In hold mode we
					// skip loading it entirely — half the video bytes — for a faster
					// page. The first layer gets a high fetch priority + poster for a
					// fast opening frame; the second only preloads when the loop
					// actually needs it.
					for ( $i = 0; $i < 2; $i++ ) :
					$is_first = ( 0 === $i );
					$preload  = ( $is_first || $ambient_loop ) ? 'auto' : 'none';
					?>
					<video
						class="ths-hero__video"
						data-ths-video
						data-video-desktop="<?php echo esc_url( $src_desktop ); ?>"
						data-video-mobile="<?php echo esc_url( $src_mobile ); ?>"
						<?php if ( $is_first ) : ?>
							<?php if ( '' !== $poster_fallback ) : ?>poster="<?php echo esc_url( $poster_fallback ); ?>"<?php endif; ?>
							<?php if ( '' !== $poster ) : ?>data-poster-desktop="<?php echo esc_url( $poster ); ?>"<?php endif; ?>
							<?php if ( '' !== $poster_mobile ) : ?>data-poster-mobile="<?php echo esc_url( $poster_mobile ); ?>"<?php endif; ?>
							fetchpriority="high"
						<?php endif; ?>
						muted
						playsinline
						preload="<?php echo esc_attr( $preload ); ?>"
						decoding="async"
						aria-hidden="true"
					></video>
					<?php endfor; ?>
				</div>

				<?php // Continuity overlays — constant warm grade, rising haze, grain. ?>
				<div class="ths-hero__tone" aria-hidden="true"></div>
				<div class="ths-hero__haze" aria-hidden="true"></div>
				<div class="ths-hero__grade" aria-hidden="true"></div>
				<div class="ths-hero__grain" aria-hidden="true"></div>

				<div class="ths-hero__scenes">
					<div class="ths-hero__scene" data-ths-scene data-ths-copy>
						<?php $this->render_scene_copy( $settings ); ?>
					</div>
				</div>

				<?php if ( $show_frame ) : ?>
					<div class="ths-hero__frame" aria-hidden="true"></div>
				<?php endif; ?>

				<?php if ( $show_cue ) : ?>
					<div class="ths-hero__cue" aria-hidden="true">
						<span class="ths-hero__cue-label"><?php echo esc_html( $cue_label ); ?></span>
						<span class="ths-hero__cue-line"></span>
					</div>
				<?php endif; ?>

				<?php if ( '' !== $ambient_url ) : ?>
					<button
						type="button"
						class="ths-hero__sound"
						data-ths-sound
						aria-pressed="false"
						aria-label="<?php esc_attr_e( 'Play ambient sound', 'tendernism-hero-single' ); ?>"
					>
						<span class="ths-hero__sound-bars" aria-hidden="true"><span></span><span></span><span></span><span></span></span>
						<span class="ths-hero__sound-label"><?php esc_html_e( 'Sound', 'tendernism-hero-single' ); ?></span>
					</button>
					<audio
						data-ths-ambient
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
	 * Render the single scene's editorial copy (mirrors the React SceneCopy
	 * component). Only ONE h1 is emitted (the finale wordmark).
	 *
	 * @param array $settings
	 */
	private function render_scene_copy( $settings ) {
		$align   = ! empty( $settings['align'] ) ? $settings['align'] : 'center';
		$variant = ! empty( $settings['variant'] ) ? $settings['variant'] : '';
		$is_finale = 'finale' === $variant;
		$is_name   = 'name' === $variant;

		$classes = 'ths-scene-copy ths-scene-copy--' . sanitize_html_class( $align );
		if ( '' !== $variant ) {
			$classes .= ' ths-scene-copy--' . sanitize_html_class( $variant );
		}

		echo '<div class="' . esc_attr( $classes ) . '">';

		// Finale crown (line-drawn logo callback) — opt-in via the "Show crown
		// icon" switch, so the "king hat" can be removed entirely.
		$show_crown = ! empty( $settings['show_crown'] ) && 'yes' === $settings['show_crown'];
		if ( $is_finale && $show_crown ) {
			echo '<svg class="ths-scene-copy__crown" viewBox="0 0 120 74" data-ths-crown data-ths-text aria-hidden="true">'
				. '<path d="M8 66 L20 22 L42 50 L60 12 L78 50 L100 22 L112 66 Z"></path>'
				. '<path d="M8 66 L112 66"></path>'
				. '</svg>';
		}

		if ( ! empty( $settings['eyebrow'] ) ) {
			echo '<span class="ths-scene-copy__eyebrow" data-ths-text>' . esc_html( $settings['eyebrow'] ) . '</span>';
		}

		if ( 'quote' === $variant ) {
			echo '<span class="ths-scene-copy__quote-mark" data-ths-text aria-hidden="true">&#8220;</span>';
		}

		// Headline lines (one per row; blank rows = a beat of silence).
		$lines = $this->headline_lines( isset( $settings['headline'] ) ? $settings['headline'] : '' );
		if ( ! empty( $lines ) ) {
			$tag = $is_finale ? 'h1' : 'h2';
			$title_class = 'ths-scene-copy__title';
			if ( $is_name ) {
				$title_class .= ' ths-scene-copy__title--name';
			}
			if ( $is_finale ) {
				$title_class .= ' ths-scene-copy__title--finale';
			}
			echo '<' . esc_html( $tag ) . ' class="' . esc_attr( $title_class ) . '">';
			foreach ( $lines as $line ) {
				if ( '' === $line ) {
					echo '<span class="ths-scene-copy__gap" aria-hidden="true" data-ths-text></span>';
				} else {
					echo '<span class="ths-scene-copy__line" data-ths-text>' . esc_html( $line ) . '</span>';
				}
			}
			echo '</' . esc_html( $tag ) . '>';
		}

		if ( ! empty( $settings['subtitle'] ) ) {
			echo '<p class="ths-scene-copy__subtitle" data-ths-text>' . esc_html( $settings['subtitle'] ) . '</p>';
		}

		if ( ! empty( $settings['cta_text'] ) ) {
			$href   = isset( $settings['cta_link']['url'] ) && '' !== $settings['cta_link']['url'] ? $settings['cta_link']['url'] : '#';
			$target = ! empty( $settings['cta_link']['is_external'] ) ? ' target="_blank"' : '';
			$rel    = ! empty( $settings['cta_link']['nofollow'] ) ? ' rel="nofollow"' : '';
			echo '<div class="ths-scene-copy__cta-wrap" data-ths-text>';
			echo '<a class="ths-scene-copy__cta" href="' . esc_url( $href ) . '"' . $target . $rel . '>'
				. esc_html( $settings['cta_text'] )
				. '<span class="ths-scene-copy__cta-line" aria-hidden="true">↗</span>'
				. '</a>';
			echo '</div>';
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
	 * Resolve a settings video URL, tolerating either a plain string or an
	 * Elementor media array.
	 *
	 * @param array  $settings
	 * @param string $key
	 * @return string
	 */
	private function url_val( $settings, $key ) {
		if ( empty( $settings[ $key ] ) ) {
			return '';
		}
		$val = $settings[ $key ];
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
