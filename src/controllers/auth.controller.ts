import { IController } from "../shared/interfaces";
import { Router, Request, Response, NextFunction } from "express";
import { validateAuth } from "../request_validations";
import { UserService } from "../services";
import { compareHash, generateJwtToken } from "../shared/extensions";

export class AuthController implements IController {

    public router: Router;
    public route: string = 'auth';

    constructor(private userService: UserService) {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post("/", validateAuth, this.authenticate);
    }


    authenticate = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { email, password } = request.body;
            const user = await this.userService.getByEmail(email);

            if (!user) {
                return response.status(404).send({ message: "User not found"})
            }

            const validPassword = await compareHash(password, user.getDataValue('password'));
            if (!validPassword) {
                return response.status(401).send({ message: "Invalid Credentials" });
            }

            const token = generateJwtToken({email: user.getDataValue("email"), userId: user.getDataValue('userid'), name: user.getDataValue('name')});
            response.send({ token });

        } catch (error) {
            next(error);
        }
    }
}