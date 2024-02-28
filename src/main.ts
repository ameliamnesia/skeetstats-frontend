let cursor: string | undefined;
let isSuggestedTableCreated = false;
export const baseUrl = 'https://skeetstats.xyz'
const urlString: string = window.location.href;
const url = new URL(urlString);
const handle = url.pathname.split("/").pop() || '';
const cleanedHandle = handle.replace(/[@'"]/g, '');
export const user: string = cleanedHandle || 'skeetstats.xyz';
import { renderProfile } from './profile.js';
import { createSuggestedTable } from "./suggested.js";
import { createTableFromStatsData } from "./stats.js";
import { bestDays } from './bestday.js';
await renderProfile(user);
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