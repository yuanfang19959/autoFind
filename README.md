## 突发奇想
> 工作的时候，做某文章详情页面下的SEO H1标签降级需求，想着功能已经开发完成。但是靠手指点来点去是不太现实的。
> 看了下大概有570条文章，靠我手点，那要等到后面马月去。

+ 本来是用python验证过的，由于技术有限，我只能爬取到spa页面的东西，拿不到实际的页面结构。所以就跳过了。

+ 于是搜到了这个东西 ```puppeteer```拼拼凑凑实现了如下的简单功能
```javascipt
const puppeteer = require("puppeteer");
<!-- list为列表数据 -->
const {
  data: { list },
} = require("./blogData");

<!-- 定义chromium的窗口大小 -->
const options = {
    width: 1920,
    height: 768
}

async function autoFindH1Page() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (let i in list) {
    <!-- 暂时先爬取十条 -->
    if (i < 10) {
      const page = await browser.newPage();
      await page.setViewport({
        width: options.width,
        height: options.height,
      });
      await page.goto("https://open.oceanbase.com/blog/" + list[i].uid, {
        timeout: 0
      });
    
      <!-- 指定页面元素，获取对应元素下的内容 -->
      const resultsSelector = "#techTypo>h1";

      const h1Count = await page.$$eval(resultsSelector, (h1s) => h1s.length);
      // const h1Text = await page.$$eval('h1', h1Text => {
      //   return h1Text.map(option => option.textContent);
      // });
      // console.log(h1Text)
      console.log(i)

      // 当页面指定元素下的h1标签数量大于1 进行截图排查 
      // 格式截图 格式为 博客uid.png
      if (h1Count > 1) {
        await page.screenshot({
          path: `./pics/${list[i].uid}.png`,
          fullPage: true,
        });
      }
      await page.close();
    }
  }

  await browser.close();
}

autoFindH1Page();

```
> 执行上述代码最好的结果就是pics文件夹下没有任何图片，其下如果有图片 就能证明我写的降级算法有问题 哈哈哈哈