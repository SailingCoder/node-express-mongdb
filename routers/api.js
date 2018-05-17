var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');
// 统一返回格式
var responseData;
router.use( function (req, res, next) {
    responseData = {
        code: 0,
        message: ''
    }

    next();
});
/*
* 用户注册
*   注册逻辑
*
*   1、用户名不能为空
*   2、密码不能为空
*   3、两次输入密码必须一致
*
*   1、用户是否已经被注册
*           数据库查询
* */
router.post('/user/register', function(req, res, next) {
    console.log(req.body)
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    // 用户名是否为空
    if ( username === '' ) {
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json( responseData );
        return;
    }
    // 密码不能为空
    if ( password === '' ) {
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json( responseData );
        return;
    }
    // 两次输入的密码必须一致
    if ( password !== repassword ) {
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致';
        res.json( responseData );
        return;
    }

    // 用户名是否已经被注册,如果数据库中出现和要注册的用户同名的数据，则表示该用户已被注册
    User.findOne({
        username: username
    }).then(function(userInfo){
        if (userInfo) {
            // 表示该数据库中有该数据
            responseData.code = 4;
            responseData.message = '用户名已被注册';
            res.json( responseData );
            return;
        }
        // 保存用户注册的信息到数据库
        var user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then(function(newUserInfo) {
        responseData.message = '注册成功';
        res.json( responseData );
    })
});

router.post('/user/login', function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;

    if ( username === '' || password === '' ) {
        responseData.code = 1;
        responseData.message = '用户名或密码不能为空';
        res.json( responseData );
        return;
    }

    // 查询数据库中相同用户名和密码的记录是否存在，如果存在则登陆成功
    User.findOne({
        username: username,
        password: password
    }).then(function(userInfo) {
        if (!userInfo) {
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json( responseData );
            return;
        }
        responseData.message = '登陆成功';
        responseData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        };
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));
        res.json( responseData );
        return;
    })
});

/*
* 退出
* */
router.get('/user/logout', function(req, res){
    req.cookies.set('userInfo', null);
    res.json( responseData );
});

/*
* 获取指定文章的
* */
router.get('/comment', function(req, res){
    var contentId = req.query.contentid || '';
    Content.findOne({
        _id: contentId
    }).then(function (content) {
        responseData.data = content.comments;
        res.json(responseData)
    })
});

/*
* 评论提交
* */
router.post('/comment/post', function (req, res) {
    // 内容的id
    var contentId = req.body.contentid || '';
    var postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content
    }
    
    // 查询这篇文章内容的信息
    Content.findOne({
        _id: contentId
    }).then(function (content) {
        content.comments.push(postData)
        return content.save();
    }).then(function (newContent) {
        responseData.message = '评论成功';
        responseData.data = newContent;
        res.json( responseData );
    });
});



module.exports = router;