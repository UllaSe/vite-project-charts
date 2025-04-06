import '../css/style.css';
import {Calendar} from 'vanilla-calendar-pro';
import 'vanilla-calendar-pro/styles/index.css';
import {getUserData} from './calendar-data';

document.querySelector(
  '#app',
).innerHTML = `Moi kirjaantunut käyttäjä ${localStorage.getItem('nimi')}`;

// const getUserDataBtn = document.querySelector('.get_user_data');
// getUserDataBtn.addEventListener('click', getUserData);

// Tehdään kalenteri

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
      modifier: 'bg-green color-white',
      html: `<div>
        <u><b>3:00 PM</b></u>
        <p style="margin: 5px 0 0;">Meeting with team</p>
      </div>`,
      customProps: {
        workDay: true,
        notes: 'Team Sync-up',
      },
    },
  },
  onClickDate: handleClickDate,
  onCreateDateEls: decorateDateButton,
};

function handleClickDate(self) {
  console.log(self.context);
  console.log(self.context.selectedDates);
}

function decorateDateButton(self, dateEl) {
  // const randomBoolean = Math.random() < 0.5;
  // if (!randomBoolean) return;

  // const randomPrice = Math.floor(Math.random() * (999 - 100 + 1) + 100);
  // const btnEl = dateEl.querySelector('[data-vc-date-btn]');
  // console.log(btnEl);

  // if (!btnEl) return;

  // const day = btnEl.innerText;
  // btnEl.style.flexDirection = 'column';
  // btnEl.innerHTML = `
  //   <span>${day}</span>
  //   <span style="font-size: 8px; color: #8BC34A;">$${randomPrice}</span>
  // `;

  console.log(dateEl);
  const btnEl = dateEl.querySelector('[data-vc-date-btn]');
  console.log(btnEl);
  // console.log(btnEl.dataset.id);
}

const calendar = new Calendar('#calendar', options);
calendar.init();

// Toinen kALENTERI

document.addEventListener('DOMContentLoaded', function () {
  // Hei, luodaan FUllcalendar pohja
  console.log('Luodaan Fullcalder');
  getDataforCalendar();
});

const getDataforCalendar = async () => {
  const userData = await getUserData();
  console.log(userData);
  const jsonData = {
    results: userData.results,
  };

  // Extract data
  const labels = jsonData.results.map((entry) => entry.daily_result);
  // Viiiva 1
  const heartRates = jsonData.results.map((entry) => entry.result.readiness);
  // Viiva 2
  const stressIndex = jsonData.results.map(
    (entry) => entry.result.stress_index,
  );

  // [
  //   {
  //     "date": "2025-04-10",
  //     "readiness": 82,
  //     "stress": 45
  //   },
  //   {
  //     "date": "2025-04-11",
  //     "readiness": 75,
  //     "stress": 60
  //   }
  // ]

  // [
  //   {
  //     title: "Readiness: 82",
  //     start: "2025-04-10",
  //     color: "#4CAF50" // green
  //   },
  //   {
  //     title: "Stress: 45",
  //     start: "2025-04-10",
  //     color: "#F44336" // red
  //   },
  //   {
  //     title: "Readiness: 75",
  //     start: "2025-04-11",
  //     color: "#4CAF50"
  //   },
  //   {
  //     title: "Stress: 60",
  //     start: "2025-04-11",
  //     color: "#F44336"
  //   }
  // ]

  // Load Data
  var data = userData.results.map((entry) => ({
    date: new Date(entry.daily_result).getTime(), // Converts date string to timestamp, // Ensure this is a Date object
    readiness: entry.result.readiness,
    stress_index: entry.result.stress_index,
  }));
  createFullcalendar();
};

const createFullcalendar = async (params) => {
  var calendarEl = document.getElementById('calendar2');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'fi', // Suomi
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    // https://fullcalendar.io/docs/events-json-feed#options
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
    eventContent: function (arg) {
      const {event} = arg;
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
    eventClick: function (info) {
      const event = info.event;
      console.log(event);
      const props = event.extendedProps;
      console.log(props);

      // Tänne voi luoda logiikan erilaisille eventeille, avataanko modaali
      // Vai kenties näytetään arvo tms.

      if (event.title == 'Work') {
        alert(`Tämä on työvuoro ja sen ID: ${props.shift_id}`);
      }
    },
  });

  calendar.render();

  calendar.on('dateClick', function (info) {
    console.log('Klikkasin päivää: ' + info.dateStr);
    //dialog.showModal();
  });
};
const showAlert = (day) => {
  alert(day);
  console.log('Tee tässä jotain, avaa modaali tms.');
};
