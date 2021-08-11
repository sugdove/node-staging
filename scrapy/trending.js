const axios = require("../axios");

const { Trendings } = require("../models/models");

const token = require("./record/token")
const cheerio = require("cheerio");
// .select-menu-item
const getHtml = (type) => {
  return axios
    .get(`https://github.com/trending?since=${type}`)
    .then((res) => res.data)
    .catch((err) => console.log(`抓取html地址:https://github.com/trending?since=${type}出错: ${err}`));
};

const saveData = async (type) => {
  try {
    let html = await getHtml(type);
    const $ = cheerio.load(html);
    getDataFromDom($, type);
  } catch (err) {
    console.log(`saveData报错${err}`);
  }
};
const getDataFromDom = ($, type) => {
  $(".Box-row").each(async function () {
    let full_name, star_count;
    full_name = $(this).find("h1").find("a").attr("href");
    full_name = full_name.substring(1, full_name.length);
    star_count = parseInt(
      $(this)
      .find(".f6")
      .children(".d-inline-block.float-sm-right")
      .text()
      .trim()
    );
    const obj = {
      date_id: new Date().toLocaleDateString(),
      star_count,
      type,
    };
    // console.log(obj);
    const respository = await getRepository(full_name);
    const result = { ...obj, ...respository };
    insertOrUpdate(result, Trendings);
  });
};

const getRepository = (full_name) => {
  return axios({
    method: 'get',
    url: `https://api.github.com/repos/${full_name}`,
    headers: { Authorization: `token ${token}` }
  })
    .then((res) => {
      console.log(
        `x-ratelimit-limit: ${res.headers["x-ratelimit-limit"]}\n
         x-ratelimit-remaining: ${res.headers["x-ratelimit-remaining"]}`
      );
      return Promise.resolve(res.data)
    })
    .catch((err) => {
      console.log(`获取单个项目报错: ${err.message}, url为: https://api.github.com/repos/${full_name}`)
    });
};
//
const insertOrUpdate = (data, model) => {
    model.findOneAndUpdate(
      { date_id: data.date_id, id: data.id, type: data.type },
      { $set: data },
      { upsert: true, new: true },
      (err, doc) => {
        if (err) {
          console.log(`数据库更新失败:${err.message}`)
        } else {
          console.log(`trendings 爬取数据成功`);
        }
      }
    );
};

const scrapy_trendings = async () => {
  try {
    const arr = ["daily", "weekly", "monthly"];
     for (let i = 0; i < arr.length; i++) {
     await saveData(arr[i]);
    }
  }
  catch(err){
    throw err
  }
  
};

module.exports = 
{
  getRepository,
  scrapy_trendings
}