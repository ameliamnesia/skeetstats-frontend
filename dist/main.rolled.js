import { Tooltip } from 'bootstrap';
import { Chart, registerables } from 'chart.js/auto';

const baseApiUrl = 'https://skeetstats.xyz:8443';
const regex = /^did:plc:[^@'"\,]+/;
async function getStats(handle) {
    let resdid = await handleOrDid(handle);
    const response = await fetch(`${baseApiUrl}/api/stats/${resdid}`);
    const respData = await response.json();
    respData.forEach(async (array, index) => {
        const uglyDate = new Date(array.date);
        const prettyDate = uglyDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        array.date = prettyDate;
    });
    const stats = await respData.map(({ did, idstats, postsDifference, ...rest }) => rest);
    return stats;
}
async function getCharts(handle) {
    let resdid = await handleOrDid(handle);
    const response = await fetch(`${baseApiUrl}/api/charts/${resdid}`);
    const respData = await response.json();
    respData.forEach(async (array, index) => {
        const uglyDate = new Date(array.date);
        const prettyDate = uglyDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        array.date = prettyDate;
    });
    const stats = await respData.map(({ did, idstats, postsDifference, ...rest }) => rest);
    return stats;
}
async function getMax(handle) {
    let resdid = await handleOrDid(handle);
    const response = await fetch(`${baseApiUrl}/api/mostincreased/${resdid}`);
    const data = await response.json();
    return data;
}
async function profileInfo(handle) {
    let resdid = await handleOrDid(handle);
    const response = await fetch(`${baseApiUrl}/api/profile/${resdid}`);
    const respData = await response.json();
    return respData;
}
async function getSuggestions(handle) {
    let resdid = await handleOrDid(handle);
    const response = await fetch(`${baseApiUrl}/api/suggested/${resdid}`);
    const respData = await response.json();
    const suggests = await respData.map(({ banner, description, followersCount, followsCount, indexedAt, postsCount, ...rest }) => rest);
    return suggests;
}
async function handleOrDid(handle) {
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
            window.location.href = 'https://skeetstats.xyz/error';
        }
    }
    return resdid;
}

const baseUrl$2 = 'https://skeetstats.xyz';
async function renderProfile(user) {
    const gp = await profileInfo(user);
    const data = {
        handle: gp.handle || '',
        displayName: gp.displayName ?? gp.handle,
        imageUrl: gp.avatar,
        banner: gp.banner,
        linkUrl: "https://bsky.app/profile/" + user,
        followerCount: String(gp.followersCount),
        followsCount: String(gp.followsCount),
        totalPosts: String(gp.postsCount),
        bio: gp.description,
    };
    const trunchandle = data.displayName.slice(0, 75) || data.handle.slice(0, 75);
    document.title = 'SkeetStats - ' + data.displayName;
    // Get the existing card, table, and card header elements
    document.getElementById('profileCard');
    const userTable = document.getElementById('userTable');
    const userName = document.getElementById('userName');
    // Update the card header with a link
    const link = document.createElement('a');
    link.href = data.linkUrl;
    link.textContent = trunchandle;
    userName.innerHTML = ''; // Clear existing content
    link.style.fontWeight = 'bold';
    link.classList.add("fs-4", "text-break", "link-body-emphasis", "list-link");
    userName.appendChild(link);
    // Create a new row for the table
    const profileRow = userTable.insertRow();
    // Create cells for the new row
    const bannerCell = profileRow.insertCell(0);
    // Set background image for the banner cell
    bannerCell.setAttribute('colspan', '3');
    if (data.banner != undefined) {
        bannerCell.style.backgroundImage = `url(${data.banner})`;
    }
    else {
        bannerCell.style.backgroundImage = `url(${baseUrl$2}/images/blankbanner.jpg)`;
    }
    bannerCell.style.backgroundSize = 'cover';
    // Create a new a element for the thumbnail
    const thumbnailLink = document.createElement('a');
    thumbnailLink.href = '#';
    thumbnailLink.setAttribute('data-bs-toggle', 'modal');
    thumbnailLink.setAttribute('data-bs-target', '#imageModal');
    // Create thumbnail element
    const thumbnail = document.createElement('img');
    if (data.imageUrl != undefined) {
        thumbnail.src = data.imageUrl;
    }
    else {
        thumbnail.src = `${baseUrl$2}/images/blank.png`;
    }
    thumbnail.alt = 'profile picture';
    thumbnail.width = 80;
    thumbnail.height = 80;
    // Append thumbnail to the a element
    thumbnailLink.appendChild(thumbnail);
    // Append the a element to the banner cell
    bannerCell.appendChild(thumbnailLink);
    // Create a new row for the headers
    const headerRow = userTable.insertRow();
    headerRow.classList.add('text-center', 'table-secondary');
    const headers = ['followers', 'follows', 'posts'];
    // Add headers to header row
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.classList.add('text-body', 'text-center');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    // Create a new row for the follower count, follows count, and total posts
    const countRow = userTable.insertRow();
    countRow.classList.add("text-center", "text-body");
    const followersCountCell = countRow.insertCell(0);
    followersCountCell.classList.add("text-body");
    const followsCountCell = countRow.insertCell(1);
    followsCountCell.classList.add("text-body");
    const totalPostsCell = countRow.insertCell(2);
    totalPostsCell.classList.add("text-body");
    // Set content for follower count, follows count, and total posts cells
    followersCountCell.textContent = data.followerCount;
    followsCountCell.textContent = data.followsCount;
    totalPostsCell.textContent = data.totalPosts;
    // Add event listener to thumbnailLink to trigger the modal
    thumbnailLink.addEventListener('click', () => {
        const modalTitle = document.getElementById('pfpModalLabel');
        modalTitle.textContent = trunchandle;
        const modalText = document.getElementById('modalText');
        if (data.bio == undefined) {
            modalText.innerText = '';
        }
        else {
            modalText.innerText = data.bio;
        }
        const fullSizeImage = document.getElementById('fullSizeImage');
        fullSizeImage.src = thumbnail.src;
    });
}

//import { Tooltip } from './../node_modules/bootstrap/dist/js/bootstrap.esm.min.js';
//import { user, baseUrl } from './functions.js';
const baseUrl$1 = 'https://skeetstats.xyz';
async function createSuggestedTable(user) {
    try {
        // Retrieve suggested follows
        let suggested = await getSuggestions(user);
        let suggestions = await suggested;
        // Get a reference to the existing table with the id "suggestions"
        const suggestionsTable = document.getElementById('suggestions');
        if (suggestionsTable) {
            // Create table body if it doesn't exist
            let tableBody = suggestionsTable.querySelector('tbody');
            if (!tableBody) {
                tableBody = document.createElement('tbody');
                suggestionsTable.appendChild(tableBody);
            }
            // Loop through suggestions and create a new row for each suggestion in the suggestions table
            suggestions.forEach(async (array, index) => {
                //const sugg = await agent.getProfile({ actor: array.handle })
                const sugg = await profileInfo(array.handle);
                const trunchandle = array.handle.slice(0, 40);
                const suggestionRow = tableBody.insertRow();
                // Add a cell for image in each suggestion row
                const imageCell = suggestionRow.insertCell();
                imageCell.classList.add("w-auto");
                const suggestionImage = document.createElement('img');
                if (sugg.avatar != undefined) {
                    suggestionImage.src = array.avatar;
                }
                else {
                    suggestionImage.src = `${baseUrl$1}/images/blank.png`;
                }
                suggestionImage.width = 45; // Set image width
                suggestionImage.height = 45; // Set image height
                suggestionImage.classList.add("text-center");
                imageCell.appendChild(suggestionImage);
                // Create a cell for the info icon link to the left of suggestionImage
                const infoIconCell = suggestionRow.insertCell();
                const infoIconLink = document.createElement('a');
                infoIconLink.href = `${baseUrl$1}/user/${array.handle}`;
                infoIconLink.setAttribute('data-bs-toggle', 'tooltip'); // Enable Bootstrap tooltip
                infoIconLink.setAttribute('data-bs-placement', 'top'); // Set tooltip placement
                infoIconLink.setAttribute('title', 'Go to the stats page for this user'); // Set tooltip text
                // Initialize Bootstrap tooltip
                new Tooltip(infoIconLink);
                infoIconCell.appendChild(infoIconLink);
                const infoIcon = document.createElement('i');
                infoIcon.className = 'bi bi-info-square-fill'; // Bootstrap icon class
                infoIcon.style.fontSize = '1.9rem';
                infoIcon.style.color = 'mediumseagreen'; // Set the color to mediumseagreen
                infoIconLink.appendChild(infoIcon);
                // Add a cell for the link in each suggestion row
                const suggestionCell = suggestionRow.insertCell();
                const suggestionLink = document.createElement('a');
                suggestionLink.href = "https://bsky.app/profile/" + array.handle; // Set the link URL
                suggestionLink.target = "_blank";
                suggestionLink.classList.add("link-info", "list-link");
                suggestionLink.style.fontWeight = "bold";
                suggestionLink.textContent = trunchandle;
                suggestionCell.appendChild(suggestionLink);
                suggestionCell.classList.add("w-100", "text-break");
            });
        }
        else {
            console.error('Suggestions table not found.');
        }
    }
    catch (error) {
        console.error('Error fetching suggested follows:', error);
    }
}

//import { user } from './functions.js';
async function createTableFromStatsData(user) {
    const statsData = await getStats(user);
    const table = document.getElementById('statsTable');
    if (table) {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['date', 'followers', 'follows', 'posts'];
        // Add headers to header row
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.classList.add('text-body');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        // Add header row to the table
        thead.appendChild(headerRow);
        table.appendChild(thead);
        // Create table body if it doesn't exist
        let tableBody = table.querySelector('tbody');
        if (!tableBody) {
            tableBody = document.createElement('tbody');
            table.appendChild(tableBody);
        }
        statsData.forEach((item) => {
            const row = document.createElement('tr');
            for (const key in item) {
                // Iterate over the keys and create a cell for each value
                if (item.hasOwnProperty(key)) {
                    const cell = document.createElement('td');
                    cell.textContent = item[key].toString();
                    //cell.classList.add("w-100");
                    cell.classList.add("text-body");
                    row.appendChild(cell);
                }
            }
            tableBody.appendChild(row);
        });
        let checkForZero = String(statsData.length);
        if (checkForZero == '0') {
            const row = document.createElement('tr');
            const noDataCell = document.createElement('td');
            noDataCell.colSpan = 4;
            noDataCell.classList.add("text-body");
            noDataCell.textContent = 'no data yet, if the user is opted in it will update daily at 11PM EST';
            row.appendChild(noDataCell);
            tableBody.appendChild(row);
        }
    }
    table.classList.add('table', 'table-striped', 'table-hover');
}

// Register necessary modules
Chart.register(...registerables);
async function makeCharts(user) {
    const chartData = await getCharts(user);
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
    const followersCanvas = document.getElementById('followers-chart-container');
    const postsCanvas = document.getElementById('posts-chart-container');
    // Create the first chart for followersDataset
    new Chart(followersCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [followersDataset, followsDataset]
        },
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
}

async function bestDays(user) {
    const data = await getMax(user);
    try {
        // Find the existing HTML table body
        const growthTable = document.getElementById('bestDaysTable');
        let tableBody = growthTable.querySelector('tbody');
        if (data.followersCountDate === null) {
            const row = tableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 3;
            cell.classList.add('text-body');
            cell.textContent = 'no data yet. if the user is opted in, it will update daily at 11PM EST';
        }
        else {
            // Insert data into the table
            if ('followersCountDate' in data) {
                const row = tableBody.insertRow();
                row.classList.add('text-center', 'text-body');
                const followersCell = row.insertCell();
                followersCell.textContent = 'followers';
                followersCell.classList.add('fw-bold');
                const followersDateCell = row.insertCell();
                followersDateCell.textContent = new Date(data.followersCountDate).toDateString();
                const followersIncreaseCell = row.insertCell();
                followersIncreaseCell.textContent = data.followersCountIncrease.toString();
            }
            if ('followsCountDate' in data) {
                const row = tableBody.insertRow();
                row.classList.add('text-center', 'text-body');
                const followsCell = row.insertCell();
                followsCell.textContent = 'follows';
                followsCell.classList.add('fw-bold');
                const followsDateCell = row.insertCell();
                followsDateCell.textContent = new Date(data.followsCountDate).toDateString();
                const followsIncreaseCell = row.insertCell();
                followsIncreaseCell.textContent = data.followsCountIncrease.toString();
            }
            if ('postsCountDate' in data) {
                const row = tableBody.insertRow();
                row.classList.add('text-center', 'text-body');
                const postsCell = row.insertCell();
                postsCell.textContent = 'posts';
                postsCell.classList.add('fw-bold');
                const postsDateCell = row.insertCell();
                postsDateCell.textContent = new Date(data.postsCountDate).toDateString();
                const postsIncreaseCell = row.insertCell();
                postsIncreaseCell.textContent = data.postsCountIncrease.toString();
            }
        }
    }
    catch (error) {
        console.error('Error fetching stats:', error);
    }
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
await renderProfile(user);
await createSuggestedTable(user);
await createTableFromStatsData(user);
await bestDays(user);
await makeCharts(user);

export { baseUrl, user };
