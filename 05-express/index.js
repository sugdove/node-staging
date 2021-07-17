const express = require('express')

const {Repositories, Users} = require('./models.js')

const app = express()

app.get('/repositories',(req, res) => {

  const { page = 1, pageSize = 20 } = req.query

  res.send('HELLO')

})

// 跨域设置
app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.listen('8081', ()=>{
  console.log('服务已经启动在8081')
})