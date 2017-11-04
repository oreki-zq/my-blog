# my_blog
express + mongodb 搭建博客

安装nvm： curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash</br>
node版本：nvm alias default v6.9.1，npm 3.10.8</br>
安装nrm：npm i nrm -g，切换cnpm源</br>
安装mongodb：https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/   (sudo chmod 777 /data/db)</br>

项目依赖模块：
express: web 框架</br>
express-session: session 中间件</br>
connect-mongo: 将 session 存储于 mongodb，结合 express-session 使用</br>
connect-flash: 页面通知提示的中间件，基于 session 实现</br>
ejs: 模板</br>
express-formidable: 接收表单及文件的上传中间件</br>
config-lite: 读取配置文件</br>
marked: markdown 解析</br>
moment: 时间格式化</br>
mongolass: mongodb 驱动</br>
objectid-to-timestamp: 根据 ObjectId 生成时间戳</br>
sha1: sha1 加密，用于密码加密</br>
winston: 日志</br>
express-winston: 基于 winston 的用于 express 的日志中间件</br>

link:https://github.com/nswbmw/N-blog
