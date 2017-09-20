var express = require('express');
var router = express.Router();

var PostModel = require('../models/posts');
var checkLogin = require('../middlewares/check').checkLogin;

/*GET /posts 用户文章页  GET /posts?author=xx*/
router.get('/', function(req, res, next) {
    res.render('posts');
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
    res.send(req.flash());
});

/*GET /posts/:postId/edit 更新文章页*/
router.get('/:postId/edit', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

/*POST /posts/:postId/edit 更新文章*/
router.post('/:postId/edit', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

/*GET /posts/:postId/remove 删除文章*/
router.get('/:postId/remove', checkLogin, function(req, res, next) {
    res.send(req.flash());
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