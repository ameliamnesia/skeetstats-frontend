export const baseUrl = 'https://skeetstats.xyz'
// Use window.location to get the current URL
const urlString: string = window.location.href;
const url = new URL(urlString);
// Extract the "handle" portion from the pathname
const handle = url.pathname.split("/").pop() || '';
// Remove '@', apostrophes, and quotation marks from the handle
const cleanedHandle = handle.replace(/[@'"]/g, '');
export const user: string = cleanedHandle || 'skeetstats.xyz';
import { makeCharts } from "./charts.js";
await makeCharts(user)