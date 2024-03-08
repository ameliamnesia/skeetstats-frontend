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
async function getFollowers(handle, cursor) {
    let resdid = await handleOrDid(handle);
    const response = await fetch(`${baseApiUrl}/api/followers/${resdid}/${cursor || ''}`);
    const respData = await response.json();
    const followers = await respData.map(({ description, indexedAt, ...rest }) => rest);
    return followers;
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

const baseUrl$1 = 'https://skeetstats.xyz';
async function renderProfile(user) {
    const gp = await profileInfo(user);
    const data = {
        handle: gp.handle || '',
        displayName: gp.displayName ?? gp.handle,
        imageUrl: gp.avatar ?? `${baseUrl$1}/images/blank.png`,
        banner: gp.banner ?? `${baseUrl$1}/images/blankbanner.jpg`,
        linkUrl: "https://bsky.app/profile/" + user,
        followerCount: String(gp.followersCount),
        followsCount: String(gp.followsCount),
        totalPosts: String(gp.postsCount),
        bio: gp.description ?? '',
        created: gp.created || ''
    };
    const trunchandle = data.displayName.slice(0, 75) || data.handle.slice(0, 75) || 'error fetching handle';
    document.title = 'SkeetStats - ' + data.displayName;
    // Get the existing card, table, and card header elements
    document.getElementById('profileCard');
    const userTable = document.getElementById('userTable');
    const userName = document.getElementById('userName');
    // Update the card header with a link
    const link = document.createElement('a');
    link.href = data.linkUrl;
    link.target = '_blank';
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
    bannerCell.setAttribute('colspan', '4');
    bannerCell.style.backgroundImage = `url(${data.banner})`;
    bannerCell.style.backgroundSize = 'cover';
    // Create a new a element for the thumbnail
    const thumbnailLink = document.createElement('a');
    thumbnailLink.href = '#';
    thumbnailLink.setAttribute('data-bs-toggle', 'modal');
    thumbnailLink.setAttribute('data-bs-target', '#imageModal');
    // Create thumbnail element
    const thumbnail = document.createElement('img');
    thumbnail.src = data.imageUrl;
    thumbnail.alt = 'profile picture';
    thumbnail.width = 80;
    thumbnail.height = 80;
    // Append thumbnail to the a element
    thumbnailLink.appendChild(thumbnail);
    // Append the a element to the banner cell
    bannerCell.appendChild(thumbnailLink);
    // Create a new row for the headers
    const headerRow = userTable.insertRow();
    headerRow.classList.add('text-center');
    const headers = ['followers', 'following', 'posts', 'joined'];
    // Add headers to header row
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.classList.add('text-body', 'text-center');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    // Create a new row for the follower count, follows count, and total posts
    const countRow = userTable.insertRow();
    countRow.classList.add("text-center", "text-body", "text-break");
    const followersCountCell = countRow.insertCell(0);
    const followsCountCell = countRow.insertCell(1);
    const totalPostsCell = countRow.insertCell(2);
    const joinedCell = countRow.insertCell(3);
    // Set content for follower count, follows count, and total posts cells
    followersCountCell.textContent = data.followerCount;
    followsCountCell.textContent = data.followsCount;
    totalPostsCell.textContent = data.totalPosts;
    joinedCell.textContent = data.created;
    // Add event listener to thumbnailLink to trigger the modal
    thumbnailLink.addEventListener('click', () => {
        const modalTitle = document.getElementById('pfpModalLabel');
        modalTitle.textContent = trunchandle;
        const modalText = document.getElementById('modalText');
        modalText.innerText = data.bio;
        const fullSizeImage = document.getElementById('fullSizeImage');
        fullSizeImage.src = thumbnail.src;
    });
}

//import { Tooltip } from './../node_modules/bootstrap/dist/js/bootstrap.esm.min.js';
let cursor;
const baseUrl = 'https://skeetstats.xyz';
async function fetchFollowers(user) {
    const table = document.getElementById('followerlist');
    const tableBody = table?.querySelector('tbody');
    if (!table || !tableBody) {
        console.error('Table or table body not found');
        return;
    }
    const result = await getFollowers(user, cursor);
    const paginationButton = document.getElementById('paginateButton');
    let followers = await result;
    if (followers[0].cursor) {
        cursor = followers[0].cursor;
    }
    else {
        cursor = undefined;
        // If there are no more pages, disable the pagination button or handle accordingly
        paginationButton.disabled = true;
    }
    paginationButton.addEventListener('click', async () => {
        await getFollowers(user, followers[0].cursor);
    });
    followers[0].followers.forEach((item) => {
        const row = tableBody.insertRow();
        followers[0].followers;
        // Create table cells
        const iconCell = document.createElement("td");
        const iconLink = document.createElement('a');
        iconLink.href = `${baseUrl}/user/${item.handle}`; // Set the href attribute for the link 
        const iconElement = document.createElement('i');
        iconElement.classList.add('bi', 'bi-info-square-fill'); // Bootstrap classes for the icon
        iconElement.style.fontSize = '1.9rem'; // Set font size
        iconElement.style.color = 'mediumseagreen'; // Set color
        iconLink.appendChild(iconElement);
        // Add tooltip using Bootstrap Tooltip
        iconLink.setAttribute('data-bs-toggle', 'tooltip');
        iconLink.setAttribute('data-bs-placement', 'top');
        iconLink.setAttribute('title', 'Go to the stats page for this user');
        // Initialize the tooltip
        new Tooltip(iconLink);
        iconCell.appendChild(iconLink);
        const imageCell = document.createElement("td");
        const imgElement = document.createElement('img');
        if (item.avatar != undefined) {
            imgElement.src = item.avatar;
        }
        else {
            imgElement.src = `${baseUrl}/images/blank.png`;
        }
        imgElement.width = 45;
        imgElement.height = 45;
        imageCell.className = "w-auto";
        imageCell.appendChild(imgElement);
        const handleCell = document.createElement("td");
        const handleLink = document.createElement('a');
        handleLink.href = "https://bsky.app/profile/" + item.handle;
        const trunchandle = item.handle.slice(0, 30);
        handleLink.textContent = trunchandle + "    ";
        handleLink.target = "_blank";
        handleLink.classList.add("link-info", "list-link");
        handleLink.style.fontWeight = "bold";
        handleCell.appendChild(handleLink);
        handleCell.classList.add("w-100", "text-break");
        // Append cells to the row
        row.appendChild(imageCell);
        row.appendChild(iconCell);
        row.appendChild(handleCell);
    });
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

const urlString = window.location.href;
const url = new URL(urlString);
const split = url.pathname.split("/");
const handle = split[2];
// Remove '@', apostrophes, and quotation marks from the handle
const cleanedHandle = handle.replace(/[@'"]/g, '');
const user = cleanedHandle || 'skeetstats.xyz';
// Get the pagination button element from the HTML
const paginationButton = document.getElementById('paginateButton');
// Add a click event listener to the pagination button
paginationButton.addEventListener('click', async () => {
    await fetchFollowers(user);
});
await renderProfile(user);
await createTableFromStatsData(user);
await fetchFollowers(user);
