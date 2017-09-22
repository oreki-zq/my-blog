var marked = require('marked');
var Post = require('../lib/mongo').Post;
var CommentModel = require('./comments');

Post.plugin('addCommentsCount', {           //给post 添加留言数 commentsCount
    afterFind: function(posts) {
        return Promise.all(posts.map(function(post) {
            return CommentModel.getCommentsCount(post._id).then(function(commentsCount) {
                return post;
            })
        }))
    },

    afterFindOne: function(post) {
        if(post) {
            return CommentModel.getCommentsCount(post._id).then(function(count) {
                post.commentsCount = count;
                return post;
            })
        }
        return post;
    }
});

Post.plugin('contentToHtml', {                //将post的content 从markdown 转变成html
    afterFind: function(posts) {
        return posts.map(function(post) {
            post.content = marked(post.content);
            return post;
        })
    },
    afterFindOne: function(post) {
        if(post) {
            post.content = marked(post.content);
        }
        return post;
    }
});

module.exports = {
    create: function create(post) {             //新建一篇文章
        return Post.create(post).exec();
    },

    getPostById: function getPostById(postId) { //通过 id 获取一篇文章
        return Post
            .findOne({ _id: postId })
            .populate({ path: 'author', model: 'User' })
            .addCreatedAt()
            .addCommentsCount()
            .contentToHtml()
            .exec();
    },

    getPosts: function getPosts(author) {       //按创建时间降序获取用户文章或者某个特定用户的所有文章
        var query = {};
        if(author) {
            query.author = author;
        }
        return Post
            .find(query)
            .populate({ path: 'author', model: 'User' })
            .sort({ _id: -1 })
            .addCreatedAt()
            .addCommentsCount()
            .contentToHtml()
            .exec();
    },

    incPv: function incPv(postId) {                //通过文章 id 给 pv 加1
        return Post
            .update({ _id: postId }, { $inc: { pv: 1 }})
            .exec();
    },

    getRawPostById: function getRawPostById(postId) {                   // 通过文章id 获取一篇原生文章（编辑文章）
        return Post
            .findOne({ _id: postId })
            .populate({ path: 'author', model: 'User' })
            .exec();
    },

    updatePostById: function updatePostById(postId, author, data) {     // 通过用户id 和文章id 更新一篇文章
        return Post.update({ author: author, _id: postId}, { $set: data }).exec();
    },

    delPostById: function delPostById(postId, author) {                 // 通过用户id 和文章id 删除一篇文章
        return Post.remove({ author: author, _id: postId }).exec();
    }
};