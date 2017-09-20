var User = require('../lib/mongo').User;

module.exports = {
    create: function create(user) {                 //注册一个用户
        return User.create(user).exec();
    },

    getUserByName: function getUserByName(name) {   //通过用户名获取用户信息
        return User
            .findOne({ name: name })
            .addCreatedAt()
            .exec();
    }
};