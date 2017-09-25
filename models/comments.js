var marked = require('marked');
var Comment = require('../lib/mongo').Comment;

Comment.plugin('contentToHtml', {                                   // 将comment的content从markdown转换成html
    afterFind: function(comments) {
        return comments.map(function(comment) {
            comment.content = marked(comment.content);
            return  comment;
        })
    }
});

module.exports = {
    create: function create(comment) {                              // 创建一个留言
        return Comment.create(comment).exec();
    },

    delCommentById: function delCommentById(commentId, author) {    //通过用户id 和留言id删除一个留言
        return Comment.remove({ author: author, _id: commentId }).exec();
    },

    delCommentsByPostId: function delCommentsByPostId(postId) {     //通过文章id 删除文章下所有留言
        return  Comment.remove({ postId: postId }).exec();
    },

    getComments: function getComments(postId) {                     //通过文章id 获取该文章下所有留言，按留言创建时间升序
        return Comment
            .find({ postId: postId })
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: 1 })
            .addCreatedAt()
            .contentToHtml()
            .exec();
    },

    getCommentsCount: function getCommentsCount(postId) {           //通过文章id 获取该文章下留言数
        return Comment.count({ postId: postId}).exec();
    }
}