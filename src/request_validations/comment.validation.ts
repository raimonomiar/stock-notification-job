import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateComment = (request: Request, response: Response, next: NextFunction) => {
    const { body } = request;

    const commentSchema = Joi.object({
        email: Joi.string().email().required(),
        content: Joi.string().required(),
        star: Joi.number()
    });

    const { error } = commentSchema.validate(body);

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