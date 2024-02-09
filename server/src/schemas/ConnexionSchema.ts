import Joi from 'joi';

const postConnexionSchema = Joi.object({
  idAppareilParent: Joi.number().integer().positive().required(),
  idAppareilEnfant: Joi.number().integer().positive().required(),
  dateDebut: Joi.date().iso().required(),
  dateFin: Joi.date().iso(),
});


const putConnexionSchema = Joi.object({
  idAppareilParent: Joi.number().integer().positive(),
  idAppareilEnfant: Joi.number().integer().positive(),
  dateDebut: Joi.date().iso(),
  dateFin: Joi.date().iso(),
});

export { postConnexionSchema, putConnexionSchema };
