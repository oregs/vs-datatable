// src/composables/useDataTableExport.ts
import type { Ref } from 'vue'

export function useDataTableExport<T extends Record<string, any>>(rows: Ref<T[]>, columns: any[]) {
  /** Export as CSV */
  const exportToCSV = (filename = 'table.csv') => {
    if (!Array.isArray(columns) || !Array.isArray(rows.value) || !rows.value.length) {
      console.warn('[VsDataTableExport] No data available for CSV export.')
      return
    }

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
    if (!Array.isArray(columns) || !Array.isArray(rows.value) || !rows.value.length) {
      console.warn('[VsDataTableExport] No data available for Excel export.')
      return
    }

    const { utils, writeFile } = await import('xlsx')
    const data = rows.value.map(row =>
      Object.fromEntries(columns.map(col => [col.label, row[col.field]]))
    )
    const worksheet = utils.json_to_sheet(data)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    writeFile(workbook, filename)
  }

  /** Export as PDF */
  async function exportToPDF(filename = 'data-export.pdf') {
    if (!Array.isArray(columns) || !Array.isArray(rows.value) || !rows.value.length) {
      console.warn('[VsDataTableExport] No data available for PDF export.')
      return
    }

    const [{ default: jsPDF }, autoTable] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable'),
    ])

    const doc = new jsPDF()
    const headers = columns.map(c => c.label || c.field)
    const data = rows.value.map(row => columns.map(c => row[c.field] ?? ''))

    autoTable.default(doc, {
      head: [headers],
      body: data,
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [45, 108, 223],
        textColor: [255, 255, 255],
      },
      startY: 20,
      margin: { top: 20 },
      theme: 'grid',
    })

    doc.save(filename)
  }

  return { 
    exportToCSV, 
    exportToExcel,
    exportToPDF
  }
}
