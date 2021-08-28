const blacklist = require("./blacklist.json");
const startTime = new Date("2021-09-10T00:00:00.000+08:00");
const { users } = require("./users-5");

const userList = [
  {
    login: "azl397985856",
  },
].concat(
  users.map((name) => ({
    login: name,
  }))
);

console.log(userList);

const leetcodeConfig = {
  baseUrl: "https://leetcode-cn.com",
  submitUrl: "https://leetcode-cn.com/problems/$slug/submit/",
  loginUrl: "https://leetcode-cn.com/accounts/login/",
  allProblem: "https://leetcode-cn.com/api/problems/all/",
  _91UsernameCookieName: "login", // 在91网站中存lc用户名的cookie的键名
  _91PwdCookieName: "password", // 在91网站中存lc密码的cookie的键名
  lcSeesionCookieName: "LEETCODE_SESSION", // lc存seesionid的 cookie键名
  lcCsrftokenCookieName: "csrftoken", // lc存csrf的 cookie键名
};

module.exports = {
  leetcodeConfig,
  owner: "leetcode-pp",
  repo: "91alg-4",
  startTime: startTime.getTime(),
  secret: process.env.secret,
  clientId: "c16b80e7b58a5a007157",
  db: userList.reduce((acc, curr) => {
    if (blacklist.includes(curr.login)) return acc;
    acc[curr.login] = curr;
    return acc;
  }, {}),
};
