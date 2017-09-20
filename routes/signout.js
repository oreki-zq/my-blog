var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

/*GET /signout*/
router.get('/', checkLogin, function(req, res, next) {
    req.session.user = null;            // 清空session中用户信息
    req.flash('success', '登出成功');
    res.redirect('/posts');             // 登出成功后跳转至主页
});

module.exports =router;