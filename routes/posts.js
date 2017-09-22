var express = require('express');
var router = express.Router();

var PostModel = require('../models/posts');
var checkLogin = require('../middlewares/check').checkLogin;

/*GET /posts 用户文章页  GET /posts?author=xx*/
router.get('/', function(req, res, next) {
    var author = req.query.author;

    PostModel.getPosts(author)
        .then(function(posts) {
            res.render('posts', {
                posts: posts
            });
        })
        .catch(next);
});

/*GET /posts/create 发表文章页*/
router.get('/create', checkLogin, function(req, res, next) {
    res.render('create');
});

/*POST /posts 发表文章*/
router.post('/', checkLogin, function(req, res, next) {
    var author = req.session.user._id;
    var title = req.fields.title;
    var content = req.fields.content;

    try {
        if(!title.length) {
            throw new Error('请填写标题');
        }
        if(!content.length) {
            throw new Error('请填写内容');
        }
    } catch(e) {
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var post = {
        author: author,
        title: title,
        content: content,
        pv: 0
    };

    PostModel.create(post)
        .then(function(result) {
            post = result.ops[0];                       //插入mongodb后的值，包括_id
            req.flash('success', '发表成功');
            res.redirect('/posts/' + post._id);         //发表成功后跳转到该文章页
    })
    .catch(next);
});

/*GET /posts/:postId 单独一篇文章页*/
router.get('/:postId', function(req, res, next) {
    var postId = req.params.postId;

    Promise.all([
        PostModel.getPostById(postId),
        PostModel.incPv(postId)
    ])
        .then(function(result) {
            var post = result[0];
            if(!post) {
                throw new Error('该文章不存在');
            }

            res.render('post', {
                post: post
            });
        })
        .catch(next);
});

/*GET /posts/:postId/edit 更新文章页*/
router.get('/:postId/edit', checkLogin, function(req, res, next) {
    var postId = req.params.postId;
    var author = req.session.user._id;

    PostModel.getRawPostById(postId)
        .then(function(post) {
            if(!post) {
                throw new Error('该文章不存在');
            }
            if(author.toString() !== post.author._id.toString()) {
                throw new Error('权限不足');
            }
            res.render('edit', {
                post: post
            });
        })
        .catch(next);
});

/*POST /posts/:postId/edit 更新一篇文章*/
router.post('/:postId/edit', checkLogin, function(req, res, next) {
    var postId = req.params.postId;
    var author = req.session.user._id;
    var title = req.fields.title;
    var content = req.fields.content;

    PostModel.updatePostById(postId, author, { title: title, content: content })
        .then(function() {
            req.flash('success', '编辑文章成功');
            res.redirect(`/posts/${postId}`);
        })
        .catch(next);
});

/*GET /posts/:postId/remove 删除一篇文章*/
router.get('/:postId/remove', checkLogin, function(req, res, next) {
    var postId = req.params.postId;
    var author = req.session.user._id;

    PostModel.delPostById(postId, author)
        .then(function() {
            req.flash('success', '删除文章成功');
            res.redirect('/posts');
        })
        .catch(next);
});

/*POST /posts/:postId/comment 创建留言*/
router.post('/:postId/comment', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

/*GET /posts/:postId/comment/:commentId/remove 删除留言*/
router.get('/:postId/comment/:commentId/remove', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

module.exports = router;