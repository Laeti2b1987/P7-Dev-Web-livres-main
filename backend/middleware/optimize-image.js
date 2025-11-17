const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = async (req, res, next) => {
  if (!req.file) return next();

  const inputPath = req.file.path;
  const outputDir = path.join('images');
  const optimizedFilename = 'optimized_' + req.file.filename;
  const outputPath = path.join(outputDir, optimizedFilename);

  try {
  // Vérifie que le dossier existe
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    

await sharp(inputPath)
  .resize(
    parseInt(process.env.IMAGE_WIDTH) || 463,
    parseInt(process.env.IMAGE_HEIGHT) || 595,
    { fit: 'cover', position: 'center' }
  )
  .jpeg({ quality: parseInt(process.env.IMAGE_QUALITY) || 80 })
  .toFile(outputPath);



    fs.unlinkSync(inputPath); // supprime l’original
    req.file.filename = optimizedFilename;
    req.file.path = outputPath;

    next();
  } catch (err) {
    console.error('Erreur Sharp:', err);
    res.status(500).json({ message: 'Erreur lors de l’optimisation de l’image' });
  }
};
