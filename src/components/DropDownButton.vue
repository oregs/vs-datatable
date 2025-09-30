<template>
  <div class="export-dropdown">
    <button class="export-btn" id="exportToggle">Export ▾</button>
    <ul class="export-menu" id="exportMenu">
      <li><button>Export CSV</button></li>
      <li><button>Export Excel</button></li>
      <li><button>Export PDF</button></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const toggleBtn = document.getElementById("exportToggle") as HTMLButtonElement | null;
const menu = document.getElementById("exportMenu") as HTMLUListElement | null;

if (toggleBtn && menu) {
  toggleBtn.addEventListener("click", (e: MouseEvent) => {
    e.stopPropagation();
    menu.classList.toggle("active");
  });

  // Close menu when clicking outside
  document.addEventListener("click", () => {
    menu.classList.remove("active");
  });
}

</script>
