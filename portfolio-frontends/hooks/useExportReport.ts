'use client'

import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// CSV Export
export const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) return

  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','), // Header row
    ...data.map((row) =>
      headers.map((field) => JSON.stringify(row[field], replacer)).join(',')
    ),
  ]

  function replacer(key: string, value: any) {
    return value === null ? '' : value
  }

  const csvContent = csvRows.join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, `${filename}.csv`)
}

// PDF Export
export const exportToPDF = (data: any[], filename: string, title = '') => {
  if (!data || !data.length) return

  const doc = new jsPDF()
  if (title) {
    doc.setFontSize(16)
    doc.text(title, 14, 20)
  }

  const headers = [Object.keys(data[0])]
  const body = data.map((row) => Object.values(row))

  // @ts-ignore
  doc.autoTable({
    startY: title ? 28 : 20,
    head: headers,
    body,
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241] },
    styles: { fontSize: 10 },
  })

  doc.save(`${filename}.pdf`)
}

export const useExportReport = () => {
  return {
    exportToCSV,
    exportToPDF,
  }
}
