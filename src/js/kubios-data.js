import {fetchData} from './fetch';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const getUserData = async () => {
  console.log('Käyttäjän DATA Kubioksesta');

  const url = 'http://localhost:3000/api/kubios/user-data';
  const token = localStorage.getItem('token');
  const headers = {Authorization: `Bearer ${token}`};
  const options = {
    headers: headers,
  };
  const userData = await fetchData(url, options);

  if (userData.error) {
    console.log('Käyttäjän tietojen haku Kubioksesta epäonnistui');
    return;
  }
  console.log(userData);
  // userDatan on oltava array
  drawChart(userData);
  drawAMChart(userData);
};

const drawChart = (userData) => {
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

  // Create the chart
  const ctx = document.getElementById('heartRateChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Mean Heart Rate (bpm)',
          data: heartRates,
          borderColor: 'blue',
          borderWidth: 2,
          fill: false,
        },
        // LISÄÄ TÄHÄN TOINEN VIIVA
        // Add Stress Index line
        {
          label: 'Stress Index',
          data: stressIndex,
          borderColor: 'rgba(255, 99, 132, 1)', // Customize color
          borderWidth: 2,
          fill: false,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date',
          },
          // ajan muutos vaatii https://www.npmjs.com/package/chartjs-adapter-date-fns
          type: 'time',
          time: {
            displayFormats: {
              quarter: 'MMM YYYY',
            },
          },
        },
        y: {
          title: {
            display: true,
            text: 'Heart Rate (bpm)',
          },
        },
      },
    },
  });
};

const drawAMChart = (userData) => {
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
      }),
    );

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        behavior: 'none',
      }),
    );
    cursor.lineY.set('visible', false);

    // Generate random data
    // var date = new Date();
    // date.setHours(0, 0, 0, 0);
    // var value = 100;

    // function generateData() {
    //   value = Math.round(Math.random() * 10 - 5 + value);
    //   am5.time.add(date, 'day', 1);
    //   return {
    //     date: date.getTime(),
    //     value: value,
    //   };
    // }

    // function generateDatas(count) {
    //   var data = [];
    //   for (var i = 0; i < count; ++i) {
    //     data.push(generateData());
    //   }
    //   return data;
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
      }),
    );

    // Ulla lisäys
    // Format the labels to show only Month and Date
    // xAxis.set("dateFormats", {
    //   day: "MMM dd", // Example: "Apr 03"
    // });

    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          pan: 'zoom',
        }),
      }),
    );

    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    // var series = chart.series.push(
    //   am5xy.LineSeries.new(root, {
    //     name: 'Series',
    //     xAxis: xAxis,
    //     yAxis: yAxis,
    //     valueYField: 'value',
    //     valueXField: 'date',
    //     tooltip: am5.Tooltip.new(root, {
    //       labelText: '{valueY}',
    //     }),
    //   }),
    // );

    var heartRateSeries = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'Mean Heart Rate',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'readiness',
        valueXField: 'date',
        stroke: am5.color(0x0000ff), // Blue color
        tooltip: am5.Tooltip.new(root, {
          labelText: '{valueY}',
        }),
      }),
    );

    var stressIndexSeries = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: 'Stress Index',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'stress_index',
        valueXField: 'date',
        stroke: am5.color(0xff6384), // Red color
        tooltip: am5.Tooltip.new(root, {
          labelText: '{valueY}',
        }),
      }),
    );

    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set(
      'scrollbarX',
      am5.Scrollbar.new(root, {
        orientation: 'horizontal',
      }),
    );

    // Set data
    // {date: 1743714000000, value: 102}
    // var data = generateDatas(12);
    // console.log(data);
    // series.data.setAll(data);

    // Load Data
    var data = userData.results.map((entry) => ({
      date: new Date(entry.daily_result).getTime(), // Converts date string to timestamp, // Ensure this is a Date object
      readiness: entry.result.readiness,
      stress_index: entry.result.stress_index,
    }));

    console.log(data);
    // Set data for both series
    heartRateSeries.data.setAll(data);
    stressIndexSeries.data.setAll(data);

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    heartRateSeries.appear(1000);
    stressIndexSeries.appear(1000);
    chart.appear(1000, 100);
  }); // end am5.ready()
};

const getUserInfo = async () => {
  console.log('Käyttäjän INFO Kubioksesta');

  const url = 'http://localhost:3000/api/kubios/user-info';
  const token = localStorage.getItem('token');
  const headers = {Authorization: `Bearer ${token}`};
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

export {getUserData, getUserInfo};
