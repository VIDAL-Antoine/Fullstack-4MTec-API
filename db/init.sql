CREATE DATABASE appareils_4mtec;

\c appareils_4mtec;

--- Type Appareils

CREATE TABLE type_appareils (
    id_type SERIAL PRIMARY KEY,
    nom_type VARCHAR(255) NOT NULL
);

--- Modèle Appareils

CREATE TABLE modele_appareils (
    id_modele SERIAL PRIMARY KEY,
    nom_modele VARCHAR(255) NOT NULL,
    id_type_appareil INTEGER REFERENCES type_appareils(id_type) NOT NULL
);

--- Appareils

CREATE TYPE etat_type AS ENUM ('stock', 'installé', 'maintenance');

CREATE TABLE appareils (
    id_appareil SERIAL PRIMARY KEY,
    id_modele_appareil INTEGER REFERENCES modele_appareils(id_modele) NOT NULL,
    adresse_mac MACADDR NOT NULL,
    etat etat_type NOT NULL DEFAULT 'stock'
);

--- Connexions

CREATE TABLE connexions (
    id_connexion SERIAL PRIMARY KEY,
    id_appareil_parent integer REFERENCES appareils(id_appareil) ON DELETE CASCADE NOT NULL,
    id_appareil_enfant integer REFERENCES appareils(id_appareil) ON DELETE CASCADE NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL
);
