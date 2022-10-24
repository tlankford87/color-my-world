/*
	Ethereal by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	// Settings.
		var settings = {

			// Keyboard shortcuts.
				keyboardShortcuts: {

					// If true, enables scrolling via keyboard shortcuts.
						enabled: true,

					// Sets the distance to scroll when using the left/right arrow keys.
						distance: 50

				},

			// // Scroll wheel.
			// 	scrollWheel: {

			// 		// If true, enables scrolling via the scroll wheel.
			// 			enabled: true,

			// 		// Sets the scroll wheel factor. (Ideally) a value between 0 and 1 (lower = slower scroll, higher = faster scroll).
			// 			factor: 1

			// 	},

			// // Scroll zones.
			// 	scrollZones: {

			// 		// If true, enables scrolling via scroll zones on the left/right edges of the scren.
			// 			enabled: true,

			// 		// Sets the speed at which the page scrolls when a scroll zone is active (higher = faster scroll, lower = slower scroll).
			// 			speed: 15

			// 	},

			// Dragging.
				dragging: {

					// If true, enables scrolling by dragging the main wrapper with the mouse.
						enabled: true,

					// Sets the momentum factor. Must be a value between 0 and 1 (lower = less momentum, higher = more momentum, 0 = disable momentum scrolling).
						momentum: 0.875,

					// Sets the drag threshold (in pixels).
						threshold: 10

				},

			// If set to a valid selector , prevents key/mouse events from bubbling from these elements.
				excludeSelector: 'input:focus, select:focus, textarea:focus, audio, video, iframe',

			// Link scroll speed.
				linkScrollSpeed: 1000

		};

	// Vars.
		var	$window = $(window),
			$document = $(document),
			$body = $('body'),
			$html = $('html'),
			$bodyHtml = $('body,html'),
			$wrapper = $('#wrapper');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ],
			short:    '(min-aspect-ratio: 16/7)',
			xshort:   '(min-aspect-ratio: 16/6)'
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Tweaks/fixes.

		// Mobile: Revert to native scrolling.
			if (browser.mobile) {

				// Disable all scroll-assist features.
					settings.keyboardShortcuts.enabled = false;
					settings.scrollWheel.enabled = false;
					settings.scrollZones.enabled = false;
					settings.dragging.enabled = false;

				// Re-enable overflow on body.
					$body.css('overflow-x', 'auto');

			}

		// IE: Various fixes.
			if (browser.name == 'ie') {

				// Enable IE mode.
					$body.addClass('is-ie');

				// Page widths.
					$window
						.on('load resize', function() {

							// Calculate wrapper width.
								var w = 0;

								$wrapper.children().each(function() {
									w += $(this).width();
								});

							// Apply to page.
								$html.css('width', w + 'px');

						});

			}

		// Polyfill: Object fit.
			if (!browser.canUse('object-fit')) {

				$('.image[data-position]').each(function() {

					var $this = $(this),
						$img = $this.children('img');

					// Apply img as background.
						$this
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-position', $this.data('position'))
							.css('background-size', 'cover')
							.css('background-repeat', 'no-repeat');

					// Hide img.
						$img
							.css('opacity', '0');

				});

			}

	// Keyboard shortcuts.
		if (settings.keyboardShortcuts.enabled)
			(function() {

				$wrapper

					// Prevent keystrokes inside excluded elements from bubbling.
						.on('keypress keyup keydown', settings.excludeSelector, function(event) {

							// Stop propagation.
								event.stopPropagation();

						});

				$window

					// Keypress event.
						.on('keydown', function(event) {

							var scrolled = false;

							switch (event.keyCode) {

								// Left arrow.
									case 37:
										$document.scrollLeft($document.scrollLeft() - settings.keyboardShortcuts.distance);
										scrolled = true;
										break;

								// Right arrow.
									case 39:
										$document.scrollLeft($document.scrollLeft() + settings.keyboardShortcuts.distance);
										scrolled = true;
										break;

								// Page Up.
									case 33:
										$document.scrollLeft($document.scrollLeft() - $window.width() + 100);
										scrolled = true;
										break;

								// Page Down, Space.
									case 34:
									case 32:
										$document.scrollLeft($document.scrollLeft() + $window.width() - 100);
										scrolled = true;
										break;

								// Home.
									case 36:
										$document.scrollLeft(0);
										scrolled = true;
										break;

								// End.
									case 35:
										$document.scrollLeft($document.width());
										scrolled = true;
										break;

							}

							// Scrolled?
								if (scrolled) {

									// Prevent default.
										event.preventDefault();
										event.stopPropagation();

									// Stop link scroll.
										$bodyHtml.stop();

								}

						});

			})();


	// Dragging.
		if (settings.dragging.enabled)
			(function() {

				var dragging = false,
					dragged = false,
					distance = 0,
					startScroll,
					momentumIntervalId, velocityIntervalId,
					startX, currentX, previousX,
					velocity, direction;

				$wrapper

					// Prevent image drag and drop.
						.on('mouseup mousemove mousedown', '.image, img', function(event) {
							event.preventDefault();
						})

					// Prevent mouse events inside excluded elements from bubbling.
						.on('mouseup mousemove mousedown', settings.excludeSelector, function(event) {

							// Prevent event from bubbling.
								event.stopPropagation();

							// End drag.
								dragging = false;
								$wrapper.removeClass('is-dragging');
								clearInterval(velocityIntervalId);
								clearInterval(momentumIntervalId);

							// Pause scroll zone.
								$wrapper.triggerHandler('---pauseScrollZone');

						})

					// Mousedown event.
						.on('mousedown', function(event) {

							// Disable on <=small.
								if (breakpoints.active('<=small'))
									return;

							// Clear momentum interval.
								clearInterval(momentumIntervalId);

							// Stop link scroll.
								$bodyHtml.stop();

							// Start drag.
								dragging = true;
								$wrapper.addClass('is-dragging');

							// Initialize and reset vars.
								startScroll = $document.scrollLeft();
								startX = event.clientX;
								previousX = startX;
								currentX = startX;
								distance = 0;
								direction = 0;

							// Initialize velocity interval.
								clearInterval(velocityIntervalId);

								velocityIntervalId = setInterval(function() {

									// Calculate velocity, direction.
										velocity = Math.abs(currentX - previousX);
										direction = (currentX > previousX ? -1 : 1);

									// Update previous X.
										previousX = currentX;

								}, 50);

						})

					// Mousemove event.
						.on('mousemove', function(event) {

							// Not dragging? Bail.
								if (!dragging)
									return;

							// Velocity.
								currentX = event.clientX;

							// Scroll page.
								$document.scrollLeft(startScroll + (startX - currentX));

							// Update distance.
								distance = Math.abs(startScroll - $document.scrollLeft());

							// Distance exceeds threshold? Disable pointer events on all descendents.
								if (!dragged
								&&	distance > settings.dragging.threshold) {

									$wrapper.addClass('is-dragged');

									dragged = true;

								}

						})

					// Mouseup/mouseleave event.
						.on('mouseup mouseleave', function(event) {

							var m;

							// Not dragging? Bail.
								if (!dragging)
									return;

							// Dragged? Re-enable pointer events on all descendents.
								if (dragged) {

									setTimeout(function() {
										$wrapper.removeClass('is-dragged');
									}, 100);

									dragged = false;

								}

							// Distance exceeds threshold? Prevent default.
								if (distance > settings.dragging.threshold)
									event.preventDefault();

							// End drag.
								dragging = false;
								$wrapper.removeClass('is-dragging');
								clearInterval(velocityIntervalId);
								clearInterval(momentumIntervalId);

							// Pause scroll zone.
								$wrapper.triggerHandler('---pauseScrollZone');

							// Initialize momentum interval.
								if (settings.dragging.momentum > 0) {

									m = velocity;

									momentumIntervalId = setInterval(function() {

										// Momentum is NaN? Bail.
											if (isNaN(m)) {

												clearInterval(momentumIntervalId);
												return;

											}

										// Scroll page.
											$document.scrollLeft($document.scrollLeft() + (m * direction));

										// Decrease momentum.
											m = m * settings.dragging.momentum;

										// Negligible momentum? Clear interval and end.
											if (Math.abs(m) < 1)
												clearInterval(momentumIntervalId);

									}, 15);

								}

						});

			})();

	// Link scroll.
		$wrapper
			.on('mousedown mouseup', 'a[href^="#"]', function(event) {

				// Stop propagation.
					event.stopPropagation();

			})
			.on('click', 'a[href^="#"]', function(event) {

				var	$this = $(this),
					href = $this.attr('href'),
					$target, x, y;

				// Get target.
					if (href == '#'
					||	($target = $(href)).length == 0)
						return;

				// Prevent default.
					event.preventDefault();
					event.stopPropagation();

				// Calculate x, y.
					if (breakpoints.active('<=small')) {

						x = $target.offset().top - (Math.max(0, $window.height() - $target.outerHeight()) / 2);
						y = { scrollTop: x };

					}
					else {

						x = $target.offset().left - (Math.max(0, $window.width() - $target.outerWidth()) / 2);
						y = { scrollLeft: x };

					}

				// Scroll.
					$bodyHtml
						.stop()
						.animate(
							y,
							settings.linkScrollSpeed,
							'swing'
						);

			});

	// Gallery.
		$('.gallery')
			.on('click', 'a', function(event) {

				var $a = $(this),
					$gallery = $a.parents('.gallery'),
					$modal = $gallery.children('.modal'),
					$modalImg = $modal.find('img'),
					href = $a.attr('href');

				// Not an image? Bail.
					if (!href.match(/\.(jpg|gif|png|mp4)$/))
						return;

				// Prevent default.
					event.preventDefault();
					event.stopPropagation();

				// Locked? Bail.
					if ($modal[0]._locked)
						return;

				// Lock.
					$modal[0]._locked = true;

				// Set src.
					$modalImg.attr('src', href);

				// Set visible.
					$modal.addClass('visible');

				// Focus.
					$modal.focus();

				// Delay.
					setTimeout(function() {

						// Unlock.
							$modal[0]._locked = false;

					}, 600);

			})
			.on('click', '.modal', function(event) {

				var $modal = $(this),
					$modalImg = $modal.find('img');

				// Locked? Bail.
					if ($modal[0]._locked)
						return;

				// Already hidden? Bail.
					if (!$modal.hasClass('visible'))
						return;

				// Stop propagation.
					event.stopPropagation();

				// Lock.
					$modal[0]._locked = true;

				// Clear visible, loaded.
					$modal
						.removeClass('loaded')

				// Delay.
					setTimeout(function() {

						$modal
							.removeClass('visible')

						// Pause scroll zone.
							$wrapper.triggerHandler('---pauseScrollZone');

						setTimeout(function() {

							// Clear src.
								$modalImg.attr('src', '');

							// Unlock.
								$modal[0]._locked = false;

							// Focus.
								$body.focus();

						}, 475);

					}, 125);

			})
			.on('keypress', '.modal', function(event) {

				var $modal = $(this);

				// Escape? Hide modal.
					if (event.keyCode == 27)
						$modal.trigger('click');

			})
			.on('mouseup mousedown mousemove', '.modal', function(event) {

				// Stop propagation.
					event.stopPropagation();

			})
			.prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>')
				.find('img')
					.on('load', function(event) {

						var $modalImg = $(this),
							$modal = $modalImg.parents('.modal');

						setTimeout(function() {

							// No longer visible? Bail.
								if (!$modal.hasClass('visible'))
									return;

							// Set loaded.
								$modal.addClass('loaded');

						}, 275);

					});

})(jQuery);

document.querySelector('.button').addEventListener('click', getColors)

// const lock = document.querySelectorAll('.unlocked .locked')
// Array.from(lock).forEach(element => element.addEventListener('click', lockColor))

let changeIcon = function(icon){
	icon.classList.toggle('fa-lock-open')
	icon.classList.toggle('fa-lock')
}

// function lockColor(){
// 		document.querySelector('.lock').classList.toggle('fa-lock fa-lock-open')
// }


function randomColor(){
	let colorArr = []
	for(let i = 0; i < 3; i ++){
		colorArr.push(Math.floor(Math.random() * 256))
	}
	return colorArr.join(', ')
	
}

function getColors(){
	let firstColor = randomColor()
	let secondColor = randomColor()
	let thirdColor = randomColor()
	let fourthColor = randomColor()
	let fifthColor = randomColor()
	// console.log(firstColor)
	// console.log(secondColor)
	// console.log(thirdColor)
	// console.log(fourthColor)
	// console.log(fifthColor)
	let box = document.querySelector('.color0')
	box.style.background = `linear-gradient(170deg, rgb(${firstColor}) 16%, rgb(${secondColor}) 36%, rgb(${thirdColor}) 54%, rgb(${fourthColor}) 72%, rgb(${fifthColor}) 86%)`

	//color swatch background colors
	//color swatch rgb values
	if(document.querySelector('.lock1').classList.contains('fa-lock-open')){
		document.querySelector('#colorOne').style.background = `rgb(${firstColor})`
		document.querySelector('#sOne').innerText = `rgb(${firstColor})`
	}
	if(document.querySelector('.lock2').classList.contains('fa-lock-open')){
		document.querySelector('#colorTwo').style.background = `rgb(${secondColor})`
		document.querySelector('#sTwo').innerText = `rgb(${secondColor})`
	}
	if(document.querySelector('.lock3').classList.contains('fa-lock-open')){
		document.querySelector('#colorThree').style.background = `rgb(${thirdColor})`
		document.querySelector('#sThree').innerText = `rgb(${thirdColor})`
	}
	if(document.querySelector('.lock4').classList.contains('fa-lock-open')){
		document.querySelector('#colorFour').style.background = `rgb(${fourthColor})`
		document.querySelector('#sFour').innerText = `rgb(${fourthColor})`
	}
	if(document.querySelector('.lock5').classList.contains('fa-lock-open')){
		document.querySelector('#colorFive').style.background = `rgb(${fifthColor})`
		document.querySelector('#sFive').innerText = `rgb(${fifthColor})`
	}
	

	//color swatch rgb values
}


// function getColors(){
// 	const url = 'http://colormind.io/api/'
// 	const requestOptions = {
// 		method: 'POST',
// 		body: '{"model":"default"}'
// 	}

// 	fetch(url, requestOptions)
// 		.then(res => res.json())
// 		.then(data => {
// 			console.log(data)
// 			let firstColor = data.result[0].join(', ')
// 			let secondColor = data.result[1].join(', ')
// 			let thirdColor = data.result[2].join(', ')
// 			let fourthColor = data.result[3].join(', ')
// 			let fifthColor = data.result[4].join(', ')
// 			console.log(firstColor)
// 			console.log(secondColor)
// 			console.log(thirdColor)
// 			console.log(fourthColor)
// 			console.log(fifthColor)
// 			let box = document.querySelector('.color0')
// 			box.style.background = `linear-gradient(45deg, rgb(${firstColor}) 20%, rgb(${secondColor}) 40%, rgb(${thirdColor}) 60%, rgb(${fourthColor}) 80%, rgb(${fifthColor}) 100%)`

// 			//color swatch background colors
// 			document.querySelector('#colorOne').style.background = `rgb(${firstColor})`
// 			document.querySelector('#colorTwo').style.background = `rgb(${secondColor})`
// 			document.querySelector('#colorThree').style.background = `rgb(${thirdColor})`
// 			document.querySelector('#colorFour').style.background = `rgb(${fourthColor})`
// 			document.querySelector('#colorFive').style.background = `rgb(${fifthColor})`

// 			//color swatch rgb values
// 			document.querySelector('#sOne').innerText = `rgb(${firstColor})`
// 			document.querySelector('#sTwo').innerText = `rgb(${secondColor})`
// 			document.querySelector('#sThree').innerText = `rgb(${thirdColor})`
// 			document.querySelector('#sFour').innerText = `rgb(${fourthColor})`
// 			document.querySelector('#sFive').innerText = `rgb(${fifthColor})`
// 		})
// 	}