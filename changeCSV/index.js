const fs = require("fs");
const csv = require("csvtojson");
const Json2csvParser = require("json2csv").Parser;
const { getRepository } = require("../scrapy/trending");
const path = require("path");
const changeList = require("./changeList");
// const path_url = "../../github-trending/archive/monthly";
// const path_url2 = `../../github-trending/archive/daily/${year}/${month.toString().padStart(2,'0')}`;
const path_url2 = `../../github-trending/archive/daily/2019/11`;

const readDir = async (path_) => {
  let dirList = fs.readdirSync(path.join(__dirname, path_));
  for (let i = 0; i < dirList.length; i++) {
    if (dirList[i].includes(".csv")) {
      if (dirList[i].includes("all.csv")) {
        await changeCSV(`${path_}/${dirList[i]}`);
      } else {
      }
    } else {
      readDir(`${path_}/${dirList[i]}`);
    }
  }
};

// 调用github api替换原有csv数据
const changeCSV = async (relPath) => {
  try {
    let response = await csv()
      .fromFile(path.join(__dirname, relPath))
      .then((json) => json)
      .catch((err) => console.log(`csv读取失败:${err.message}, `));
    const newArr = [];

    for (let i = 0; i < response.length; i++) {
      let repository
      // 过滤掉已经转换的数据
      if (response[i].name.includes("/")) {
        repository = await getRepository(response[i].name);
      }
      if (repository === undefined) repository = {};
      // 若请求失败则直接break
      newArr.push({ ...response[i], ...repository });
    }

    fs.writeFileSync('./test.txt',JSON.stringify(newArr))
    const csvFields = Object.keys(newArr[0]);

    const json2csvParser = new Json2csvParser({ csvFields });

    const newcsv = json2csvParser.parse(newArr);

    fs.writeFileSync(path.join(__dirname, relPath), newcsv);
  } catch (err) {
    console.log(`出错: ${err}`);
  }
};

const main = async () => {
  try {
    for (let i = 0; i < changeList.length; i++) {
      const { dateType, dirValue } = changeList[i];
      const path = `../../github-trending/archive/${dateType}/${dirValue}`;
      await readDir(path);
    }
  } catch (err) {
    console.log(`main报错:${err.message}`);
  }
};

main();
// readDir(path_url2);
// csv()
//       .fromFile(path.join(__dirname, "../github-trending/archive/weekly/2021/00/all.csv"))
//       .then((json) => {console.log(json)})
//       .catch((err) => console.log(`csv读取失败:${err.message}`));
