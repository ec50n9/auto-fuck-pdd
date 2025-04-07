# auto-fuck-pdd

这是一个基于 Bun 运行时的快递查询自动化服务项目。该项目使用 Puppeteer 实现自动化查询快递信息，并提供 RESTful API 接口供外部调用。

## 技术栈

- Bun v1.2.4：JavaScript/TypeScript 运行时
- Elysia：轻量级 Web 框架
- Puppeteer：浏览器自动化工具
- TypeScript：开发语言

## 项目结构

```bash
src/
├── server.ts     # 服务器入口和配置
├── index.ts      # 应用程序主入口
├── search.ts     # 搜索功能实现
├── scraper.ts    # 网页爬虫相关功能
├── types.ts      # 类型定义
└── utils.ts      # 工具函数
```

## 核心功能

### 服务器配置 (server.ts)

服务器模块实现了以下主要功能：

1. **浏览器实例管理**

   - 使用 `puppeteer-extra` 和 `puppeteer-extra-plugin-stealth` 创建浏览器实例
   - 实现浏览器和页面实例的池化管理
   - 支持无头模式配置（当前设置为 `headless: false`）

2. **API 服务**

   - 基于 Elysia 框架构建
   - 默认监听 3000 端口
   - 提供以下接口：
     - `GET /`：服务健康检查
     - `POST /search`：快递信息查询接口

3. **错误处理**

   - 统一的错误处理中间件
   - 详细的错误日志记录
   - 标准化的错误响应格式

4. **优雅关闭**
   - 监听 SIGINT 信号
   - 自动关闭浏览器实例
   - 清理系统资源

### 数据类型 (types.ts)

项目定义了以下主要数据类型：

1. **搜索类型枚举 (SearchType)**

   ```typescript
   enum SearchType {
     PHONE = 1, // 手机号查询
     PICKUP_CODE = 2, // 取件码查询
     WAYBILL = 3, // 运单号查询
     RECIPIENT = 4, // 收件人查询
   }
   ```

2. **查询表单接口**

   ```typescript
   interface SearchForm {
     content: string; // 搜索内容
     searchType: number; // 搜索类型
     startInCabinetDate?: Date; // 入柜开始时间
     endInCabinetDate?: Date; // 入柜结束时间
     stayDaysList?: number; // 滞留天数
     selected?: boolean; // 是否选中
   }
   ```

3. **包裹信息接口**

   ```typescript
   interface PackageInfo {
     waybillNumber: string; // 运单号
     courier: string; // 快递公司
     notificationStatus: string; // 通知状态
     pickupCode: string; // 取件码
     recipientInfo: {
       name: string; // 收件人姓名
       phone: string; // 收件人电话
     };
     packageStatus: {
       status: string; // 包裹状态
       date: string; // 状态日期
       time: string; // 状态时间
     };
   }
   ```

## 安装和运行

1. 安装依赖：

```bash
bun install
```

2. 运行服务：

```bash
bun run index.ts
```

## API 使用示例

### 查询快递信息

```bash
curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/json" \
  -d '{
    "content": "12345678",
    "searchType": 3,
    "startInCabinetDate": "2024-04-07"
  }'
```

## 注意事项

1. 项目使用了浏览器自动化，首次运行时会在项目根目录创建 `user_data` 文件夹存储浏览器数据
2. 服务默认以非无头模式运行，可以在 `server.ts` 中修改 `headless` 配置
3. 确保系统中已安装 Bun 运行时环境

## 开发建议

1. 使用 TypeScript 严格模式确保类型安全
2. 遵循项目既定的错误处理机制
3. 注意浏览器实例的资源管理
4. 建议在开发环境中使用非无头模式便于调试
