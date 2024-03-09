let cursor;
let isSuggestedTableCreated = false;
let currentPage = 1;
export const baseUrl = 'https://skeetstats.xyz';
const urlString = window.location.href;
const url = new URL(urlString);
const handle = url.pathname.split("/").pop() || '';
const cleanedHandle = handle.replace(/[@'"]/g, '');
export const user = cleanedHandle || 'skeetstats.xyz';
//import { renderProfile } from './profile.js';
import { createSuggestedTable } from "./suggested.js";
import { statsHeaders, createTableFromStatsData } from "./stats.js";
import { bestDays } from './bestday.js';
//await renderProfile(user);
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
