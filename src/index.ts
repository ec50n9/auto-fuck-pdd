import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { join } from 'path';
import { executeSearch } from './search';

// 使用 Stealth 插件
puppeteer.use(StealthPlugin());

async function main() {
  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1080,
      height: 1024,
    },
    userDataDir: join(__dirname, '..', 'user_data'),
  });

  try {
    // 打开新页面
    const page = await browser.newPage();
    
    // 执行默认查询
    const packages = await executeSearch(page);
    console.log('查询结果:', packages);
  } finally {
    // 关闭浏览器
    await browser.close();
  }
}

// 运行主函数
main().catch(console.error); 