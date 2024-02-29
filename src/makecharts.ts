export const baseUrl = 'https://skeetstats.xyz'
const urlString: string = window.location.href;
const url = new URL(urlString);
const handle = url.pathname.split("/").pop() || '';
const cleanedHandle = handle.replace(/[@'"]/g, '');
export const user: string = cleanedHandle || 'skeetstats.xyz';
import { makeCharts } from "./charts.js";
await makeCharts(user)