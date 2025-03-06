import dayjs from 'dayjs';
import type { SearchForm } from './types';

// 日期时间转换为时间戳
export const toTimestamp = (date: string | number | Date | undefined): number | undefined => {
  if (!date) return undefined;
  return dayjs(date).valueOf();
};

// 构建查询URL
export const buildSearchUrl = (form: SearchForm) => {
  const params = new URLSearchParams();
  
  // 添加必需参数
  params.append('content', form.content);
  params.append('search_type', form.searchType.toString());
  params.append('selected', (form.selected ?? false).toString());
  
  // 添加可选参数
  const startTimestamp = toTimestamp(form.startInCabinetDate);
  if (startTimestamp) {
    params.append('start_in_cabinet_date', startTimestamp.toString());
  }
  
  const endTimestamp = toTimestamp(form.endInCabinetDate);
  if (endTimestamp) {
    params.append('end_in_cabinet_date', endTimestamp.toString());
  }
  
  if (form.stayDaysList) {
    params.append('stay_days_list', form.stayDaysList.toString());
  }
  
  return `https://mdkd.pinduoduo.com/packageList?${params.toString()}`;
}; 