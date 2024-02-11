import Joi from 'joi';

const postUserSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),  
});


const putUserSchema = Joi.object({
    username: Joi.string(),
    password: Joi.string(),  
});

export { postUserSchema, putUserSchema };
