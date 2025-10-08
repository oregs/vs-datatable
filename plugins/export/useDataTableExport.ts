// src/composables/useDataTableExport.ts
import type { Ref } from 'vue'

export function useDataTableExport<T extends Record<string, any>>(rows: Ref<T[]>, columns: any[]) {
  /** Export as CSV */
  const exportToCSV = (filename = 'table.csv') => {
    const headers = columns.map(col => col.label)
    const data = rows.value.map(row => 
      columns.map(col => JSON.stringify(row[col.field] ?? '')).join(',')
    )
    const csvContent = [headers.join(','), ...data].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /** Export as Excel */
  const exportToExcel = async (filename = 'table.xlsx') => {
    const { utils, writeFile } = await import('xlsx') // lazy import (only loads if used)
    const data = rows.value.map(row =>
      Object.fromEntries(columns.map(col => [col.label, row[col.field]]))
    )
    const worksheet = utils.json_to_sheet(data)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    writeFile(workbook, filename)
  }

  return { exportToCSV, exportToExcel }
}
