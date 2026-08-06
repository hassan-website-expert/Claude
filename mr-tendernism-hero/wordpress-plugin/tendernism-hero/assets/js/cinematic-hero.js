/**
 * cinematic-hero.js — the vanilla motion engine for the Tendernism hero widget.
 *
 * A framework-free port of the original React hook + pure GSAP timeline. It:
 *   • Builds a paused master timeline (1 time-unit per scene) of video
 *     crossfades + per-scene copy reveals, and scrubs it with scroll.
 *   • Pins the full-viewport stage for the length of the piece.
 *   • Plays only the active clip in real time; loops a clip's smoke-filled tail
 *     when it finishes while its scene is still parked, so it never freezes.
 *   • Picks the portrait clip on phones and the landscape clip elsewhere, once.
 *   • Drives one global Lenis smooth-scroll instance.
 *   • Falls back to a static poster in the Elementor editor and for visitors who
 *     prefer reduced motion.
 *
 * Reads all configuration from data-* attributes printed by the PHP widget.
 */
( function () {
	'use strict';

	var REVEAL_AT_DEFAULT = 0.26;
	var CINEMATIC_EASE = 'power2.inOut';

	var lenisStarted = false;

	// ── Lenis (one instance drives the whole page) ───────────────────────────
	function startLenis() {
		if ( lenisStarted || typeof window.Lenis === 'undefined' ) {
			return;
		}
		lenisStarted = true;
		var lenis = new window.Lenis( { lerp: 0.1, smoothWheel: true } );
		lenis.on( 'scroll', window.ScrollTrigger.update );
		window.gsap.ticker.add( function ( time ) {
			lenis.raf( time * 1000 );
		} );
		window.gsap.ticker.lagSmoothing( 0 );
	}

	function isEditMode() {
		return !! (
			window.elementorFrontend &&
			typeof window.elementorFrontend.isEditMode === 'function' &&
			window.elementorFrontend.isEditMode()
		);
	}

	function prefersReducedMotion() {
		return !! ( window.matchMedia && window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches );
	}

	function isMobile() {
		return !! ( window.matchMedia && window.matchMedia( '(max-width: 640px)' ).matches );
	}

	// Choose the right source for a video element (portrait on phones, else
	// landscape), decided once so the src never swaps mid-session.
	function sourceFor( video, mobile ) {
		var desktop = video.getAttribute( 'data-video-desktop' ) || '';
		var portrait = video.getAttribute( 'data-video-mobile' ) || '';
		return mobile && portrait ? portrait : desktop;
	}

	function num( el, attr, fallback ) {
		var raw = parseFloat( el.getAttribute( attr ) );
		return isNaN( raw ) ? fallback : raw;
	}

	// ── Pure timeline construction (ported from heroTimeline.js) ─────────────
	function buildSceneTextTimeline( gsap, sceneEl, isFinale ) {
		var tl = gsap.timeline();
		var textItems = Array.prototype.slice.call( sceneEl.querySelectorAll( '[data-th-text]' ) );
		if ( ! textItems.length ) {
			return tl;
		}

		var rawReveal = sceneEl.getAttribute( 'data-reveal' );
		var start = rawReveal !== null && rawReveal !== '' ? parseFloat( rawReveal ) : REVEAL_AT_DEFAULT;

		var crownPaths = Array.prototype.slice.call( sceneEl.querySelectorAll( '[data-th-crown] path' ) );
		crownPaths.forEach( function ( path ) {
			var len = path.getTotalLength ? path.getTotalLength() : 200;
			gsap.set( path, { strokeDasharray: len, strokeDashoffset: len } );
			tl.to( path, { strokeDashoffset: 0, duration: 0.5, ease: 'power1.inOut' }, start );
		} );

		tl.fromTo(
			textItems,
			{ autoAlpha: 0, y: 40, filter: 'blur(9px)' },
			{ autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.34, ease: 'power2.out', stagger: 0.07 },
			start
		);

		if ( ! isFinale ) {
			tl.to(
				textItems,
				{ autoAlpha: 0, y: -30, filter: 'blur(9px)', duration: 0.24, ease: 'power2.in', stagger: 0.04 },
				0.7
			);
		}

		return tl;
	}

	function buildMasterTimeline( gsap, videoEls, sceneEls, crossfade ) {
		var count = videoEls.length;
		var master = gsap.timeline( { paused: true, defaults: { ease: CINEMATIC_EASE } } );

		videoEls.forEach( function ( v, i ) {
			gsap.set( v, { autoAlpha: i === 0 ? 1 : 0, scale: 1.06, transformOrigin: '50% 50%' } );
		} );

		videoEls.forEach( function ( video, i ) {
			var sceneStart = i;
			if ( i > 0 ) {
				master.to( video, { autoAlpha: 1, duration: crossfade }, sceneStart - crossfade / 2 );
			}
			if ( i < count - 1 ) {
				master.to( video, { autoAlpha: 0, duration: crossfade }, sceneStart + 1 - crossfade / 2 );
			}
			master.to( video, { scale: 1.0, duration: 1, ease: 'none' }, sceneStart );
			master.add( buildSceneTextTimeline( gsap, sceneEls[ i ], i === count - 1 ), sceneStart );
		} );

		return master;
	}

	function activeSceneIndex( progress, count ) {
		var raw = Math.floor( progress * count );
		return Math.min( count - 1, Math.max( 0, raw ) );
	}

	// ── Static fallback (editor preview / reduced motion) ────────────────────
	function initStatic( root, posterIndex ) {
		root.classList.add( 'th-hero--static' );
		var mobile = isMobile();
		var videos = Array.prototype.slice.call( root.querySelectorAll( '[data-th-video]' ) );
		var scenes = Array.prototype.slice.call( root.querySelectorAll( '[data-th-scene]' ) );

		videos.forEach( function ( v, i ) {
			if ( i === posterIndex ) {
				v.src = sourceFor( v, mobile );
				v.loop = true;
				v.muted = true;
				v.setAttribute( 'playsinline', '' );
				v.style.opacity = '1';
				var p = v.play();
				if ( p && p.catch ) { p.catch( function () {} ); }
			} else {
				v.style.opacity = '0';
			}
		} );

		scenes.forEach( function ( s, i ) {
			s.style.display = i === posterIndex ? '' : 'none';
		} );

		wireSound( root );
	}

	// ── Ambient sound toggle ─────────────────────────────────────────────────
	function wireSound( root ) {
		var btn = root.querySelector( '[data-th-sound]' );
		var audio = root.querySelector( '[data-th-ambient]' );
		if ( ! btn || ! audio ) {
			return;
		}

		var targetVol = num( audio, 'data-volume', 0.5 );
		var on = false;
		var raf = 0;

		// Only surface the control once the file is actually playable.
		btn.style.display = 'none';
		audio.addEventListener( 'canplaythrough', function () {
			btn.style.display = '';
		} );

		function fadeTo( target, done ) {
			cancelAnimationFrame( raf );
			var step = function () {
				var delta = target - audio.volume;
				if ( Math.abs( delta ) < 0.02 ) {
					audio.volume = Math.max( 0, Math.min( 1, target ) );
					if ( done ) { done(); }
					return;
				}
				audio.volume = Math.max( 0, Math.min( 1, audio.volume + delta * 0.08 ) );
				raf = requestAnimationFrame( step );
			};
			step();
		}

		btn.addEventListener( 'click', function () {
			if ( on ) {
				on = false;
				btn.classList.remove( 'is-on' );
				btn.setAttribute( 'aria-pressed', 'false' );
				fadeTo( 0, function () { audio.pause(); } );
				return;
			}
			on = true;
			btn.classList.add( 'is-on' );
			btn.setAttribute( 'aria-pressed', 'true' );
			audio.volume = 0;
			var p = audio.play();
			if ( p && p.catch ) { p.catch( function () { on = false; btn.classList.remove( 'is-on' ); } ); }
			fadeTo( targetVol );
		} );
	}

	// ── Full animated hero ───────────────────────────────────────────────────
	function initAnimated( root ) {
		var gsap = window.gsap;
		var ScrollTrigger = window.ScrollTrigger;
		gsap.registerPlugin( ScrollTrigger );

		var stage = root.querySelector( '[data-th-stage]' );
		var videoEls = Array.prototype.slice.call( root.querySelectorAll( '[data-th-video]' ) );
		var sceneEls = Array.prototype.slice.call( root.querySelectorAll( '[data-th-scene]' ) );
		var sceneCount = sceneEls.length;
		if ( ! sceneCount || ! videoEls.length ) {
			return;
		}

		var mobile = isMobile();
		var playbackRate = num( root, 'data-playback', 1.3 );
		var perScene = num( root, 'data-scroll-per-scene', 0.5 );
		var crossfade = num( root, 'data-crossfade', 0.66 );
		var tailLoop = num( root, 'data-tail-loop', 1.2 );

		var master = buildMasterTimeline( gsap, videoEls, sceneEls, crossfade );

		// Decode management: warm a 1-scene window, only the active clip plays.
		var warmed = { 0: true };
		function ensureLoaded( i ) {
			var v = videoEls[ i ];
			if ( ! v || warmed[ i ] ) {
				return;
			}
			warmed[ i ] = true;
			if ( ! v.src ) {
				v.src = sourceFor( v, mobile );
			}
			v.preload = 'auto';
			v.load();
		}

		function setActive( idx ) {
			ensureLoaded( idx - 1 );
			ensureLoaded( idx );
			ensureLoaded( idx + 1 );
			videoEls.forEach( function ( v, i ) {
				if ( i === idx ) {
					try { v.currentTime = 0; } catch ( e ) {}
					v.playbackRate = playbackRate;
					var p = v.play();
					if ( p && p.catch ) { p.catch( function () {} ); }
				} else if ( ! v.paused ) {
					v.pause();
				}
			} );
		}

		var lastActive = -1;

		// Living hold: loop the tail rather than freeze on the final frame.
		var endedHandlers = videoEls.map( function ( v, i ) {
			var handler = function () {
				if ( i !== lastActive || tailLoop <= 0 ) {
					return;
				}
				var d = v.duration;
				if ( ! isFinite( d ) || d <= 0 ) {
					return;
				}
				try { v.currentTime = Math.max( 0, d - tailLoop ); } catch ( e ) {}
				var p = v.play();
				if ( p && p.catch ) { p.catch( function () {} ); }
			};
			v.addEventListener( 'ended', handler );
			return handler;
		} );

		// Give the first clip its source immediately for a fast opening frame.
		videoEls[ 0 ].src = sourceFor( videoEls[ 0 ], mobile );
		ensureLoaded( 0 );
		setActive( 0 );

		var st = ScrollTrigger.create( {
			animation: master,
			trigger: root,
			start: 'top top',
			end: function () { return '+=' + window.innerHeight * ( sceneCount * perScene ); },
			pin: stage,
			pinSpacing: true,
			scrub: 1,
			invalidateOnRefresh: true,
			onUpdate: function ( self ) {
				var idx = activeSceneIndex( self.progress, sceneCount );
				if ( idx !== lastActive ) {
					lastActive = idx;
					setActive( idx );
				}
			},
		} );

		wireSound( root );

		if ( document.fonts && document.fonts.ready ) {
			document.fonts.ready.then( function () { ScrollTrigger.refresh(); } );
		}

		// Expose a teardown so the Elementor editor can re-init cleanly.
		root._thHeroDestroy = function () {
			st.kill();
			master.kill();
			endedHandlers.forEach( function ( h, i ) {
				if ( videoEls[ i ] ) { videoEls[ i ].removeEventListener( 'ended', h ); }
			} );
			videoEls.forEach( function ( v ) { v.pause(); } );
			delete root._thHeroInit;
		};
	}

	// ── Entry point per widget instance ──────────────────────────────────────
	function initHero( root ) {
		if ( ! root || root._thHeroInit ) {
			return;
		}
		if ( typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined' ) {
			return;
		}
		root._thHeroInit = true;

		if ( isEditMode() ) {
			// Editor: show the opening frame so the client can edit content; the
			// scrubbed experience only runs on the live front end.
			initStatic( root, 0 );
			return;
		}

		if ( prefersReducedMotion() ) {
			// Reduced motion: hold on the finale (the brand payoff + CTA).
			var sceneCount = root.querySelectorAll( '[data-th-scene]' ).length;
			initStatic( root, Math.max( 0, sceneCount - 1 ) );
			return;
		}

		startLenis();
		initAnimated( root );
	}

	// ── Bootstrapping ────────────────────────────────────────────────────────
	function initAll() {
		var roots = document.querySelectorAll( '[data-th-hero]' );
		Array.prototype.forEach.call( roots, initHero );
	}

	// Elementor front end + editor: init each widget as it becomes ready.
	var hookAdded = false;
	function registerElementorHook() {
		if ( hookAdded || ! window.elementorFrontend || ! window.elementorFrontend.hooks ) {
			return;
		}
		hookAdded = true;
		window.elementorFrontend.hooks.addAction(
			'frontend/element_ready/tendernism_cinematic_hero.default',
			function ( $scope ) {
				var el = $scope && $scope[ 0 ]
					? $scope[ 0 ].querySelector( '[data-th-hero]' )
					: null;
				if ( ! el ) {
					return;
				}
				// Only in the editor do we tear down and re-init so live content
				// edits re-render cleanly. On the front end initHero's own guard
				// prevents any double init between this hook and the fallback.
				if ( isEditMode() && el._thHeroDestroy ) {
					el._thHeroDestroy();
				}
				initHero( el );
			}
		);
	}

	// Register now if Elementor already initialised, and also on its init event —
	// whichever comes first (guarded so the hook is only added once).
	registerElementorHook();
	window.addEventListener( 'elementor/frontend/init', registerElementorHook );

	// Fallback for non-Elementor contexts (or if the hook never fires).
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initAll );
	} else {
		initAll();
	}
} )();
