let cursor;
export const baseUrl = 'https://skeetstats.xyz';
// Use window.location to get the current URL
const urlString = window.location.href;
const url = new URL(urlString);
// Extract the "handle" portion from the pathname
const handle = url.pathname.split("/").pop() || '';
// Remove '@', apostrophes, and quotation marks from the handle
const cleanedHandle = handle.replace(/[@'"]/g, '');
export const user = cleanedHandle || 'bsky.app';
import { renderProfile } from './profile.js';
import { createSuggestedTable } from "./suggested.js";
import { createTableFromStatsData } from "./stats.js";
import { fetchFollowers } from "./followers.js";
// Get the pagination button element from the HTML
const paginationButton = document.getElementById('paginateButton');
// Add a click event listener to the pagination button
paginationButton.addEventListener('click', async () => {
    await fetchFollowers(user);
});
await renderProfile(user);
await fetchFollowers(user);
await createSuggestedTable(user);
await createTableFromStatsData(user);
