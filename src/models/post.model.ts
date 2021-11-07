import { Model, Sequelize, DataTypes } from "sequelize";

export class Post extends Model {

}

export function post(sequelize: Sequelize) {
    Post.init({
        postid: {
            type: DataTypes.NUMBER,
            primaryKey: true,
            autoIncrement: true
        },
        guid: {
            type: DataTypes.UUID        
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ispublished: {
            type: DataTypes.BOOLEAN
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        categoryid: {
            type: DataTypes.NUMBER,
        },
        userid: {
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
        tableName: "posts"
    });
}