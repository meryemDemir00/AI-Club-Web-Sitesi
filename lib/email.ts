import nodemailer from 'nodemailer'

export interface ContactEmailData {
  senderName: string
  senderEmail: string
  subject: string
  message: string
}

export async function sendContactEmail(data: ContactEmailData): Promise<boolean> {
  const { senderName, senderEmail, subject, message } = data

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const recipientEmail = process.env.EMAIL_TO || 'info@koyuyapayzeka.com'

  const mailOptions = {
    from: `"${senderName}" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    replyTo: senderEmail,
    subject: `[İletişim Formu] ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">
          Yeni İletişim Mesajı
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555; width: 120px;">Gönderen:</td>
            <td style="padding: 8px;">${senderName}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #555;">E-posta:</td>
            <td style="padding: 8px;"><a href="mailto:${senderEmail}">${senderEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">Konu:</td>
            <td style="padding: 8px;">${subject}</td>
          </tr>
        </table>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #6366f1;">
          <h3 style="margin-top: 0; color: #333;">Mesaj:</h3>
          <p style="white-space: pre-wrap; color: #444; line-height: 1.6;">${message}</p>
        </div>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">
          Bu mesaj koyuyapayzeka.com iletişim formu aracılığıyla gönderilmiştir.
        </p>
      </div>
    `,
    text: `Gönderen: ${senderName}\nE-posta: ${senderEmail}\nKonu: ${subject}\n\nMesaj:\n${message}`
  }

  try {
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('E-posta gönderilemedi:', error)
    // Don't throw - return false so API can still respond gracefully
    return false
  }
}
