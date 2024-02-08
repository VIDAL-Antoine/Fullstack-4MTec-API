\c appareils_4mtec;

--- Type Appareils

INSERT INTO type_appareils ("nomType") VALUES ('Box'), ('Radiateur'), ('Chaudière');

--- Modèle Appareils

INSERT INTO modele_appareils ("nomModele", type_appareil_id) VALUES 
  ('Box OCP', (SELECT id FROM type_appareils WHERE "nomType" = 'Box')),
  ('Radiateur 1700X', (SELECT id FROM type_appareils WHERE "nomType" = 'Radiateur')),
  ('Chaudière OCP Leopard', (SELECT id FROM type_appareils WHERE "nomType" = 'Chaudière')),
  ('Chaudière OCP Capri', (SELECT id FROM type_appareils WHERE "nomType" = 'Chaudière')),
  ('Radiateur 2700', (SELECT id FROM type_appareils WHERE "nomType" = 'Radiateur'));

--- Appareils

INSERT INTO appareils (id_modele, mac_address, etat) VALUES
((SELECT id FROM modele_appareils WHERE "nomModele" = 'Box OCP'), '11:22:33:44:55:66', 'installé'),
((SELECT id FROM modele_appareils WHERE "nomModele" = 'Radiateur 1700X'), '11:22:33:44:55:77', 'installé'),
((SELECT id FROM modele_appareils WHERE "nomModele" = 'Chaudière OCP Leopard'), '11:22:33:44:55:88', 'installé'),
((SELECT id FROM modele_appareils WHERE "nomModele" = 'Chaudière OCP Capri'), '11:22:33:44:55:99', 'maintenance'),
((SELECT id FROM modele_appareils WHERE "nomModele" = 'Radiateur 2700'), '11:22:33:44:55:10', 'stock');

--- Connexions

INSERT INTO connexions (id_appareil_parent, id_appareil_enfant, datedebut, datefin) VALUES
    (1, 2, '2022-09-01', '9999-12-31'),
    (1, 3, '2022-12-01', '9999-12-31'),
    (1, 4, '2022-09-01', '2022-11-30');
