import '../css/style.css';
import { getUserData } from './calendar-data';
import { Calendar } from 'vanilla-calendar-pro';
import 'vanilla-calendar-pro/styles/index.css';

document.querySelector('#app').innerHTML = `Moi ${localStorage.getItem('nimi')}`;

// Please fix the js of these functions to suit the format of the course

// Simple Vanilla CALENDAR
///////////////////

// https://vanilla-calendar.pro/docs/learn/installation-and-usage

const handleClickDate = (self) => {
	console.log(self.context);
	//console.log('Tee jotain kivaa, päivämäärä:', self.context.selectedDates);
};

const decoratePrices = (self, dateEl) => {
	const randomBoolean = Math.random() < 0.5;
	if (!randomBoolean) return;
	const randomPrice = Math.floor(Math.random() * (999 - 100 + 1) + 100);
	const btnEl = dateEl.querySelector('[data-vc-date-btn]');
	console.log(btnEl);
	if (!btnEl) return;
	const day = btnEl.innerText;
	btnEl.style.flexDirection = 'column';
	btnEl.innerHTML = `
	  <span>${day}</span>
	  <span style="font-size: 8px; color: #8BC34A;">$${randomPrice}</span>
	`;
};

const options = {
	type: 'default',
	locale: 'fi-FI',
	popups: {
		'2025-04-08': {
			modifier: 'hrv-circle',
			html: `<div data-hrv=55 data-note="Flight to Vegas">
      ✈️ Flight </div>`,
		},
		'2025-04-09': {
			html: `<div>
        <u><b>3:00 PM</b></u>
        <p style="margin: 5px 0 0;">Meeting with team</p>
      </div>`,
			customProps: {
				workDay: true,
				notes: 'Team Sync-up',
				id: 'id-3456',
			},
		},
	},
	onClickDate: handleClickDate,
	onCreateDateEls: decoratePrices,
};

const calendar = new Calendar('#calendar', options);
calendar.init();

// FULL CALENDAR
///////////////////

// https://fullcalendar.io/docs/initialize-globals
// https://fullcalendar.io/docs/initialize-globals-demo
