import Joi from "joi";


export const videoValidationSchema = Joi.object({
    id: Joi.string().min(1).max(24),
    name: Joi.string().min(1).max(50),
    description: Joi.string().min(1).max(50).optional()
})