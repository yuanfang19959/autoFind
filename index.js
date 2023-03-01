const puppeteer = require("puppeteer");
const {
  data: { list },
} = require("./blogData");

const options = {
    width: 1920,
    height: 768
}

async function autoFindH1Page() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (let i in list) {
    if (i < 100) {
      const page = await browser.newPage();
      await page.setViewport({
        width: options.width,
        height: options.height,
      });
      await page.goto("https://open.oceanbase.com/blog/" + list[i].uid, {
        timeout: 0
      });

      const resultsSelector = "#techTypo>h1";

      const h1Count = await page.$$eval(resultsSelector, (h1s) => h1s.length);
      // const h1Text = await page.$$eval('h1', h1Text => {
      //   return h1Text.map(option => option.textContent);
      // });
      // console.log(h1Text)
      console.log(i)
      // 当页面的h1标签大于1 进行截图排查 bloguid.png 格式截图
      // if (h1Count > 1) {
        await page.screenshot({
          path: `./pics/${list[i].uid}.png`,
          fullPage: true,
        });
      // }
      await page.close();
    }
  }

  await browser.close();
}

autoFindH1Page();
