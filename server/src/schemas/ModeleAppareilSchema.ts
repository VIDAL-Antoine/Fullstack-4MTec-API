import Joi from 'joi';

const postModeleAppareilSchema = Joi.object({
  nomModele: Joi.string().max(255).required(),
  idTypeAppareil: Joi.number().integer().positive().required(),
});


const putModeleAppareilSchema = Joi.object({
  nomModele: Joi.string().max(255),
  idTypeAppareil: Joi.number().integer().positive(),
});

export { postModeleAppareilSchema, putModeleAppareilSchema };
