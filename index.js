const fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs");

const plurks = fs.readFileSync("plurks.txt", "utf-8").split("\n");

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

(async () => {
  asyncForEach(plurks, async plurk => {
    const html = await fetch(plurk).then(res => res.text());
    const $ = cheerio.load(html);
    const avatar = $("#profile_pic").attr("src");

    fs.appendFileSync("data.csv", `${plurk},${avatar}\n`);
    console.log(`${plurk} Done!`);
  });
})();
