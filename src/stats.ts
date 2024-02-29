import { getStats } from './api.js';
export async function statsHeaders() {
  const table = document.getElementById('statsTable');
  if (table) {
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['date', 'followers', 'follows', 'posts'];
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.classList.add('text-body')
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
  }
}
export async function createTableFromStatsData(user, page: number = 1) {
  const statsData = await getStats(user, page)
  const table = document.getElementById('statsTable');
  if (table) {
    let tableBody = table.querySelector('tbody');
    if (!tableBody) {
      tableBody = document.createElement('tbody');
      table.appendChild(tableBody);
    }
    tableBody.innerHTML = '';
    statsData.forEach((item) => {
      const row = document.createElement('tr');
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          const cell = document.createElement('td');
          cell.textContent = item[key].toString();
          cell.classList.add("text-body");
          row.appendChild(cell);
        }
      }
      tableBody.appendChild(row);
    });
    let checkForZero = String(statsData.length)
    if (checkForZero == '0') {
      const row = document.createElement('tr');
      const noDataCell = document.createElement('td');
      noDataCell.colSpan = 4;
      noDataCell.classList.add("text-body")
      noDataCell.textContent = 'no data yet, if the user is opted in it will update daily at 11PM EST'
      row.appendChild(noDataCell)
      tableBody.appendChild(row);
      const nextPageBtn = document.getElementById('nextPageBtn') as HTMLButtonElement;
      nextPageBtn.disabled = true;
    } else {
      const nextPageBtn = document.getElementById('nextPageBtn') as HTMLButtonElement;
      nextPageBtn.disabled = false;
    }
  }
  table.classList.add('table', 'table-striped', 'table-hover');
}