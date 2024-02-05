import { profileInfo } from './api.js';
const baseUrl = 'https://skeetstats.xyz'
export async function renderProfile(user) {
const gp = await profileInfo(user);

const data = {
    handle: gp.handle || '',
    displayName: gp.displayName ?? gp.handle,
    imageUrl: gp.avatar,
    banner: gp.banner,
    linkUrl: "https://bsky.app/profile/" + user,
    followerCount: String(gp.followersCount),
    followsCount: String(gp.followsCount),
    totalPosts: String(gp.postsCount),
    bio: gp.description,
  };
  const trunchandle = data.displayName.slice(0, 75) || data.handle.slice(0, 75);
  document.title = 'SkeetStats - ' + data.displayName;
  // Get the existing card, table, and card header elements
  const card = document.getElementById('profileCard') as HTMLTableElement | null;
  const userTable = document.getElementById('userTable') as HTMLTableElement | null;
  const userName = document.getElementById('userName') as HTMLTableElement | null;
  
  // Update the card header with a link
  const link = document.createElement('a');
  link.href = data.linkUrl;
  link.textContent = trunchandle;
  link.classList.add("text-body")
  userName.innerHTML = ''; // Clear existing content
  link.style.fontWeight = 'bold';
  link.classList.add("fs-4", "text-break", "link-info", "list-link")
  userName.appendChild(link);
  
  // Create a new row for the table
  const profileRow = userTable.insertRow();
  
  // Create cells for the new row
  const bannerCell = profileRow.insertCell(0);

  // Set background image for the banner cell
bannerCell.setAttribute('colspan', '3');
if(data.banner != undefined) {
    bannerCell.style.backgroundImage = `url(${data.banner})`
  } else {
    bannerCell.style.backgroundImage = `url(${baseUrl}/images/blankbanner.jpg)`
  }
  bannerCell.style.backgroundSize = 'cover';

// Create a new a element for the thumbnail
const thumbnailLink = document.createElement('a');
thumbnailLink.href = '#';
thumbnailLink.setAttribute('data-bs-toggle', 'modal');
thumbnailLink.setAttribute('data-bs-target', '#imageModal');

// Create thumbnail element
const thumbnail = document.createElement('img');
if(data.imageUrl != undefined) {
    thumbnail.src = data.imageUrl;
    } else {
        thumbnail.src = `${baseUrl}/images/blank.png`;
    }
thumbnail.alt = 'profile picture';
thumbnail.width = 80;
thumbnail.height = 80;

// Append thumbnail to the a element
thumbnailLink.appendChild(thumbnail);
// Append the a element to the banner cell
bannerCell.appendChild(thumbnailLink);
// Create a new row for the headers
const headerRow = userTable.insertRow();
headerRow.classList.add('text-center', 'table-secondary')
const headers = ['followers', 'follows', 'posts'];
// Add headers to header row
headers.forEach(headerText => {
  const th = document.createElement('th');
  th.classList.add('text-body', 'text-center')
  th.textContent = headerText;
  headerRow.appendChild(th);
});

// Create a new row for the follower count, follows count, and total posts
const countRow = userTable.insertRow();
countRow.classList.add("text-center", "text-body")
const followersCountCell = countRow.insertCell(0);
followersCountCell.classList.add("text-body")
const followsCountCell = countRow.insertCell(1);
followsCountCell.classList.add("text-body")
const totalPostsCell = countRow.insertCell(2);
totalPostsCell.classList.add("text-body")

// Set content for follower count, follows count, and total posts cells
followersCountCell.textContent = data.followerCount;
followsCountCell.textContent = data.followsCount;
totalPostsCell.textContent = data.totalPosts;
// Add event listener to thumbnailLink to trigger the modal
thumbnailLink.addEventListener('click', () => {
    const modalTitle = document.getElementById('pfpModalLabel') as HTMLImageElement;
    modalTitle.textContent = trunchandle
    const modalText = document.getElementById('modalText') as HTMLImageElement;
    if(data.bio == undefined) {
      modalText.innerText = ''
    } else {
    modalText.innerText = data.bio;
    }
    const fullSizeImage = document.getElementById('fullSizeImage') as HTMLImageElement;
    fullSizeImage.src = thumbnail.src;
  });
}