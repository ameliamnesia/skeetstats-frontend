import { getMax } from "./api.js";
let user;
export async function bestDays(user) {
    const data = await getMax(user);
    try {
        // Find the existing HTML table body
        const growthTable = document.getElementById('bestDaysTable');
        let tableBody = growthTable.querySelector('tbody');
        if (data.followersCountDate === null) {
            const row = tableBody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 3;
            cell.classList.add('text-body');
            cell.textContent = 'no data yet. if the user is opted in, it will update daily at 11PM EST';
        }
        else {
            // Insert data into the table
            if ('followersCountDate' in data) {
                const row = tableBody.insertRow();
                row.classList.add('text-center', 'text-body');
                const followersCell = row.insertCell();
                followersCell.textContent = 'followers';
                followersCell.classList.add('fw-bold');
                const followersDateCell = row.insertCell();
                followersDateCell.textContent = new Date(data.followersCountDate).toDateString();
                const followersIncreaseCell = row.insertCell();
                followersIncreaseCell.textContent = data.followersCountIncrease.toString();
            }
            if ('followsCountDate' in data) {
                const row = tableBody.insertRow();
                row.classList.add('text-center', 'text-body');
                const followsCell = row.insertCell();
                followsCell.textContent = 'follows';
                followsCell.classList.add('fw-bold');
                const followsDateCell = row.insertCell();
                followsDateCell.textContent = new Date(data.followsCountDate).toDateString();
                const followsIncreaseCell = row.insertCell();
                followsIncreaseCell.textContent = data.followsCountIncrease.toString();
            }
            if ('postsCountDate' in data) {
                const row = tableBody.insertRow();
                row.classList.add('text-center', 'text-body');
                const postsCell = row.insertCell();
                postsCell.textContent = 'posts';
                postsCell.classList.add('fw-bold');
                const postsDateCell = row.insertCell();
                postsDateCell.textContent = new Date(data.postsCountDate).toDateString();
                const postsIncreaseCell = row.insertCell();
                postsIncreaseCell.textContent = data.postsCountIncrease.toString();
            }
        }
    }
    catch (error) {
        console.error('Error fetching stats:', error);
    }
}
