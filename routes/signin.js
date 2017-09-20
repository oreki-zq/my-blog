var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

/*GET /signin 登陆页*/
router.get('/', checkNotLogin, function(req, res, next) {
    res.render('signin');
});

/*POST /signin 用户登陆*/
router.post('/', checkNotLogin, function(req, res, next) {
    var name = req.fields.name;
    var password = req.fields.password;

    UserModel.getUserByName(name)
        .then(function(user){
            if(!user) {
                req.flash('error', '用户不存在');
                return res.redirect('back');
            }

            if(sha1(password) !== user.password) {      // 检测密码是否匹配
                req.flash('error', '用户密码错误');
                return res.redirect('back');
            }

            req.flash('success', '登录成功');

            delete user.password;                       // 用户信息写入session
            req.session.user = user;
            res.redirect('/posts');                     // 跳转到主页
        })
        .catch(next);
});

module.exports = router;