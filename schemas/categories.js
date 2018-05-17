/*
* 定义数据库表存储的结构
* */
var mongoose = require('mongoose');

// 用户的表结构
module.exports = new mongoose.Schema({

    // 分类名称
    name: String

});