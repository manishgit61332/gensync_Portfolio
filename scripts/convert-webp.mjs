import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const assetsDir = path.join(process.cwd(), 'src', 'assets');

async function convertToWebP(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await convertToWebP(filePath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        const webpPath = filePath.replace(new RegExp(`${ext}$`), '.webp');
        
        try {
          await sharp(filePath)
            .webp({ quality: 80 })
            .toFile(webpPath);
          console.log(`Converted: ${filePath} -> ${webpPath}`);
          
          // Optionally delete the original file to save space and force update
          // fs.unlinkSync(filePath);
        } catch (error) {
          console.error(`Error converting ${filePath}:`, error);
        }
      }
    }
  }
}

convertToWebP(assetsDir).then(() => {
  console.log('Finished converting images to WebP.');
});
