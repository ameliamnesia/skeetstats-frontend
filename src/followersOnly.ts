const urlString: string = window.location.href;
const url = new URL(urlString);
const split = url.pathname.split("/");
const handle = split[2]
// Remove '@', apostrophes, and quotation marks from the handle
const cleanedHandle = handle.replace(/[@'"]/g, '');
const user: string = cleanedHandle || 'skeetstats.xyz';
let cursor: string | undefined;
import { renderProfile } from './profile.js';
import { fetchFollowers } from './followers.js';
import { createTableFromStatsData } from "./stats.js";

// Get the pagination button element from the HTML
const paginationButton = document.getElementById('paginateButton') as HTMLButtonElement;

// Add a click event listener to the pagination button
paginationButton.addEventListener('click', async () => {
  await fetchFollowers(user);
});
await renderProfile(user);
await createTableFromStatsData(user);
await fetchFollowers(user);
