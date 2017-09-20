var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

/*GET /posts 用户文章页  GET /posts?author=xx*/
router.get('/', function(req, res, next) {
    res.render('posts');
});

/*POST /posts 发表文章*/
router.post('/', checkLogin, function(req, res, next) {
    res.send(req.flash());
});

/*GET /posts/create 发表文章页*/
router.get('/create', checkLogin, function(req, res, next) {
    res.send(req.flash());
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