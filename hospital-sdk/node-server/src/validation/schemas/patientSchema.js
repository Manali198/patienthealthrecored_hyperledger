import Joi from "joi"

export const LogIn = Joi.object({
    email: Joi.string().required().trim().min(3).max(50).email(),
    password:Joi.string().required().trim().min(3).max(50)
});

export const SignUp = Joi.object({
    firstName:Joi.string().required().min(3).max(50),
    lastName: Joi.string().required().trim().min(3).max(50),
    email: Joi.string().required().trim().min(3).max(50).email(),
    password:Joi.string().required().trim().min(3).max(50)
});

export const Demographic = Joi.object({
    name:Joi.string().required().min(3).max(50),
    abha: Joi.number().required().min(10000000000000).max(99999999999999),
    gender: Joi.string().required().trim().min(1).max(50),
    DOB:Joi.date().required(),
    height:Joi.string().required(),
    weight:Joi.string().required(),
    id: Joi.string().optional(),
});

export const ForgotPassword = Joi.object({
    email: Joi.string().required().trim().min(3).max(50).email(),
});

export const ResetPassword = Joi.object({
    email: Joi.string().required().trim().min(3).max(50).email(),
    otp:Joi.number(),
    password:Joi.string().required().trim().min(3).max(50)
});