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
import { makeCharts } from './charts.js';
await renderProfile(user);
await createSuggestedTable(user);
await createTableFromStatsData(user);
await makeCharts(user);
