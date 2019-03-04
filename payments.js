// pk_test_WLvFPL1mC9cr94Sjj6wxvBPN

const stripe   = Stripe('pk_test_WLvFPL1mC9cr94Sjj6wxvBPN')
const elements = stripe.elements()
const card     = elements.create('card', {
	style: {
		base: {
			fontSize: '16px',
		}
	}
})

card.mount('#card-element')

card.addEventListener('change', ({error}) => {
	const displayError = document.querySelector('#card-errors')
	if (error) {
		displayError.textContent = error.message
	} else {
		displayError.textContent = ''
	}
})

// form mgmt

const collectAndSubmit = (token) => {
	// visual state
	window.scrollTo({
		'behavior': 'smooth',
		'left': 0,
		'top': document.querySelector('.form-container').offsetTop - 100
	})
	setTimeout(() => document.querySelector('.form-flipper').classList.add('form-flipper--flipped'), 750)

	const extract = name => document.querySelector(`[name=${name}]`)
	let dietreqs = ['glutenfree', 'lactosefree', 'vegan', 'vegetarian'].map(n => extract(n).checked ? n : null).filter(n => n !== null)

	const fields = {
		token: token.id,
		uun: extract('uun').value,
		email: extract('email').value,
		fullname: extract('full-name').value,
		noalcohol: extract('noalcohol').checked,
		specialreqs: extract('othernotes').value,
		mealtype: dietreqs
	}
	if (extract('invitecode').value !== '') {
		fields.staffcode = extract('invitecode').value
	}

	const clearIndefinite = () => document.querySelector('.form-outcome--indefinite').remove()
	const onsuccess = (id) => {
		clearIndefinite()
		document.querySelector('.form-outcome--successful').classList.remove('form-outcome--hidden')
		document.querySelector('#success-id').textContent = id
	}
	const onfailure = (msg) => {
		clearIndefinite()
		document.querySelector('.form-outcome--unsuccessful').classList.remove('form-outcome--hidden')
		document.querySelector('#failure-message').textContent = msg
	}


	fetch('/charge', {
		method: 'POST',
		mode: 'no-cors',
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(fields)
	})
		.then(r => r.json())
		.then(r => {
			console.log(r)
			if (r.status === 'success') {
				onsuccess(r.data)
			} else {
				onfailure(r.message)
			}
		})
		.catch(e => {
			console.warn(e)
			onfailure('A server error occurred.')
		})
}

const form = document.querySelector('#ticketform')
form.addEventListener('submit', async (e) => {
	e.preventDefault()
	console.log('clicked submit')


	const {token, error} = await stripe.createToken(card)

	if (error) {
		const displayError = document.querySelector('#card-errors')
		displayError.textContent = error.message
	} else {
		collectAndSubmit(token)
	}

})
