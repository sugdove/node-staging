const axios = require("axios");

const { Trendings } = require("./models.js");

const cheerio = require("cheerio");
// .select-menu-item
const getHtml = (type) => {
  return axios
    .get(`https://github.com/trending?since=${type}`)
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(`https://github.com/trending?since=${type} ${err}`));
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
    console.log(obj);
    const respository = await getRepository(full_name);
    const result = { ...obj, ...respository };
    await insertOrUpdate(result, Trendings);
  });
};

const getRepository = (full_name) => {
  return axios
    .get(`https://api.github.com/repos/${full_name}`, {
      headers: {
        Authorization: "token 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",
      },
    })
    .then((res) => Promise.resolve(res.data))
    .catch((err) => Promise.reject(err));
};
//
const main = async () => {
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

main()
.then(res=>{console.log('爬取完毕!')})
.catch(err => {console.log('爬取失败:'+ err)})
// const saveData = async (page_size, totalPage, type, model) => {
//   let startpage = startpageObj[type]
//   try {
//       for (let page = startpage; page <= totalPage; page++) {
//         let insertData = await getDataFromAxios(page, page_size, type)
//           .then(res => {
//             let result = res.data.data.feed.edges.map(el=> el.node )
//             console.log(result)
//             return result
//           })
//           .catch(err => {
//             return Promise.reject('axios调用报错：async终止运行:' + err)
//           })

//         await insertOrUpdate(insertData, page, page_size, type, model)

//       }

//   }
//   catch (err) {
//     throw new Error(err)
//   }
// }
//
const insertOrUpdate = async (data, model) => {
  try {
    model.findOneAndUpdate(
      { date_id: data.date_id, id: data.id, type: data.type },
      { $set: data },
      { upsert: true, new: true },
      (err, doc) => {
        if (err) {
          return Promise.reject("爬取失败：async终止运行");
        } else {
          console.log(`爬取数据成功`);
        }
      }
    );
  } catch (err) {
    throw new Error(err);
  }
};

// // 主入口
// const main = async () => {
//   // saveData此处如果试做promise则 不会执行里面的函数

//   try {
//     await saveData(20, 100000, 'Blogs', Blogs).then(res => {
//       console.log('Blogs爬取成功')
//     }).catch(err => Promise.reject(err))
//   }
//   catch (err) {
//     throw new Error(err)
//   }
// }

// main().then(res => {
//   console.log('爬虫程序全部执行成功')
// }).catch(err => {
//   console.log('爬虫程序执行失败: ' + err)
// })
