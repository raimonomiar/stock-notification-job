import { Model, Sequelize, DataTypes } from "sequelize";

export class EmailQueue extends Model {

}

export function emailQueue(sequelize: Sequelize) {
    EmailQueue.init({
        emailqueueid: {
            type: DataTypes.NUMBER,
            primaryKey: true,
            autoIncrement: true
        },
        guid: {
            type: DataTypes.UUID
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        stockthresholdid : {
            type: DataTypes.NUMBER,
            allowNull: false
        }
    }, {
        sequelize,
        timestamps: false,
        tableName: "emailqueue"
    });
}