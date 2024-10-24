import path from 'path'
import fs from 'fs'
import fsPromise from 'fs/promises'
import { UploadedFile } from 'express-fileupload'
import { IAllMediaFields } from '../types/common.interface'
import { generateRandomString } from './common'

/**
 * Upload a single file to the specified directory.
 * @param file - The uploaded file from the request.
 * @param uploadDir - The directory where the file should be saved.
 * @returns - The path to the uploaded file.
 * @throws - If the upload fails.
 */
export const uploadFile = async (file: UploadedFile, uploadDir: string): Promise<string> => {
  // Ensure the upload directory exists

  const uploadDirPath: string = path.join(__dirname, `../public/uploads/${uploadDir}`)

  if (!fs.existsSync(uploadDirPath)) {
    fs.mkdirSync(uploadDirPath, { recursive: true })
  }

  let generateFileName = await generateRandomString(16)
  const uploadPath = path.join(uploadDirPath, `${generateFileName}${path.extname(file.name)}`)

  return new Promise((resolve, reject) => {
    // Move the file to the upload directory
    file.mv(uploadPath, (err) => {
      if (err) {
        return reject(new Error('File upload failed: ' + err.message))
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

// function isKeyOfIAllMediaFields(key: string): key is keyof IAllMediaFields {
//   return ['icon_image', 'profile_image'].includes(key)
// }

// export const removeFilesWithOptions = async (
//   mediaStatus: MediaStatus,
//   payload: IAllMediaFields
// ) => {
//   const results = await Promise.all(
//     Object.entries(mediaStatus).map(async ([key, value]) => {
//       if (value) {
//         if (isKeyOfIAllMediaFields(key)) {
//           const filePath = payload[key] as string | undefined
//           if (filePath) {
//             return fsPromise
//               .unlink(path.join(__dirname, `../public${payload[key]}`))
//               .then(() => ({
//                 error: false,
//                 message: `File deleted successfully: ${path}`,
//               }))
//               .catch((err) => ({
//                 error: true,
//                 message: `Error deleting file: ${err.message}`,
//               }))
//           }
//         }
//       } else {
//         return Promise.resolve({
//           error: false,
//           message: `File not deleted (mediaStatus is false)`,
//         })
//       }
//     })
//   )

//   return results // Return all results as an array
// }
