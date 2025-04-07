import '../css/style.css';
import '../css/snackbar.css';
import { fetchData } from './fetch.js';

console.log('Moi luodaan nyt tokeneita ja kirjaudutaan sisään');

const loginUser = async (event) => {
	event.preventDefault();

	// Haetaan oikea formi
	const loginForm = document.querySelector('.loginForm');

	// Haetaan formista arvot, tällä kertaa käyttäen attribuuutti selektoreita
	const username = loginForm.querySelector('input[name=username]').value;
	const password = loginForm.querySelector('input[name=password]').value;

	// Luodaan body lähetystä varten taustapalvelun vaatimaan muotoon
	const bodyData = {
		username: username,
		password: password,
	};

	// Endpoint
	const url = 'http://localhost:3000/api/auth/login';

	// Options
	const options = {
		body: JSON.stringify(bodyData),
		method: 'POST',
		headers: {
			'Content-type': 'application/json',
		},
	};
	console.log(options);

	// Hae data
	const response = await fetchData(url, options);

	if (response.error) {
		console.error('Error adding a new user:', response.error);
		return;
	}

	if (response.message) {
		console.log(response.message, 'success');
		localStorage.setItem('token', response.token);
		localStorage.setItem('nimi', response.user.given_name);
		alert('Sisäänkirjautuminen onnistui!! Siirrän sinut pääsivulle!!!');
		location.href = './src/pages/kubios.html';
	}

	console.log(response);
	loginForm.reset(); // tyhjennetään formi
};

const loginForm = document.querySelector('.loginForm');
loginForm.addEventListener('submit', loginUser);
