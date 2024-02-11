document.getElementById('modalsDiv').innerHTML = `
<div class="modal fade" id="aboutModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">about SkeetStats</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-body">
          <p class="text-center">
            created by <a href="https://bsky.app/profile/ameliamnesia.xyz" target="_blank">ameliamnesia.xyz</a>
          </p>
          <p class="text-center"><strong>
            to use the tracking feature create a post or reply tagging the account and giving it a command:
            </strong></p>
          <ul class="list">
            <li>
              <i><a href="https://bsky.app/profile/skeetstats.xyz" target="_blank">@skeetstats.xyz</a> !optin</i>
            </li>
            <li>
              <i><a href="https://bsky.app/profile/skeetstats.xyz" target="_blank">@skeetstats.xyz</a> !optout</i>
            </li>
            <li>
              <i><a href="https://bsky.app/profile/skeetstats.xyz" target="_blank">@skeetstats.xyz</a> !status</i>
            </li>
          </ul>
          <hr>
          <p class="text-center">
            if you like this project please consider donating to help me keep it active via the links in the main menu.
            </p>
          <hr>
          <p class="text-center">
            thank you i hope you enjoy it! 💜🩵💚
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="pfpModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="pfpModalLabel">profile picture</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <img id="fullSizeImage" alt="Full Size Image" style="width: 100%;">
        </div>
        <div class="modal-footer">
          <p class="w-100 text-break" id="modalText"></p>
        </div>
      </div>
    </div>
  </div>
  `
  + //supporters modal
  `
  <div class="modal fade" id="supportersModal" tabindex="-1" aria-labelledby="supportersModal" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="patreonModalLabel">supporters</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body text-body">
      <ul class="list-group list-group-flush">
      <li class="list-group-item"><a class="link-info" target="_blank" href="https://bsky.app/profile/did:plc:c3c54quc4xysc6khc7jeppns"><i class="bi bi-person-hearts"></i> &nbsp; phoebe </a></li>
      <li class="list-group-item"><a class="link-info" arget="_blank" href="https://bsky.app/profile/did:plc:wzsilnxf24ehtmmc3gssy5bu"><i class="bi bi-person-hearts"></i> &nbsp; mark</a></li>
      <li class="list-group-item"><a class="link-info" target="_blank" href="https://bsky.app/profile/did:plc:yj2pd3wzceorf3bcawceoqfk"><i class="bi bi-person-hearts"></i> &nbsp; imogen</a></li>
      <li class="list-group-item"><a class="link-info" target="_blank" href="https://bsky.app/profile/did:plc:f5lxswkf3gcjwaamrija5t6i"><i class="bi bi-person-hearts"></i> &nbsp; hesse</a></li>
      <li class="list-group-item"><a class="link-info" target="_blank" href="https://bsky.app/profile/did:plc:c5lcwcbubqa3rvbjq4awpy7q"><i class="bi bi-person-hearts"></i> &nbsp; tay</a></li>
      </ul>
      </div>
      <div class="modal-footer pb-0 mb-0">
      <div class="container-fluid">
        <p class="w-100 text-break text-center text-body small" id="modalText"><em>
        this project is ad-free and any support is greatly appreciated.<br><br> please send me a message on whichever platform with your bluesky handle if you would like to be featured here.<br>
        </em></p>
        <p class="text-center text-body small">
        <a target="_blank" href="https://ko-fi.com/ameliamnesia" class="btn btn-sm btn-outline-success">ko-fi</a>
        <a target="_blank" href="https://www.patreon.com/SkeetStats" class="btn btn-sm btn-outline-success">patreon</a>
        </p>
        </div>
      </div>
    </div>
  </div>
</div>
  `
document.getElementById('footerLinks').innerHTML = `
  <ul class="nav justify-content-center py-1 sticky-bottom" id="footer">
  <li class="nav-item">
    <div class="btn-group">
      <a target="_blank" href="https://bsky.app/profile/ameliamnesia.xyz" class="btn btn-sm btn-info">
        <i class="bi bi-person-hearts"></i> &nbsp ameliamnesia.xyz
      </a>
      <a target="_blank" href="https://ko-fi.com/ameliamnesia" class="btn btn-sm btn-success">
        <i class="bi bi-cup-hot"></i> &nbsp ko-fi</a>
      <a target="_blank" href="https://www.patreon.com/SkeetStats" class="btn btn-sm btn-success">
        <i class="bi bi-piggy-bank"></i> &nbsp patreon
      </a>
    </div>
  </li>
</ul>
  `