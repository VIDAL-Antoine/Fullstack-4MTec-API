CREATE DATABASE appareils_4mtec;

\c appareils_4mtec;

--- Type Appareils

CREATE TABLE type_appareils (
    id SERIAL PRIMARY KEY,
    "nomType" VARCHAR(255) NOT NULL
);

--- Modèle Appareils

CREATE TABLE modele_appareils (
    id SERIAL PRIMARY KEY,
    "nomModele" VARCHAR(255) NOT NULL,
    type_appareil_id INTEGER REFERENCES type_appareils(id) NOT NULL
);

--- Appareils

CREATE TYPE etat_type AS ENUM ('stock', 'installé', 'maintenance');

CREATE TABLE appareils (
    id_appareil SERIAL PRIMARY KEY,
    id_modele INTEGER REFERENCES modele_appareils(id) NOT NULL,
    mac_address MACADDR NOT NULL,
    etat etat_type NOT NULL DEFAULT 'stock'
);

--- Connexions

CREATE TABLE connexions (
        id_connexion SERIAL PRIMARY KEY,
        id_appareil_parent integer REFERENCES appareils(id_appareil) ON DELETE CASCADE NOT NULL,
        id_appareil_enfant integer REFERENCES appareils(id_appareil) ON DELETE CASCADE NOT NULL,
        dateDebut DATE NOT NULL,
        dateFin DATE NOT NULL
);
