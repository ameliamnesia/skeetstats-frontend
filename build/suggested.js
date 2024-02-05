//import { Tooltip } from './../node_modules/bootstrap/dist/js/bootstrap.esm.min.js';
import { Tooltip } from 'bootstrap';
import { profileInfo, getSuggestions } from './api.js';
//import { user, baseUrl } from './functions.js';
const baseUrl = 'https://skeetstats.xyz';
export async function createSuggestedTable(user) {
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
                    suggestionImage.src = `${baseUrl}/images/blank.png`;
                }
                suggestionImage.width = 45; // Set image width
                suggestionImage.height = 45; // Set image height
                suggestionImage.classList.add("text-center");
                imageCell.appendChild(suggestionImage);
                // Create a cell for the info icon link to the left of suggestionImage
                const infoIconCell = suggestionRow.insertCell();
                const infoIconLink = document.createElement('a');
                infoIconLink.href = `${baseUrl}/user/${array.handle}`;
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
