import type { App } from 'vue'
import VsDataTable from '@/components/VsDataTable.vue'

import './styles/index.scss'

// Named export
export { VsDataTable }

// Default export (Vue plugin install)
export default {
  install(app: App) {
    app.component('VsDataTable', VsDataTable)
  },
}
