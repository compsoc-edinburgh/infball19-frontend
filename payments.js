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

const collectFields = () => {
	const extract = name => document.querySelector(`[name=${name}]`)
	let dietreqs = ['glutenfree', 'lactosefree', 'vegan', 'vegetarian'].map(n => extract(n).checked ? n : null).filter(n => n !== null)

	const fields = {
		uun: extract('uun').value,
		email: extract('email').value,
		fullname: extract('full-name').value,
		noalcohol: extract('noalcohol').checked,
		specialreqs: extract('othernotes').value,
		staffcode: extract('invitecode').value,
		mealtype: dietreqs
	}

	return fields

}

const formClearIndefinite = () => document.querySelector('.form-outcome--indefinite').remove()
const formSuccess = (id) => {
	formClearIndefinite()
	document.querySelector('.form-outcome--successful').classList.remove('form-outcome--hidden')
	document.querySelector('#success-id').textContent = id
}
const formFailure = (msg) => {
	formClearIndefinite()
	document.querySelector('.form-outcome--unsuccessful').classList.remove('form-outcome--hidden')
	document.querySelector('#failure-message').textContent = msg
}

const chargeForm = (token) => {

	const fields = collectFields()
	fields.token = token.id // patch in the ID



	fetch(`${API_URL}/charge`, {
		method: 'POST',
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
				formSuccess(r.data)
			} else {
				formFailure(r.message)
			}
		})
		.catch(e => {
			console.warn(e)
			formFailure('A server error occurred.')
		})
}

const validateForm = async () => {
	const fields = collectFields()
	let resp = null

	try {
		resp = await fetch(`${API_URL}/validate`, {
			method: 'POST',
			cache: 'no-cache',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(fields)
		}).then(r => r.json())
	} catch (e) {
		console.warn(e)
		formFailure('A server error occurred.')
	}

	if (resp.status === 'success') {
		return true
	} else {
		formFailure(r.message)
		return false
	}
}

const form = document.querySelector('#ticketform')
form.addEventListener('submit', async (e) => {
	e.preventDefault()
	console.log('clicked submit')

	// visual state
	window.scrollTo({
		'behavior': 'smooth',
		'left': 0,
		'top': document.querySelector('.form-container').offsetTop - 100
	})
	setTimeout(() => document.querySelector('.form-flipper').classList.add('form-flipper--flipped'), 750)

	if (!(await validateForm())) return;

	const {token, error} = await stripe.createToken(card)

	if (error) {
		const displayError = document.querySelector('#card-errors')
		displayError.textContent = error.message
		setTimeout(() => document.querySelector('.form-flipper').classList.remove('form-flipper--flipped'), 800)

	} else {
		chargeForm(token)
	}
})
