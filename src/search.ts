import type { Page } from 'puppeteer';
import type { SearchForm } from './types';
import { SearchType } from './types';
import { buildSearchUrl } from './utils';
import { extractPackageInfo } from './scraper';

// 默认查询参数
export const defaultSearchForm: SearchForm = {
  // content: '7225',
  content: '32530',
  searchType: SearchType.RECIPIENT,
  selected: false
};

// 执行查询
export const executeSearch = async (page: Page, form: SearchForm = defaultSearchForm) => {
  // Navigate the page to a URL.
  await page.goto(buildSearchUrl(form));
  
  // 等待包含 station-table-row 类的元素出现
  try {
    console.log('正在等待表格行元素加载...');
    await page.waitForSelector('.station-table-row', { timeout: 30000 });
    console.log('表格行元素已加载完成');
  } catch (error) {
    console.error('等待表格行元素超时:', error);
    return [];
  }
  
  return await extractPackageInfo(page);
}; 