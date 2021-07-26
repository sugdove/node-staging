const axios = require("axios");

const { Blogs } = require("./models.js");

const fs = require("fs")

const cheerio = require("cheerio");
// .select-menu-item
const getHtml = (url) => {
  return axios.get(url).then(res=> Promise.resolve(res.data)).catch(err=> Promise.reject(err))
}
const saveData = async(url) => {
  try{
    let html = await getHtml(url ? url : `https://github.com/trending`)
    console.log(html)
    const $ = cheerio.load(html)
    getDataFromDom($)
    // if( !url ) {
    //   $('.select-menu-item').each(function(){
    //     let urlHref = `https://github.com${$(this).attr('href')}`
    //     saveData(urlHref)
    //   })
    // }
  }
  catch(err){
    console.log(`saveData报错${err}`)
  }
}
const getDataFromDom = ($) => {
  $('.Box-row').each(function(){
    let full_name,html_url,description,language,stargazers_count,stargazers_count_url,forks_count,forks_count_url,builtBy,star_des
    full_name = $(this).find('h1').find('a').attr('href')
    full_name = full_name.substring(1, full_name.length)
    html_url = `https://github.com/${full_name}`
    description = $(this).children('p').text().trim()
    language = $(this).children('.f6').children(':first').text().trim()
    $(this).children('.f6').children().each(function( index ) {
      switch (index) {
        case 0:
            language = $(this).text().trim()
          break;
        case 1:
            stargazers_count = $(this).text().trim()
            stargazers_count_url = `https://github.com${$(this).attr('href')}`
            break;
        case 2:
            forks_count = $(this).text().trim()
            forks_count_url = `https://github.com${$(this).attr('href')}`
          break;
        case 3:
            builtBy = $(this).text().trim()
          break;
        case 4:
            star_des = $(this).text().trim() 
        default:
          break;
      }
    })
    const obj = {
      full_name,
      html_url,
      description,
      language,
      stargazers_count,
      stargazers_count_url,
      forks_count,
      forks_count_url,
      star_des,
      builtBy
    }
    console.log(obj)
  })
}
saveData()
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
