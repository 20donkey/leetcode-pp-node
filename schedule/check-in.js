const fs = require("fs");
const path = require("path");
const { getDay } = require("../utils/day");
const us = require("../static/users/index");
const mySolutions = require("../static/my/solutions.json");

const allUsers = JSON.parse(JSON.stringify(us));
const whitelist = [
  "unclegem",
  "feikerwu",
  "threedayaaaaa",
  "suukii",
  "azl397985856",
];

function run(n) {
  // 返回目前为止满勤的人（连续七天可获取补签卡）
  function fullCheckIn(from = 1, to = getDay()) {
    const users = [];
    const DAYS_TO_GET_CARD = 7;

    for (const login in mySolutions) {
      const solutions = mySolutions[login];
      let i = from - 1;
      let card = 0; // 补签卡数量
      let noCheckDays = 0;
      let continuousDays = 0; // 连续打卡的天数
      while (i < to) {
        if (!solutions || !solutions[i] || !solutions[i].onTime) {
          continuousDays = 0;
          noCheckDays++;
        } else {
          continuousDays++;
          if (continuousDays == DAYS_TO_GET_CARD) {
            card++;
            continuousDays = 0;
          }
        }
        i++;
      }
      if (card >= noCheckDays) {
        users.push({
          login,
          card: card - noCheckDays,
        });
      }
    }
    return users;
  }
  // 返回7天内(不包括今天)所有已经打卡的
  function checkWithinNDays(n) {
    const users = {};
    const day = getDay();
    if (day <= n) return us; // 至少第 n + 1 天才能开始统计前 n 天
    for (const name in us) {
      if (whitelist.includes(name)) {
        users[name] = true;
        continue;
      }
      us[name].noCheck = false;
      us[name].allCheck = false;
      const solutions = mySolutions[name];
      // 如果注册时间不满 n 天，则算打过卡。
      if (day - getDay(us[name].createTime) + 1 <= n) {
        users[name] = true;
        continue;
      }
      // [day - n - 2, day - 2]
      let i = day - n - 1;

      let count = 0;

      while (i < day - 1) {
        if (!solutions || !solutions[i] || !solutions[i].onTime) {
          count += 1;
        } else {
          count = 0;
        }
        i++;
      }

      if (count < n) {
        users[name] = true;
      }
    }
    return users;
  }

  function diff(A, B) {
    for (const name in B) {
      delete A[name.toLocaleLowerCase()];
    }
    return Object.keys(A);
  }
  const blacklist = diff(allUsers, checkWithinNDays(n)).filter(
    (name) => !/[A-Z]/.test(name)
  );
  const redlist = fullCheckIn(29);
  console.log(`no check within ${n} days`, JSON.stringify(blacklist));
  console.log(`full check`, redlist);

  for (const red of redlist) {
    if (!us[red.login]) {
      us[red.login] = {};
    }
    us[red.login].allCheck = true;
    us[red.login].card = red.card;
  }
  for (const login of blacklist) {
    us[login].noCheck = true;
  }

  fs.writeFileSync(
    path.resolve(__dirname, "../static/users/index.json"),
    JSON.stringify(us)
  );
}

run(7);
