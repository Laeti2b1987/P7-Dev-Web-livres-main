const Book = require("../models/book");
const fs = require('fs');
const path = require('path');

// Récupère tous les livres
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Récupère les 3 livres les mieux notés
exports.getBestRating = async (req, res) => {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Récupère un seul livre par son id
exports.getOneBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Crée un nouveau livre
exports.createBook = async (req, res) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      
    });
    await book.save();
    res.status(201).json({ message: 'Livre créé avec succès !' });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Modifie un livre existant

exports.modifyBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
    if (book.userId !== req.auth.userId) return res.status(403).json({ message: 'Requête non autorisée' });

    let updatedData;
    if (req.file) {
      // Supprimer l’ancienne image
      const oldFilename = book.imageUrl.split('/images/')[1];
      const fs = require('fs');
      const path = require('path');
      fs.unlink(path.join('images', oldFilename), (err) => {
        if (err) console.error('Erreur lors de la suppression de l\'ancienne image :', err);
      });

      updatedData = {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      };
    } else {
      updatedData = req.body;
    }

    await Book.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.status(200).json({ message: 'Livre modifié avec succès !' });
  } catch (error) {
    res.status(400).json({ error });
  }
};


// Supprime un livre
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });
    if (book.userId !== req.auth.userId) return res.status(403).json({ message: 'Requête non autorisée' });

    const filename = book.imageUrl.split('/images/')[1];
    fs.unlink(path.join('images', filename), async () => {
      await Book.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Livre supprimé avec succès !' });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Note un livre
exports.rateBook = async (req, res) => {
  try {
    const { rating } = req.body;
    if (rating < 0 || rating > 5) return res.status(400).json({ message: 'Note invalide (0 à 5)' });

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

    const alreadyRated = book.ratings.find(r => r.userId === req.auth.userId);
    if (alreadyRated) return res.status(400).json({ message: 'Vous avez déjà noté ce livre' });

    book.ratings.push({ userId: req.auth.userId, grade: rating });
    book.averageRating = book.ratings.reduce((sum, r) => sum + r.grade, 0) / book.ratings.length;

    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error });
  }
};
