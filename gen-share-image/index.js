const { genShareImage } = require('./gen-img')
const options = {
  backgroundPath: './images/template2.jpg',
  avatarPath: './images/avatar.jpeg',
  qrcodePath: './images/qrcode.png',
  userName: 'naluduo233',
  words: '100000',
  likes: '999',
  outFilePath: './dist/output.jpg'
}

genShareImage(options)
