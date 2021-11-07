import { ParsedQs } from "qs";
import { Comment, Post } from "../models";
import { Op } from "sequelize";
import { getPagination, getSorting } from "../shared/extensions";
import { IComment } from "../shared/interfaces";
export class CommentService {

    async getComments(query: ParsedQs, postId: string) {
        const { content, page, size, order, orderBy } = query;

        const post = await Post.findOne({
            attributes: [["postid", "postId"]],
            where: {
                deletedat: null,
                guid: postId
            }
        });

        const comments = await Comment.findAll({
            attributes: [["guid", "commentId"], "email", "content", ["isremoved", "isRemoved"], "star", ["createdat", "createdAt"]],
            where: {
                deletedat: null,
                postid: post.getDataValue("postId"),
                ...(content !== undefined ? {
                    content: { [Op.iLike]: `%${content}%` }
                } : {})
            },
            ...getPagination({ page, size }),
            ...getSorting({ order, orderBy })
        });

        const totalItems = await Comment.count({ where: { deletedat: null, ...(content !== undefined ? { content: content } : {}) } });
        const totalPages = Math.ceil(totalItems / Number(size));

        return {
            data: comments,
            meta: {
                page,
                size,
                totalItems,
                totalPages
            }
        }
    }

    async getById(commentId: string) {

        return await Comment.findOne({
            attributes: [["commentid", "commentId"]],
            where: {
                deletedat: null,
                guid: commentId
            }
        });
    }

    async add(comment: IComment, postId: string) {
        const post = await Post.findOne({
            attributes: [["postid", "postId"]],
            where: {
                deletedat: null,
                guid: postId
            }
        });

        return await Comment.create({ ...comment, postid: post.getDataValue("postId") });
    }

    async update(commentId: number, comment: IComment) {
        return await Comment.update(comment, {
            where: {
                deletedat: null,
                commentid: commentId
            }
        });
    }

    async hide(commentId: number) {
        return await Comment.update({ isremoved: true }, {
            where: {
                deletedat: null,
                commentid: commentId
            }
        });
    }

    async delete(commentId: number) {
        return await Comment.update({
            deletedat: Date.now()
        }, {
            where: {
                commentid: commentId
            }
        });
    }
}