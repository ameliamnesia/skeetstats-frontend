import { Chart, registerables } from 'chart.js/auto';
import { getCharts } from './api.js';
// Register necessary modules
Chart.register(...registerables);
export async function makeCharts(user) {
  const chartData = await getCharts(user)
  const labels = chartData.map(item => item.date);
  const followersDataset = {
    label: 'followers',
    fill: true,
    data: chartData.map(item => item.followersCount),
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: 'rgba(75, 192, 192, 1)',
    borderWidth: 5
  };
  const followsDataset = {
    label: 'following',
    fill: true,
    data: chartData.map(item => item.followsCount),
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 5
  };
  const postsDataset = {
    label: 'posts',
    fill: true,
    data: chartData.map(item => item.postsCount),
    backgroundColor: 'rgba(255, 206, 86, 0.2)',
    borderColor: 'rgba(255, 206, 86, 1)',
    borderWidth: 5
  };
  Chart.defaults.font.size = 20;
  // Configuration options
  const options = {
    scales: {
      y: {
        beginAtZero: false
      }
    },
    plugins: {
      legend: {
        display: true
      },
      tooltip: {
        displayColors: false
      }
      
    },
    maintainAspectRatio: false, // To make the chart responsive
    responsive: true,
  };
  const options2 = {
    scales: {
      y: {
        beginAtZero: false
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        displayColors: false
      }
      
    },
    maintainAspectRatio: false, // To make the chart responsive
    responsive: true
  };
  // Get the canvas elements by the updated ids
  const followersCanvas = document.getElementById('followers-chart-container') as HTMLCanvasElement;
  const postsCanvas = document.getElementById('posts-chart-container') as HTMLCanvasElement;

  // Create the first chart for followersDataset
  const followersChart = new Chart(followersCanvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [followersDataset, followsDataset]
    },
    options: options
  });

  // Create the second chart for postsDataset
  const postsChart = new Chart(postsCanvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [postsDataset]
    },
    options: options2
  });
}