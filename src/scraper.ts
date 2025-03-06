import type { Page } from 'puppeteer';
import type { PackageInfo } from './types';

// 提取表格中的信息
export const extractPackageInfo = async (page: Page): Promise<PackageInfo[]> => {
  const rows = await page.$$('.station-table-row');
  const packages: PackageInfo[] = [];
  
  for (const row of rows) {
    // 提取运单号
    const waybillNumber = await row.$eval('td:nth-child(2)', el => 
      el.textContent?.split('\n')[0]?.trim() || '');
    
    // 提取快递公司
    const courier = await row.$eval('td:nth-child(3)', el => 
      el.textContent?.trim() || '');
    
    // 提取通知状态
    const notificationStatus = await row.$eval('td:nth-child(4)', el => 
      el.textContent?.trim() || '');
    
    // 提取取件码
    const pickupCode = await row.$eval('td:nth-child(5)', el => 
      el.textContent?.trim() || '');
    
    // 提取收件人信息
    const recipientInfo = await row.$eval('td:nth-child(6)', el => {
      const divs = el.querySelectorAll('.table-text div');
      return {
        name: divs[0]?.textContent || '',
        phone: divs[1]?.textContent || ''
      };
    });
    
    // 提取包裹状态
    const packageStatus = await row.$eval('td:nth-child(7)', el => {
      const divs = el.querySelectorAll('.table-text div');
      return {
        status: divs[0]?.textContent || '',
        date: divs[1]?.textContent || '',
        time: divs[2]?.textContent || ''
      };
    });

    packages.push({
      waybillNumber,
      courier,
      notificationStatus,
      pickupCode,
      recipientInfo,
      packageStatus
    });
  }

  return packages;
}; 