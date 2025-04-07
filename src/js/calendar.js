import '../css/style.css';
import { getUserData } from './calendar-data';
import { Calendar } from 'vanilla-calendar-pro';
import 'vanilla-calendar-pro/styles/index.css';

document.querySelector('#app').innerHTML = `Moi ${localStorage.getItem('nimi')}`;

// Please fix the js of these functions to suit the format of the course

// Simple Vanilla CALENDAR
///////////////////

// https://vanilla-calendar.pro/docs/learn/installation-and-usage

// FULL CALENDAR
///////////////////

// https://fullcalendar.io/docs/initialize-globals
// https://fullcalendar.io/docs/initialize-globals-demo
