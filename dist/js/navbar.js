var navUrl = 'https://skeetstats.xyz'
document.getElementById('topnavbar').innerHTML = `
    <div class="container-fluid d-flex justify-content-center">
      <div class="d-flex align-items-center justify-content-center">
        <a class="navbar-brand d-none d-md-block" href="#">
          <img src="${navUrl}/images/logo.png" alt="a lil butterfly" width="124" height="30"
            class="d-inline-block align-text-top">
          <img src="https://skeetstats.xyz/images/beta.png" alt="beta" width="30" height="30"
            class="d-inline-block align-text-bottom">
        </a>
        &nbsp;&nbsp;
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <button class="nav-link modeswitch font-white" id="changeStyleButton" type="button" aria-expanded="false"
              aria-label="toggle light/dark">
              <i class="bi bi-brightness-high"></i>
            </button>
          </li>
        </ul>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div class="input group">
          <form class="d-flex align-items-center justify-content-center" onsubmit="submitSearch(event)">
            <div class="input-group">
              <span class="input-group-text" id="basic-addon1">@</span>
              <input type="text" class="form-control" placeholder="yourhandle.bsky.app" autocomplete="on"
                aria-label="Search" aria-describedby="search-btn" id="searchInput">
              <button class="btn btn-secondary" type="submit" id="search-btn"><i class="bi bi-search"></i></button>
            </div>
          </form>
          <div id="autocompleteDropdown"></div>
        </div>
        &nbsp;&nbsp;
        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
      <div class="offcanvas offcanvas-end text-bg-dark" tabindex="-1" id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header">
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          <a class="navbar-brand d-block d-md-none" href="#">
            <img src="https://skeetstats.xyz/images/logo.png" alt="a lil butterfly" width="124" height="30"
              class="d-inline-block align-text-top">
            <img src="https://skeetstats.xyz/images/beta.png" alt="beta" width="30" height="30"
              class="d-inline-block align-text-bottom">
          </a>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li class="nav-item">
              <a class="nav-link" href="#" id="homeLink">stats</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" aria-current="page" href="#" id="followersLink">followers</a>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" href="#" id="followingLink">following</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                donate
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" target="_blank" rel="noreferrer noopener"
                    href="https://patreon.com/SkeetStats">patreon</a></li>
                <li><a class="dropdown-item" target="_blank" rel="noreferrer noopener"
                    href="https://ko-fi.com/ameliamnesia">kofi</a></li>
              </ul>
            </li>
            <li class="nav-item">
            <a class="nav-link" data-bs-toggle="modal" data-bs-target="#supportersModal" href="#">supporters</a>
          </li>
            <li class="nav-item">
              <a class="nav-link" data-bs-toggle="modal" data-bs-target="#aboutModal" href="#">about</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
function submitSearch(event) {
  event.preventDefault();
  const searchInputRaw = document.getElementById('searchInput').value.trim();

  if (searchInput !== '') {
    // Strip '@', apostrophes, and quotation marks
    const cleanSearchInputValue = searchInputRaw.replace(/[@'"]/g, '');
    const url = `https://skeetstats.xyz/user/${encodeURIComponent(cleanSearchInputValue)}`;
    window.location.href = url;
  }
}