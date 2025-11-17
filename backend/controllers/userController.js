
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();


// Inscription d'un nouvel utilisateur
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash });

    await user.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès !' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }
    res.status(500).json({ error });
  }
};

// Connexion d'un utilisateur existant
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ userId: user._id, token });
  } catch (error) {
    res.status(500).json({ error });
  }
};
