/*
* 定义数据库表存储的结构
* */
var mongoose = require('mongoose');

// 内容的表结构
module.exports = new mongoose.Schema({
    //关联字段 - 内容分类的id
    category: {
        type: mongoose.Schema.Types.ObjectId,  // 类型
        ref: 'Category' // 从另一个表里读取的信息
    },
    // 用户
    user: {
        type: mongoose.Schema.Types.ObjectId,  // 类型
        ref: 'User' // 从另一个表里读取的信息
    },

    // 添加时间
    addTime: {
        type: Date,
        default: new Date()
    },

    // 阅读数
    views: {
        type: Number,
        default: 0
    },

    // 分类名称
    title: String,

    // 简介
    desription: {
        type: String,
        default: ''
    },

    // 内容
    content: {
        type: String,
        default: ''
    },

    // 评论
    comments: {
        type: Array,
        default: []
    }

});