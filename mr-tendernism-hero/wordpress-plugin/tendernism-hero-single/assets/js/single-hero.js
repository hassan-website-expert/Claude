/**
 * single-hero.js — the vanilla motion engine for the Tendernism Single Hero.
 *
 * A framework-free port of the React single-clip controller (useCinematicHero +
 * buildIntroTimeline + the Lenis wiring). It:
 *   • Plays ONE continuous clip once (walk-in → lid lift → smoke), then EITHER
 *     seamlessly loops its smoke-filled tail via a crossfade between two stacked
 *     <video> layers (so it never freezes), OR holds on the final frame while the
 *     CSS smoke haze keeps rising — chosen by the "Seamless tail loop" switch.
 *   • Plays the copy intro (crown draw, wordmark, tagline, CTA) once on load, a
 *     beat after the lid opens, so the footage reads first.
 *   • Hands off to the next section on scroll by gently fading the copy out — no
 *     pin, no scrubbing, no hard cut.
 *   • Optionally, a short beat after the clip ends (hold mode), nudges the page
 *     down a touch to hint there's more below — once, only if still at the top,
 *     cancelled by any manual scroll.
 *   • Picks the portrait clip on phones and the landscape clip elsewhere, once.
 *   • Drives one global Lenis smooth-scroll instance.
 *   • Falls back to a static hold in the Elementor editor and for reduced motion.
 *
 * Reads all configuration from data-* attributes printed by the PHP widget.
 */
( function () {
	'use strict';

	var lenis = null;
	var lenisStarted = false;

	// ── Mobile viewport guard ────────────────────────────────────────────────
	// Some themes / page-builder templates ship without the mobile viewport
	// meta tag. Without it, phones render the whole page at a ~980px desktop
	// width, so NO responsive CSS (ours or Elementor's own) ever triggers — the
	// hero looks like the desktop layout squeezed onto the phone even though the
	// Elementor mobile PREVIEW looks correct (the editor forces a device width on
	// its iframe). Add the tag only when it is genuinely absent — a no-op on the
	// vast majority of sites that already have one, so it can never double up.
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
			duration: 1.25,
			easing: function ( t ) { return Math.min( 1, 1.001 - Math.pow( 2, -10 * t ) ); },
			smoothWheel: true,
			wheelMultiplier: 0.9,
			touchMultiplier: 1.1,
		} );
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

	// Choose the poster the same way as the source: portrait on phones, else
	// landscape, each falling back to the other if only one is provided.
	function posterFor( video, mobile ) {
		var desktop = video.getAttribute( 'data-poster-desktop' ) || '';
		var portrait = video.getAttribute( 'data-poster-mobile' ) || '';
		if ( mobile ) {
			return portrait || desktop;
		}
		return desktop || portrait;
	}

	function num( el, attr, fallback ) {
		var raw = parseFloat( el.getAttribute( attr ) );
		return isNaN( raw ) ? fallback : raw;
	}

	function flag( el, attr ) {
		return el.getAttribute( attr ) === '1';
	}

	// ── Intro timeline (ported from heroTimeline.js) ─────────────────────────
	function buildIntroTimeline( gsap, sceneEl ) {
		var tl = gsap.timeline( { paused: true, defaults: { ease: 'power2.out' } } );
		if ( ! sceneEl ) {
			return tl;
		}
		var items = Array.prototype.slice.call( sceneEl.querySelectorAll( '[data-ths-text]' ) );
		if ( ! items.length ) {
			return tl;
		}

		// Crown line-draw — the logo completing itself under the wordmark.
		var crownPaths = Array.prototype.slice.call( sceneEl.querySelectorAll( '[data-ths-crown] path' ) );
		crownPaths.forEach( function ( path ) {
			var len = path.getTotalLength ? path.getTotalLength() : 200;
			gsap.set( path, { strokeDasharray: len, strokeDashoffset: len } );
			tl.to( path, { strokeDashoffset: 0, duration: 1.1, ease: 'power1.inOut' }, 0 );
		} );

		// A slow rise out of soft focus, line by line — a held breath, not a snap.
		tl.fromTo(
			items,
			{ autoAlpha: 0, y: 34, filter: 'blur(8px)' },
			{ autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.14 },
			0.1
		);

		return tl;
	}

	// ── Static fallback (editor preview / reduced motion) ────────────────────
	function initStatic( root ) {
		root.classList.add( 'ths-hero--static' );
		var mobile = isMobile();
		var videos = Array.prototype.slice.call( root.querySelectorAll( '[data-ths-video]' ) );

		videos.forEach( function ( v, i ) {
			if ( i === 0 ) {
				v.src = sourceFor( v, mobile );
				var poster = posterFor( v, mobile );
				if ( poster ) { v.poster = poster; }
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

		wireSound( root );
	}

	// ── Ambient sound toggle ─────────────────────────────────────────────────
	function wireSound( root ) {
		var btn = root.querySelector( '[data-ths-sound]' );
		var audio = root.querySelector( '[data-ths-ambient]' );
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

		var layers = Array.prototype.slice.call( root.querySelectorAll( '[data-ths-video]' ) );
		if ( layers.length < 2 ) {
			return;
		}
		var sceneEl = root.querySelector( '[data-ths-scene]' );
		var copyEl = root.querySelector( '[data-ths-copy]' );

		var mobile = isMobile();
		var ambientLoop = flag( root, 'data-ambient-loop' );
		var loopTail = num( root, 'data-loop-tail', 2.0 );
		var crossfade = num( root, 'data-crossfade', 0.6 );
		var copyDelay = num( root, 'data-copy-delay', 1.4 );
		var playbackRate = num( root, 'data-playback', 1.0 );

		var nudgeEnabled = flag( root, 'data-nudge-enabled' );
		var nudgeDelay = num( root, 'data-nudge-delay', 2500 );
		var nudgeDist = num( root, 'data-nudge-distance', 0.4 );

		// The first layer always loads. The SECOND layer is only needed for the
		// crossfade loop — in hold mode we never assign its source, saving a full
		// second video download (the biggest single speed win, since hold is the
		// default). In loop mode the browser serves the 2nd copy from cache.
		var src = sourceFor( layers[ 0 ], mobile );
		layers[ 0 ].src = src;
		if ( ambientLoop ) {
			layers[ 1 ].src = src;
			layers[ 1 ].preload = 'auto';
		}

		// Swap in the device-appropriate poster (the PHP prints a desktop-first
		// fallback in the poster attribute; correct it to the mobile still here).
		var poster = posterFor( layers[ 0 ], mobile );
		if ( poster ) {
			layers[ 0 ].poster = poster;
			if ( ambientLoop ) {
				layers[ 1 ].poster = poster;
			}
		}

		var intro = buildIntroTimeline( gsap, sceneEl );
		var introCall = null;

		// ── Seamless crossfade loop engine ───────────────────────────────────
		var front = layers[ 0 ];
		var back = layers[ 1 ];
		var swapping = false;
		var rafId = 0;
		var started = false;

		function play( v ) {
			v.playbackRate = playbackRate;
			var p = v.play();
			if ( p && p.catch ) { p.catch( function () {} ); }
		}

		// ── Post-clip auto-nudge ─────────────────────────────────────────────
		var nudged = false;
		var nudgeTimer = 0;
		function doNudge() {
			if ( nudged || window.scrollY > 8 ) {
				return;
			}
			nudged = true;
			var targetY = Math.round( window.innerHeight * nudgeDist );
			if ( lenis && lenis.scrollTo ) {
				lenis.scrollTo( targetY, { duration: 1.4 } );
			} else {
				window.scrollTo( { top: targetY, behavior: 'smooth' } );
			}
		}
		function cancelNudge() {
			nudged = true;
			clearTimeout( nudgeTimer );
		}
		function scheduleNudge() {
			if ( nudged ) {
				return;
			}
			nudgeTimer = setTimeout( doNudge, nudgeDelay );
		}
		if ( nudgeEnabled ) {
			window.addEventListener( 'wheel', cancelNudge, { passive: true } );
			window.addEventListener( 'touchmove', cancelNudge, { passive: true } );
			window.addEventListener( 'keydown', cancelNudge );
		}

		function tick() {
			rafId = requestAnimationFrame( tick );
			var v = front;
			var d = v.duration;
			if ( swapping || ! isFinite( d ) || d <= 0 ) {
				return;
			}
			if ( v.currentTime >= d - crossfade ) {
				swapping = true;
				var loopStart = Math.max( 0, d - loopTail );
				try { back.currentTime = loopStart; } catch ( e ) {}
				play( back );
				gsap.to( front, { autoAlpha: 0, duration: crossfade, ease: 'none' } );
				gsap.to( back, {
					autoAlpha: 1,
					duration: crossfade,
					ease: 'none',
					onComplete: function () {
						var prev = front;
						front = back;
						back = prev;
						back.pause();
						swapping = false;
					},
				} );
			}
		}

		function begin() {
			if ( started ) {
				return;
			}
			started = true;
			gsap.set( front, { autoAlpha: 1 } );
			gsap.set( back, { autoAlpha: 0 } );
			try { front.currentTime = 0; } catch ( e ) {}
			play( front );
			if ( ambientLoop ) {
				rafId = requestAnimationFrame( tick );
			} else if ( nudgeEnabled ) {
				// Clip plays once and holds — schedule the nudge when it finishes.
				front.addEventListener( 'ended', scheduleNudge, { once: true } );
			}
			introCall = gsap.delayedCall( copyDelay, function () { intro.play( 0 ); } );
		}

		// Start as soon as the first layer has enough data (first frame decoded).
		if ( layers[ 0 ].readyState >= 2 ) {
			begin();
		} else {
			layers[ 0 ].addEventListener( 'loadeddata', begin, { once: true } );
			layers[ 0 ].addEventListener( 'canplay', begin, { once: true } );
		}

		// ── Scroll handoff — fade the copy as the hero leaves, no pin, no cut ─
		var st = null;
		if ( copyEl ) {
			st = ScrollTrigger.create( {
				trigger: root,
				start: 'top top',
				end: 'bottom top',
				scrub: true,
				onUpdate: function ( self ) {
					gsap.set( copyEl, { autoAlpha: 1 - self.progress, y: -self.progress * 60 } );
				},
			} );
		}

		wireSound( root );

		if ( document.fonts && document.fonts.ready ) {
			document.fonts.ready.then( function () { ScrollTrigger.refresh(); } );
		}

		// Expose a teardown so the Elementor editor can re-init cleanly.
		root._thsHeroDestroy = function () {
			cancelAnimationFrame( rafId );
			clearTimeout( nudgeTimer );
			window.removeEventListener( 'wheel', cancelNudge );
			window.removeEventListener( 'touchmove', cancelNudge );
			window.removeEventListener( 'keydown', cancelNudge );
			layers.forEach( function ( v ) { v.removeEventListener( 'ended', scheduleNudge ); } );
			if ( introCall ) { introCall.kill(); }
			intro.kill();
			if ( st ) { st.kill(); }
			layers.forEach( function ( v ) { v.pause(); } );
			delete root._thsHeroInit;
		};
	}

	// ── Entry point per widget instance ──────────────────────────────────────
	function initHero( root ) {
		if ( ! root || root._thsHeroInit ) {
			return;
		}
		if ( typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined' ) {
			return;
		}
		root._thsHeroInit = true;

		if ( isEditMode() || prefersReducedMotion() ) {
			// Editor / reduced motion: hold on the clip with copy shown (static).
			initStatic( root );
			return;
		}

		startLenis();
		initAnimated( root );
	}

	// ── Bootstrapping ────────────────────────────────────────────────────────
	function initAll() {
		var roots = document.querySelectorAll( '[data-ths-hero]' );
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
			'frontend/element_ready/tendernism_single_hero.default',
			function ( $scope ) {
				var el = $scope && $scope[ 0 ]
					? $scope[ 0 ].querySelector( '[data-ths-hero]' )
					: null;
				if ( ! el ) {
					return;
				}
				// Only in the editor do we tear down and re-init so live content
				// edits re-render cleanly. On the front end initHero's own guard
				// prevents any double init between this hook and the fallback.
				if ( isEditMode() && el._thsHeroDestroy ) {
					el._thsHeroDestroy();
				}
				initHero( el );
			}
		);
	}

	// Make sure phones actually use their real width before anything else runs,
	// so the responsive layout can take effect on the live front end.
	ensureViewportMeta();

	registerElementorHook();
	window.addEventListener( 'elementor/frontend/init', registerElementorHook );

	// Fallback for non-Elementor contexts (or if the hook never fires).
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', initAll );
	} else {
		initAll();
	}
} )();
