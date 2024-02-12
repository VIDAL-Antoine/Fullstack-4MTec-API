# Projet Full Stack 4MTec - Backend (Node.js, Express.js et PostgreSQL)

# Introduction

Ce projet contient la partie backend de notre application. Elle permet de manipuler la base de données.

# Structure du projet

Le code source du projet se trouve dans le dossier `src`. Son contenu est le suivant :

- `config.ts` : Ce fichier gère la configuration de l'application, notamment le chargement des variables d'environnement.
- `database.ts` : Fichier responsable de l'initialisation de la connexion à la base de données PostgreSQL.
- `index.ts` : Point d'entrée de l'application, responsable du démarrage du serveur Express.js.
- `middlewares` : Ce dossier contient les middlewares utilisés dans l'application, notamment `verifyToken.ts` pour vérifier les tokens JWT.
- `models` : Contient les modèles de données correspondant aux entités de la base de données, comme les utilisateurs, les appareils, etc.
- `routes` : Contient les définitions des routes de l'API Express.js.
- `schemas` : Ce dossier contient les schémas de validation des données utilisés pour valider les entrées de l'API.
- `utils` : Dossier contenant les utilitaires divers, comme `TokenUtils.ts` pour la gestion des tokens JWT.

Certains dossiers contiennent des fichiers en commun représentant les entités de la base de données. Ces fichiers, tels que `AppareilModel.ts`, `ConnexionModel.ts`, etc... définissent les structures de données correspondantes dans la base de données PostgreSQL (voir le fichier`db/init.sql`). Le dossier `routes` contient des fichiers supplémentaires liés à l'authentification des utilisateurs.

# Documentation de l'API

La documentation de l'API a été générée automatiquement à l'aide de `apidoc`. Pour consulter la documentation, ouvrez le fichier `server/apidoc/index.html` dans un navigateur web. Elle permet de comprendre comment utiliser l'API, notamment comment obtenir l'accès en y créant un utilisateur.

# Setup du projet
```
npm install
```

## Lancer le serveur de développement
```
npm run serve
```

Le script correspondant à `npm run serve` est visible dans le fichier `package.json`.

## Construire le serveur de production
```
npm run build
```
