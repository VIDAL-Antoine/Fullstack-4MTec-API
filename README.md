# Projet Full Stack 4MTec

Ce projet consiste à implémenter une application web full stack permettant de manipuler une base de données via une API REST. L'application web permet de visualiser les données de la base de données et d'interagir avec elles.

# Organisation du Projet

Le projet est divisé en trois dossiers : le client, le serveur et la base de données.

## Structure du Client (Vue.js)

Le dossier client contient le code de l'application web développée avec Vue.js. Voici la structure de ce dossier :

- `public` : Ce dossier contient les fichiers statiques qui seront servis par le serveur lors du déploiement de l'application.

- `src` : Ce dossier contient le code source de l'application Vue.js. Cette application est organisé en composants (qui se trouvent dans le dossier `./client/src/components`).

- `screenshots` : Ce dossier contient les captures d'écran de l'application web permettant de voir à quoi ressemble l'application web.

- `Dockerfile` : Ce fichier contient les instructions pour la construction de l'image Docker pour le client Vue.js. Il indique à Docker comment construire un conteneur exécutable contenant l'application client Vue.js.

Il y a également différents fichiers .json de configuration.

## Structure du Serveur (Node.js avec Express.js)

Le dossier serveur contient le code de l'API REST développée avec Node.js et Express.js. Voici la structure de ce dossier :

- `apidoc` : Ce dossier contient la documentation de l'API générée automatiquement par `apidoc`. Cette documentation est au format HTML et peut être consultée via un navigateur web (en ouvrant `./server/apidoc/index.html`). Elle fournit des informations sur les fonctionnalités de l'API, les paramètres acceptés, les exemples de requêtes et de réponses, etc.

- `src` : Ce dossier contient le code source de l'API REST développée avec Node.js et Express.js. Il contient des dossiers pour les modèles, les routes et les schémas de validation.

- `Dockerfile` : Ce fichier contient les instructions pour la construction de l'image Docker pour le serveur Node.js. Il indique à Docker comment construire un conteneur exécutable contenant l'API REST Node.js.

Il y a également différents fichiers .json de configuration.

## Structure de la Base de Données (PostgreSQL)

Le dossier base de données contient les fichiers nécessaires à l'initialisation de la base de données.
Voici la structure de ce dossier :

- `Dockerfile` : Ce fichier contient les instructions pour la construction de l'image Docker pour la base de données PostgreSQL. Il indique à Docker comment construire un conteneur exécutable contenant PostgreSQL.

- `init.sql` : Ce fichier contient les instructions SQL pour initialiser la base de données lors de sa création. Il inclut la création de la base de données et des tables.

- `seed.sql` : Ce fichier contient les instructions SQL pour peupler la base de données avec des données initiales.

# Configuration, déploiement et authentification

## Configuration

Il est nécessaire de configurer le projet avant de pouvoir le lancer, principalement pour instancier les variables d'environnement.

1. Cloner le dépôt Git avec par exemple `git clone`
2. Dans le dossier `server`, créer un fichier `.env` (`touch server/.env`). Ce fichier contiendra les variables d'environnement. Ce fichier doit contenir les informations suivantes :

```
API_PORT=3000

POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=appareils_4mtec

# Pour le développement local
# POSTGRES_HOST="localhost"

# Pour docker-compose
POSTGRES_HOST=db # pour le service docker-compose nommé "db"

JWT_SECRET_KEY=<clé secrète ici>
```

Il suffit simplement de copier ces lignes dans le fichier `.env`. Les variables importantes ici sont `POSTGRES_HOST` et `JWT_SECRET_KEY`. Il est possible de changer la valeur de `POSTGRES_DB`, toutefois celle-ci doit être égale à celle du fichier `./db/init.sql`.

### POSTGRES_HOST

Il existe deux valeurs possibles pour `POSTGRES_HOST` : une pour le développement local et une pour Docker Compose. La valeur par défaut est `db` car elle correspond au service du fichier `docker-compose.yml` et permet au serveur Express d'accéder à la base de données. Il reste possible de changer cette valeur (`db`), toutefois elle doit avoir le même nom que le service du fichier `docker-compose.yml`. Si vous souhaitez utiliser l'application sans Docker Compose (localement par exemple), il est nécessaire de changer cette valeur en `localhost`. Si vous souhaitez déployer l'application avec Docker Compose, vous pouvez laisser la valeur par défaut de `db`.

### JWT_SECRET_KEY

Pour sécuriser l'API, il est nécessaire de mettre en place des clés secrètes sur lesquelles les utilisateurs se baseront pour accéder à l'API. Notre application va générer des tokens aux utilisateurs et chaque requête effectuée à l'API va vérifier l'authenticité de ces tokens. L'authenticité de ces tokens se basent sur ces clés secrètes, il est donc important de conserver cette clé secrète et de ne pas la supprimer (sinon les tokens générés ne seront plus valides).

Pour générer une clé secrète, vous pouvez lancer `node` sur un terminal et exécuter la commande suivante :
```
require('crypto').randomBytes(32).toString('hex');
```

Ceci va générer une clé que vous devrez insérer dans votre fichier `server/.env` (à la place de `<clé secrète ici>`). Vous pouvez changer la longueur de la clé (ici 32 caractères) et l'encodage (ici hex) selon les besoins de votre projet.

Une fois que le fichier `./server/.env` est créé et que les variables importantes ont les valeurs adéquates, il est recommandé de déployer l'application avec Docker Compose.

## Déploiement avec Docker Compose (recommandé)

1. Assurez-vous que Docker Compose est installé sur votre machine.
2. À la racine du projet, exécutez la commande : `docker-compose build`. Ceci construirera les conteneurs Docker. Une fois la construction terminée, vous pouvez lancer l'application avec `docker-compose up` (avec le flag `-d` si vous voulez lancer en arrière-plan). Les prochaines fois où vous voudrez lancer l'application vous pouvez uniquement lancer `docker-compose up` car les conteneurs seront déjà construits.
3. Accédez à l'application web via l'URL : `http://localhost:8080` et à l'API via l'URL : `http://localhost:3000` (inaccessible car vous n'êtes pas encore authentifié).

## Déploiement manuel (utile à des fins de développement)

Pour les personnes ne disposant pas de Docker Compose ou souhaitant développer localement, il est possible de lancer les applications manuellement.

1. Assurez-vous que le fichier `./server/.env` est bien configuré, notamment la valeur `POSTGRES_HOST` qui doit être à `localhost` et que vous avez généré une clé secrète pour `JWT_SECRET_KEY`.
2. Connectez-vous sur PostgreSQL pour insérer les données de base (par exemple `sudo su - postgres` puis `psql -U postgres`). Exécutez les commandes des fichiers `./db/init.sql` puis `./db/seed.sql` (vous pouvez simplement les copier-coller) pour aggrémenter la base de données des données nécessaires à son fonctionnement.
3. Installer les dépendances pour le client : `cd client && npm install`
4. Installer les dépendances pour le serveur : `cd server && npm install`
5. Lancer le client avec `cd client && npm run serve` (qui sera disponible sur `http://localhost:8080`) et le serveur (sur un autre terminal) avec `cd server && npm run serve` (qui sera disponible sur `http://localhost:3000` mais sera inaccessible car vous n'êtes pas encore authentifié)

## Authentification

Maintenant que l'application est déployé, vous devez vous authentifier pour obtenir l'accès aux données. Il vous faut d'abord créer votre compte utilisateur, puis vous login avec ce compte. Vous pouvez effectuer cela depuis la page web client ou depuis le backend avec par exemple cURL ou Postman.

### Frontend

Rendez-vous sur `http://localhost:8080/signup` pour créer un compte (ou cliquez sur le bouton `Sign Up` dans la barre de navigation). Saisissez ensuite votre nom d'utilisateur et votre mot de passe (ils ne peuvent pas être vides). Cliquez ensuite sur le bouton `Sign Up` en-dessous. Si la création de compte a fonctionné, vous serez redirigé vers la page de login (`http://localhost:8080/login`). Saisissez le nom d'utilisateur et le mot de passe de votre nouveau compte pour vous connecter. Si ceux-ci sont corrects, vous serez dirigé vers la page principale de l'application (`http://localhost:8080/appareils`). Celle-ci contient les données de l'application que vous pouvez manipuler et modifier. Vous pouvez vous déconnecter en cliquant sur le bouton `Logout` de la barre de navigation si vous souhaitez quitter l'application.

### Backend

L'API devient disponible sur `http://localhost:3000` une fois le serveur lancé. La route pour se créer un compte est `http://localhost:3000/signup` et `http://localhost:3000/login` pour se connecter. Il faut envoyer une requête POST à ces routes pour se créer un compte ou se connecter, avec dans le body le `username` et le `password` (non vides). Ici les requêtes seront effecutées avec cURL.

- Pour se créer un compte :

```
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "user",
    "password": "user"
  }' \
  http://localhost:3000/signup
```

En cas de succès, la réponse reçue sera le `username` et le `password` (encrypté) fournis aggrémenté d'un `ID` (non utile pour l'utilisateur, utile à des fins de déboggage). Il vous suffit ensuite de vous connecter avec votre nom d'utilisateur et mot de passe.

- Pour se connecter :

```
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "user",
    "password": "user"
  }' \
  http://localhost:3000/login
```

En cas de succès, vous recevrez un token JWT :
```
{"token":"<token JWT>"}
```

Vous devez conserver ce token et le renseigner dans le header de toutes vos requêtes pour vous authentifier sur l'API. Par exemple avec cURL vous pouvez tester une requête GET pour obtenir les appareils présents dans la base de données.

```
curl -X GET -H "Authorization: Bearer <token JWT>" http://localhost:3000/appareils
```

Si la requête renvoie bien une liste d'appareils alors vous êtes bien authentifié sur l'API. Vous pouvez consulter la documentation de l'API (qui se trouve dans le dossier `server/apidoc/index.html`) pour voir les différentes requêtes et actions possibles.

# Guide d'utilisation de l'interface web (Frontend)

Une fois que vous êtes connecté sur votre navigateur (sur `http://localhost:8080/appareils`), vous pouvez manipuler les données. Elles sont constituées de deux tableaux : les appareils et les connexions (triée par défaut par ordre décroissant de date de fin puis de date de début). Ces tableaux permettent de trier par ordre croissant ou décroissant selon l'attribut de son choix.

## Explication des icônes

Pour les appareils, vous pouvez changer leur état en cliquant sur l'icône en forme de prise électrique ou les supprimer en cliquant sur l'icône en forme de poubelle. Pour les connexions vous pouvez les supprimer en cliquant également sur l'icône en forme de poubelle.

## Fonctionnement des filtres

Différents filtres sont disponibles pour afficher uniquement les données souhaitées, que cela soit pour les appareils ou les connexions. Les filtres fonctionnent en vérifiant si les données commencent par la valeur spécifiée (ou le texte saisi), plutôt que de rechercher une correspondance exacte.

## Création de nouvelles données

Vous pouvez également ajouter des appareils ou des connexions via les boutons adéquats (pour connecter deux appareils ils doivent être tous les deux à l'état "installé"). Remplissez ensuite les formulaires avec les données correctes pour sauvegarder les données saisies.

# Documentation de l'API (Backend)

La documentation de l'API est générée automatiquement à l'aide de `apidoc`. Pour consulter la documentation, ouvrez le fichier `server/apidoc/index.html` dans un navigateur web. Elle permet de comprendre comment utiliser l'API, notamment comment obtenir l'accès en y créant un utilisateur.

# Informations sur les tokens

## Expiration des tokens

Ici la sécurité de l'API est implémentée avec les tokens JWT. Toutefois les tokens ont une durée de vie d'une heure. Au-delà d'une heure, vous devrez vous reconnecter (se rendre sur `http://localhost:3000/login` côté backend ou `http://localhost:8080/login` côté frontend) pour vous réauthentifier.

## Révocations de tokens

Il est possible de révoquer les droits d'accès à l'API en interdisant certains tokens. Ainsi en ajoutant un token à une blacklist, l'utilisateur perdra les droits d'accès à l'API et ne pourra donc plus manipuler les données. Pour cela il faut effectuer une requête POST avec dans le body le token à révoquer sur la route `http://localhost:3000/revoke-token`. Par exemple avec cURL :

```
curl -X POST \
  -H 'Authorization: Bearer <token JWT pour s'authentifier>' \
  -H 'Content-Type: application/json' \
  -d '{
    "token": "<token JWT à révoquer>"
  }' \
  http://localhost:3000/revoke-token
```

En cas de succès vous aurez un message indiquant que la révocation s'est effecutuée avec succès.

```
{"message":"Token révoqué avec succès."}
```

La liste des tokens révoqués est non persistante, ce qui signifie qu'elle n'est pas conservée de manière permanente dans le système. En conséquence, chaque fois que l'application est arrêtée ou redémarrée, la liste des tokens révoqués est effacée et réinitialisée. Cette absence de persistance signifie que les tokens révoqués ne sont pas mémorisés entre les sessions de l'application.

# Technologies Utilisées

## Côté Client

- Vue.js (v2)
- Vuetify
- TypeScript
- Axios

## Côté Serveur

- Node.js
- Express.js
- TypeScript
- PostgreSQL (avec Sequelize pour l'ORM)
- joi pour les schémas de validation
- apidoc
- dotenv
- bcrypt pour l'encryptage des mots de passe des utilisateurs
- jsonwebtoken pour l'authentification sur l'API
- concurrently, nodemon et rimraf pour faciliter le développement

# Notes Supplémentaires

- Assurez-vous que les ports nécessaires (par exemple, 8080 pour le client et 3000 pour le serveur) ne sont pas utilisés par d'autres applications sur votre machine.
- Il peut être nécessaire de stopper le service PostgreSQL pour permettre à Docker d'initialiser un conteneur PostgreSQL. Ceci peut se faire avec la commande : `sudo service postgresql stop`. `sudo service postgresql start` permet de démarrer le service si nécessaire (par exemple pour le développement local).

# Crédits

- Auteur : VIDAL Antoine
- Référent : MENELLA Adrien
