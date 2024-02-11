          // Change button text and icons when collapse/expand state changes for the stats table
    document.querySelector('#statsCollapse').addEventListener('show.bs.collapse', function () {
      const button = document.querySelector('[data-bs-target="#statsCollapse"]');
      button.innerHTML = '<span class="text-body align-middle"><i class="bi bi-chevron-double-up"></i>&nbsp;&nbsp; hide <i class="bi bi-chevron-double-up"></i></span>';
    });
    document.querySelector('#statsCollapse').addEventListener('hide.bs.collapse', function () {
      const button = document.querySelector('[data-bs-target="#statsCollapse"]');
      button.innerHTML = '<span class="text-body align-middle"><i class="bi bi-chevron-double-down"></i>&nbsp;&nbsp; show &nbsp;&nbsp <i class="bi bi-chevron-double-down"></i></span>';
    });