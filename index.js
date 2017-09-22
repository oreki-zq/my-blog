var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite')(__dirname);
var routes = require('./routes');
var pkg = require('./package');

var app = express();

app.set('views', path.join(__dirname, 'views'));    // 设置模版目录

app.set('view engine', 'ejs');                      // 设置引擎为 ejs

app.use(express.static(path.join(__dirname, 'public')));    // 设置静态文件目录

// session中间件
app.use(session({
    name: config.session.key,           // 设置cookie中保存session id 的字段
    secret: config.session.secret,      // 设置secret 计算hash值放在cookie中，使产生的signedCookie防篡改
    resave: true,                       // 强制更新 session
    saveUninitialized: false,           // 强制创建一个session， 即使用户未登陆
    cookie: {
        maxAge: config.session.maxAge   // 过期后cookie中的 session id 自动删除
    },
    store: new MongoStore({             // 将session存到 mongodb
        url: config.mongodb             // mongodb 地址
    })
}));

app.use(flash());                       // flash中间件，用于显示通知

app.use(require('express-formidable')({             //处理表单及文件上传的中间件
    uploadDir: path.join(__dirname, 'public/img'),  //上传文件目录
    keepExtensions: true                            //保留后缀
}))

app.locals.blog = {                     // 设置模版全局变量
    title: pkg.name,
    description: pkg.description
};

app.use(function(req, res, next) {      // 添加模版必需的三个变量
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

routes(app);                            // 路由

app.listen(config.port, function() {
    console.log(pkg.name + ' listening on port ' + config.port);
})