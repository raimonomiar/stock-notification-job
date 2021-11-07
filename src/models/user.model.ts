import { Model, Sequelize, DataTypes } from "sequelize";

export class User extends Model {

}

export function user(sequelize: Sequelize) {
    User.init({
        userid: {
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
        },
        location: {
            type: DataTypes.STRING,
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
        tableName: "users"
    });
}