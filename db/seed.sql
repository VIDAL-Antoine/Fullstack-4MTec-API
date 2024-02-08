\c appareils_4mtec;

--- Type Appareils

INSERT INTO type_appareils (nom_type) VALUES ('Box'), ('Radiateur'), ('Chaudière');

--- Modèle Appareils

INSERT INTO modele_appareils (nom_modele, id_type_appareil) VALUES 
  ('Box OCP', (SELECT id_type FROM type_appareils WHERE nom_type = 'Box')),
  ('Radiateur 1700X', (SELECT id_type FROM type_appareils WHERE nom_type = 'Radiateur')),
  ('Chaudière OCP Leopard', (SELECT id_type FROM type_appareils WHERE nom_type = 'Chaudière')),
  ('Chaudière OCP Capri', (SELECT id_type FROM type_appareils WHERE nom_type = 'Chaudière')),
  ('Radiateur 2700', (SELECT id_type FROM type_appareils WHERE nom_type = 'Radiateur'));

--- Appareils

INSERT INTO appareils (id_modele_appareil, adresse_mac, etat) VALUES
((SELECT id_modele FROM modele_appareils WHERE nom_modele = 'Box OCP'), '11:22:33:44:55:66', 'installé'),
((SELECT id_modele FROM modele_appareils WHERE nom_modele = 'Radiateur 1700X'), '11:22:33:44:55:77', 'installé'),
((SELECT id_modele FROM modele_appareils WHERE nom_modele = 'Chaudière OCP Leopard'), '11:22:33:44:55:88', 'installé'),
((SELECT id_modele FROM modele_appareils WHERE nom_modele = 'Chaudière OCP Capri'), '11:22:33:44:55:99', 'maintenance'),
((SELECT id_modele FROM modele_appareils WHERE nom_modele = 'Radiateur 2700'), '11:22:33:44:55:10', 'stock');

--- Connexions

INSERT INTO connexions (id_appareil_parent, id_appareil_enfant, date_debut, date_fin) VALUES
    (1, 2, '2022-09-01', '9999-12-31'),
    (1, 3, '2022-12-01', '9999-12-31'),
    (1, 4, '2022-09-01', '2022-11-30');
