# Mon vieux Grimoire - Backend
# Prérequis
- Node.js
- MongoDB Atlas :
    - Créez un compte
    - Créez un cluster, dans le cluster créez une base de données.
    - Récupérez l'URL de connexion au cluster MongoDB

## Installation du backend

1. Cloner le projet : 
    git clone https://github.com/Laeti2b1987/P7-Dev-Web-livres-main.git

2. Allez dans le répertoire du projet :
     cd backend

3. Installez les dépendances : 
    npm install

4. Configurer les variables d'environnement :
    Créez un fichier .env à la racine du projet :
        MONGODB_URI=votre_uri_mongodb_atlas
        JWT_SECRET=votre_clé_secrète_jwt
        PORT=4000

5. Lancer le serveur :
    nodemon server



