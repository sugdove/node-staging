const axios = require("axios");

const { Blogs } = require("./models.js");

const cheerio = require("cheerio");
// select-menu-modal position-absolute right-0 class

// axios 获取
let proxy = {
  host: '18.162.236.39',
  port: '7078',
}
axios({
  method: 'get',
  url: 'https://github.com/trending',
  proxy
}).then(res=>{
  console.log(2222)
  console.log(res.data)
}).catch(err => {
  console.error(err)
})
// // 同步读取 page
// const getDataFromAxios = (page, page_size, type) => {
//   let url
//   switch (type) {
//     case 'Blogs':
//       url = `https://www.githubs.cn/api/graphql`
//       // url = `https://blog.csdn.net/api/articles?type=more&category=home&shown_offset=${Date.now()}`
//       break;
//     default:
//       url = `https://www.githubs.cn/api/graphql`
//       break;
//   }
//   return axios({
//     url,
//     method: 'post',
//     data:{
//       query: "query FeedListPaginationQuery(\n  $count: Int!\n  $cursor: String\n) {\n  ...FeedList_query_1G22uz\n}\n\nfragment FeedList_query_1G22uz on Query {\n  feed(after: $cursor, first: $count) {\n    edges {\n      node {\n        link\n        title\n        siteName\n        site\n        postTime\n        description\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n",
//       variables: {count: 2, cursor: page * page_size}
//     }

//   })
// }
// function sleep(ms) {
//   return new Promise(resolve=>setTimeout(resolve, ms))
// }
// /*
//  *  @params page_size
//  *
//  */
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

// //
// const insertOrUpdate = async (arr, page, page_size, type, model) => {
//   try {
//     for (let i = 0; i < arr.length; i++) {
//       model.findOneAndUpdate({ link: arr[i].link }, { $set: arr[i] }, { upsert: true, 'new': true }, (err, doc) => {
//         if (err) {
//           return Promise.reject('爬取失败：async终止运行')
//         }
//         else {
//           console.log(`爬取:${(page - 1) * page_size + 1 + i}条数据成功`)
//         }
//       })
//     }
//   }
//   catch (err) {
//     throw new Error(err)
//   }
// }

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
