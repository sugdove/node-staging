// const mongodbClient = require('mongodb').mongodbClient
const axios = require('axios')

const { Repositories, Users } = require("../models/models");

const fs = require('fs')

const languageList = require('./record/languageList.js')

// 同步读取 page
let startpageObj = JSON.parse(fs.readFileSync('./record/page.json'))

// 写入page
const writePage = (page, type) => {
  console.log('开始写入')
  startpageObj[type] = page
  fs.writeFile('./record/page.json', JSON.stringify(startpageObj), (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(`${type}集合page写入成功,写入${page}页`)
  })
}

const getDataFromAxios = (page, page_size, type, url = '', language) => {
  let q = ''
  if (!url) {
    switch (type) {
      case 'Repositories':
        q = 'stars:>0'
        url = `https://api.github.com/search/repositories`
        break;
      case 'language':
        q = language
        url = `https://api.github.com/search/repositories`
        break;
      case 'Users':
        q = 'followers:>0'
        url = `https://api.github.com/search/users`
        break;
      default:
        q = 'q=stars:>0'
        url = `https://api.github.com/search/repositories`
        break;
    }
  }
  return axios({
    url,
    method: 'get',
    params: { q, page, per_page: page_size },
    headers: { Authorization: 'token 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' }
  })
}
/*
 *  @params page_size
 *
 */
const saveData = async (page_size, totalPage, type, model) => {
  let startpage = startpageObj[type]
  console.log(startpage)
  // let total_count = await getDataFromAxios(1, 1).then(res => {
  //   // console.log(res.data)
  //   return res.data.total_count
  // }).catch(err => { console.log('获取项目数量失败') })
  // if (total_count === undefined) return
  // console.log(`总项目数为:${total_count}`)
  // let total_page = Math.ceil(total_count / page_size)
  // console.log(`总页数为:${total_page}`)
  try {
    if (type === 'language') {
      for (let i = 0; i < languageList.length; i++) {
        startpage = startpageObj[languageList[i]]
        for (let page = startpage; page <= totalPage; page++) {
          let insertData = await getDataFromAxios(page, page_size, type, '', languageList[i])
            .then(res => {
              writePage(page + 1, languageList[i])
              console.log(`x-ratelimit-limit: ${res.headers['x-ratelimit-limit']}`)
              console.log(`x-ratelimit-remaining: ${res.headers['x-ratelimit-remaining']}`)
              return res.data.items
            })
            .catch(err => {
              writePage(page + 1, languageList[i])
              return Promise.reject('axios调用报错：async终止运行:' + err)
            })

          await insertOrUpdate(insertData, page, page_size, languageList[i], model)

        }
      }
    }
    else {
      for (let page = startpage; page <= totalPage; page++) {
        let insertData = await getDataFromAxios(page, page_size, type)
          .then(res => {
            writePage(page + 1, type)
            console.log(`x-ratelimit-limit: ${res.headers['x-ratelimit-limit']}`)
            console.log(`x-ratelimit-remaining: ${res.headers['x-ratelimit-remaining']}`)
            return res.data.items
          })
          .catch(err => {
            writePage(page + 1, type)
            return Promise.reject('axios调用报错：async终止运行:' + err)
          })

        insertData = await getDetails(insertData, type)

        await insertOrUpdate(insertData, page, page_size, type, model)

      }
    }

  }
  catch (err) {
    throw new Error(err)
  }
}

// 
const insertOrUpdate = async (arr, page, page_size, type, model) => {
  try {
    for (let i = 0; i < arr.length; i++) {
      model.findOneAndUpdate({ id: arr[i].id }, { $set: arr[i] }, { upsert: true, 'new': true }, (err, doc) => {
        if (err) {
          writePage(page, type)
          return Promise.reject('爬取失败：async终止运行')
        }
        else {
          console.log(`爬取:${(page - 1) * page_size + 1 + i}条数据成功`)
        }
      })
    }
  }
  catch (err) {
    throw new Error(err)
  }
}

// 当为 Users情况下时需再请求obj.url获取对象
const getDetails = async (dataList, type) => {
  if (type !== 'Users') return dataList
  const arr = []
  try {
    for (let i = 0; i < dataList.length; i++) {
      let data = await getDataFromAxios(1, 1, 'Users', dataList[i]['url']).then(res => res.data)
      arr.push(data)
    }
    return arr
  }
  catch (err) {
    console.log(err)
  }
}
// 主入口
const main = async () => {
  // saveData此处如果试做promise则 不会执行里面的函数

  try {
    await saveData(50, 20, 'Repositories', Repositories).then(res=>{
    console.log('Repositories爬取成功')
    }).catch(err=> Promise.reject(err))
    await saveData(50, 20, 'language', Repositories).then(res => {
      console.log('language爬取成功')
    }).catch(err => Promise.reject(err))
    await saveData(50, 20, 'Users', Users).then(res => {
      console.log('Users爬取成功')
    }).catch(err => Promise.reject(err))
  }
  catch (err) {
    throw new Error(err)
  }
}

main().then(res => {
  console.log('爬虫程序全部执行成功')
}).catch(err => {
  console.log('爬虫程序执行失败: ' + err)
})