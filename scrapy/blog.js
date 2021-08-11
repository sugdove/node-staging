const axios = require('../axios')

const { Blogs } = require('../models/models.js')

const getDataFromAxios = (page, page_size, type) => {
  let url
  switch (type) {
    case 'Blogs':
      url = `https://www.githubs.cn/api/graphql`
      // url = `https://blog.csdn.net/api/articles?type=more&category=home&shown_offset=${Date.now()}`
      break;
    default:
      url = `https://www.githubs.cn/api/graphql`
      break;
  }
  return axios({
    url,
    method: 'post',
    data:{
      query: "query FeedListPaginationQuery(\n  $count: Int!\n  $cursor: String\n) {\n  ...FeedList_query_1G22uz\n}\n\nfragment FeedList_query_1G22uz on Query {\n  feed(after: $cursor, first: $count) {\n    edges {\n      node {\n        link\n        title\n        siteName\n        site\n        postTime\n        description\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n",
      variables: {count: 2, cursor: page * page_size}
    }
    
  })
}
/*
 *  @params page_size
 *
 */
const saveData = async (page_size, totalPage, type, model) => {
  try {
      for (let page = 1; page <= totalPage; page++) {
        let insertData = await getDataFromAxios(page, page_size, type)
          .then(res => {
            let result = res.data.data.feed.edges.map(el=> el.node )
            // console.log(result)
            return result
          })
          .catch(err => {
            // return Promise.reject('axios调用报错：async终止运行:' + err)
            console.log('axios调用报错：'+ err.message)
          })

        insertOrUpdate(insertData, page, page_size, type, model)

      }

  }
  catch (err) {
    throw new Error(err)
  }
}

// 
const insertOrUpdate =  (arr, page, page_size, type, model) => {
    if(arr === undefined) return
    for (let i = 0; i < arr.length; i++) {
      model.findOneAndUpdate({ link: arr[i].link }, { $set: arr[i] }, { upsert: true, 'new': true }, (err, doc) => {
        if (err) {
          console.log('数据库更新出错' + err.message)
        }
        else {
          console.log(`爬取blogs:${(page - 1) * page_size + 1 + i}条数据成功`)
        }
      })
    }
}

// 主入口
const scrapy_blogs = () => {
  // saveData此处如果试做promise则 不会执行里面的函数
  saveData(20, 50, 'Blogs', Blogs).then(res => {
    console.log('Blogs爬取成功')
  }).catch(err => {
    console.log('Blogs爬取失败' + err.message)
  })
}

module.exports = scrapy_blogs