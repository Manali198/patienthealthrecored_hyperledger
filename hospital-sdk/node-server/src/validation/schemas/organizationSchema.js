import Joi from "joi"

export const LogIn = Joi.object({
    id: Joi.string().optional(),
    email: Joi.string().required().trim().min(3).max(50).email(),
    password:Joi.string().required().trim().min(3).max(50)
});

export const SignUp = Joi.object({
    id: Joi.string().optional(),
    firstName: Joi.string().required().trim().min(3).max(50),
    lastName: Joi.string().required().trim().min(3).max(50),
    email: Joi.string().required().trim().min(3).max(50).email(),
    password:Joi.string().required().trim().min(3).max(50)
});

export const Profile = Joi.object({
    id: Joi.string().optional(),
    firstName: Joi.string().required().trim().min(3).max(50),
    lastName: Joi.string().required().trim().min(3).max(50),
    email: Joi.string().required().trim().min(3).max(50).email(),
});

export const AddPhr = Joi.object({
    patientId:Joi.string().required(),
    diagnosis:Joi.string().required().trim().min(3).max(50000),
    remedies:Joi.string().required().trim().min(3).max(50000),
    recommendation:Joi.string().required().trim().min(3).max(50000)
});

export const ForgotPassword = Joi.object({
    email: Joi.string().required().trim().min(3).max(50).email(),
});

export const ResetPassword = Joi.object({
    email: Joi.string().required().trim().min(3).max(50).email(),
    otp:Joi.number(),
    password:Joi.string().required().trim().min(3).max(50)
});