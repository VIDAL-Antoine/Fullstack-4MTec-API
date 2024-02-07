import Joi from 'joi';

const typeAppareilSchema = Joi.object({
  nomType: Joi.string().max(255).required(),
});

export { typeAppareilSchema };
