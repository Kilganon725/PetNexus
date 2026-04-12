# PetNexus

国际化宠物综合服务平台（Next.js 14 + TypeScript + Tailwind + Prisma + PostgreSQL + Redis）。

## 已实现骨架

- `/[lang]/...` 多语言路由（默认 `zh-CN/en/fr`，支持后台新增语言）
- 数据库存储翻译词条（`translations.values` 为 JSON）
- 后台语言管理页面：`/[lang]/admin/languages`
- 翻译 API：新增/查询/导入/导出（JSON/CSV）
- 宠物模块：列表页 + 地图（React Leaflet + OSM）
- 商城模块：商品 API + Zustand 购物车 + React Query
- 狗牌模块：基础设计表单 + 图片上传（Sharp 服务器压缩）
- 会员模块：订阅计划展示 + Stripe/PayPal 下单 API 骨架

## 技术栈

- 前端：Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn 风格组件
- 状态：Zustand, TanStack Query
- 地图：React Leaflet + OpenStreetMap
- 后端：Next.js Route Handlers
- 数据：PostgreSQL + Prisma, Redis（预留）
- 支付：Stripe, PayPal
- 图片：Sharp（服务端压缩）

## 启动方式

1. 安装依赖

```bash
npm install
```

2. 配置环境变量

```bash
cp .env.example .env.local
```

3. 生成 Prisma Client

```bash
npm run prisma:generate
```

4. 本地迁移（需要本地 PostgreSQL）

```bash
npm run prisma:migrate -- --name init
```

5. 启动开发服务器

```bash
npm run dev
```

## 主要 API

- `GET/POST /api/languages`
- `GET/POST /api/translations`
- `GET /api/translations/export?format=json|csv`
- `POST /api/translations/import`
- `GET/POST /api/pets`
- `GET/POST /api/products`
- `POST /api/images/compress`
- `POST /api/payments/stripe-intent`
- `POST /api/payments/paypal-order`

## 数据模型

`prisma/schema.prisma` 包含：

- `Language`
- `Translation`
- `Pet`
- `Product`
- `Order` / `OrderItem`
- `DogTagDesign`
- `MembershipPlan`
- `UserMembership`
