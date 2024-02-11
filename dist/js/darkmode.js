const pageUrl = 'https://skeetstats.xyz'

    // Get the current URL
    var currentUrl = window.location.href;
    // Extract the "handle" from the URL
    var urlSplit = currentUrl.split('/');
    var urlHandle = urlSplit[4] ?? 'bsky.app';
    // Update the href attributes with the handle value
    document.getElementById('homeLink').href = pageUrl + '/user/' + urlHandle;
    document.getElementById('followersLink').href = pageUrl + '/user/' + urlHandle + '/followers';
    document.getElementById('followingLink').href = pageUrl + '/user/' + urlHandle + '/following';

document.addEventListener("DOMContentLoaded", function () {
    const changeStyleButton = document.getElementById("changeStyleButton");
    const styleSheetLink = document.getElementById("styleSheetLink");
  
    if (changeStyleButton && styleSheetLink) {
      // Retrieve the saved theme from localStorage
      let isDarkMode = localStorage.getItem("isDarkMode") === "true";
  
      // Set the initial stylesheet and button text based on the saved theme
      if (isDarkMode) {
        styleSheetLink.setAttribute("href", `${pageUrl}/css/dark.css`);
        changeStyleButton.innerHTML = '<i class="bi bi-moon-stars"></i>';
      } else {
        styleSheetLink.setAttribute("href", `${pageUrl}/css/bootstrap.min.css`);
        changeStyleButton.innerHTML = '<i class="bi bi-brightness-high"></i>';
      }
  
      changeStyleButton.addEventListener("click", function () {
        // Toggle between light and dark stylesheets
        if (isDarkMode) {
          styleSheetLink.setAttribute("href", `${pageUrl}/css/bootstrap.min.css`);
          changeStyleButton.innerHTML = '<i class="bi bi-brightness-high"></i>';
        } else {
          styleSheetLink.setAttribute("href", `${pageUrl}/css/dark.css`);
          changeStyleButton.innerHTML = '<i class="bi bi-moon-stars"></i>';
        }
  
        // Update the mode for the next click
        isDarkMode = !isDarkMode;
  
        // Save the current theme setting to localStorage
        localStorage.setItem("isDarkMode", isDarkMode.toString());
      });
    }
  });


  
