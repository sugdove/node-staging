const express = require("express");

const csv = require("csvtojson");

const {
  Repositories,
  Users,
  Blogs,
  Trendings,
} = require("../models/models.js");

const app = express();
// 获取项目
app.get("/repositories", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { page = 1, pageSize = 20, language = "all" } = req.query;
  // 此处需要处理C++ ++字符不出现问题
  // console.log(type === 'all' ? {} : { language: type })
  Repositories.find(language === "all" ? {} : { language })
    .skip(Number((page - 1) * pageSize))
    .limit(Number(pageSize))
    .sort({ stargazers_count: -1 })
    .exec((err, doc) => {
      if (err) {
        const obj = {
          status: 500,
          message: err.message,
        };
        res.send(obj);
      } else {
        const obj = {
          status: 200,
          items: doc,
          total_count: 1000,
        };
        res.send(obj);
      }
    });
});
// 获取users
app.get("/users", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { page = 1, pageSize = 20 } = req.query;
  // 此处需要处理C++ ++字符不出现问题
  // console.log(type === 'all' ? {} : { language: type })
  Users.find({})
    .skip(Number((page - 1) * pageSize))
    .limit(Number(pageSize))
    .sort({ followers: -1 })
    .exec((err, doc) => {
      if (err) {
        const obj = {
          status: 500,
          message: err.message,
        };
        res.send(obj);
      } else {
        const obj = {
          status: 200,
          items: doc,
          total_count: 1000,
        };
        res.send(obj);
      }
    });
});
// 获取blogs
app.get("/blogs", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { page = 1, pageSize = 20 } = req.query;
  Blogs.find({})
    .skip(Number((page - 1) * pageSize))
    .limit(Number(pageSize))
    .sort({ postTime: -1 })
    .exec((err, doc) => {
      if (err) {
        const obj = {
          status: 500,
          message: err.message,
        };
        res.send(obj);
      } else {
        const obj = {
          status: 200,
          items: doc,
        };
        res.send(obj);
      }
    });
});
// 获取trendings
app.get("/trendings", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { page = 1, pageSize = 10, type = "daily" } = req.query;
  Trendings.find({ type })
    .skip(Number((page - 1) * pageSize))
    .limit(Number(pageSize))
    .sort({ postTime: -1 })
    .exec((err, doc) => {
      if (err) {
        const obj = {
          status: 500,
          message: err.message,
        };
        res.send(obj);
      } else {
        const obj = {
          status: 200,
          items: doc,
        };
        res.send(obj);
      }
    });
});
// 获取趋势周报和
app.get("/trendings/history", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const { year, count, dateType = "weekly", language = "all" } = req.query;
    const path = `../../github-trending/archive/${dateType}/${year}/${count}/${language}.csv`
    let response = await csv()
      .fromFile(
        path
      )
      .then((json) => json)
      .catch((err) => Promise.reject(err));
    const obj = {
      status: 200,
      items: response,
    };
    res.send(obj);
  } catch (err) {
    const obj = {
      status: 500,
      message: err.message,
    };
    res.send(obj);
  }
});

app.listen("8081", () => {
  console.log("服务已经启动在8081");
});