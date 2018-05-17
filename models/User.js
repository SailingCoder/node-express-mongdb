/*
* 创建模型类,用于对数据的表结构进行操作
*   增删改查
* */
var mongoose = require('mongoose');
var userSchema = require('../schemas/users');

module.exports = mongoose.model('User', userSchema);