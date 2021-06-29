const path = require('path')
const { v4: uuidv4 } = require('uuid')

const uploadFile = (
  files,
  validExtensions = ['png', 'jpg', 'jpeg', 'gif'],
  folder = ''
) => {
  return new Promise((resolve, reject) => {
    const { file } = files
    const nameCutOff = file.name.split('.')
    const extension = nameCutOff[nameCutOff.length - 1]

    if (!validExtensions.includes(extension.toLowerCase())) {
      return reject(
        `La extension ${extension} no es permitida, extensiones permitidas ${validExtensions}`
      )
    }
    const tempName = uuidv4() + '.' + extension
    const uploadPath = path.join(__dirname, '../uploads/', folder, tempName)

    file.mv(uploadPath, (err) => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      resolve(tempName)
    })
  })
}

module.exports = { uploadFile }
