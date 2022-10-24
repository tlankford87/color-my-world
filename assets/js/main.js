/*
	Ethereal by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {


	// Vars.
		var	$window = $(window),
			$body = $('body');


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

})(jQuery);

document.querySelector('.button').addEventListener('click', getColors)


let changeIcon = function(icon){
	icon.classList.toggle('fa-lock-open')
	icon.classList.toggle('fa-lock')
}


function randomColor(){
	let colorArr = []
	for(let i = 0; i < 3; i ++){
		colorArr.push(Math.floor(Math.random() * 256))
		newArr = colorArr.join(', ')
	}
	return `rgb(${newArr})`
	
}

function getColors(){
	const lock1 = document.querySelector('.lock1')
	const lock2 = document.querySelector('.lock2')
	const lock3 = document.querySelector('.lock3')
	const lock4 = document.querySelector('.lock4')
	const lock5 = document.querySelector('.lock5')

	let firstColor = document.querySelector('#sOne').innerText
	let secondColor = document.querySelector('#sTwo').innerText
	let thirdColor = document.querySelector('#sThree').innerText
	let fourthColor = document.querySelector('#sFour').innerText
	let fifthColor = document.querySelector('#sFive').innerText

	//color swatch background colors
	//color swatch rgb values
	if(lock1.classList.contains('fa-lock-open')){
		firstColor = randomColor()
		document.querySelector('#colorOne').style.background = firstColor
		document.querySelector('#sOne').innerText = firstColor
	}
	if(lock2.classList.contains('fa-lock-open')){
		secondColor = randomColor()
		document.querySelector('#colorTwo').style.background = secondColor
		document.querySelector('#sTwo').innerText = secondColor
	}
	if(lock3.classList.contains('fa-lock-open')){
		thirdColor = randomColor()
		document.querySelector('#colorThree').style.background = thirdColor
		document.querySelector('#sThree').innerText = thirdColor
	}
	if(lock4.classList.contains('fa-lock-open')){
		fourthColor = randomColor()
		document.querySelector('#colorFour').style.background = fourthColor
		document.querySelector('#sFour').innerText = fourthColor
	}
	if(lock5.classList.contains('fa-lock-open')){
		fifthColor = randomColor()
		document.querySelector('#colorFive').style.background = fifthColor
		document.querySelector('#sFive').innerText = fifthColor
	}

	//gradient
	let box = document.querySelector('.color0')
	box.style.background = `linear-gradient(170deg, ${firstColor} 16%, ${secondColor} 36%, ${thirdColor} 54%, ${fourthColor} 72%, ${fifthColor} 86%)`
}