const scrapy_blogs = require("./blog");
const scrapy_repositories = require("./repositories");
const scrapy_trendings = require("./trending");

const main = async () => {
  try {
    await scrapy_repositories();
    await scrapy_trendings();
    await scrapy_blogs();
  } catch (err) {
    console.log(`出错：${err.message}`);
  }
};

const TIMEOUT = 6000 * 60 * 3;

main()

setInterval(main, TIMEOUT);
