import { Chart, registerables } from 'chart.js/auto';
import { getCharts } from './api.js';
// Register necessary modules
Chart.register(...registerables);
export async function makeCharts(user) {
  const chartData = await getCharts(user)
  const labels = chartData.charts.map(item => item.date);
  const monthLabels = chartData.monthData.map(item => item.date)
  const followersDataset = {
    label: 'followers',
    fill: true,
    data: chartData.charts.map(item => item.followersCount),
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: 'rgba(75, 192, 192, 1)',
    borderWidth: 3,
    yAxisID: 'y'
  };
  const followsDataset = {
    label: 'following',
    fill: true,
    data: chartData.charts.map(item => item.followsCount),
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 3,
    yAxisID: 'y1'
  };
  const postsDataset = {
    label: 'posts',
    fill: true,
    data: chartData.charts.map(item => item.postsCount),
    backgroundColor: 'rgba(255, 206, 86, 0.2)',
    borderColor: 'rgba(255, 206, 86, 1)',
    borderWidth: 3
  };
  const monthlyFollowersDataset = {
    label: 'followers',
    data: chartData.monthData.map(item => item.followersCount),
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: 'rgba(75, 192, 192, 1)',
    borderWidth: 3,
    yAxisID: 'y'
  };
  const monthlyFollowsDataset = {
    label: 'following',

    data: chartData.monthData.map(item => item.followsCount),
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 3,
    yAxisID: 'y1',
    position: 'right',
  };
  const monthlyPostsDataset = {
    label: 'posts',

    data: chartData.monthData.map(item => item.postsCount),
    backgroundColor: 'rgba(255, 206, 86, 0.2)',
    borderColor: 'rgba(255, 206, 86, 1)',
    borderWidth: 3
  };
  Chart.defaults.font.size = 20;
  Chart.defaults.elements.point.hitRadius = 4
  Chart.defaults.maintainAspectRatio = false
  Chart.defaults.responsive = true
  Chart.defaults.plugins.tooltip.displayColors = false
  Chart.defaults.layout.padding = { right: 15, left: 15 }
  Chart.defaults.scales.linear.ticks.precision = 0;
  Chart.defaults.elements.point.hitRadius = 4
  Chart.defaults.elements.point.radius = 4

  // Configuration options
  const options = {
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          color: 'rgba(75, 192, 192, 1)'
        },
      },
      y1: {
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: 'rgba(255, 99, 132, 1)'
        }
      }
    }
  };
  const options2 = {
    scales: {
      y: {
        beginAtZero: false,
        
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };
  const options3 = {
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        ticks: {
          color: 'rgba(75, 192, 192, 1)'
        },
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        min: 0,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: 'rgba(255, 99, 132, 1)'
        }
      },
    }
  };
  const options4 = {
    scales: {
      y: {
        beginAtZero: true,
      
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };
  // Get the canvas elements id
  const followersCanvas = document.getElementById('followers-chart-container') as HTMLCanvasElement;
  const postsCanvas = document.getElementById('posts-chart-container') as HTMLCanvasElement;
  const followersMonthCanvas = document.getElementById('monthly-chart-container') as HTMLCanvasElement;
  const postsMonthCanvas = document.getElementById('monthly-posts-container') as HTMLCanvasElement;

  // Create the first chart for followersDataset
  const followersChart = new Chart(followersCanvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [followersDataset, followsDataset]
    },
    //@ts-ignore
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

  // Create the first chart for followersDataset
  const monthlyFollowChart = new Chart(followersMonthCanvas, {
    type: 'bar',
    data: {
      labels: monthLabels,
      datasets: [monthlyFollowersDataset, monthlyFollowsDataset]
    },
    //@ts-ignore
    options: options3
  });
  // Create the first chart for followersDataset
  const monthlyPostsChart = new Chart(postsMonthCanvas, {
    type: 'bar',
    data: {
      labels: monthLabels,
      datasets: [monthlyPostsDataset]
    },
    options: options4
  });
}