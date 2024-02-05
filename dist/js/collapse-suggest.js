    // Change button text and icons when collapse/expand state changes for the second card
    document.querySelector('#suggestionsCollapse').addEventListener('show.bs.collapse', function () {
        const button = document.querySelector('[data-bs-target="#suggestionsCollapse"]');
        button.innerHTML = '<span class="text-body align-middle"><i class="bi bi-chevron-double-up"></i>&nbsp;&nbsp; hide <i class="bi bi-chevron-double-up"></i></span>';
      });
      document.querySelector('#suggestionsCollapse').addEventListener('hide.bs.collapse', function () {
        const button = document.querySelector('[data-bs-target="#suggestionsCollapse"]');
        button.innerHTML = '<span class="text-body align-middle"><i class="bi bi-chevron-double-down"></i>&nbsp;&nbsp; show &nbsp;&nbsp <i class="bi bi-chevron-double-down"></i></span>';
      });