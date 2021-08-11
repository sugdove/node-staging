// const mongodbClient = require('mongodb').mongodbClient
const axios = require("../axios");

const { Repositories, Users } = require("../models/models");

const token = require("./record/token");

const languageList = require("./record/languageList.js");

const getDataFromAxios = (page, page_size, type, url = "", language) => {
  let q = "";
  if (!url) {
    switch (type) {
      case "Repositories":
        q = "stars:>0";
        url = `https://api.github.com/search/repositories`;
        break;
      case "language":
        q = language;
        url = `https://api.github.com/search/repositories`;
        break;
      case "Users":
        q = "followers:>0";
        url = `https://api.github.com/search/users`;
        break;
      default:
        q = "q=stars:>0";
        url = `https://api.github.com/search/repositories`;
        break;
    }
  }
  return axios({
    url,
    method: "get",
    params: { q, page, per_page: page_size },
    headers: { Authorization: `token ${token}` },
  });
};
/*
 *  @params page_size
 *
 */
const saveData = async (page_size, totalPage, type, model) => {
  try {
    if (type === "language") {
      for (let i = 0; i < languageList.length; i++) {
        for (let page = 1; page <= totalPage; page++) {
          let insertData = await getDataFromAxios(
            page,
            page_size,
            type,
            "",
            languageList[i]
          ).then((res) => {
            console.log(
              `x-ratelimit-limit: ${res.headers["x-ratelimit-limit"]}`
            );
            console.log(
              `x-ratelimit-remaining: ${res.headers["x-ratelimit-remaining"]}`
            );
            return res.data.items;
          });

          insertOrUpdate(insertData, page, page_size, languageList[i], model);
        }
      }
    } else {
      for (let page = 1; page <= totalPage; page++) {
        let insertData = await getDataFromAxios(page, page_size, type)
          .then((res) => {
            console.log(
              `x-ratelimit-limit: ${res.headers["x-ratelimit-limit"]}\n
               x-ratelimit-remaining: ${res.headers["x-ratelimit-remaining"]}`
            );
          })
          .catch((err) => {
            // return Promise.reject()
            console.log("axios调用报错:" + err);
          });

        insertData = await getDetails(insertData, type);

        insertOrUpdate(insertData, page, page_size, type, model);
      }
    }
  } catch (err) {
    throw new Error(err);
  }
};

//
const insertOrUpdate = (arr, page, page_size, type, model) => {
  if(arr === undefined) return
  for (let i = 0; i < arr.length; i++) {
    model.findOneAndUpdate(
      { id: arr[i].id },
      { $set: arr[i] },
      { upsert: true, new: true },
      (err, doc) => {
        if (err) {
          console.log("数据库更新出错:" + err.message);
        } else {
          console.log(`爬取${type}:${(page - 1) * page_size + 1 + i}条数据成功`);
        }
      }
    );
  }
};

// 当为 Users情况下时需再请求obj.url获取对象
const getDetails = async (dataList, type) => {
  if(dataList === undefined) return []; 
  if (type !== "Users") return dataList;
  const arr = [];
  try {
    for (let i = 0; i < dataList.length; i++) {
      let data = await getDataFromAxios(1, 1, "Users", dataList[i]["url"]).then(res => res.data)
      arr.push(data);
    }
    return arr;
  } catch (err) {
    console.log(err);
  }
};
// 主入口
const scrapy_respositories = async () => {
  // saveData此处如果试做promise则 不会执行里面的函数 
  await saveData(100, 10, "Repositories", Repositories)
    .then(() => {
      console.log("Repositories爬取成功");
    })
    .catch((err) => {
      console.log("Repositories爬取失败" + err);
    });
  await saveData(100, 10, "language", Repositories)
    .then(() => {
      console.log("language爬取成功");
    })
    .catch((err) => {
      console.log("language爬取失败" + err);
    });
  await saveData(100, 10, "Users", Users)
    .then(() => {
      console.log("Users爬取成功");
    })
    .catch((err) => {
      console.log("Users爬取失败" + err);
    });
};

module.exports = scrapy_respositories;
