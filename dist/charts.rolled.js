import { Chart, registerables } from 'chart.js/auto';

const baseApiUrl = 'https://skeetstats.xyz:8443';
const regex = /^did:plc:[^@'"\,]+/;
async function getCharts(handle) {
    let resdid = await handleOrDid(handle);
    // First API call to fetch 30 days
    const response = await fetch(`${baseApiUrl}/api/charts/${resdid}`);
    const respData = await response.json();
    // Process data from 30 day
    respData.forEach(async (array, index) => {
        const uglyDate = new Date(array.date);
        const prettyDate = uglyDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        array.date = prettyDate;
    });
    const chartsData = await respData.map(({ did, idstats, postsDifference, ...rest }) => rest);
    // Second API call to fetch monthly data
    const monthResponse = await fetch(`${baseApiUrl}/api/monthly/${resdid}`);
    const monthData = await monthResponse.json();
    // Process data from monthly call
    monthData.forEach(async (array, index) => {
        const uglyDate = new Date(array.date);
        const prettyDate = uglyDate.toLocaleDateString('en-US', { month: 'short' });
        array.date = prettyDate;
    });
    return { charts: chartsData, monthData };
}
const handleCache = {};
async function handleOrDid(handle) {
    if (handleCache[handle]) {
        return handleCache[handle];
    }
    let resdid;
    let strippedHandle = handle.replace(/[@'"]/g, '');
    if (regex.test(handle)) {
        const resultString = handle.replace(regex, (match) => match.replace(/[@'"\,]/g, ''));
        resdid = resultString;
    }
    else {
        try {
            const response = await fetch(`${baseApiUrl}/api/resolve/${strippedHandle}`, { method: 'POST' });
            if (!response.ok) {
                console.log(`Failed to resolve ${strippedHandle}`);
            }
            resdid = await response.json();
        }
        catch (error) {
            console.log(`Error resolving handle: ${error.message}`);
        }
    }
    handleCache[handle] = Promise.resolve(resdid);
    return resdid;
}

// Register necessary modules
Chart.register(...registerables);
async function makeCharts(user) {
    const chartData = await getCharts(user);
    const labels = chartData.charts.map(item => item.date);
    const monthLabels = chartData.monthData.map(item => item.date);
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
    Chart.defaults.elements.point.hitRadius = 4;
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.responsive = true;
    Chart.defaults.plugins.tooltip.displayColors = false;
    Chart.defaults.layout.padding = { right: 15, left: 15 };
    Chart.defaults.scales.linear.ticks.precision = 0;
    Chart.defaults.elements.point.hitRadius = 4;
    Chart.defaults.elements.point.radius = 4;
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
    const followersCanvas = document.getElementById('followers-chart-container');
    const postsCanvas = document.getElementById('posts-chart-container');
    const followersMonthCanvas = document.getElementById('monthly-chart-container');
    const postsMonthCanvas = document.getElementById('monthly-posts-container');
    // Create the first chart for followersDataset
    new Chart(followersCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [followersDataset, followsDataset]
        },
        //@ts-ignore
        options: options
    });
    // Create the second chart for postsDataset
    new Chart(postsCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [postsDataset]
        },
        options: options2
    });
    // Create the first chart for followersDataset
    new Chart(followersMonthCanvas, {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [monthlyFollowersDataset, monthlyFollowsDataset]
        },
        //@ts-ignore
        options: options3
    });
    // Create the first chart for followersDataset
    new Chart(postsMonthCanvas, {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [monthlyPostsDataset]
        },
        options: options4
    });
}

const baseUrl = 'https://skeetstats.xyz';
// Use window.location to get the current URL
const urlString = window.location.href;
const url = new URL(urlString);
// Extract the "handle" portion from the pathname
const handle = url.pathname.split("/").pop() || '';
// Remove '@', apostrophes, and quotation marks from the handle
const cleanedHandle = handle.replace(/[@'"]/g, '');
const user = cleanedHandle || 'skeetstats.xyz';
await makeCharts(user);

export { baseUrl, user };
