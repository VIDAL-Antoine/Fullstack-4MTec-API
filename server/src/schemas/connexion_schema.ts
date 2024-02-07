import Joi from 'joi';

const postConnexionSchema = Joi.object({
  id_appareil_parent: Joi.number().integer().positive().required(),
  id_appareil_enfant: Joi.number().integer().positive().required(),
  datedebut: Joi.date().iso().required(),
  datefin: Joi.date().iso().required(),
});


const putConnexionSchema = Joi.object({
  id_appareil_parent: Joi.number().integer().positive(),
  id_appareil_enfant: Joi.number().integer().positive(),
  datedebut: Joi.date().iso(),
  datefin: Joi.date().iso(),
});

export { postConnexionSchema, putConnexionSchema };
