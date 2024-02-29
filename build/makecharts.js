export const baseUrl = 'https://skeetstats.xyz';
const urlString = window.location.href;
const url = new URL(urlString);
const handle = url.pathname.split("/").pop() || '';
const cleanedHandle = handle.replace(/[@'"]/g, '');
export const user = cleanedHandle || 'skeetstats.xyz';
import { makeCharts } from "./charts.js";
await makeCharts(user);
