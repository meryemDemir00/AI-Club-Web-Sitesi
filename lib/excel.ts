import * as XLSX from 'xlsx'
import path from 'path'
import fs from 'fs'
import os from 'os'

const DATA_DIR = path.join(process.cwd(), 'data')
const FILE_PATH = path.join(DATA_DIR, 'applications.xlsx')
// OneDrive dışındaki güvenli konum kullan
const ALT_FILE_PATH = path.join(os.tmpdir(), 'web_sitesi_applications.xlsx')

export interface ApplicationRow {
  Ad: string
  Soyad: string
  Email: string
  Telefon: string
  Ekip: string
  'Başvuru Tarihi': string
}

function isFileLocked(filePath: string): boolean {
  if (!fs.existsSync(filePath)) {
    return false
  }

  try {
    const fd = fs.openSync(filePath, 'r+')
    fs.closeSync(fd)
    return false
  } catch (err: any) {
    return err.code === 'EBUSY' || err.code === 'EPERM'
  }
}

function writeWorkbookToPath(workbook: XLSX.WorkBook, targetPath: string) {
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
  const tempPath = `${targetPath}.${process.pid}.${Date.now()}.tmp`

  fs.writeFileSync(tempPath, buffer)

  try {
    if (fs.existsSync(targetPath)) {
      fs.copyFileSync(tempPath, targetPath)
      fs.unlinkSync(tempPath)
    } else {
      fs.renameSync(tempPath, targetPath)
    }
  } catch (error) {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath)
    }
    throw error
  }
}

function getSafeFilePath(): string {
  // Önce alternatif konumu dene (temp)
  if (!isFileLocked(ALT_FILE_PATH)) {
    return ALT_FILE_PATH
  }
  // Temp de kilitliyse, ana konumu dene
  if (!isFileLocked(FILE_PATH)) {
    return FILE_PATH
  }
  // Her ikisi de kilitliyse, benzersiz bir temp dosya oluştur
  return path.join(os.tmpdir(), `applications_${Date.now()}.xlsx`)
}

export async function appendApplicationToExcel(row: ApplicationRow) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    let workbook: XLSX.WorkBook
    let worksheet: XLSX.WorkSheet
    let targetPath = getSafeFilePath()

    console.log(`Excel dosyası kaydedilecek konum: ${targetPath}`)

    if (fs.existsSync(targetPath)) {
      // Dosyanın kilitli olup olmadığını kontrol et
      if (isFileLocked(targetPath)) {
        console.error('\n❌ Excel yazma hatası: Dosya şu anda başka bir program tarafından kullanılıyor.')
        console.error('Dosya yolu:', targetPath)
        return false
      }

      const fileBuffer = fs.readFileSync(targetPath)
      workbook = XLSX.read(fileBuffer, { type: 'buffer' })
      worksheet = workbook.Sheets[workbook.SheetNames[0]]
    } else {
      workbook = XLSX.utils.book_new()
      const headers: ApplicationRow = {
        Ad: 'Ad',
        Soyad: 'Soyad',
        Email: 'Email',
        Telefon: 'Telefon',
        Ekip: 'Ekip',
        'Başvuru Tarihi': 'Başvuru Tarihi'
      }
      worksheet = XLSX.utils.json_to_sheet([], { header: Object.keys(headers) })
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Başvurular')
    }

    // Get existing data
    const existingData: ApplicationRow[] = XLSX.utils.sheet_to_json(worksheet)
    existingData.push(row)

    // Rebuild sheet with updated data
    const newSheet = XLSX.utils.json_to_sheet(existingData, {
      header: ['Ad', 'Soyad', 'Email', 'Telefon', 'Ekip', 'Başvuru Tarihi']
    })

    workbook.Sheets[workbook.SheetNames[0] || 'Başvurular'] = newSheet
    if (!workbook.SheetNames.length) {
      XLSX.utils.book_append_sheet(workbook, newSheet, 'Başvurular')
    }

    // Retry mechanism with file lock check
    let attempts = 0;
    while (attempts < 5) { // 5 deneme
      try {
        // Son kontrol: dosya hala kilitli mi?
        if (isFileLocked(targetPath)) {
          throw new Error('Dosya kilitli')
        }

        writeWorkbookToPath(workbook, targetPath)
        console.log(`✅ Başvuru başarıyla kaydedildi: ${targetPath}`)

        // Eğer alternatif konumdaysak, ana konuma da kopyala (eğer mümkünse)
        if (targetPath !== FILE_PATH && !isFileLocked(FILE_PATH)) {
          try {
            fs.copyFileSync(targetPath, FILE_PATH)
            console.log('Dosya ana konuma da kopyalandı')
          } catch (copyErr) {
            console.warn('Ana konuma kopyalama başarısız, alternatif konum kullanılıyor')
          }
        }

        return true;
      } catch (writeErr: any) {
        attempts++;
        if (attempts >= 5) {
          console.error('\n❌ Excel yazma hatası: Dosya kaydedilemedi.')
          console.error('Hata detayı:', writeErr.message)
          console.error('Dosya yolu:', targetPath)
          console.error('OneDrive senkronizasyon sorunu olabilir. Lütfen OneDrive\'ı geçici olarak durdurun.')
          return false;
        }
        console.warn(`Excel dosyası meşgul. Yeniden deneniyor... (${attempts}/5)`);
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 saniye bekle
      }
    }
    return false;
  } catch (error: any) {
    console.error('Beklenmeyen hata:', error);
    return false;
  }
}
