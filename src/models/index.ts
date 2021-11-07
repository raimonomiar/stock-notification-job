import { Sequelize } from "sequelize";
import { IDatabaseConnectionOptions } from "../shared/interfaces";
import { Category, category } from "./category.model";
import { comment } from "./comment.model";
import { logInfo } from "./loginfo.model";
import { Post, post } from "./post.model";
import { User, user } from "./user.model";


export const sequelize = async (connOptions: IDatabaseConnectionOptions) => {
    try {
        let connectionUri = `postgres://${connOptions.host}:${connOptions.port}/${connOptions.database}`;
        if (connOptions.username || connOptions.password) {
            connectionUri = `postgres://${connOptions.username || ''}:${connOptions.password || ''}@${connOptions.host}:${connOptions.port}/${connOptions.database}`;
        }

        //logging connection 
        if (process.env.NODE_ENV !== "production") {
            global.logger.log({
                level: 'debug',
                message: connectionUri,
            })
        }

        const config = new Sequelize(connectionUri, { logging: process.env.NODE_ENV == "development" ? true : false });
        await config.authenticate();

        global.logger.log({
            level: 'info',
            message: 'Connection has been established sucessfully.'
        });

        //initialize models
        user(config);
        logInfo(config);
        category(config);
        comment(config);
        post(config);

        Post.hasOne(Category, { as: "category", sourceKey: "categoryid", foreignKey: "categoryid" });
        Post.hasOne(User, { as: "author", sourceKey: "userid", foreignKey: "userid" });

    } catch (error) {
        global.logger.log({
            level: "error",
            message: "Error connecting to database",
            skip: true
        })
    }

}

export * from "./user.model";
export * from "./loginfo.model";
export * from "./category.model";
export * from "./comment.model";
export * from "./post.model";