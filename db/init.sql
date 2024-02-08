CREATE DATABASE appareils_4mtec;

\c appareils_4mtec;

--- Type Appareils

CREATE TABLE type_appareils (
    id SERIAL PRIMARY KEY,
    "nomType" VARCHAR(255) NOT NULL
);

INSERT INTO type_appareils ("nomType") VALUES ('Box'), ('Radiateur'), ('Chaudière');

--- Modèle Appareils

CREATE TABLE modele_appareils (
    id SERIAL PRIMARY KEY,
    "nomModele" VARCHAR(255) NOT NULL,
    type_appareil_id INTEGER REFERENCES type_appareils(id) NOT NULL
);

INSERT INTO modele_appareils ("nomModele", type_appareil_id) VALUES 
  ('Box OCP', (SELECT id FROM type_appareils WHERE "nomType" = 'Box')),
  ('Radiateur 1700X', (SELECT id FROM type_appareils WHERE "nomType" = 'Radiateur')),
  ('Chaudière OCP Leopard', (SELECT id FROM type_appareils WHERE "nomType" = 'Chaudière')),
  ('Chaudière OCP Capri', (SELECT id FROM type_appareils WHERE "nomType" = 'Chaudière')),
  ('Radiateur 2700', (SELECT id FROM type_appareils WHERE "nomType" = 'Radiateur'));

--- Appareils

CREATE TYPE etat_type AS ENUM ('stock', 'installé', 'maintenance');

CREATE TABLE appareils (
    id_appareil SERIAL PRIMARY KEY,
    id_modele INTEGER REFERENCES modele_appareils(id) NOT NULL,
    mac_address MACADDR NOT NULL,
    etat etat_type NOT NULL DEFAULT 'stock'
);

INSERT INTO appareils (id_modele, mac_address, etat) VALUES
((SELECT id FROM modele_appareils WHERE "nomModele" = 'Box OCP'), '11:22:33:44:55:66', 'installé'),
((SELECT id FROM modele_appareils WHERE "nomModele" = 'Radiateur 1700X'), '11:22:33:44:55:77', 'installé'),
((SELECT id FROM modele_appareils WHERE "nomModele" = 'Chaudière OCP Leopard'), '11:22:33:44:55:88', 'installé'),
((SELECT id FROM modele_appareils WHERE "nomModele" = 'Chaudière OCP Capri'), '11:22:33:44:55:99', 'maintenance'),
((SELECT id FROM modele_appareils WHERE "nomModele" = 'Radiateur 2700'), '11:22:33:44:55:10', 'stock');

--- Connexions

CREATE TABLE connexions (
        id_connexion SERIAL PRIMARY KEY,
        id_appareil_parent integer REFERENCES appareils(id_appareil) ON DELETE CASCADE NOT NULL,
        id_appareil_enfant integer REFERENCES appareils(id_appareil) ON DELETE CASCADE NOT NULL,
        dateDebut DATE NOT NULL,
        dateFin DATE NOT NULL
);

INSERT INTO connexions (id_appareil_parent, id_appareil_enfant, datedebut, datefin) VALUES
    (1, 2, '2022-09-01', '9999-12-31'),
    (1, 3, '2022-12-01', '9999-12-31'),
    (1, 4, '2022-09-01', '2022-11-30');
