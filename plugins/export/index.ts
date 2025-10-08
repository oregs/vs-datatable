import type { App } from 'vue'
import VsDataTableExportDropdown from './VsDataTableExportDropdown.vue'
import { useDataTableExport } from './useDataTableExport'

/**
 * Export Plugin for VsDataTable
 * 
 * This plugin adds optional CSV/Excel export functionality.
 * You can either:
 *  - Use `app.use(VsDataTableExport)` to register the dropdown globally
 *  - Or import `useDataTableExport()` composable manually
 */

export default {
  install(app: App) {
    // Register the dropdown component globally
    app.component('VsDataTableExportDropdown', VsDataTableExportDropdown)
  },
}

// Named exports for manual usage
export { VsDataTableExportDropdown, useDataTableExport }
