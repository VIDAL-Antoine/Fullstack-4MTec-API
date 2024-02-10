# Projet Full Stack 4MTec - Backend (Node.js, Express.js et PostgreSQL)

## Introduction

Ce projet contient la partie backend de notre application. Elle permet de manipuler la base de données.

## Structure du projet

Le code source du projet se trouve dans le dossier `src`. Son contenu est le suivant :

- `config.ts` : fichier de configuration chargeant le fichier `.env` et les variables d'environnement
- `database.ts` : fichier instanciant la base de données PostgreSQL
- `index.ts` : fichier permenttant de démarrer le serveur Express.js
- `models`: dossier contenant la liste des modèles de la base de données
- `routes` : dossier contenant la liste des routes de l'API
- `schemas` : dossier contenant la liste des schémas de validation

Chaque dossier contient quatre fichiers différents représentant les quatres tables de la base de données (voir le fichier `db/init.sql`). Ainsi chaque table de la base de données contient (au niveau du serveur Express.js) son modèle, ses routes et son schéma de validation.

## Documentation de l'API

La documentation de l'API a été générée automatiquement à l'aide de `apidoc`. Pour consulter la documentation, ouvrez le fichier `server/apidoc/index.html` dans un navigateur web. Elle permet de comprendre comment utiliser l'API.

## Setup du projet
```
npm install
```

### Lancer le serveur de développement
```
npm run serve
```

Le script correspondant à `npm run serve` est visible dans le fichier `package.json`.

### Construire le serveur de production
```
npm run build
```
