const scrapy_blogs = require("./blog");
const scrapy_repositories = require("./repositories");
const {
  scrapy_trendings
} = require("./trending");

const main = async () => {
  try {
    await scrapy_repositories();
    await scrapy_blogs();
    // await scrapy_trendings();
    console.log('爬虫结束！')
  } catch (err) {
    console.log(`出错：${err.message}`);
  }
};

// 每隔24小时跑一次
const TIMEOUT = 60000 * 60 * 24;

main()

setInterval(main, TIMEOUT);
