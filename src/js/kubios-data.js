import { fetchData } from './fetch';
// need to inport chart if installed
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

// Function to test and get user info from kubios API
const getUserInfo = async () => {
	console.log('Käyttäjän INFO Kubioksesta');

	const url = 'http://localhost:3000/api/kubios/user-info';
	const token = localStorage.getItem('token');
	const headers = { Authorization: `Bearer ${token}` };
	const options = {
		headers: headers,
	};
	const userData = await fetchData(url, options);

	if (userData.error) {
		console.log('Käyttäjän tietojen haku Kubioksesta epäonnistui');
		return;
	}
	console.log(userData);
};

// Function to get more actual data from Kubios API
const getUserData = async () => {
	console.log('Käyttäjän DATA Kubioksesta');

	const url = 'http://localhost:3000/api/kubios/user-data';
	const token = localStorage.getItem('token');
	const headers = { Authorization: `Bearer ${token}` };
	const options = {
		headers: headers,
	};
	const userData = await fetchData(url, options);

	if (userData.error) {
		console.log('Käyttäjän tietojen haku Kubioksesta epäonnistui');
		return;
	}
	console.log(userData);
	// Draw chart with chart.js
	// drawChart(userData);
	// Draw chart with amcharts
	// drawAMChart(userData);
};

// Let us try these together
const drawChart = (userData) => {
	// Now the data that comes from kubios /result/self route
	console.log('UserData:', userData);

	// You need to formulate data into correct structure in the BE
	// OR you can extract the data here in FE from one or multiple sources
	// Extract data: https://www.w3schools.com/jsref/jsref_map.asp

	// Labels

	// Line 1

	// Line 2

	// Create the chart
	// https://www.chartjs.org/docs/latest/charts/line.html
	// https://www.chartjs.org/docs/latest/samples/line/line.html

	// Add necessary adapters
	// https://github.com/chartjs/awesome#adapters
};

const drawAMChart = (userData) => {
	// Lets look at a example from
	// https://www.amcharts.com/demos/line-graph/
	// Documentation
	// https://www.amcharts.com/docs/v5/getting-started/
};

export { getUserData, getUserInfo };
