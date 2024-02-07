import Joi from 'joi';

const postModeleAppareilSchema = Joi.object({
  nomModele: Joi.string().max(255).required(),
  type_appareil_id: Joi.number().integer().positive().required(),
});


const putModeleAppareilSchema = Joi.object({
  nomModele: Joi.string().max(255),
  type_appareil_id: Joi.number().integer().positive(),
});

export { postModeleAppareilSchema, putModeleAppareilSchema };
