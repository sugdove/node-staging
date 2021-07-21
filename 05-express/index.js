const express = require('express')

const {Repositories, Users} = require('./models.js')

const app = express()
// 获取项目
app.get('/repositories',(req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { page = 1, pageSize = 20, language= 'all' } = req.query
  // 此处需要处理C++ ++字符不出现问题
  // console.log(type === 'all' ? {} : { language: type })
  Repositories.find(language === 'all' ? {} : { language })
  .skip(Number((page - 1) * pageSize))
  .limit(Number(pageSize))
  .sort({'stargazers_count': -1})
  .exec((err, doc) => {
    if(err){
      console.log(err)
    }
    else{
      const obj = {
        status: 200,
        items: doc,
        total_count:1000
      }
      res.send(obj)
    }
  })
})
// 获取user
app.get('/users',(req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { page = 1, pageSize = 20 } = req.query
  // 此处需要处理C++ ++字符不出现问题
  // console.log(type === 'all' ? {} : { language: type })
  Users.find({})
  .skip(Number((page - 1) * pageSize))
  .limit(Number(pageSize))
  .sort({'followers': -1})
  .exec((err, doc) => {
    if(err){
      console.log(err)
    }
    else{
      const obj = {
        status: 200,
        items: doc,
        total_count:1000
      }
      res.send(obj)
    }
  })
})
// 跨域设置
app.all("*", function(req, res, next) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  next();
});

app.listen('8081', ()=>{
  console.log('服务已经启动在8081')
})