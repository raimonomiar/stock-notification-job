import { Model, Sequelize, DataTypes } from "sequelize";

export class Comment extends Model {

}

export function comment(sequelize: Sequelize) {
    Comment.init({
        commentid: {
            type: DataTypes.NUMBER,
            primaryKey: true,
            autoIncrement: true
        },
        guid: {
            type: DataTypes.UUID        
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isremoved: {
            type: DataTypes.BOOLEAN,
        },
        star: {
            type: DataTypes.NUMBER,
        },
        postid: {
            type: DataTypes.NUMBER,
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
        tableName: "comments"
    });
}