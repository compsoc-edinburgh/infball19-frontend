document.querySelector('[type="submit"]').addEventListener('click', e => {
	e.preventDefault()
	console.log('clicked submit')

	window.scrollTo({
		'behavior': 'smooth',
		'left': 0,
		'top': document.querySelector('.form-container').offsetTop - 100
	})
	setTimeout(() => document.querySelector('.form-flipper').classList.add('form-flipper--flipped'), 750)
})


document.querySelector('#ticketform').addEventListener('submit', e => {
	e.preventDefault()
	console.log('clicked submit')
})
