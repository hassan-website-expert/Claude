/**
 * Tendernism Preloader — removes the branded overlay once the page is ready.
 *
 * Hides on window "load" (all resources in), with a hard maximum-wait cap so a
 * slow or failed asset never blocks the site, and a minimum on-screen time so
 * the brand never merely flashes. Optionally remembers, per browser session,
 * that the visitor has already seen it.
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
	var done  = false;
	var hardTimer = 0;

	// Prevent the page scrolling underneath the overlay while it is up.
	root.classList.add( 'thp-lock' );

	function remove() {
		if ( pre && pre.parentNode ) {
			pre.parentNode.removeChild( pre );
		}
		root.classList.remove( 'thp-lock' );
	}

	function hide() {
		if ( done ) {
			return;
		}
		done = true;
		clearTimeout( hardTimer );

		var wait = Math.max( 0, minShow - ( Date.now() - start ) );
		setTimeout( function () {
			pre.classList.add( 'is-hidden' );
			if ( once ) {
				try { sessionStorage.setItem( 'thpSeen', '1' ); } catch ( e ) {}
			}
			pre.addEventListener( 'transitionend', remove, { once: true } );
			setTimeout( remove, 1000 ); // safety in case transitionend never fires
		}, wait );
	}

	// Ready when the whole page (images, fonts, etc.) has loaded.
	if ( document.readyState === 'complete' ) {
		hide();
	} else {
		window.addEventListener( 'load', hide );
	}

	// Hard cap — never let the overlay overstay its welcome.
	hardTimer = setTimeout( hide, maxWait );
} )();
