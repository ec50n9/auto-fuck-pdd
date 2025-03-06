import { t } from 'elysia';

// 搜索类型枚举
export enum SearchType {
  PHONE = 1,      // 手机号
  PICKUP_CODE = 2, // 取件码
  WAYBILL = 3,    // 运单号
  RECIPIENT = 4    // 收件人
}

export const searchForm = t.Object({
  content: t.String(),      // 搜索内容
  searchType: t.Number(),   // 搜索类型
  startInCabinetDate: t.Optional(t.Union([t.String(), t.Number(), t.Date()])),  // 入柜开始时间，支持多种格式
  endInCabinetDate: t.Optional(t.Union([t.String(), t.Number(), t.Date()])),    // 入柜结束时间，支持多种格式
  stayDaysList: t.Optional(t.Number()),  // 滞留天数
  selected: t.Optional(t.Boolean()),     // 是否选中
})

// 查询表单接口
export type SearchForm = typeof searchForm.static;

// 包裹信息接口
export interface PackageInfo {
  waybillNumber: string;
  courier: string;
  notificationStatus: string;
  pickupCode: string;
  recipientInfo: {
    name: string;
    phone: string;
  };
  packageStatus: {
    status: string;
    date: string;
    time: string;
  };
} 