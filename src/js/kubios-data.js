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
	//console.log(userData);

	// Draw chart with chart.js
	drawChart(userData);
	// Draw chart with amcharts
	drawAMChart(userData);
};

// Let us try these together
const drawChart = async (userData) => {
	// Now the data that comes from kubios /result/self route
	console.log('UserData:', userData);

	const url = '/mockdata.json';
	const response = await fetchData(url);
	// You need to formulate data into correct structure in the BE
	// OR you can extract the data here in FE from one or multiple sources
	// Extract data: https://www.w3schools.com/jsref/jsref_map.asp

	// Labels

	const formatter = new Intl.DateTimeFormat('fi-FI', { day: 'numeric', month: 'long' });
	const labels = response.results.map((rivi) => formatter.format(new Date(rivi.daily_result)));

	// Ilman formulointia
	//const labels = userData.results.map((rivi) => rivi.daily_result);

	// Line 1
	const readiness = response.results.map((rivi) => rivi.result.readiness);
	// Line 2
	const stressIndex = response.results.map((rivi) => rivi.result.stress_index);

	// Create the chart
	// https://www.chartjs.org/docs/latest/charts/line.html
	// https://www.chartjs.org/docs/latest/samples/line/line.html

	const ctx = document.getElementById('jsChart');

	new Chart(ctx, {
		type: 'line',
		data: {
			labels: labels,
			datasets: [
				{
					label: 'readiness',
					data: readiness,
					borderWidth: 1,
					borderColor: 'red',
				},
				{
					label: 'stress index',
					data: stressIndex,
					borderWidth: 1,
					borderColor: 'blue',
				},
			],
		},
		options: {
			responsive: true,
			locale: 'fi-FI',
			scales: {
				x: {
					title: {
						display: true,
						text: 'Day',
					},
				},
				y: {
					beginAtZero: true,
					title: {
						display: true,
						text: 'Readiness / Stress',
					},
				},
			},
		},
	});

	// Add necessary adapters
	// https://github.com/chartjs/awesome#adapters
};

const drawAMChart = async () => {
	// Lets look at a example from
	// https://www.amcharts.com/demos/line-graph/
	// Documentation
	// https://www.amcharts.com/docs/v5/getting-started/

	const url = '/mockdata.json';
	const userData = await fetchData(url);

	am5.ready(function () {
		// Create root element
		// https://www.amcharts.com/docs/v5/getting-started/#Root_element
		var root = am5.Root.new('chartdiv');

		// Set themes
		// https://www.amcharts.com/docs/v5/concepts/themes/
		root.setThemes([am5themes_Animated.new(root)]);

		// Create chart
		// https://www.amcharts.com/docs/v5/charts/xy-chart/
		var chart = root.container.children.push(
			am5xy.XYChart.new(root, {
				panX: true,
				panY: true,
				wheelX: 'panX',
				wheelY: 'zoomX',
				pinchZoomX: true,
				paddingLeft: 0,
			})
		);

		// Add cursor
		// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
		var cursor = chart.set(
			'cursor',
			am5xy.XYCursor.new(root, {
				behavior: 'none',
			})
		);
		cursor.lineY.set('visible', false);

		// // Generate random data
		// var date = new Date();
		// date.setHours(0, 0, 0, 0);
		// var value = 100;

		// function generateData() {
		// 	value = Math.round(Math.random() * 10 - 5 + value);
		// 	am5.time.add(date, 'day', 1);
		// 	return {
		// 		date: date.getTime(),
		// 		value: value,
		// 	};
		// }

		// function generateDatas(count) {
		// 	var data = [];
		// 	for (var i = 0; i < count; ++i) {
		// 		data.push(generateData());
		// 	}
		// 	return data;
		// }

		// Create axes
		// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
		var xAxis = chart.xAxes.push(
			am5xy.DateAxis.new(root, {
				maxDeviation: 0.2,
				baseInterval: {
					timeUnit: 'day',
					count: 1,
				},
				renderer: am5xy.AxisRendererX.new(root, {
					minorGridEnabled: true,
				}),
				tooltip: am5.Tooltip.new(root, {}),
			})
		);

		var yAxis = chart.yAxes.push(
			am5xy.ValueAxis.new(root, {
				renderer: am5xy.AxisRendererY.new(root, {
					pan: 'zoom',
				}),
			})
		);

		// Add series
		// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
		var series = chart.series.push(
			am5xy.LineSeries.new(root, {
				name: 'Readiness',
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: 'readiness',
				valueXField: 'date',
				tooltip: am5.Tooltip.new(root, {
					labelText: '{valueY}',
				}),
			})
		);

		// Add scrollbar
		// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
		chart.set(
			'scrollbarX',
			am5.Scrollbar.new(root, {
				orientation: 'horizontal',
			})
		);

		// Set data
		//var data = generateDatas(12);
		var data = userData.results.map((entry) => ({
			date: new Date(entry.daily_result).getTime(), // Converts date string to timestamp,
			readiness: entry.result.readiness,
		}));
		series.data.setAll(data);

		// Make stuff animate on load
		// https://www.amcharts.com/docs/v5/concepts/animations/
		series.appear(1000);
		chart.appear(1000, 100);
	}); // end am5.ready()
};

export { getUserData, getUserInfo };
