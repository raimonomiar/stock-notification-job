import { ParsedQs } from "qs";
import { Category, Post, User } from "../models";
import { Op } from "sequelize";
import { getPagination, getSorting } from "../shared/extensions";
import { IPost } from "../shared/interfaces";
export class PostService {

    async getPosts(query: ParsedQs, userId: string) {
        const { title, page, size, order, orderBy } = query;

        const user = await User.findOne({
            attributes: ['userid'],
            where: { deletedat: null, guid: userId }
        });

        const posts = await Post.findAll({
            attributes: [["guid", "postId"], "title", ["ispublished", "isPublished"], "content", ["createdat", "createdAt"]],
            include: [{
                association: "author",
                attributes: [["guid", "userId"], "name", "email"],
                required: true
            }, {
                association: "category", 
                attributes: [["guid", "categoryId"], "name"],
                required: true
            }],
            where: {
                deletedat: null,
                userid: user.getDataValue("userid"),
                '$author.deletedat$': null,
                '$category.deletedat$': null,
                ...(title !== undefined ? {
                    title: { [Op.iLike]: `%${title}%` }
                } : {})
            },
            ...getPagination({ page, size }),
            ...getSorting({ order, orderBy })
        });

        const totalItems = await Post.count({
            where: {
                deletedat: null,
                userid: user.getDataValue("userid"),
                ...(title !== undefined ? { title: title } : {})
            }
        });
        const totalPages = Math.ceil(totalItems / Number(size));

        return {
            data: posts,
            meta: {
                page,
                size,
                totalItems,
                totalPages
            }
        }
    }

    async getPostById(postId: string) {
        return await Post.findOne({
            attributes: [['postid', 'postId']],
            where: { deletedat: null, guid: postId }
        });
    }

    async add(post: IPost, userId: string) {

        const user = await User.findOne({
            attributes: ['userid'],
            where: { deletedat: null, guid: userId }
        });

        const category = await Category.findOne({
            attributes: ['categoryid'],
            where: { deletedat: null, guid: post.category.categoryId }
        });

        return await Post.create({
            ...post,
            ispublished: true,
            userid: user.getDataValue("userid"),
            categoryid: category.getDataValue("categoryid")
        });

    }

    async update(post: IPost, postId: number, userId: string) {
        const user = await User.findOne({
            attributes: ['userid'],
            where: { deletedat: null, guid: userId }
        });

        const category = await Category.findOne({
            attributes: ['categoryid'],
            where: { deletedat: null, guid: post.category.categoryId }
        });

        return await Post.update({
            ...post,
            ispublished: true,
            userid: user.getDataValue("userid"),
            categoryid: category.getDataValue("categoryid")
        }, {
            where: { deletedat: null, postid: postId }
        });
    }

    async delete(postId: number) {
        return await Post.update({
            deletedat:  Date.now()
        }, {
            where: { deletedat: null, postid: postId }
        });
    }
}