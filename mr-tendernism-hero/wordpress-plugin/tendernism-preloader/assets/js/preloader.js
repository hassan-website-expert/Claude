/**
 * Tendernism Preloader — removes the branded overlay once the page is ready.
 *
 * Hides on window "load" (all resources in), with a hard maximum-wait cap so a
 * slow or failed asset never blocks the site, and a minimum on-screen time so
 * the brand never merely flashes. Optionally remembers, per browser session,
 * that the visitor has already seen it.
 *
 * When the "Number counter" style is active, a percentage climbs smoothly while
 * the page loads and lands on exactly 100% at the moment the overlay fades.
 * Because browsers expose no true "page is 40% loaded" figure, the number is an
 * eased estimate: it crawls up over time, moves faster once the DOM is parsed,
 * and snaps to 100 when the real load/ready signal arrives.
 */
( function () {
	'use strict';

	var pre = document.querySelector( '.thp-preloader' );
	if ( ! pre ) {
		return;
	}

	var maxWait = parseInt( pre.getAttribute( 'data-max-wait' ), 10 );
	var minShow = parseInt( pre.getAttribute( 'data-min-show' ), 10 );
	var once    = pre.getAttribute( 'data-once' ) === '1';
	if ( isNaN( maxWait ) ) { maxWait = 6000; }
	if ( isNaN( minShow ) ) { minShow = 600; }

	var root  = document.documentElement;
	var start = Date.now();
	var done  = false; // fade-out started
	var ready = false; // load event or hard cap reached -> drive to 100%
	var hardTimer = 0;

	var numEl  = pre.querySelector( '.thp-preloader__num' );
	var fillEl = pre.querySelector( '.thp-preloader__fill' );
	var hasCounter = !! numEl;

	// Prevent the page scrolling underneath the overlay while it is up.
	root.classList.add( 'thp-lock' );

	function remove() {
		if ( pre && pre.parentNode ) {
			pre.parentNode.removeChild( pre );
		}
		root.classList.remove( 'thp-lock' );
	}

	function fadeOut() {
		if ( done ) {
			return;
		}
		done = true;
		clearTimeout( hardTimer );
		pre.classList.add( 'is-hidden' );
		if ( once ) {
			try { sessionStorage.setItem( 'thpSeen', '1' ); } catch ( e ) {}
		}
		pre.addEventListener( 'transitionend', remove, { once: true } );
		setTimeout( remove, 1000 ); // safety in case transitionend never fires
	}

	function markReady() {
		ready = true;
	}

	// Signals that the page is ready: the load event, or the hard cap.
	if ( document.readyState === 'complete' ) {
		markReady();
	} else {
		window.addEventListener( 'load', markReady );
	}
	hardTimer = setTimeout( markReady, maxWait );

	// ── Number-counter style: animate a percentage toward 100 ──────────────────
	if ( hasCounter ) {
		var shown = 0;
		var reduce = window.matchMedia && window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

		var paint = function ( v ) {
			var n = v < 0 ? 0 : ( v > 100 ? 100 : Math.round( v ) );
			numEl.textContent = n;
			if ( fillEl ) {
				fillEl.style.width = n + '%';
			}
		};

		if ( reduce ) {
			// No easing: show 0, then jump to 100 when ready (respecting min-show).
			paint( 0 );
			var finishNow = function () {
				paint( 100 );
				var wait = Math.max( 0, minShow - ( Date.now() - start ) );
				setTimeout( fadeOut, wait );
			};
			var check = setInterval( function () {
				if ( ready ) {
					clearInterval( check );
					finishNow();
				}
			}, 60 );
			return;
		}

		var tick = function () {
			var elapsed = Date.now() - start;
			var target;

			if ( ready ) {
				target = 100;
			} else {
				// Asymptotic crawl: eases toward a ceiling that lifts once the DOM
				// has parsed, so the number never stalls but also never "arrives".
				var ceil = document.readyState === 'loading' ? 80 : 93;
				target = ceil * ( 1 - Math.exp( -elapsed / ( maxWait * 0.45 ) ) );
			}

			// Ease the displayed value toward the target; faster while finishing.
			shown += ( target - shown ) * ( ready ? 0.3 : 0.09 );
			if ( shown > target ) {
				shown = target;
			}
			paint( shown );

			// Finish only when at 100 AND the brand has shown for its minimum.
			if ( ready && shown >= 99.5 && elapsed >= minShow ) {
				paint( 100 );
				fadeOut();
				return;
			}
			requestAnimationFrame( tick );
		};

		requestAnimationFrame( tick );
		return;
	}

	// ── Other styles (bar / ring / pulse): simple min-show + hard-cap hide ─────
	var hide = function () {
		var wait = Math.max( 0, minShow - ( Date.now() - start ) );
		setTimeout( fadeOut, wait );
	};
	if ( ready ) {
		hide();
	} else {
		var poll = setInterval( function () {
			if ( ready ) {
				clearInterval( poll );
				hide();
			}
		}, 60 );
	}
} )();
