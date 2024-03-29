import { Tooltip } from 'bootstrap';

const baseApiUrl = 'https://skeetstats.xyz:8443';
const regex = /^did:plc:[^@'"\,]+/;
async function getStats(handle, page) {
    let resdid = await handleOrDid(handle);
    let url = `${baseApiUrl}/api/stats/${resdid}`;
    if (page) {
        url += `?page=${page}`;
    }
    const response = await fetch(url);
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
    const plcdir = `https://plc.directory/${resdid}/log/audit`;
    try {
        const audit = await fetch(plcdir);
        const plcData = await audit.json();
        if (Array.isArray(plcData) && plcData.length > 0) {
            const created = new Date(plcData[0].createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            respData.created = created;
        }
        else {
            console.log('No data returned or data is not in expected format.');
        }
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
    return respData;
}
async function getSuggestions(handle) {
    let resdid = await handleOrDid(handle);
    const response = await fetch(`${baseApiUrl}/api/suggested/${resdid}`);
    const respData = await response.json();
    const suggests = await respData.map(({ banner, description, followersCount, followsCount, indexedAt, postsCount, ...rest }) => rest);
    return suggests;
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

async function statsHeaders() {
    const table = document.getElementById('statsTable');
    if (table) {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['date', 'followers', 'following', 'posts'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.classList.add('text-body');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
    }
}
async function createTableFromStatsData(user, page = 1) {
    const statsData = await getStats(user, page);
    const table = document.getElementById('statsTable');
    if (table) {
        let tableBody = table.querySelector('tbody');
        if (!tableBody) {
            tableBody = document.createElement('tbody');
            table.appendChild(tableBody);
        }
        tableBody.innerHTML = '';
        statsData.forEach((item) => {
            const row = document.createElement('tr');
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    const cell = document.createElement('td');
                    cell.textContent = item[key].toString();
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
            const nextPageBtn = document.getElementById('nextPageBtn');
            nextPageBtn.disabled = true;
        }
        else {
            const nextPageBtn = document.getElementById('nextPageBtn');
            nextPageBtn.disabled = false;
        }
    }
    table.classList.add('table', 'table-striped', 'table-hover');
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

let isSuggestedTableCreated = false;
let currentPage = 1;
const baseUrl = 'https://skeetstats.xyz';
const urlString = window.location.href;
const url = new URL(urlString);
const handle = url.pathname.split("/").pop() || '';
const cleanedHandle = handle.replace(/[@'"]/g, '');
const user = cleanedHandle || 'skeetstats.xyz';
await statsHeaders();
await createTableFromStatsData(user);
await bestDays(user);
const interactionsButton = document.getElementById("interactions");
if (interactionsButton) {
    interactionsButton.addEventListener("click", async () => {
        if (!isSuggestedTableCreated) {
            await createSuggestedTable(user);
            isSuggestedTableCreated = true;
        }
    });
}
document.getElementById('prevPageBtn')?.addEventListener('click', async () => {
    currentPage--;
    await createTableFromStatsData(user, currentPage);
    const prevPageBtn = document.getElementById('prevPageBtn');
    if (prevPageBtn && currentPage === 1) {
        prevPageBtn.disabled = true;
    }
});
document.getElementById('nextPageBtn')?.addEventListener('click', async () => {
    currentPage++;
    await createTableFromStatsData(user, currentPage);
    const prevPageBtn = document.getElementById('prevPageBtn');
    if (prevPageBtn && currentPage != 1) {
        prevPageBtn.disabled = false;
    }
});
const prevPageBtn = document.getElementById('prevPageBtn');
if (prevPageBtn && currentPage === 1) {
    prevPageBtn.disabled = true;
}

export { baseUrl, user };
