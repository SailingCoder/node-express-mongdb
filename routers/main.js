var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var Content = require('../models/Content');

// 使用中间件处理通用数据
router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: []
    }

    // 读取所有的分类信息
    Category.find().then(function (categories) {
        data.categories = categories;
        next()
    });
});

/*
* 首页
* */
router.get('/', function(req, res, next) {
    // res.send('MAIN - User');

    data.category = req.query.category || '';
    data.count = 0;
    data.page = Number(req.query.page || 1);
    data.limit = 2;
    data.pages = 0;

    var whereInfo = {};
    if (data.category) {
        whereInfo.category = data.category
    }

    Content.where(whereInfo).count().then(function (count) {
        data.count = count;
        // 计算总页数
        data.pages = Math.ceil(data.count / data.limit);
        // 取值不能超过pages
        data.page = Math.min( data.page, data.pages );
        // 取值不能小于1
        data.page = Math.max( data.page, 1);

        var skip = ( data.page - 1 ) * data.limit;

        // where条件
        return Content.where(whereInfo).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({addTime: -1});
    }).then(function (contents) {
        data.contents = contents;
        res.render('main/index', data);
    });
});

/*
* 阅读全文页面
* */
router.get('/view', function (req, res) {
    
    var contentid = req.query.contentid || '';
    
    Content.findOne({
        _id: contentid
    }).then(function (content) {
        data.content = content;

        // 增加阅读数
        content.views++;
        content.save();

        res.render('main/view', data);
    })
})
module.exports = router;





