// const mongodbClient = require('mongodb').mongodbClient
const axios = require('axios')

const { Repositories, Users } = require('./models.js')

const fs = require('fs')

const languageList = require('./languageList.js')

// 同步读取 page
let startpageObj = JSON.parse(fs.readFileSync('./page.json'))

// 写入page
const writePage = (page, type) => {
  console.log('开始写入')
  startpageObj[type] = page
  fs.writeFile('./page.json', JSON.stringify(startpageObj), (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(`${type}集合page写入成功,写入${page}页`)
  })
}

const getDataFromAxios = (page, page_size, type, url = '', language) => {
  let obj = {}
  if (!url) {
    switch (type) {
      case 'Repositories':
        url = `https://api.github.com/search/repositories?q=stars:>0&page=${page}&per_page=${page_size}`
        break;
      case 'language':
        url = `https://api.github.com/search/repositories?q=${language}&page=${page}&per_page=${page_size}`
        break;
      case 'Users':
        url = `https://api.github.com/search/users?q=followers:>0&page=${page}&per_page=${page_size}`
        break;
      default:
        url = `https://api.github.com/search/repositories?q=stars:>0&page=${page}&per_page=${page_size}`
        break;
    }
  }
  return axios({
    url,
    method: 'get',
    params: obj,
    headers: { Authorization: 'token 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' }
  }
  )
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

          insertData = await getDetails(insertData, languageList[i])

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
const main = () => {
  // saveData此处如果试做promise则 不会执行里面的函数
  // saveData(50, 20, 'Repositories', Repositories).then(res=>{
  // }).catch(err=>{console.log(err)})
  saveData(50, 20, 'language', Repositories).then(res => {
  }).catch(err => { console.log(err) })
  // saveData(50, 20, 'Users', Users)
}

main()




 // await model.insertMany(insertData)
        //   .then(res => {
        //     writePage(page + 1, type)
        //     console.log(`爬取:${(page - 1) * page_size + 1}条 到  ${page * page_size}条数据成功`)
        //   })
        //   .catch(err => {
        //     writePage(page, type)
        //     return Promise.reject('爬取失败：async终止运行')
        //   })