import { Elysia, t } from 'elysia';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { join } from 'path';
import { executeSearch } from './search';
import { searchForm, type SearchForm } from './types';
import type { Page } from 'puppeteer';

// 使用 Stealth 插件
puppeteer.use(StealthPlugin());

// 创建浏览器和页面实例池
let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;
let searchPage: Page | null = null;

async function getSearchPage() {
  if (!browser) {
    console.log('启动浏览器...');
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: {
        width: 1080,
        height: 1024,
      },
      userDataDir: join(__dirname, '..', 'user_data'),
    });
  }

  if (!searchPage) {
    console.log('创建新页面...');
    searchPage = await browser.newPage();
  }

  return searchPage;
}

// 创建 API 服务器
const app = new Elysia()
  .onError(({ error, set }) => {
    console.error('API Error:', error);
    set.status = 500;
    return {
      error: String(error)
    };
  })
  .get('/', () => '快递查询 API 服务已启动')
  .post('/search', async ({ body }) => {
    const searchForm = body;
    
    try {
      const page = await getSearchPage();
      const results = await executeSearch(page, searchForm);
      return { success: true, data: results };
    } catch (err) {
      const error = err as Error;
      throw new Error(`搜索失败: ${error.message}`);
    }
  }, {
    body: searchForm,
  })
  .listen(3000);

console.log(
  `🦊 快递查询 API 服务已在 http://${app.server?.hostname}:${app.server?.port} 启动`
);

// 优雅关闭
process.on('SIGINT', async () => {
  if (searchPage) {
    await searchPage.close();
  }
  if (browser) {
    await browser.close();
  }
  process.exit();
}); 