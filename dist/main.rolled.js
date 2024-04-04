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
        const prettyDate = uglyDate.toLocaleString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
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

let statsPage = 1;
const baseUrl = 'https://skeetstats.xyz';
const urlString = window.location.href;
const url = new URL(urlString);
const handle = url.pathname.split("/").pop() || '';
const cleanedHandle = handle.replace(/[@'"]/g, '');
const user = cleanedHandle || 'skeetstats.xyz';
await statsHeaders();
await createTableFromStatsData(user);
await bestDays(user);
document.getElementById('prevPageBtn')?.addEventListener('click', async () => {
    statsPage--;
    await createTableFromStatsData(user, statsPage);
    const prevPageBtn = document.getElementById('prevPageBtn');
    if (prevPageBtn && statsPage === 1) {
        prevPageBtn.disabled = true;
    }
});
document.getElementById('nextPageBtn')?.addEventListener('click', async () => {
    statsPage++;
    await createTableFromStatsData(user, statsPage);
    const prevPageBtn = document.getElementById('prevPageBtn');
    if (prevPageBtn && statsPage != 1) {
        prevPageBtn.disabled = false;
    }
});
const prevPageBtn = document.getElementById('prevPageBtn');
if (prevPageBtn && statsPage === 1) {
    prevPageBtn.disabled = true;
}

export { baseUrl, user };
