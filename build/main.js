let cursor;
let statsPage = 1;
export const baseUrl = 'https://skeetstats.xyz';
const urlString = window.location.href;
const url = new URL(urlString);
const handle = url.pathname.split("/").pop() || '';
const cleanedHandle = handle.replace(/[@'"]/g, '');
export const user = cleanedHandle || 'skeetstats.xyz';
import { statsHeaders, createTableFromStatsData } from "./stats.js";
import { bestDays } from './bestday.js';
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
