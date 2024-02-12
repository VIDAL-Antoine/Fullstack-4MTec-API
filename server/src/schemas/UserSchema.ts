import Joi from 'joi';

const postUserSchema = Joi.object({
    username: Joi.string().min(1).required(),
    password: Joi.string().min(1).required(),
});


const putUserSchema = Joi.object({
    username: Joi.string().min(1),
    password: Joi.string().min(1),
});

export { postUserSchema, putUserSchema };
