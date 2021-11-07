import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export const authMiddleware = function (request: Request, response: Response, next: NextFunction) {
    try {
        let authKey = request.header("Authorization");
        if (authKey.startsWith("Bearer ")) {
            authKey = authKey.slice(7, authKey.length)
        } else {
            throw new Error("Invalid authkey");
        }
        const decoded = verify(authKey, process.env.JWT_PRIVATE_KEY);
        response.locals.User = decoded;
        next();
    } catch (error) {
        global.logger.log({
            level: "error",
            message: error.message,
            detail: error.stack
        });

        response.status(401).json({ message: "Invalid Token" })
    }

}