import type { App } from 'vue'
import VsDataTable from '@/components/VsDataTable.vue'

export * from "./types"

import './styles/index.scss'

export { VsDataTable }

export default {
  install(app: App) {
    app.component('VsDataTable', VsDataTable)
  },
}
