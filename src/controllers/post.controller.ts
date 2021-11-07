import { IController } from "../shared/interfaces";
import { Router, Request, Response, NextFunction } from "express";
import { PostService } from "../services";
import { authMiddleware } from "../middlewares";
import { validatePost } from "../request_validations";

export class PostController implements IController {

    public router: Router;
    public route: string = "posts";

    constructor(private postService: PostService) {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/", [authMiddleware], this.getWithPagination);
        this.router.post("/", [authMiddleware, validatePost], this.create);
        this.router.put("/:postId", [authMiddleware, validatePost], this.update);
        this.router.delete("/:postId", [authMiddleware], this.delete);
    }

    getWithPagination = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { userId } = response.locals.User;
            const posts = await this.postService.getPosts(request.query, userId);

            response.json(posts);
        } catch (error) {
            next(error);
        }
    }

    create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { userId } = response.locals.User;
            await this.postService.add(request.body, userId);

            response.status(201).send();
        } catch (error) {
            next(error);
        }
    }

    update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { userId } = response.locals.User;
            const post = await this.postService.getPostById(request.params.postId);

            if (post === undefined || post === null) {
                global.logger.log({
                    level: "info",
                    message: `Update Post - ${post.getDataValue('postId')} doesnt exists`
                })
                return response.status(404).send({ message: "Identifier not found" });
            }

            await this.postService.update(request.body, post.getDataValue("postId"), userId);
            response.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    delete = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const post = await this.postService.getPostById(request.params.postId);

            if (post === undefined || post === null) {
                global.logger.log({
                    level: "info",
                    message: `Delete Post - ${request.params.postId} doesnt exists`
                })
                return response.status(404).send({ message: "Identifier not found" });
            }

            await this.postService.delete(post.getDataValue("postId"));
            response.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}