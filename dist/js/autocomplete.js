const searchInput = document.getElementById('searchInput');
const autocompleteDropdown = document.getElementById('autocompleteDropdown');

searchInput.addEventListener('input', async (event) => {
  const query = event.target.value;

  // Activate autocomplete only if the input has at least 5 characters
  if (query.length >= 5) {
    searchInput.autocomplete = 'off';
    try {
      const response = await fetch('https://skeetstats.xyz:8443/autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const autoCompleteResults = data.results;

      // Display autocomplete results in the dropdown
      displayAutocompleteResults(autoCompleteResults);
    } catch (error) {
      console.error('Error:', error);
    }
  } else {
    // Hide the dropdown if input has less than 5 characters
    autocompleteDropdown.style.display = 'none';
  }
});

function displayAutocompleteResults(results) {
  // Clear previous results
  autocompleteDropdown.innerHTML = '';

  // Display results in the dropdown
  if (results.length > 0) {
    results.forEach(result => {
      const resultElement = document.createElement('a');
      resultElement.href = '#';
      resultElement.textContent = (result.handle).slice(0, 30);  // Use the relevant property

      // Handle click event on result
      resultElement.addEventListener('click', (event) => {
        event.preventDefault();
        searchInput.value = result.handle;  // Use the relevant property
        autocompleteDropdown.style.display = 'none';
        const url = `https://skeetstats.xyz/user/${result.handle || result.did }`;
        window.location.href = url;
      });

      autocompleteDropdown.appendChild(resultElement);
    });

    // Show the dropdown
    autocompleteDropdown.style.display = 'block';
  } else {
    // Hide the dropdown if no results
    searchInput.autocomplete = 'on';
    autocompleteDropdown.style.display = 'none';
  }
}

// Close the dropdown when clicking outside of it
document.addEventListener('click', (event) => {
  if (event.target !== searchInput) {
    searchInput.autocomplete = 'on';
    autocompleteDropdown.style.display = 'none';
  }
});