const multer = require('multer');
const path = require('path');

// Filtrage des fichiers image
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

// Configuration de multer pour le stockage des images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
// Nom unique pour chaque fichier
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    callback(null, uniqueName + '.' + extension);
  }
});

// Filtrage pour n'accepter que les images
const fileFilter = (req, file, callback) => {
  if (MIME_TYPES[file.mimetype]) {
    callback(null, true);
  } else {
    callback(new Error('Type de fichier non supporté'), false);
  }
};

module.exports = multer({ storage, fileFilter }).single('image');
