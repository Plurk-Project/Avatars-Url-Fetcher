const ArgumentParser = require("argparse").ArgumentParser;
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs");

const parser = new ArgumentParser({
  addHelp: true
});
parser.addArgument(["-i", "--input"], {
  required: true,
  help: "Input text path. (seperate user url with new line)"
});
parser.addArgument(["-o", "--output"], {
  required: true,
  help: "Output csv format path."
});
const args = parser.parseArgs();

const plurks = fs.readFileSync(args.input, "utf-8").split("\n");

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

    fs.appendFileSync(args.output, `${plurk},${avatar}\n`);
    console.log(`${plurk} Done!`);
  });
})();
