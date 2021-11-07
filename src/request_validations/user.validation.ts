import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateAuth = (request: Request, response: Response, next: NextFunction) => {
    const { body } = request;

    const authSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(255).required()
    });

    const { error } = authSchema.validate(body);
    if (error && error.details) {
        global.logger.log({
            level: "info",
            message: error.message,
            detail: error.details
        });

        response.status(400).send({
            message: "Invalid Body Parameters"
        });
    } else {
        next()
    }
}