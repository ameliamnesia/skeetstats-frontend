import { getStats } from './api.js';
//import { user } from './functions.js';

export async function createTableFromStatsData(user) {
    const statsData = await getStats(user)
    const table = document.getElementById('statsTable');
    if (table) {
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      const headers = ['date', 'followers', 'follows', 'posts'];
      // Add headers to header row
      headers.forEach(headerText => {
        const th = document.createElement('th');
        th.classList.add('text-body')
        th.textContent = headerText;
        headerRow.appendChild(th);
      });
       // Add header row to the table
       thead.appendChild(headerRow);
       table.appendChild(thead);
  // Create table body if it doesn't exist
    let tableBody = table.querySelector('tbody');
      if (!tableBody) {
        tableBody = document.createElement('tbody');
        table.appendChild(tableBody);
        }   
        statsData.forEach((item) => {
          const row = document.createElement('tr');
          for (const key in item) {
             // Iterate over the keys and create a cell for each value
            if (item.hasOwnProperty(key)) {
              const cell = document.createElement('td');
              cell.textContent = item[key].toString();
              //cell.classList.add("w-100");
              cell.classList.add("text-body");
              row.appendChild(cell);
            }
          }
          tableBody.appendChild(row);
        });
      let checkForZero = String(statsData.length)
      if(checkForZero == '0') {
        const row = document.createElement('tr');
        const noDataCell = document.createElement('td');
        noDataCell.colSpan = 4;
        noDataCell.classList.add("text-body")
        noDataCell.textContent = 'no data yet, if the user is opted in it will update daily at 11PM EST'
        row.appendChild(noDataCell)
        tableBody.appendChild(row);
      }
    }
    table.classList.add('table', 'table-striped', 'table-hover');
  }