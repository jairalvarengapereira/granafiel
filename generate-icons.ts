import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const logoPath = path.resolve('src/assets/Logo.png')
const resDir = path.resolve('Granafiel-Android/app/src/main/res')

const sizes = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
  { dir: 'drawable', size: 48 },
  { dir: 'drawable-v24', size: 48 },
]

const generateIcons = async () => {
  const logoBuffer = fs.readFileSync(logoPath)
  
  for (const { dir, size } of sizes) {
    const outputDir = path.join(resDir, dir)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    await sharp(logoBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'ic_launcher.png'))
    
    console.log(`Created ${dir}/ic_launcher.png (${size}x${size})`)
  }
  
  // Round icons
  for (const { dir, size } of sizes) {
    const outputDir = path.join(resDir, dir)
    
    await sharp(logoBuffer)
      .resize(size, size, { fit: 'cover' })
      .png()
      .toFile(path.join(outputDir, 'ic_launcher_round.png'))
    
    console.log(`Created ${dir}/ic_launcher_round.png (${size}x${size})`)
  }
  
  // Foreground for adaptive icon (larger size)
  for (const { dir, size } of [{ dir: 'mipmap-mdpi', size: 108 }, { dir: 'mipmap-hdpi', size: 162 }, { dir: 'mipmap-xhdpi', size: 216 }, { dir: 'mipmap-xxhdpi', size: 324 }, { dir: 'mipmap-xxxhdpi', size: 432 }]) {
    const outputDir = path.join(resDir, dir)
    
    await sharp(logoBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(outputDir, 'ic_launcher_foreground.png'))
    
    console.log(`Created ${dir}/ic_launcher_foreground.png (${size}x${size})`)
  }
  
  // Splash
  const splashDir = path.join(resDir, 'drawable-land-hdpi')
  if (!fs.existsSync(splashDir)) {
    fs.mkdirSync(splashDir, { recursive: true })
  }
  await sharp(logoBuffer)
    .resize(480, 320, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(splashDir, 'splash.png'))
  
  await sharp(logoBuffer)
    .resize(200, 320, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(resDir, 'drawable-port-mdpi', 'splash.png'))
  
  console.log('Created splash images')
  console.log('Done!')
}

generateIcons().catch(console.error)