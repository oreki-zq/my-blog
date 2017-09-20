var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

/*GET /signup 注册页*/
router.get('/', checkNotLogin, function(req, res, next) {
    res.render('signup');
});

/*POST /signup 用户注册*/
router.post('/', checkNotLogin, function(req, res, next) {
    var name = req.fields.name;
    var gender = req.fields.gender;
    var bio = req.fields.bio;
    var avatar = req.files.avatar.path.split(path.sep).pop();
    var password = req.fields.password;
    var repassword = req.fields.repassword;

    try {                                               // 校验参数
       if (!(name.length >= 1 && name.length <= 10)) {
            throw new Error('名字长度限制在1-10个字符');
        }
        if (['m', 'f', 'x'].indexOf(gender) === -1 ) {
            throw new Error('性别只能是 m、f 或 x');
        }
        if (!(bio.length >= 1 && bio.length <= 30)) {
            throw new Error('个人简介请限制在 1-30 个字符');
        }
        if (!req.files.avatar.name) {
            throw new Error('缺少头像');
        }
        if (password.length < 6) {
            throw new Error('密码至少 6 个字符');
        }
        if (password !== repassword) {
            throw new Error('两次输入密码不一致');
        }
    } catch (e) {                                       // 注册失败，异步删除上传的头像
        fs.unlink(req.files.avatar.path);
        req.flash('error', e.message);
        return res.redirect('/signup');
    }

    password = sha1(password);                          // 明文密码加密

    var user = {                                        //待写入数据库的用户信息
        name: name,
        password: password,
        gender: gender,
        bio: bio,
        avatar: avatar
    };

    UserModel.create(user)                              // 用户信息写入数据库
        .then(function (result) {
            user = result.ops[0];                       // 此user是插入mongodb后的值，包括_id
            delete user.password;
            req.session.user = user;                    // 将用户信息存入session
            req.flash('success', '注册成功');            // 写入flash
            res.redirect('/posts');                     // 跳转到首页
        })
        .catch(function (e) {
            fs.unlink(req.files.avatar.path);               // 注册失败，异步删除上传的头像
            if (e.message.match('E11000 duplicate key')) {  // 用户名被占用则跳回注册页，而不是错误页
                req.flash('error', '用户名已被占用');
                return res.redirect('/signup');
            }
            next(e);
        });
});

module.exports = router;