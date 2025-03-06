import type { Page } from 'puppeteer';
import type { SearchForm } from './types';
import { buildSearchUrl } from './utils';
import { extractPackageInfo } from './scraper';

// 执行查询
export const executeSearch = async (page: Page, form: SearchForm) => {
  // Navigate the page to a URL.
  await page.goto(buildSearchUrl(form));
  
  // 等待包含 station-table-row 类的元素出现
  try {
    await page.waitForSelector('.package-list-container .station-loading', { timeout: 30000 });
    console.log('开始搜索...')
    await Promise.race([
      page.waitForSelector('.station-table-row', { timeout: 30000 }),
      page.waitForSelector('.station-table-empty', { timeout: 30000 })
    ])
    await page.waitForSelector('.station-table-row', { timeout: 1000 });
    console.log('搜索完成');
  } catch (error) {
    console.error('等待搜索结果超时，可能没有搜索结果');
    return [];
  }
  
  return await extractPackageInfo(page);
}; 