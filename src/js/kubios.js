import '../css/style.css';
import '../css/snackbar.css';
import Chart from 'chart.js/auto';
import {getUserInfo, getUserData} from './kubios-data.js';

document.querySelector(
  '#app',
).innerHTML = `Moi kirjaantunut käyttäjä ${localStorage.getItem('nimi')}`;

const getUserInfoBtn = document.querySelector('.get_user_info');
getUserInfoBtn.addEventListener('click', getUserInfo);

const getUserDataBtn = document.querySelector('.get_user_data');
getUserDataBtn.addEventListener('click', getUserData);

// piirretään graafit
const ctx = document.getElementById('myChart');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
