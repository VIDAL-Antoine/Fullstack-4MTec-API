import Joi from 'joi';

const postAppareilSchema = Joi.object({
    idModeleAppareil: Joi.number().integer().positive().required(),
    adresseMAC: Joi.string().pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/).required(),
    etat: Joi.string().valid('stock', 'installé', 'maintenance').default('stock'),
});


const putAppareilSchema = Joi.object({
    idModeleAppareil: Joi.number().integer().positive(),
    adresseMAC: Joi.string().pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/),
    etat: Joi.string().valid('stock', 'installé', 'maintenance').default('stock'),
});

export { postAppareilSchema, putAppareilSchema };
