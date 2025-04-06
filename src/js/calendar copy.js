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
  onClickDate: handleClickDate,
  onCreateDateEls: decorateDateButton,
};

function handleClickDate(self) {
  console.log(self.context.selectedDates);
}

function decorateDateButton(self, dateEl) {
  const randomBoolean = Math.random() < 0.5;
  if (!randomBoolean) return;

  const randomPrice = Math.floor(Math.random() * (999 - 100 + 1) + 100);
  const btnEl = dateEl.querySelector('[data-vc-date-btn]');

  if (!btnEl) return;

  const day = btnEl.innerText;
  btnEl.style.flexDirection = 'column';
  btnEl.innerHTML = `
    <span>${day}</span>
    <span style="font-size: 8px; color: #8BC34A;">$${randomPrice}</span>
  `;
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
        title: '🟠 ',
        start: '2025-04-01',
        color: 'transparent', // override!
        extraParams: {},
      },
      {
        title: 'Työvuoro',
        start: '2025-04-07T14:00:00',
        end: '2025-04-8T12:00:00',
      },
      {
        groupId: '999',
        title: 'HRV',
        start: '2025-04-09T16:00:00',
      },
      {
        groupId: '999',
        title: 'HRV',
        start: '2025-04-16T16:00:00',
      },
      {
        title: 'Conference',
        start: '2025-04-11',
        end: '2025-04-13',
      },
      {
        title: 'Meeting',
        start: '2025-04-12T10:30:00',
        end: '2025-04-12T12:30:00',
      },
      {
        title: 'Lunch',
        start: '2025-04-12T12:00:00',
      },
      {
        title: 'Meeting',
        start: '2025-04-12T14:30:00',
      },
      {
        title: 'Birthday Party',
        start: '2025-04-13T07:00:00',
      },
      {
        title: 'Click for Google',
        url: 'https://google.com/',
        start: '2025-04-28',
      },
    ],
    eventClick: function (info) {
      info.jsEvent.preventDefault(); // don't let the browser navigate

      // Tänne voi luoda logiikan erilaisille eventeille, avataanko modaali
      // Vai kenties näytetään arvo tms.

      if (info.event.start) {
        alert(
          `Tee jotain, avaa modaali tms. \nTässä aika: ${info.event.start}`,
        );
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
