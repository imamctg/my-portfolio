import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'

export const generateCertificate = async (
  userName: string,
  courseTitle: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 })

    // ✅ Fonts
    const fontsDir = path.join(__dirname, '../../fonts')
    doc.registerFont('Regular', path.join(fontsDir, 'Roboto-Regular.ttf'))
    doc.registerFont('Bold', path.join(fontsDir, 'Roboto-Bold.ttf'))
    doc.registerFont('Italic', path.join(fontsDir, 'Roboto-Italic.ttf'))
    doc.registerFont('Cursive', path.join(fontsDir, 'GreatVibes-Regular.ttf'))

    const signaturePath = path.join(__dirname, '../../assets/signature.png')

    // ✅ Output file path
    const fileName = `${userName}-${courseTitle}-certificate.pdf`.replace(
      /\s+/g,
      '_'
    )
    const certDir = path.join(__dirname, '../../certificates')
    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir, { recursive: true })
    }

    const filePath = path.join(certDir, fileName)
    const stream = fs.createWriteStream(filePath)

    stream.on('finish', () => {
      console.log('✅ PDF file written:', filePath)
      resolve(filePath)
    })

    stream.on('error', (err) => {
      console.error('❌ Stream error:', err)
      reject(err)
    })

    doc.pipe(stream)

    // ✅ Background & Border
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff')
    doc
      .lineWidth(6)
      .strokeColor('#0ea5e9')
      .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .stroke()

    // ✅ Header Title
    doc
      .fillColor('#1e3a8a')
      .font('Cursive')
      .fontSize(48)
      .text('Certificate of Completion', {
        align: 'center',
        underline: false,
      })

    doc.moveDown(1.2)

    // ✅ Subtitle
    doc
      .font('Regular')
      .fontSize(20)
      .fillColor('#334155')
      .text('This certificate is proudly presented to', {
        align: 'center',
      })

    // ✅ Student Name
    doc
      .moveDown(0.8)
      .font('Bold')
      .fontSize(36)
      .fillColor('#111827')
      .text(userName, {
        align: 'center',
      })

    // ✅ Course Info
    doc
      .moveDown(0.8)
      .font('Regular')
      .fontSize(18)
      .fillColor('#334155')
      .text('For successfully completing the course', {
        align: 'center',
      })

    doc
      .moveDown(0.5)
      .font('Italic')
      .fontSize(26)
      .fillColor('#2563eb')
      .text(`"${courseTitle}"`, {
        align: 'center',
        width: doc.page.width - 100,
      })

    // ✅ Date
    const issueDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    doc
      // .moveDown(1)
      .font('Regular')
      .fontSize(14)
      .fillColor('#6b7280')
      .text(`Issued on: ${issueDate}`, {
        align: 'center',
      })

    doc.image(signaturePath, 80, doc.page.height - 160, {
      width: 120, // Adjust as needed
    })

    // ✅ Signature Line
    doc
      .moveTo(80, doc.page.height - 120)
      .lineTo(250, doc.page.height - 120)
      .strokeColor('#9ca3af')
      .lineWidth(1)
      .stroke()

    doc
      .font('Regular')
      .fontSize(12)
      .fillColor('#334155')
      .text('Authorized Signature', 80, doc.page.height - 110)

    // ✅ Footer
    const footerText =
      '© 2025 Your Advanced Learning Platform. All rights reserved.'
    const footerY = doc.page.height - doc.page.margins.bottom - 20

    doc
      .font('Regular')
      .fontSize(10)
      .fillColor('gray')
      .text(footerText, 50, footerY, {
        align: 'center',
        width: doc.page.width - 100,
      })

    doc.end()
  })
}
