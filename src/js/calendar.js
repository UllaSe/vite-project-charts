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

document.addEventListener('DOMContentLoaded', function () {
	var calendarEl = document.getElementById('calendar2');

	var calendar = new FullCalendar.Calendar(calendarEl, {
		initialView: 'dayGridMonth',
		headerToolbar: {
			left: 'prev,next today',
			center: 'title',
			right: 'dayGridMonth,timeGridWeek,timeGridDay',
		},
		events: [
			{
				title: 'Readiness: 82',
				start: '2025-04-10',
				color: '#4CAF50', // green
				extendedProps: {
					measure_id: 'e7dbb65e-0f6c-48c8-94af-07d7205d5602',
				},
			},
			{
				title: 'Stress: 45',
				start: '2025-04-10',
				color: '#F44336', // red
			},
			{
				title: 'Readiness: 75',
				start: '2025-04-11',
				color: '#4CAF50',
			},
			{
				title: 'Stress: 60',
				start: '2025-04-11',
				color: '#F44336',
			},
			{
				title: 'Work',
				start: '2025-04-08T12:00:00',
				end: '2025-04-12T12:00:00',
				color: '#36f4be',
				extendedProps: {
					shift_id: '86654444',
				},
			},
		],
		eventClick: function (info) {
			const event = info.event;
			//console.log(event);
			const props = event.extendedProps;
			console.log(props);
			console.log('Avataan vaikkapa uusi dialogi ja ID:n mukainen haku BE');
		},
		eventContent: function (info) {
			const { event } = info;
			const title = event.title;

			// Simple emoji logic
			const isReadiness = title.toLowerCase().includes('readiness');
			const isStress = title.toLowerCase().includes('stress');

			const emoji = isReadiness ? '💪' : isStress ? '⚡' : '📝';

			return {
				html: `
          <div style="font-size: 11px; line-height: 1.2;">
            ${emoji} ${title}
          </div>
        `,
			};
		},
	});

	calendar.render();
});
