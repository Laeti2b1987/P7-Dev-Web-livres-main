const express = require('express');
const router = express.Router();
const bookCtrl = require ('../controllers/bookController')
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const optimizeImage = require('../middleware/optimize-image')

//Lecture des livres

router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestRating); 
router.get('/:id', bookCtrl.getOneBook);

//Création/modification/suppression des livres

router.post('/', auth, multer,optimizeImage, bookCtrl.createBook); 
router.put('/:id', auth,multer,optimizeImage, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

//Notation des livres
router.post('/:id/rating', auth, bookCtrl.rateBook);


module.exports = router;