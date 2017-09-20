var Post = require('../lib/mongo').Post;

module.exports = {
    create: function create(post) {             //新建一篇文章
        return Post.create(post).exec();
    }
};