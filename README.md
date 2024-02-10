# Projet Full Stack 4MTec

Ce projet consiste à implémenter une application web full stack permettant de manipuler une base de données via une API REST. L'application web permet de visualiser les données de la base de données et d'interagir avec elles.

## Organisation du Projet

Le projet est divisé en trois dossiers : le client, le serveur et la base de données.

### Structure du Client (Vue.js)

Le dossier client contient le code de l'application web développée avec Vue.js. Voici la structure de ce dossier :

- `public` : Ce dossier contient les fichiers statiques qui seront servis par le serveur lors du déploiement de l'application.

- `src` : Ce dossier contient le code source de l'application Vue.js. Cette application est organisé en composants (qui se trouvent dans le dossier `./client/src/components`).

- `screenshots` : Ce dossier contient les captures d'écran de l'application web permettant de voir à quoi ressemble l'application web.

- `Dockerfile` : Ce fichier contient les instructions pour la construction de l'image Docker pour le client Vue.js. Il indique à Docker comment construire un conteneur exécutable contenant l'application client Vue.js.

Il y a également différents fichiers .json de configuration.

### Structure du Serveur (Node.js avec Express.js)

Le dossier serveur contient le code de l'API REST développée avec Node.js et Express.js. Voici la structure de ce dossier :

- `apidoc` : Ce dossier contient la documentation de l'API générée automatiquement par `apidoc`. Cette documentation est au format HTML et peut être consultée via un navigateur web (en ouvrant `./server/apidoc/index.html`). Elle fournit des informations sur les fonctionnalités de l'API, les paramètres acceptés, les exemples de requêtes et de réponses, etc.

- `src` : Ce dossier contient le code source de l'API REST développée avec Node.js et Express.js. Il contient des dossiers pour les modèles, les routes et les schémas de validation.

- `Dockerfile` : Ce fichier contient les instructions pour la construction de l'image Docker pour le serveur Node.js. Il indique à Docker comment construire un conteneur exécutable contenant l'API REST Node.js.

Il y a également différents fichiers .json de configuration.

### Structure de la Base de Données (PostgreSQL)

Le dossier base de données contient les fichiers nécessaires à l'initialisation de la base de données.
Voici la structure de ce dossier :

- `Dockerfile` : Ce fichier contient les instructions pour la construction de l'image Docker pour la base de données PostgreSQL. Il indique à Docker comment construire un conteneur exécutable contenant PostgreSQL.

- `init.sql` : Ce fichier contient les instructions SQL pour initialiser la base de données lors de sa création. Il inclut la création de la base de données et des tables.

- `seed.sql` : Ce fichier contient les instructions SQL pour peupler la base de données avec des données initiales.

## Configuration et Déploiement

### Configuration

Il est nécessaire de configurer le projet avant de pouvoir le lancer, principalement pour instancier les variables d'environnement.

1. Cloner le dépôt Git avec par exemple `git clone`
2. Dans le dossier `server`, créer un fichier `.env` (`touch .env`). Ce fichier contiendra les variables d'environnement. Ce fichier doit contenir les informations suivantes :

```
API_PORT=3000 # port utilisé par l'API

POSTGRES_PORT=5432 # port utilisé par la base de données PostgreSQL
POSTGRES_USER=postgres # nom d'utilisateur
POSTGRES_PASSWORD=password # mot de passe
POSTGRES_DB=appareils_4mtec # nom de la base de données

# Pour le développement local
# POSTGRES_HOST="localhost"

# Pour docker=compose
POSTGRES_HOST=db # pour le service docker-compose nommé "db"
```

Il suffit simplement de copier ces lignes dans le fichier `.env`. Ces valeurs par défaut permettent de déployer l'application sans soucis.

Il existe deux valeurs possibles pour `POSTGRES_HOST` : une pour le développement local et une pour Docker Compose. La valeur par défaut est `db` car elle correspond au service du fichier `docker-compose.yml` et permet au serveur Express d'accéder à la base de données. Il reste possible de changer cette valeur (`db`), toutefois elle doit avoir le même nom que le service du fichier `docker-compose.yml`. Si vous souhaitez utiliser l'application sans Docker Compose (localement par exemple), il est nécessaire de changer cette valeur en `localhost`.

Il est possible de changer la valeur de `POSTGRES_DB`, toutefois celle-ci doit être égale à celle du fichier `./db/init.sql`.

Une fois que le fichier `./server/.env` est créé, il est recommandé de déployer l'application avec Docker Compose.

### Déploiement avec Docker Compose (recommandé)

1. Assurez-vous que Docker Compose est installé sur votre machine.
2. À la racine du projet, exécutez la commande : `docker-compose up --build`. Vous pouvez également lancer l'application en arrière-plan avec l'option `-d`.
3. Accédez à l'application web via l'URL : `http://localhost:8080` et à l'API via l'URL : `http://localhost:3000`

### Déploiement manuel (utile à des fins de développement)

Pour les personnes ne disposant pas de Docker Compose ou souhaitant développer localement, il est possible de lancer les applications manuellement.

1. Assurez-vous que le fichier `./server/.env` est bien configuré, notamment la valeur `POSTGRES_HOST` qui doit être à `localhost`
2. Installer les dépendances pour le client : `cd client && npm install`
3. Installer les dépendances pour le serveur : `cd server && npm install`
4. Lancer le client avec `cd client && npm run serve` (qui sera disponible sur `http://localhost:8080`) et le serveur (sur un autre terminal) avec `cd server && npm run serve` (qui sera disponible sur `http://localhost:3000`)

## Documentation de l'API

La documentation de l'API est générée automatiquement à l'aide de `apidoc`. Pour consulter la documentation, ouvrez le fichier `server/apidoc/index.html` dans un navigateur web. Elle permet de comprendre comment utiliser l'API.

## Technologies Utilisées

### Côté Client

- Vue.js (v2)
- Vuetify
- TypeScript
- Axios

### Côté Serveur

- Node.js
- Express.js
- TypeScript
- PostgreSQL (avec Sequelize pour l'ORM)
- apidoc
- dotenv
- concurrently, nodemon et rimraf pour faciliter le développement

## Notes Supplémentaires

- Assurez-vous que les ports nécessaires (par exemple, 8080 pour le client et 3000 pour le serveur) ne sont pas utilisés par d'autres applications sur votre machine.
- Il peut être nécessaire de stopper le service PostgreSQL pour permettre à Docker d'initialiser un conteneur PostgreSQL. Ceci peut se faire avec la commande : `sudo service postgresql stop`.

## Crédits

- Auteur : VIDAL Antoine
- Référent : MENELLA Adrien
