<?php
/**
 * Cinematic Hero — Scroll: the scroll-SCRUBBED Elementor widget.
 *
 * A second, independent hero option to trial alongside the play/loop
 * "Cinematic Hero". Here the footage is tied to the scroll position — it plays
 * forward as the visitor scrolls down and rewinds as they scroll up, and never
 * "ends" or loops. It is intentionally text-light: the opening beat runs copy-
 * free and only the finale carries the wordmark, tagline and CTA.
 *
 * Every symbol is distinct from the play/loop widget (class name, get_name,
 * asset handles, the .thx- CSS prefix and data-thx-* hooks), so both widgets can
 * live on the same page. render() prints semantic markup + data-* config; all
 * motion is driven by assets/js/scroll-hero.js.
 *
 * @package Tendernism_Hero
 */

namespace Tendernism_Hero\Widgets;

use Elementor\Widget_Base;
use Elementor\Controls_Manager;
use Elementor\Repeater;
use Elementor\Group_Control_Typography;
use Elementor\Group_Control_Text_Shadow;
use Elementor\Group_Control_Border;
use Elementor\Group_Control_Box_Shadow;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Scroll_Hero_Widget extends Widget_Base {

	public function get_name() {
		return 'tendernism_scroll_hero';
	}

	public function get_title() {
		return esc_html__( 'Cinematic Hero — Scroll', 'tendernism-hero' );
	}

	public function get_icon() {
		return 'eicon-scroll';
	}

	public function get_categories() {
		return array( 'tendernism' );
	}

	public function get_keywords() {
		return array( 'hero', 'cinematic', 'video', 'scroll', 'scrub', 'tendernism' );
	}

	public function get_script_depends() {
		return array( 'tendernism-scroll-hero' );
	}

	public function get_style_depends() {
		return array( 'tendernism-scroll-hero' );
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
		$this->register_headline_style_section();
		$this->register_eyebrow_style_section();
		$this->register_subtitle_style_section();
		$this->register_button_style_section();
		$this->register_crown_style_section();
	}

	/**
	 * The scenes repeater — the editable "beats" of the scrubbed film.
	 */
	private function register_scenes_section() {
		$this->start_controls_section(
			'section_scenes',
			array(
				'label' => esc_html__( 'Scenes', 'tendernism-hero' ),
				'tab'   => Controls_Manager::TAB_CONTENT,
			)
		);

		$this->add_control(
			'scenes_notice',
			array(
				'type'            => Controls_Manager::RAW_HTML,
				'raw'             => esc_html__( 'For the smoothest scrubbing, use short all-keyframe MP4 clips (the pre-filled clips are already encoded that way). Every frame is tied to scroll — the video never ends or loops.', 'tendernism-hero' ),
				'content_classes' => 'elementor-descriptor',
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
				'description' => esc_html__( 'Direct .mp4 URL. Use an all-keyframe encode so scroll-seeking is instant.', 'tendernism-hero' ),
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
			'poster_image',
			array(
				'label'       => esc_html__( 'Poster image (desktop)', 'tendernism-hero' ),
				'type'        => Controls_Manager::MEDIA,
				'dynamic'     => array( 'active' => true ),
				'description' => esc_html__( 'Optional still shown instantly while this clip decodes (no black flash). Use a frame from the 16:9 clip.', 'tendernism-hero' ),
			)
		);

		$repeater->add_control(
			'poster_image_mobile',
			array(
				'label'       => esc_html__( 'Poster image (mobile)', 'tendernism-hero' ),
				'type'        => Controls_Manager::MEDIA,
				'dynamic'     => array( 'active' => true ),
				'description' => esc_html__( 'Optional portrait still shown on phones (≤640px). Falls back to the desktop poster if empty.', 'tendernism-hero' ),
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
				'description' => esc_html__( 'The finale renders the only H1 on the page and holds on screen at the end of the scrub.', 'tendernism-hero' ),
			)
		);

		$repeater->add_control(
			'show_crown',
			array(
				'label'        => esc_html__( 'Show crown icon', 'tendernism-hero' ),
				'type'         => Controls_Manager::SWITCHER,
				'default'      => 'yes',
				'return_value' => 'yes',
				'condition'    => array( 'variant' => 'finale' ),
				'description'  => esc_html__( 'The small line-drawn crown above the finale wordmark. It draws in as the copy reveals.', 'tendernism-hero' ),
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
				'description' => esc_html__( 'One line per row. Leave a scene’s headline empty for a copy-free, footage-only beat.', 'tendernism-hero' ),
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
				'label'       => esc_html__( 'Chapter mark', 'tendernism-hero' ),
				'type'        => Controls_Manager::TEXT,
				'default'     => '',
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
				'default'     => array( 'unit' => '%', 'size' => 45 ),
				'description' => esc_html__( 'How far into the scene’s scrub the words rise in. Later = the footage establishes first.', 'tendernism-hero' ),
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
	 * Scrub feel / timing controls.
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
			'scroll_per_scene',
			array(
				'label'       => esc_html__( 'Scroll length per scene', 'tendernism-hero' ),
				'type'        => Controls_Manager::SLIDER,
				'size_units'  => array( 'vh' ),
				'range'       => array( 'vh' => array( 'min' => 40, 'max' => 200, 'step' => 5 ) ),
				'default'     => array( 'unit' => 'vh', 'size' => 90 ),
				'description' => esc_html__( 'How much scrolling transports each clip end-to-end. Longer = the footage advances more slowly per swipe.', 'tendernism-hero' ),
			)
		);

		$this->add_control(
			'end_hold',
			array(
				'label'       => esc_html__( 'Finale hold length', 'tendernism-hero' ),
				'type'        => Controls_Manager::SLIDER,
				'size_units'  => array( 'vh' ),
				'range'       => array( 'vh' => array( 'min' => 0, 'max' => 150, 'step' => 5 ) ),
				'default'     => array( 'unit' => 'vh', 'size' => 60 ),
				'description' => esc_html__( 'Extra scroll after the last frame where the finale (wordmark + CTA) holds fully on screen.', 'tendernism-hero' ),
			)
		);

		$this->add_control(
			'crossfade',
			array(
				'label'       => esc_html__( 'Crossfade amount', 'tendernism-hero' ),
				'type'        => Controls_Manager::SLIDER,
				'range'       => array( 'px' => array( 'min' => 0.04, 'max' => 0.5, 'step' => 0.02 ) ),
				'default'     => array( 'size' => 0.14 ),
				'description' => esc_html__( 'How wide the dissolve between clips is (as a share of a scene).', 'tendernism-hero' ),
			)
		);

		$this->add_control(
			'seek_smoothing',
			array(
				'label'       => esc_html__( 'Scrub smoothing', 'tendernism-hero' ),
				'type'        => Controls_Manager::SLIDER,
				'range'       => array( 'px' => array( 'min' => 0.04, 'max' => 0.5, 'step' => 0.02 ) ),
				'default'     => array( 'size' => 0.16 ),
				'description' => esc_html__( 'How much the film transport is eased. Lower = silkier, more weighted (a touch of lag); higher = snappier, tracks the finger more tightly.', 'tendernism-hero' ),
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
				'default'      => '',
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
				'description' => esc_html__( 'A seamless loop (fire crackle / room tone) under the whole hero. The toggle self-hides until the file is playable.', 'tendernism-hero' ),
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
	 * Colour tokens — mapped to CSS custom properties on the widget wrapper.
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
			'color_ink'      => array( esc_html__( 'Background (near-black)', 'tendernism-hero' ), '#0e0b09', '--thx-ink' ),
			'color_headline' => array( esc_html__( 'Headline', 'tendernism-hero' ), '#ededea', '--thx-headline' ),
			'color_cream'    => array( esc_html__( 'Body / light text', 'tendernism-hero' ), '#f2efe9', '--thx-cream' ),
			'color_ash'      => array( esc_html__( 'Muted text', 'tendernism-hero' ), '#c3bcae', '--thx-ash' ),
			'color_gold'     => array( esc_html__( 'Gold', 'tendernism-hero' ), '#d4a018', '--thx-gold' ),
			'color_gold_hi'  => array( esc_html__( 'Gold highlight', 'tendernism-hero' ), '#f0c95a', '--thx-gold-hi' ),
			'color_gold_lo'  => array( esc_html__( 'Gold deep', 'tendernism-hero' ), '#a87c12', '--thx-gold-lo' ),
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
						'{{WRAPPER}} .thx-hero' => $var . ': {{VALUE}};',
					),
				)
			);
		}

		$this->end_controls_section();
	}

	/**
	 * Headline typography + colour.
	 */
	private function register_headline_style_section() {
		$this->start_controls_section(
			'section_style_headline',
			array(
				'label' => esc_html__( 'Headline', 'tendernism-hero' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			array(
				'name'     => 'headline_typography',
				'selector' => '{{WRAPPER}} .thx-scene-copy__title',
			)
		);

		$this->add_control(
			'headline_color',
			array(
				'label'       => esc_html__( 'Colour', 'tendernism-hero' ),
				'type'        => Controls_Manager::COLOR,
				'selectors'   => array(
					'{{WRAPPER}} .thx-scene-copy__title' => 'color: {{VALUE}}; -webkit-text-stroke-color: {{VALUE}};',
				),
				'description' => esc_html__( 'Overrides the Headline colour from the Colours section.', 'tendernism-hero' ),
			)
		);

		$this->add_control(
			'headline_stroke',
			array(
				'label'       => esc_html__( 'Outline thickness', 'tendernism-hero' ),
				'type'        => Controls_Manager::SLIDER,
				'size_units'  => array( 'px', 'em' ),
				'range'       => array(
					'px' => array( 'min' => 0, 'max' => 4, 'step' => 0.1 ),
					'em' => array( 'min' => 0, 'max' => 0.1, 'step' => 0.002 ),
				),
				'selectors'   => array(
					'{{WRAPPER}} .thx-scene-copy__title' => '-webkit-text-stroke-width: {{SIZE}}{{UNIT}};',
				),
				'description' => esc_html__( 'Set to 0 to remove the letter outline for a flatter look.', 'tendernism-hero' ),
			)
		);

		$this->add_group_control(
			Group_Control_Text_Shadow::get_type(),
			array(
				'name'     => 'headline_shadow',
				'selector' => '{{WRAPPER}} .thx-scene-copy__title',
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Eyebrow typography + colour.
	 */
	private function register_eyebrow_style_section() {
		$this->start_controls_section(
			'section_style_eyebrow',
			array(
				'label' => esc_html__( 'Eyebrow', 'tendernism-hero' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			array(
				'name'     => 'eyebrow_typography',
				'selector' => '{{WRAPPER}} .thx-scene-copy__eyebrow',
			)
		);

		$this->add_control(
			'eyebrow_color',
			array(
				'label'     => esc_html__( 'Colour', 'tendernism-hero' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					'{{WRAPPER}} .thx-scene-copy__eyebrow' => 'color: {{VALUE}};',
				),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Subtitle / tagline typography + colour.
	 */
	private function register_subtitle_style_section() {
		$this->start_controls_section(
			'section_style_subtitle',
			array(
				'label' => esc_html__( 'Subtitle', 'tendernism-hero' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			array(
				'name'     => 'subtitle_typography',
				'selector' => '{{WRAPPER}} .thx-scene-copy__subtitle',
			)
		);

		$this->add_control(
			'subtitle_color',
			array(
				'label'       => esc_html__( 'Colour', 'tendernism-hero' ),
				'type'        => Controls_Manager::COLOR,
				'selectors'   => array(
					'{{WRAPPER}} .thx-scene-copy__subtitle' => 'color: {{VALUE}}; -webkit-text-fill-color: {{VALUE}}; background: none;',
				),
				'description' => esc_html__( 'On the Finale variant this replaces the gold-gradient tagline with a solid colour.', 'tendernism-hero' ),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Full button styling.
	 */
	private function register_button_style_section() {
		$this->start_controls_section(
			'section_style_button',
			array(
				'label' => esc_html__( 'Button', 'tendernism-hero' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_group_control(
			Group_Control_Typography::get_type(),
			array(
				'name'     => 'button_typography',
				'selector' => '{{WRAPPER}} .thx-scene-copy__cta',
			)
		);

		$this->start_controls_tabs( 'button_tabs' );

		$this->start_controls_tab(
			'button_tab_normal',
			array( 'label' => esc_html__( 'Normal', 'tendernism-hero' ) )
		);

		$this->add_control(
			'button_color',
			array(
				'label'     => esc_html__( 'Text colour', 'tendernism-hero' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					'{{WRAPPER}} .thx-scene-copy__cta' => 'color: {{VALUE}};',
				),
			)
		);

		$this->add_control(
			'button_bg',
			array(
				'label'     => esc_html__( 'Background', 'tendernism-hero' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					'{{WRAPPER}} .thx-scene-copy__cta' => 'background: {{VALUE}}; border-color: {{VALUE}};',
				),
			)
		);

		$this->end_controls_tab();

		$this->start_controls_tab(
			'button_tab_hover',
			array( 'label' => esc_html__( 'Hover', 'tendernism-hero' ) )
		);

		$this->add_control(
			'button_color_hover',
			array(
				'label'     => esc_html__( 'Text colour', 'tendernism-hero' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					'{{WRAPPER}} .thx-scene-copy__cta:hover, {{WRAPPER}} .thx-scene-copy__cta:focus' => 'color: {{VALUE}};',
				),
			)
		);

		$this->add_control(
			'button_bg_hover',
			array(
				'label'     => esc_html__( 'Background', 'tendernism-hero' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					'{{WRAPPER}} .thx-scene-copy__cta:hover, {{WRAPPER}} .thx-scene-copy__cta:focus' => 'background: {{VALUE}}; border-color: {{VALUE}};',
				),
			)
		);

		$this->end_controls_tab();
		$this->end_controls_tabs();

		$this->add_group_control(
			Group_Control_Border::get_type(),
			array(
				'name'      => 'button_border',
				'selector'  => '{{WRAPPER}} .thx-scene-copy__cta',
				'separator' => 'before',
			)
		);

		$this->add_control(
			'button_radius',
			array(
				'label'      => esc_html__( 'Border radius', 'tendernism-hero' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => array( 'px', '%', 'em' ),
				'selectors'  => array(
					'{{WRAPPER}} .thx-scene-copy__cta' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				),
			)
		);

		$this->add_control(
			'button_padding',
			array(
				'label'      => esc_html__( 'Padding', 'tendernism-hero' ),
				'type'       => Controls_Manager::DIMENSIONS,
				'size_units' => array( 'px', 'em', '%' ),
				'selectors'  => array(
					'{{WRAPPER}} .thx-scene-copy__cta' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
				),
			)
		);

		$this->add_group_control(
			Group_Control_Box_Shadow::get_type(),
			array(
				'name'     => 'button_shadow',
				'selector' => '{{WRAPPER}} .thx-scene-copy__cta',
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Crown icon styling (colour + size).
	 */
	private function register_crown_style_section() {
		$this->start_controls_section(
			'section_style_crown',
			array(
				'label' => esc_html__( 'Crown icon', 'tendernism-hero' ),
				'tab'   => Controls_Manager::TAB_STYLE,
			)
		);

		$this->add_control(
			'crown_color',
			array(
				'label'     => esc_html__( 'Colour', 'tendernism-hero' ),
				'type'      => Controls_Manager::COLOR,
				'selectors' => array(
					'{{WRAPPER}} .thx-scene-copy__crown path' => 'stroke: {{VALUE}};',
				),
			)
		);

		$this->add_control(
			'crown_size',
			array(
				'label'      => esc_html__( 'Size', 'tendernism-hero' ),
				'type'       => Controls_Manager::SLIDER,
				'size_units' => array( 'px', '%' ),
				'range'      => array(
					'px' => array( 'min' => 24, 'max' => 220, 'step' => 2 ),
				),
				'selectors'  => array(
					'{{WRAPPER}} .thx-scene-copy__crown' => 'width: {{SIZE}}{{UNIT}};',
				),
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Seed content — the approved two-beat cut, re-encoded ALL-KEYFRAME so scroll
	 * seeking is instant. Text-light: the opening beat is copy-free; only the
	 * finale carries the wordmark, tagline and CTA.
	 *
	 * @return array
	 */
	private function default_scenes() {
		$cdn = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3GdMpDQKnvNT4cwozQAEb1LsUI2';
		return array(
			array(
				'chapter'       => 'I',
				'label'         => esc_html__( 'The Smoker', 'tendernism-hero' ),
				'video_desktop' => $cdn . '/712ae92c-1973-4e35-a49c-0990aa676599.mp4',
				'video_mobile'  => $cdn . '/3f9de4d5-f358-49dc-85eb-6e1e62eb469f.mp4',
				'align'         => 'center',
				'variant'       => '',
				'headline'      => '',
				'reveal_at'     => array( 'unit' => '%', 'size' => 50 ),
			),
			array(
				'chapter'       => 'II',
				'label'         => esc_html__( 'The Pitmaster', 'tendernism-hero' ),
				'video_desktop' => $cdn . '/b6da3c45-e934-4220-8905-40e48329dcfa.mp4',
				'video_mobile'  => $cdn . '/9419e9c8-0b0b-40f6-bc30-41de08ec2e27.mp4',
				'align'         => 'center',
				'variant'       => 'finale',
				'eyebrow'       => esc_html__( 'Come hungry', 'tendernism-hero' ),
				'headline'      => 'Mr. Tendernism',
				'subtitle'      => esc_html__( 'Good Energy. Real Moments. Good Food.', 'tendernism-hero' ),
				'cta_text'      => esc_html__( 'Book Mr. Tendernism', 'tendernism-hero' ),
				'cta_link'      => array( 'url' => '#story' ),
				'reveal_at'     => array( 'unit' => '%', 'size' => 45 ),
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

		if ( isset( $settings['load_fonts'] ) && 'yes' === $settings['load_fonts'] ) {
			wp_enqueue_style( 'tendernism-hero-fonts' );
		}

		$uid = 'thx-hero-' . $this->get_id();

		$per_scene = $this->num( $settings, 'scroll_per_scene', 90 ) / 100; // vh% → multiple of viewport
		$end_hold  = $this->num( $settings, 'end_hold', 60 ) / 100;         // vh% → multiple of viewport
		$crossfade = $this->num( $settings, 'crossfade', 0.14 );
		$smoothing = $this->num( $settings, 'seek_smoothing', 0.16 );

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
			class="thx-hero"
			aria-label="<?php esc_attr_e( 'Cinematic introduction (scroll-scrubbed)', 'tendernism-hero' ); ?>"
			data-thx-hero
			data-scroll-per-scene="<?php echo esc_attr( $per_scene ); ?>"
			data-end-hold="<?php echo esc_attr( $end_hold ); ?>"
			data-crossfade="<?php echo esc_attr( $crossfade ); ?>"
			data-seek-smoothing="<?php echo esc_attr( $smoothing ); ?>"
		>
			<div class="thx-hero__stage" data-thx-stage>

				<div class="thx-hero__videos">
					<?php
					foreach ( $scenes as $i => $scene ) :
						$poster_d = ! empty( $scene['poster_image']['url'] ) ? $scene['poster_image']['url'] : '';
						$poster_m = ! empty( $scene['poster_image_mobile']['url'] ) ? $scene['poster_image_mobile']['url'] : '';
						$poster_fallback = '' !== $poster_d ? $poster_d : $poster_m;
						?>
						<video
							class="thx-hero__video"
							data-thx-video
							data-video-desktop="<?php echo esc_url( $this->scene_video( $scene, 'video_desktop' ) ); ?>"
							data-video-mobile="<?php echo esc_url( $this->scene_video( $scene, 'video_mobile' ) ); ?>"
							<?php if ( '' !== $poster_fallback ) : ?>poster="<?php echo esc_url( $poster_fallback ); ?>"<?php endif; ?>
							<?php if ( '' !== $poster_d ) : ?>data-poster-desktop="<?php echo esc_url( $poster_d ); ?>"<?php endif; ?>
							<?php if ( '' !== $poster_m ) : ?>data-poster-mobile="<?php echo esc_url( $poster_m ); ?>"<?php endif; ?>
							muted
							playsinline
							preload="auto"
							aria-hidden="true"
						></video>
					<?php endforeach; ?>
				</div>

				<?php
				// Device-correct opening poster (chosen by a CSS media query, so phones
				// never flash the desktop still). JS fades it out on the first frame.
				$first = $scenes[0];
				$fp_d  = ! empty( $first['poster_image']['url'] ) ? $first['poster_image']['url'] : '';
				$fp_m  = ! empty( $first['poster_image_mobile']['url'] ) ? $first['poster_image_mobile']['url'] : '';
				if ( '' !== $fp_d || '' !== $fp_m ) :
					$bg_d   = '' !== $fp_d ? $fp_d : $fp_m;
					$bg_m   = '' !== $fp_m ? $fp_m : $fp_d;
					$pstyle = "--thx-poster-d:url('" . esc_url( $bg_d ) . "');--thx-poster-m:url('" . esc_url( $bg_m ) . "');";
					?>
					<div class="thx-hero__poster" data-thx-poster aria-hidden="true" style="<?php echo esc_attr( $pstyle ); ?>"></div>
				<?php endif; ?>

				<?php // Continuity overlays — constant across every scene. ?>
				<div class="thx-hero__tone" aria-hidden="true"></div>
				<div class="thx-hero__grade" aria-hidden="true"></div>
				<div class="thx-hero__grain" aria-hidden="true"></div>

				<div class="thx-hero__scenes">
					<?php
					foreach ( $scenes as $i => $scene ) {
						$reveal = isset( $scene['reveal_at']['size'] ) ? floatval( $scene['reveal_at']['size'] ) / 100 : 0.3;
						printf(
							'<div class="thx-hero__scene" data-thx-scene="%1$d" data-reveal="%2$s">',
							(int) $i,
							esc_attr( $reveal )
						);
						$this->render_scene_copy( $scene );
						echo '</div>';
					}
					?>
				</div>

				<?php if ( $show_frame ) : ?>
					<div class="thx-hero__frame" aria-hidden="true"></div>
				<?php endif; ?>

				<?php if ( $show_cue ) : ?>
					<div class="thx-hero__cue" data-thx-cue aria-hidden="true">
						<span class="thx-hero__cue-label"><?php echo esc_html( $cue_label ); ?></span>
						<span class="thx-hero__cue-line"></span>
					</div>
				<?php endif; ?>

				<?php if ( '' !== $ambient_url ) : ?>
					<button
						type="button"
						class="thx-hero__sound"
						data-thx-sound
						aria-pressed="false"
						aria-label="<?php esc_attr_e( 'Play ambient sound', 'tendernism-hero' ); ?>"
					>
						<span class="thx-hero__sound-bars" aria-hidden="true"><span></span><span></span><span></span><span></span></span>
						<span class="thx-hero__sound-label"><?php esc_html_e( 'Sound', 'tendernism-hero' ); ?></span>
					</button>
					<audio
						data-thx-ambient
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
	 * Render one scene's editorial copy.
	 *
	 * @param array $scene
	 */
	private function render_scene_copy( $scene ) {
		$align     = ! empty( $scene['align'] ) ? $scene['align'] : 'center';
		$variant   = ! empty( $scene['variant'] ) ? $scene['variant'] : '';
		$is_finale = 'finale' === $variant;
		$is_name   = 'name' === $variant;

		$classes = 'thx-scene-copy thx-scene-copy--' . sanitize_html_class( $align );
		if ( '' !== $variant ) {
			$classes .= ' thx-scene-copy--' . sanitize_html_class( $variant );
		}

		echo '<div class="' . esc_attr( $classes ) . '">';

		$show_crown = ! isset( $scene['show_crown'] ) || 'yes' === $scene['show_crown'];
		if ( $is_finale && $show_crown ) {
			echo '<svg class="thx-scene-copy__crown" viewBox="0 0 120 74" data-thx-crown data-thx-text aria-hidden="true">'
				. '<path d="M8 66 L20 22 L42 50 L60 12 L78 50 L100 22 L112 66 Z"></path>'
				. '<path d="M8 66 L112 66"></path>'
				. '</svg>';
		}

		if ( ! empty( $scene['eyebrow'] ) ) {
			echo '<span class="thx-scene-copy__eyebrow" data-thx-text>' . esc_html( $scene['eyebrow'] ) . '</span>';
		}

		if ( 'quote' === $variant ) {
			echo '<span class="thx-scene-copy__quote-mark" data-thx-text aria-hidden="true">&#8220;</span>';
		}

		$lines = $this->headline_lines( isset( $scene['headline'] ) ? $scene['headline'] : '' );
		if ( ! empty( $lines ) ) {
			$tag = $is_finale ? 'h1' : 'h2';
			$title_class = 'thx-scene-copy__title';
			if ( $is_name ) {
				$title_class .= ' thx-scene-copy__title--name';
			}
			if ( $is_finale ) {
				$title_class .= ' thx-scene-copy__title--finale';
			}
			echo '<' . esc_html( $tag ) . ' class="' . esc_attr( $title_class ) . '">';
			foreach ( $lines as $line ) {
				if ( '' === $line ) {
					echo '<span class="thx-scene-copy__gap" aria-hidden="true" data-thx-text></span>';
				} else {
					echo '<span class="thx-scene-copy__line" data-thx-text>' . esc_html( $line ) . '</span>';
				}
			}
			echo '</' . esc_html( $tag ) . '>';
		}

		if ( ! empty( $scene['subtitle'] ) ) {
			echo '<p class="thx-scene-copy__subtitle" data-thx-text>' . esc_html( $scene['subtitle'] ) . '</p>';
		}

		if ( ! empty( $scene['cta_text'] ) ) {
			$href   = isset( $scene['cta_link']['url'] ) && '' !== $scene['cta_link']['url'] ? $scene['cta_link']['url'] : '#';
			$target = ! empty( $scene['cta_link']['is_external'] ) ? ' target="_blank"' : '';
			$rel    = ! empty( $scene['cta_link']['nofollow'] ) ? ' rel="nofollow"' : '';
			echo '<div class="thx-scene-copy__cta-wrap" data-thx-text>';
			echo '<a class="thx-scene-copy__cta" href="' . esc_url( $href ) . '"' . $target . $rel . '>'
				. esc_html( $scene['cta_text'] )
				. '<span class="thx-scene-copy__cta-line" aria-hidden="true">↗</span>'
				. '</a>';
			echo '</div>';
		}

		if ( ! empty( $scene['chapter'] ) || ! empty( $scene['label'] ) ) {
			$mark = trim( ( isset( $scene['chapter'] ) ? $scene['chapter'] : '' ) . ' · ' . ( isset( $scene['label'] ) ? $scene['label'] : '' ), ' ·' );
			echo '<span class="thx-scene-copy__chapter" aria-hidden="true" data-thx-text>' . esc_html( $mark ) . '</span>';
		}

		echo '</div>';
	}

	// ─────────────────────────────────────────────────────────────────────────
	// Helpers
	// ─────────────────────────────────────────────────────────────────────────

	private function headline_lines( $raw ) {
		if ( '' === trim( (string) $raw ) ) {
			return array();
		}
		$lines = preg_split( '/\r\n|\r|\n/', (string) $raw );
		return array_map( 'trim', $lines );
	}

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
