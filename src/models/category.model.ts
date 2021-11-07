import { Model, Sequelize, DataTypes } from "sequelize";

export class Category extends Model {

}

export function category(sequelize: Sequelize) {
    Category.init({
        categoryid: {
            type: DataTypes.NUMBER,
            primaryKey: true,
            autoIncrement: true
        },
        guid: {
            type: DataTypes.UUID        
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdat: {
            type: DataTypes.DATE
        },
        updatedat: {
            type: DataTypes.DATE
        },
        deletedat: {
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        timestamps: false,
        tableName: "categories"
    });
}