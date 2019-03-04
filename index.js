const API_URL = '/'

fetch(`${API_URL}/stats/nonalcoholic`)
	.then(r => r.json())
	.then(r => {
		document.querySelector('#nonalcohol-remaining').textContent = ` (${r.quantity} remaining)`
	})
	.catch(e => {})

fetch(`${API_URL}/stats/regular`)
	.then(r => r.json())
	.then(r => {
		document.querySelector('#tickets-remaining').textContent = `(${r.quantity} remaining)`
	})
	.catch(e => {})

