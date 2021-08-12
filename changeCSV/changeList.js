const WEEKTIMES = 604800000;
const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const week = Math.ceil(
  (Date.now().valueOf() - new Date(year, 0, 1).valueOf()) / WEEKTIMES
);

const changeList = [
  {
    dateType: "daily",
    dirValue: `${year}/${month.toString().padStart(2, "0")}`
  },
  {
    dateType: "weekly",
    dirValue: `${year}/${week.toString().padStart(2, "0")}`
  },
  {
    dateType: "monthly",
    dirValue: `${year}/${month.toString().padStart(2, "0")}`
  },
];

module.exports = changeList