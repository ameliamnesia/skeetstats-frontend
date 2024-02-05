//import { Tooltip } from './../node_modules/bootstrap/dist/js/bootstrap.esm.min.js';
import { Tooltip } from 'bootstrap';
import { getFollowers } from './api.js';
let cursor;
const baseUrl = 'https://skeetstats.xyz';
export async function fetchFollowers(user) {
    const table = document.getElementById('followerlist');
    const tableBody = table?.querySelector('tbody');
    if (!table || !tableBody) {
        console.error('Table or table body not found');
        return;
    }
    let currentPage = 0;
    const result = await getFollowers(user, cursor);
    const paginationButton = document.getElementById('paginateButton');
    let followers = await result;
    if (followers[0].cursor) {
        cursor = followers[0].cursor;
        currentPage++;
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
        let array = followers[0].followers;
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
