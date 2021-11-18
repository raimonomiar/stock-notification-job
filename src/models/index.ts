import { Sequelize } from "sequelize";
import { IDatabaseConnectionOptions } from "../shared/interfaces";
import { logInfo } from "./loginfo.model";
import { userEmail, UserEmail } from "./useremail.model";
import { stockThreshold, StockThreshold } from "./stockthreshold.model";
import { emailQueue } from "./emailqueue.model";

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
        logInfo(config);
        userEmail(config);
        stockThreshold(config);
        emailQueue(config);

        //relations
        StockThreshold.hasOne(UserEmail, {as: 'user', sourceKey: 'useremailid', foreignKey: 'useremailid'});

    } catch (error) {
        global.logger.log({
            level: "error",
            message: "Error connecting to database",
            skip: true
        })
    }

}

export * from "./loginfo.model";
export * from "./useremail.model";
export * from "./stockthreshold.model";
export * from "./emailqueue.model";
