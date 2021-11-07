import { Router, Request, Response, NextFunction } from "express";
import { validateCategory } from "../request_validations";
import { CategoryService } from "../services";
import { IController } from "../shared/interfaces";
import { authMiddleware } from "../middlewares";
export class CategoryController implements IController {

    public router: Router;
    public route: string = 'categories';

    constructor(private categoryService: CategoryService) {
        this.router = Router();
        this.initRoutes();

    }

    initRoutes() {
        this.router.get("/", [authMiddleware], this.getWithPagination);
        this.router.post("/", [authMiddleware, validateCategory], this.create);
        this.router.put("/:categoryId", [authMiddleware, validateCategory], this.update);
        this.router.delete("/:categoryId", [authMiddleware], this.delete);
    }

    getWithPagination = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const categories = await this.categoryService.getCategories(request.query);

            response.json(categories);

        } catch (error) {
            next(error);
        }
    }

    create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.categoryService.add(request.body);
            response.status(201).send();
        } catch (error) {
            next(error);
        }
    }

    update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const category = await this.categoryService.getById(request.params.categoryId);

            if (category === undefined || category === null) {
                global.logger.log({
                    level: "info",
                    message: `Update Category - ${category.getDataValue('categoryId')} doesnt exists`
                })
                return response.status(404).send({ message: "Identifier not found" });
            }

            await this.categoryService.update(category.getDataValue('categoryId'), request.body);
            response.status(204).send();

        } catch (error) {
            next(error);
        }
    }

    delete = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const category = await this.categoryService.getById(request.params.categoryId);

            if (category === undefined || category === null) {
                global.logger.log({
                    level: "info",
                    message: `Delete Category - ${request.params.categoryId} doesnt exists`
                })
                return response.status(404).send({ message: "Identifier not found" });
            }

            await this.categoryService.delete(category.getDataValue('categoryId'));
            response.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}