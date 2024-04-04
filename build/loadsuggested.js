let isSuggestedTableCreated = false;
export const baseUrl = 'https://skeetstats.xyz';
const urlString = window.location.href;
const url = new URL(urlString);
const handle = url.pathname.split("/").pop() || '';
const cleanedHandle = handle.replace(/[@'"]/g, '');
export const user = cleanedHandle || 'skeetstats.xyz';
import { createSuggestedTable } from "./suggested.js";
const interactionsButton = document.getElementById("interactions");
if (interactionsButton) {
    interactionsButton.addEventListener("click", async () => {
        if (!isSuggestedTableCreated) {
            await createSuggestedTable(user);
            isSuggestedTableCreated = true;
        }
    });
}
