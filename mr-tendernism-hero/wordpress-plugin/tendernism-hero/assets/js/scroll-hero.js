/**
 * scroll-hero.js — the scroll-SCRUBBED motion engine for the Tendernism
 * "Cinematic Hero — Scroll" widget.
 *
 * This is a SEPARATE engine from cinematic-hero.js (the play/loop widget). Here
 * the video itself is tied to the scroll position: scrolling down plays the
 * footage forward, scrolling up rewinds it, and the film never "ends" and never
 * loops — there is always exactly the frame that matches where you are on the
 * page. That is the behaviour the client asked to trial as an alternative.
 *
 * How the smoothness is achieved:
 *   • The clips are re-encoded all-keyframe, so seeking to any frame is instant
 *     (no decode-from-nearest-keyframe stutter). This engine only SEEKS video —
 *     it never relies on real-time playback for the scrub.
 *   • Lenis smooths the scroll; ScrollTrigger maps it to a 0..1 progress; and a
 *     requestAnimationFrame loop eases the applied video time toward that
 *     progress (a gentle lerp), so even a jerky finger drag becomes a silky,
 *     weighted film transport. Redundant/needless seeks are skipped.
 *   • No per-frame CSS filters, no always-on compositor animations — the only
 *     work each frame is a couple of opacity writes and one video seek.
 *
 * Scoped entirely under .thx-hero / data-thx-* so it can run at the same time as
 * the play/loop "Cinematic Hero" and the "Single Hero" widgets.
 */
( function () {
	'use strict';

	var REVEAL_AT_DEFAULT = 0.3;
	var REVEAL_BAND = 0.2;        // how much scroll the copy reveal takes.
	var OUT_START = 0.82;         // non-finale copy starts fading out here (localP).
	var OUT_BAND = 0.14;
	var CROSSFADE_MIN = 0.06;     // clamp for the crossfade band width (global frac).
	var SEEK_EPS = 1 / 50;        // don't seek for sub-frame deltas (~20ms).

	var lenisStarted = false;
	var lenis = null;

	// ── Mobile viewport guard ────────────────────────────────────────────────
	function ensureViewportMeta() {
		if ( ! document.head || document.querySelector( 'meta[name="viewport"]' ) ) {
			return;
		}
		var meta = document.createElement( 'meta' );
		meta.name = 'viewport';
		meta.content = 'width=device-width, initial-scale=1';
		document.head.appendChild( meta );
	}

	// ── Lenis (one instance drives the whole page) ───────────────────────────
	function startLenis() {
		if ( lenisStarted || typeof window.Lenis === 'undefined' ) {
			return;
		}
		lenisStarted = true;
		lenis = new window.Lenis( {
			lerp: 0.1,
			smoothWheel: true,
			syncTouch: true,
			syncTouchLerp: 0.075,
			touchInertiaMultiplier: 24,
			gestureOrientation: 'vertical',
		} );
		lenis.on( 'scroll', window.ScrollTrigger.update );
		window.gsap.ticker.add( function ( time ) {
			lenis.raf( time * 1000 );
		} );
		window.gsap.ticker.lagSmoothing( 0 );

		if ( window.ScrollTrigger && window.ScrollTrigger.config ) {
			window.ScrollTrigger.config( { ignoreMobileResize: true } );
		}
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

	function sourceFor( video, mobile ) {
		var desktop = video.getAttribute( 'data-video-desktop' ) || '';
		var portrait = video.getAttribute( 'data-video-mobile' ) || '';
		return mobile && portrait ? portrait : desktop;
	}

	function applyPoster( video, mobile ) {
		var desktop = video.getAttribute( 'data-poster-desktop' ) || '';
		var portrait = video.getAttribute( 'data-poster-mobile' ) || '';
		var poster = mobile && portrait ? portrait : ( desktop || portrait );
		if ( poster ) {
			video.poster = poster;
		}
	}

	function num( el, attr, fallback ) {
		var raw = parseFloat( el.getAttribute( attr ) );
		return isNaN( raw ) ? fallback : raw;
	}

	function clamp01( v ) {
		return v < 0 ? 0 : ( v > 1 ? 1 : v );
	}

	// Smoothstep — a soft 0→1 ramp, nicer than a linear crossfade.
	function smoothstep( t ) {
		t = clamp01( t );
		return t * t * ( 3 - 2 * t );
	}

	// ── Static fallback (editor preview / reduced motion) ────────────────────
	// Show one scene's copy over a held frame of its clip. No scrubbing.
	function initStatic( root, holdIndex ) {
		root.classList.add( 'thx-hero--static' );
		var mobile = isMobile();
		var videos = Array.prototype.slice.call( root.querySelectorAll( '[data-thx-video]' ) );
		var scenes = Array.prototype.slice.call( root.querySelectorAll( '[data-thx-scene]' ) );

		videos.forEach( function ( v, i ) {
			applyPoster( v, mobile );
			if ( i === holdIndex ) {
				v.src = sourceFor( v, mobile );
				v.muted = true;
				v.setAttribute( 'playsinline', '' );
				v.classList.add( 'is-active' );
				v.style.opacity = '1';
				// Hold a representative frame once we can seek.
				var seekIn = function () {
					try {
						v.currentTime = v.duration && isFinite( v.duration ) ? v.duration * 0.5 : 0.1;
					} catch ( e ) {}
				};
				if ( v.readyState >= 1 ) {
					seekIn();
				} else {
					v.addEventListener( 'loadedmetadata', seekIn, { once: true } );
				}
			} else {
				v.style.opacity = '0';
			}
		} );

		scenes.forEach( function ( s, i ) {
			s.style.opacity = i === holdIndex ? '1' : '0';
		} );

		var poster = root.querySelector( '[data-thx-poster]' );
		if ( poster ) {
			poster.classList.add( 'is-hidden' );
		}

		wireSound( root );
	}

	// ── Ambient sound toggle ─────────────────────────────────────────────────
	function wireSound( root ) {
		var btn = root.querySelector( '[data-thx-sound]' );
		var audio = root.querySelector( '[data-thx-ambient]' );
		if ( ! btn || ! audio ) {
			return;
		}

		var targetVol = num( audio, 'data-volume', 0.5 );
		var on = false;
		var raf = 0;

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

	// ── Full scrubbed hero ────────────────────────────────────────────────────
	function initAnimated( root ) {
		var gsap = window.gsap;
		var ScrollTrigger = window.ScrollTrigger;
		gsap.registerPlugin( ScrollTrigger );

		var stage = root.querySelector( '[data-thx-stage]' );
		var videoEls = Array.prototype.slice.call( root.querySelectorAll( '[data-thx-video]' ) );
		var sceneEls = Array.prototype.slice.call( root.querySelectorAll( '[data-thx-scene]' ) );
		var count = videoEls.length;
		if ( ! count || ! sceneEls.length ) {
			return;
		}

		var mobile = isMobile();
		var perScene = num( root, 'data-scroll-per-scene', 0.9 );   // viewport-heights of scroll per scene.
		var endHold = num( root, 'data-end-hold', 0.6 );            // extra viewport-heights holding the finale.
		var crossfade = num( root, 'data-crossfade', 0.14 );        // crossfade width, as a fraction of a scene.
		var smoothing = num( root, 'data-seek-smoothing', 0.16 );   // lerp factor for the video transport.

		// Phones get a touch more scroll room per scene so a short swipe glides a
		// beat instead of racing through it.
		if ( mobile ) {
			perScene *= 1.3;
		}
		smoothing = Math.max( 0.03, Math.min( 0.6, smoothing ) );

		// Per-scene durations (filled from metadata). Start with a sane guess so the
		// engine works before metadata lands, then self-corrects.
		var durations = [];
		var applied = [];
		var i;
		for ( i = 0; i < count; i++ ) {
			durations[ i ] = 6;
			applied[ i ] = 0;
		}

		// Prepare each video: device-correct source + poster, muted, inline, and a
		// decode warm-up so the very first seek on iOS actually paints a frame.
		videoEls.forEach( function ( v, idx ) {
			applyPoster( v, mobile );
			v.muted = true;
			v.defaultMuted = true;
			v.setAttribute( 'muted', '' );
			v.setAttribute( 'playsinline', '' );
			v.playsInline = true;
			v.preload = 'auto';
			if ( ! v.src ) {
				v.src = sourceFor( v, mobile );
			}
			v.addEventListener( 'loadedmetadata', function () {
				if ( v.duration && isFinite( v.duration ) && v.duration > 0 ) {
					durations[ idx ] = v.duration;
				}
			} );
			// Warm the decoder: a muted play immediately paused makes Safari/iOS
			// decode frames so subsequent currentTime seeks render instantly.
			var warm = function () {
				try {
					var p = v.play();
					if ( p && p.then ) {
						p.then( function () { v.pause(); try { v.currentTime = idx === 0 ? 0.001 : 0; } catch ( e ) {} } )
							.catch( function () {} );
					} else {
						v.pause();
					}
				} catch ( e ) {}
			};
			if ( v.readyState >= 2 ) {
				warm();
			} else {
				v.addEventListener( 'loadeddata', warm, { once: true } );
			}
		} );

		// Also warm on the first user gesture (covers iOS low-power / autoplay
		// blocks where the load-time warm-up was refused).
		var warmedByGesture = false;
		function gestureWarm() {
			if ( warmedByGesture ) { return; }
			warmedByGesture = true;
			videoEls.forEach( function ( v ) {
				try {
					var p = v.play();
					if ( p && p.then ) { p.then( function () { v.pause(); } ).catch( function () {} ); }
				} catch ( e ) {}
			} );
		}
		window.addEventListener( 'touchstart', gestureWarm, { passive: true, once: true } );
		window.addEventListener( 'pointerdown', gestureWarm, { once: true } );

		// Crown stroke setup (drawn in sync with the reveal).
		var crownPaths = Array.prototype.slice.call( root.querySelectorAll( '[data-thx-crown] path' ) );
		crownPaths.forEach( function ( path ) {
			var len = path.getTotalLength ? path.getTotalLength() : 200;
			path._thxLen = len;
			path.style.strokeDasharray = len;
			path.style.strokeDashoffset = len;
		} );

		// Cache the copy items per scene so the render loop doesn't query the DOM.
		var sceneItems = sceneEls.map( function ( s ) {
			return Array.prototype.slice.call( s.querySelectorAll( '[data-thx-text]' ) );
		} );
		var sceneReveal = sceneEls.map( function ( s ) {
			var r = s.getAttribute( 'data-reveal' );
			return r !== null && r !== '' ? parseFloat( r ) : REVEAL_AT_DEFAULT;
		} );

		// Opening poster: fade out once the first clip has a real frame.
		var posterEl = root.querySelector( '[data-thx-poster]' );
		var posterHidden = false;
		var posterTimer = 0;
		function hidePoster() {
			if ( posterHidden || ! posterEl ) { return; }
			posterHidden = true;
			clearTimeout( posterTimer );
			posterEl.classList.add( 'is-hidden' );
		}
		if ( posterEl ) {
			videoEls[ 0 ].addEventListener( 'loadeddata', hidePoster, { once: true } );
			videoEls[ 0 ].addEventListener( 'seeked', hidePoster, { once: true } );
			posterTimer = setTimeout( hidePoster, 2500 );
		} else {
			posterHidden = true;
		}

		// Scroll cue hides after the visitor starts scrubbing.
		var cueEl = root.querySelector( '[data-thx-cue]' );

		// ── Geometry: map global scroll progress (0..1) to per-scene time ────────
		// Boundaries are weighted by clip duration so the film transports at an even
		// pace across scenes. A trailing "hold" band keeps the finale on screen.
		var starts = [];  // global-frac where each scene begins
		var ends = [];    // global-frac where each scene's PLAYBACK ends (reaches its last frame)
		function recomputeGeometry() {
			var total = 0;
			for ( var k = 0; k < count; k++ ) { total += durations[ k ] || 0.0001; }
			// Fraction of the whole scroll spent actually transporting footage; the
			// remainder is the finale hold.
			var totalVh = count * perScene + endHold;
			var playFrac = totalVh > 0 ? ( count * perScene ) / totalVh : 1;
			var acc = 0;
			for ( var j = 0; j < count; j++ ) {
				var w = ( durations[ j ] || 0.0001 ) / total; // share of play region
				starts[ j ] = acc * playFrac;
				acc += w;
				ends[ j ] = acc * playFrac;
			}
			// Last scene reaches its final frame at playFrac; [playFrac..1] holds it.
			ends[ count - 1 ] = playFrac;
		}
		recomputeGeometry();

		// ── Render one frame from a global progress value ────────────────────────
		var lastSceneOpacity = [];
		for ( i = 0; i < count; i++ ) { lastSceneOpacity[ i ] = -1; }
		var isFinaleIndex = count - 1;

		function applyProgress( g ) {
			g = clamp01( g );
			for ( var s = 0; s < count; s++ ) {
				var st0 = starts[ s ];
				var en0 = ends[ s ];
				var span = Math.max( 0.0001, en0 - st0 );
				var localP = clamp01( ( g - st0 ) / span );

				// Crossfade opacity from the shared boundaries.
				var cfW = Math.max( CROSSFADE_MIN, crossfade * span );
				var op = 1;
				if ( s > 0 ) {
					// fade IN across the boundary with the previous scene (centered on st0)
					op *= smoothstep( ( g - ( st0 - cfW ) ) / ( 2 * cfW ) );
				}
				if ( s < count - 1 ) {
					// fade OUT across the boundary with the next scene (centered on en0)
					op *= 1 - smoothstep( ( g - ( en0 - cfW ) ) / ( 2 * cfW ) );
				}
				op = clamp01( op );

				var v = videoEls[ s ];

				// Seek this clip toward its target frame (only when it is visible, to
				// avoid pointless decoding of off-screen clips).
				if ( op > 0.004 ) {
					var target = localP * ( durations[ s ] || 0 );
					applied[ s ] += ( target - applied[ s ] ) * smoothing;
					if ( ! v.seeking && v.readyState >= 1 &&
						Math.abs( applied[ s ] - v.currentTime ) > SEEK_EPS ) {
						try { v.currentTime = applied[ s ]; } catch ( e ) {}
					}
					if ( ! v.classList.contains( 'is-active' ) ) {
						v.classList.add( 'is-active' );
					}
				} else if ( v.classList.contains( 'is-active' ) ) {
					v.classList.remove( 'is-active' );
				}
				v.style.opacity = op.toFixed( 3 );

				// Scene copy: container follows the crossfade; items reveal on localP.
				var sceneEl = sceneEls[ s ];
				if ( op <= 0.004 ) {
					if ( lastSceneOpacity[ s ] !== 0 ) {
						sceneEl.style.opacity = '0';
						lastSceneOpacity[ s ] = 0;
					}
					continue;
				}
				sceneEl.style.opacity = op.toFixed( 3 );
				lastSceneOpacity[ s ] = op;

				var items = sceneItems[ s ];
				if ( ! items.length ) { continue; }

				var revP = smoothstep( ( localP - sceneReveal[ s ] ) / REVEAL_BAND );
				var eff = revP;
				if ( s !== isFinaleIndex ) {
					// Non-finale copy also eases out before its scene ends.
					eff = revP * ( 1 - smoothstep( ( localP - OUT_START ) / OUT_BAND ) );
				}
				var ty = ( 1 - eff ) * 34;
				for ( var it = 0; it < items.length; it++ ) {
					var el = items[ it ];
					el.style.opacity = eff.toFixed( 3 );
					el.style.transform = 'translate3d(0,' + ty.toFixed( 1 ) + 'px,0)';
				}
				for ( var cp = 0; cp < crownPaths.length; cp++ ) {
					if ( sceneEl.contains( crownPaths[ cp ] ) ) {
						crownPaths[ cp ].style.strokeDashoffset = ( crownPaths[ cp ]._thxLen * ( 1 - eff ) ).toFixed( 1 );
					}
				}
			}

			if ( cueEl ) {
				if ( g > 0.02 ) { cueEl.classList.add( 'is-hidden' ); }
				else { cueEl.classList.remove( 'is-hidden' ); }
			}
			if ( g > 0.01 ) { hidePoster(); }
		}

		// ── ScrollTrigger drives progress; a ticker eases the transport ──────────
		var progress = 0;
		var st = ScrollTrigger.create( {
			trigger: root,
			start: 'top top',
			end: function () {
				return '+=' + window.innerHeight * ( count * perScene + endHold );
			},
			pin: stage,
			pinSpacing: true,
			scrub: true,
			anticipatePin: 1,
			invalidateOnRefresh: true,
			onRefreshInit: recomputeGeometry,
			onUpdate: function ( self ) {
				progress = self.progress;
			},
		} );

		function tick() {
			applyProgress( progress );
		}
		gsap.ticker.add( tick );

		wireSound( root );

		// Recompute geometry + repaint once real durations / fonts are known.
		Promise.resolve().then( function () {
			var wait = videoEls.map( function ( v ) {
				return new Promise( function ( res ) {
					if ( v.readyState >= 1 ) { res(); return; }
					v.addEventListener( 'loadedmetadata', function () { res(); }, { once: true } );
					setTimeout( res, 4000 );
				} );
			} );
			Promise.all( wait ).then( function () {
				recomputeGeometry();
				ScrollTrigger.refresh();
			} );
		} );
		if ( document.fonts && document.fonts.ready ) {
			document.fonts.ready.then( function () { ScrollTrigger.refresh(); } );
		}

		// Teardown for clean re-init in the Elementor editor.
		root._thxHeroDestroy = function () {
			gsap.ticker.remove( tick );
			st.kill();
			clearTimeout( posterTimer );
			window.removeEventListener( 'touchstart', gestureWarm );
			window.removeEventListener( 'pointerdown', gestureWarm );
			videoEls.forEach( function ( v ) { try { v.pause(); } catch ( e ) {} } );
			delete root._thxHeroInit;
		};
	}

	// ── Entry point per widget instance ──────────────────────────────────────
	function initHero( root ) {
		if ( ! root || root._thxHeroInit ) {
			return;
		}
		if ( typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined' ) {
			return;
		}
		root._thxHeroInit = true;

		if ( isEditMode() ) {
			initStatic( root, 0 );
			return;
		}
		if ( prefersReducedMotion() ) {
			var sceneCount = root.querySelectorAll( '[data-thx-scene]' ).length;
			initStatic( root, Math.max( 0, sceneCount - 1 ) );
			return;
		}

		startLenis();
		initAnimated( root );
	}

	// ── Bootstrapping ────────────────────────────────────────────────────────
	function initAll() {
		var roots = document.querySelectorAll( '[data-thx-hero]' );
		Array.prototype.forEach.call( roots, initHero );
	}

	var hookAdded = false;
	function registerElementorHook() {
		if ( hookAdded || ! window.elementorFrontend || ! window.elementorFrontend.hooks ) {
			return;
		}
		hookAdded = true;
		window.elementorFrontend.hooks.addAction(
			'frontend/element_ready/tendernism_scroll_hero.default',
			function ( $scope ) {
				var el = $scope && $scope[ 0 ]
					? $scope[ 0 ].querySelector( '[data-thx-hero]' )
					: null;
				if ( ! el ) {
					return;
				}
				if ( isEditMode() && el._thxHeroDestroy ) {
					el._thxHeroDestroy();
				}
				initHero( el );
			}
		);
	}

	ensureViewportMeta();

	registerElementorHook();
	window.addEventListener( 'elementor/frontend/init', registerElementorHook );

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initAll );
	} else {
		initAll();
	}
} )();
