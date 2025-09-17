'use client'

import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Button } from './button'

type Props = {
  data: any[]
  fileName?: string
  title?: string
}

export default function ExportReportButtons({
  data,
  fileName = 'report',
  title = 'Revenue Report',
}: Props) {
  const exportToCSV = () => {
    if (!data || !data.length) return
    const headers = Object.keys(data[0])
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((field) => JSON.stringify(row[field] ?? '')).join(',')
      ),
    ]
    const blob = new Blob([csvRows.join('\r\n')], {
      type: 'text/csv;charset=utf-8;',
    })
    saveAs(blob, `${fileName}.csv`)
  }

  const exportToPDF = () => {
    if (!data || !data.length) return
    const doc = new jsPDF()

    if (title) {
      doc.setFontSize(16)
      doc.text(title, 14, 15)
    }

    autoTable(doc, {
      startY: title ? 25 : 10,
      head: [Object.keys(data[0])],
      body: data.map((row) => Object.values(row)),
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] },
      styles: { fontSize: 10 },
    })

    doc.save(`${fileName}.pdf`)
  }

  return (
    <div className='flex space-x-2'>
      <Button variant='outline' onClick={exportToCSV}>
        Export CSV
      </Button>
      <Button variant='outline' onClick={exportToPDF}>
        Export PDF
      </Button>
    </div>
  )
}
