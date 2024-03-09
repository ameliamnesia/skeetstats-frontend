// Use window.location to get the current URL
const urlString = window.location.href;
const url = new URL(urlString);
const handle = url.pathname.split("/").pop() || '';
const cleanedHandle = handle.replace(/[@'"]/g, '');
export const user = cleanedHandle || 'skeetstats.xyz';
import { renderProfile } from './profile.js';
await renderProfile(user);
