const sharp = require('sharp')
const TextToSvG = require('text-to-svg')
const path = require('path')

// 加载字体文件
const textToSvG = TextToSvG.loadSync(
  path.join(__dirname, './images/Microsoft-YaHei-UI-Bold.ttf')
)

// 创建圆形 SVG，用于实现头像裁剪
const roundedCorners = new Buffer(
  '<svg><circle r="90" cx="90" cy="90"></circle></svg>'
)

// 设置 SVG 文本元素相关参数
const attributes = { fill: 'white' }
const svgOptions = {
  x: 0,
  y: 0,
  fontSize: 32,
  anchor: 'top',
  attributes
}

async function genShareImage(options) {
  const {
    backgroundPath,
    avatarPath,
    qrcodePath,
    userName,
    words,
    likes,
    outFilePath
  } = options

  // 背景图片
  const backgroundBuffer = sharp(path.join(__dirname, backgroundPath)).toBuffer(
    {
      resolveWithObject: true
    }
  )
  const backgroundImageInfo = await backgroundBuffer

  // 头像图片
  const avatarBuffer = await genCircleAvatar(path.join(__dirname, avatarPath))

  // 二维码图片
  const qrcodeBuffer = await sharp(path.join(__dirname, qrcodePath))
    .resize(180)
    .toBuffer({ resolveWithObject: true })

  // 用户名
  const userNameSVG = textToSVGFn(userName)

  // 用户数据
  const userDataSVG = textToSVGFn(`写了${words}个字 收获${likes}个赞`)
  const userNameBuffer = await sharp(new Buffer(userNameSVG)).toBuffer({
    resolveWithObject: true
  })
  const userDataBuffer = await sharp(new Buffer(userDataSVG)).toBuffer({
    resolveWithObject: true
  })

  const buffers = [avatarBuffer, qrcodeBuffer, userNameBuffer, userDataBuffer]

  // 图层叠加参数列表
  const overlayOptions = [
    { top: 150, left: 230 },
    { top: 861, left: 227 },
    {
      top: 365,
      left: Math.floor(
        (backgroundImageInfo.info.width - userNameBuffer.info.width) / 2
      ) // 居中放置
    },
    {
      top: 435,
      left: Math.floor(
        (backgroundImageInfo.info.width - userDataBuffer.info.width) / 2
      ) // 居中放置
    }
  ]

  // 组合多个图层：图片 + 文字图层
  return buffers
    .reduce((input, overlay, index) => {
      return input.then((result) => {
        console.dir(overlay.info)
        return (
          sharp(result.data)
            .composite([{ input: overlay.data, ...overlayOptions[index] }])
            .toBuffer({ resolveWithObject: true })
        )
      })
    }, backgroundBuffer)
    .then((data) => {
      return sharp(data.data).toFile(outFilePath)
    })
    .catch((error) => {
      throw new Error(`Generate Share Image Failed. ${error.message}`)
    })
}

/**
 * 生成圆形的头像
 */
function genCircleAvatar(avatarPath) {
  // 测试各种叠加模式
  // const modes = [
  //   'clear',
  //   'source',
  //   'over',
  //   'in',
  //   'out',
  //   'atop',
  //   'dest',
  //   'dest-over',
  //   'dest-in',
  //   'dest-out',
  //   'dest-atop',
  //   'xor',
  //   'add',
  //   'saturate',
  //   'multiply',
  //   'screen',
  //   'overlay',
  //   'darken',
  //   'lighten',
  //   'color-burn',
  //   'color-dodge',
  //   'hard-light',
  //   'soft-light',
  //   'difference',
  //   'exclusion'
  // ]
  // modes.forEach((mode) => {
  //   sharp(avatarPath)
  //     .resize(180, 180)
  //     .composite([{ input: roundedCorners, blend: mode }]) // 蒙板处理
  //     .toFile(`./dist/${mode}.jpg`)
  // })

  return sharp(avatarPath)
    .resize(180, 180)
    .composite([{ input: roundedCorners, blend: 'dest-atop' }])
    .png()
    .toBuffer({
      resolveWithObject: true
    })
}

/**
 * 使用文本生成 SVG
 */
function textToSVGFn(text, options = svgOptions) {
  return textToSvG.getSVG(text, options)
}

module.exports = {
  genShareImage
}
