import path from 'path'
import fs from 'fs'
import sharp from 'sharp'
import QRCode from 'qrcode'
import fsPromise from 'fs/promises'
import { UploadedFile } from 'express-fileupload'
import { IAllMediaFields } from '../types/common.interface'
import { generateRandomString } from './common'
import eventService from '../services/event.service'
import { ICreateEventAssets } from '../types/event_assets.interface'

/**
 * Upload a single file to the specified directory.
 * @param file - The uploaded file from the request.
 * @param uploadDir - The directory where the file should be saved.
 * @returns - The path to the uploaded file.
 * @throws - If the upload fails.
 */
export const uploadFile = async (file: UploadedFile, uploadDir: string): Promise<string> => {
  // Ensure the upload directory exists

  uploadDir = uploadDir.replace(/\s+/g, '_')
  const uploadDirPath: string = path.join(__dirname, `../public/uploads/${uploadDir}`)

  if (!fs.existsSync(uploadDirPath)) {
    fs.mkdirSync(uploadDirPath, { recursive: true })
  }

  let generateFileName = await generateRandomString(16)

  console.log('🚀 ~ file: fileUpload.ts:31 ~ uploadFile ~ generateFileName:', generateFileName)

  const uploadPath = path.join(uploadDirPath, `${generateFileName}${path.extname(file.name)}`)

  return new Promise((resolve, reject) => {
    // Move the file to the upload directory
    file.mv(uploadPath, async (err) => {
      if (err) {
        return reject(new Error('File upload failed: ' + err.message))
      }
      if (path.extname(file.name) === '.svg') {
        await convertSvgToPng(uploadPath, path.join(uploadDirPath, `${generateFileName}.png`))
        const pathDirection = path.join(uploadDirPath, `${generateFileName}.png`)
        return resolve(pathDirection.split('public')[1].replace(/\\/g, '/'))
      }

      return resolve(uploadPath.split('public')[1].replace(/\\/g, '/'))
    })
  })
}

export const validateFileType = (file: UploadedFile, ALLOWED_TYPES: string[]): boolean => {
  const { name } = file
  const extension: string = name.split('.').pop()?.toLowerCase() ?? 'none'
  return ALLOWED_TYPES.includes(extension)
}

export const removeFile = async (
  filePath: string
): Promise<{ error: boolean; message: string }> => {
  filePath = filePath.replace(/\s+/g, '_')
  return new Promise((resolve) => {
    fs.unlink(path.join(__dirname, `../public${filePath}`), (err) => {
      if (err) {
        console.error(`Error deleting file: ${err.message}`)
        resolve({
          error: true,
          message: err.message,
        })
      } else {
        console.error(`File deleted successfully`)
        resolve({
          error: false,
          message: 'File deleted successfully',
        })
      }
    })
  })
}
export const removeFolder = async (folderPath: string) => {
  folderPath = folderPath.replace(/\s+/g, '_')
  fs.rm(
    path.join(__dirname, `../public/uploads/${folderPath}`),
    { recursive: true, force: true },
    (err) => {
      if (err) {
        console.error('Error deleting folder:', err)
      } else {
        console.log('Folder deleted successfully!')
      }
    }
  )
}
export const folderMoveOperation = async (oldPath: string, newPath: string) => {
  oldPath = oldPath.replace(/\s+/g, '_')

  newPath = newPath.replace(/\s+/g, '_')

  await fsPromise.cp(
    path.join(__dirname, `../public/uploads/${oldPath}`),
    path.join(__dirname, `../public/uploads/${newPath}`),
    { recursive: true }
  )

  // Delete the old directory after copying
  await fsPromise.rm(path.join(__dirname, `../public/uploads/${oldPath}`), {
    recursive: true,
    force: true,
  })
}
export const uploadAssetsHelper = async (
  files: Array<UploadedFile> | UploadedFile,
  event_id: string,
  mediaType: string,
  destinationLocation: string
) => {
  let ArrayOfVideoPaths: ICreateEventAssets[] = []

  destinationLocation = destinationLocation.replace(/\s+/g, '_')

  console.log('🚀 ~ file: fileUpload.ts:78 ~ destinationLocation:', destinationLocation)

  if (Array.isArray(files)) {
    const assetsPromise = files.map(async (video) => {
      const uploadedAssetpath = await uploadFile(video, `${destinationLocation}`)

      ArrayOfVideoPaths.push({
        event_id,
        media_type: mediaType,
        path: uploadedAssetpath,
      })
    })

    // Wait for all uploads to complete
    await Promise.all(assetsPromise)
    return await eventService.bulkCreateEventAssets(ArrayOfVideoPaths)
  } else {
    const uploadedAssetpath = await uploadFile(files, `${destinationLocation}`)
    ArrayOfVideoPaths.push({
      event_id,
      media_type: mediaType,
      path: uploadedAssetpath,
    })
    return await eventService.bulkCreateEventAssets(ArrayOfVideoPaths)
  }
}
export const generateQRCode = async (id: string, title: string) => {
  try {
    title = title.replace(/\s+/g, '_')
    let generateFileName = await generateRandomString(16)
    const destination = `/uploads/event_assets/${title}/qr_code/${generateFileName}.png`
    const uploadDirPath: string = path.join(__dirname, `../public${destination}`)

    const dirPath = path.dirname(uploadDirPath)

    if (fs.existsSync(uploadDirPath)) {
      await removeFolder(`event_assets/${title}/qr_code/`)
    }
    try {
      // Recursively create the directory, handling any issues that arise
      await fs.promises.mkdir(dirPath, { recursive: true })
      console.log('Directory created or already exists:', dirPath)
    } catch (error) {
      console.error('Error creating directory:', error)
      return
    }

    const buffer = await QRCode.toBuffer(`https://www.itpathsolutions.com/${id}`, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 200,
      margin: 2,
      color: {
        dark: '#7F0042',
        light: '#ffffff',
      },
    })
    // Write the buffer to the file
    await fs.promises.writeFile(uploadDirPath, buffer)
    console.log('QR code saved successfully', destination)

    // Return the relative path after the QR code is saved
    return destination

    //***************BELOW is a callback version of buffer code (START)************ */
    //   async (err, buffer) => {
    //     if (err) {
    //       console.error('Error generating QR code:', err)
    //       return
    //     }

    //     // Write the Buffer to the file
    //     try {
    //       const r = await fs.promises.writeFile(uploadDirPath, buffer)

    //       console.log('🚀 ~ file: fileUpload.ts:164 ~ r:', r)

    //       console.log('QR code saved successfully')
    //       return destination
    //     } catch (writeError) {
    //       console.error('Error saving QR code to file:', writeError)
    //       return
    //     }
    //   }
    // )
    //***************BELOW is a callback version of buffer code (END)************ */
  } catch (error) {
    console.error('Error generating QR Code:', error)
    throw error
  }
}

export const convertSvgToPng = async (svgPath: string, outputPngPath: string) => {
  try {
    await sharp(svgPath).png().toFile(outputPngPath)
    await removeFile(svgPath.split('public')[1].replace(/\\/g, '/'))
    console.log('SVG successfully converted to PNG.')
  } catch (error) {
    console.error('Error converting SVG to PNG:', error)
  }
}
