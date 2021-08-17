const shell = require("shelljs");

const main = () => {
  shell.exec("git pull", (code, stdout, err) => {
    if (code !== 0) {
      console.log("git pull success");
    } else {
      console.log("git pull error:" + err);
    }
  });
};

main();

const TIME = 60000 * 60 * 24

setInterval(main, TIME)
