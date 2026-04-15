# 🏗️ PetNexus 购物系统架构

## 系统架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│                           客户端 (Frontend)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────┐  ┌─────────────┐  ┌──────────────┐               │
│  │  Shop Page    │  │  Cart Page  │  │ Checkout     │               │
│  │  /shop        │  │  /cart      │  │ /checkout    │               │
│  └───────┬───────┘  └──────┬──────┘  └──────┬───────┘               │
│          │                  │                 │                       │
│  ┌───────▼──────────────────▼─────────────────▼──────────────┐       │
│  │              Zustand Cart Store                           │       │
│  │  • addItem() • removeItem() • clearCart() • totalCents() │       │
│  │  • updateQuantity() • itemCount()                        │       │
│  └───────┬──────────────────────────────────────────────────┘       │
│          │                                                            │
│  ┌───────▼──────────────────┬──────────────────┬─────────────────┐  │
│  │   ProductGrid            │   CartItems      │   CartSummary   │  │
│  │  • Fetch products        │  • List items    │  • Show total   │  │
│  │  • Display items         │  • Edit qty      │  • Tax calc     │  │
│  │  • Add to cart           │  • Delete item   │  • Shipping     │  │
│  └──────────────────────────┴──────────────────┴─────────────────┘  │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐            │
│  │ Stripe Page  │  │ PayPal Page  │  │ OrderConfirmation
│  │ Payment      │  │ Payment      │  │ Success page    │            │
│  └──────┬───────┘  └──────┬───────┘  └─────────────────┘            │
│         │                  │                                          │
└─────────┼──────────────────┼──────────────────────────────────────────┘
          │                  │
          │ HTTP Requests    │
          ▼                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API 服务器 (Backend)                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │              API Endpoints (Next.js Routes)                │     │
│  ├────────────────────────────────────────────────────────────┤     │
│  │                                                             │     │
│  │  GET  /api/products              → 获取产品列表           │     │
│  │  POST /api/products              → 创建产品              │     │
│  │  POST /api/orders                → 创建订单              │     │
│  │  GET  /api/orders?orderId=...    → 获取订单              │     │
│  │  PATCH /api/orders/update        → 更新订单状态          │     │
│  │  GET  /api/users/orders          → 获取用户订单          │     │
│  │  POST /api/payments/stripe-intent → Stripe Payment      │     │
│  │  POST /api/payments/paypal-order → PayPal Payment       │     │
│  │                                                             │     │
│  └────────┬───────────────────────────────────────────────────┘     │
│           │                                                           │
│  ┌────────▼──────────────────────────────────────────────────┐     │
│  │            业务逻辑 (Business Logic)                       │     │
│  ├────────────────────────────────────────────────────────────┤     │
│  │  • 价格计算 (Price Calculation)                           │     │
│  │  • 库存验证 (Inventory Check)                             │     │
│  │  • 订单验证 (Order Validation)                            │     │
│  │  • 支付处理 (Payment Processing)                          │     │
│  │  • 多语言处理 (i18n)                                      │     │
│  └────────┬──────────────────────────────────────────────────┘     │
│           │                                                           │
│  ┌────────▼──────────────────────────────────────────────────┐     │
│  │         外部服务集成 (External Services)                   │     │
│  ├────────────────────────────────────────────────────────────┤     │
│  │                                                             │     │
│  │  ┌──────────────┐      ┌──────────────┐                  │     │
│  │  │   Stripe     │      │   PayPal     │                  │     │
│  │  │  • Intent    │      │  • Orders    │                  │     │
│  │  │  • Webhook   │      │  • Capture   │                  │     │
│  │  └──────────────┘      └──────────────┘                  │     │
│  │                                                             │     │
│  └────────┬──────────────────────────────────────────────────┘     │
│           │                                                           │
│  ┌────────▼──────────────────────────────────────────────────┐     │
│  │           数据库 (Database Layer)                          │     │
│  ├────────────────────────────────────────────────────────────┤     │
│  │                                                             │     │
│  │  Prisma ORM ◄──────────► PostgreSQL                       │     │
│  │                                                             │     │
│  │  Tables:                                                   │     │
│  │  • products         • orders      • order_items           │     │
│  │  • users            • memberships                         │     │
│  │                                                             │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 数据流 (Data Flow)

### 1️⃣ 添加商品到购物车

```
用户点击 "Add to Cart"
         │
         ▼
ProductGrid 组件
         │
         ├─ 获取产品信息
         └─ 调用 useCartStore.addItem()
                │
                ▼
         Zustand Store 更新
                │
                ├─ 检查商品是否已存在
                ├─ 如果存在 → 数量 +1
                └─ 如果不存在 → 添加新商品
                │
                ▼
         LocalStorage 持久化
                │
                ▼
         UI 更新 (购物车徽章)
```

### 2️⃣ 结账流程

```
用户填写结账表单
         │
         ▼
CheckoutForm 验证
         │
         ├─ 表单数据验证 (Zod)
         ├─ 购物车验证
         └─ 金额验证
                │
                ▼
         调用 /api/orders (POST)
                │
                ▼
         服务器创建订单
                │
                ├─ 创建 Order 记录
                ├─ 创建 OrderItem 记录
                └─ 验证库存
                │
                ▼
         返回 orderId + totalCents
                │
                ▼
         根据支付方式选择:
         ├─ Stripe → /api/payments/stripe-intent
         │           │
         │           └─ 返回 clientSecret
         │                   │
         │                   └─ 跳转 /payment/stripe
         │
         └─ PayPal → /api/payments/paypal-order
                     │
                     └─ 返回 orderId
                             │
                             └─ 跳转 /payment/paypal
```

### 3️⃣ 支付和订单确认

```
Stripe Flow:
  Stripe Payment    清空购物车    显示成功
  │                 │             │
  └─ Webhook ──► /api/orders/update ──► /order-confirmation

PayPal Flow:
  PayPal Order      清空购物车    显示成功
  │                 │             │
  └─ 用户批准 ──► /order-confirmation
```

---

## 组件树 (Component Tree)

```
app/[lang]/
├── shop/page.tsx
│   └── ProductGrid
│       ├── Button (Add to cart)
│       └── useCartStore
│
├── cart/page.tsx
│   ├── CartItems
│   │   ├── 商品列表
│   │   └── 数量控制
│   ├── CartSummary
│   │   ├── 小计
│   │   ├── 税费
│   │   └── 运费
│   └── 导航按钮
│
├── checkout/page.tsx
│   ├── CheckoutForm
│   │   ├── 地址输入
│   │   ├── 个人信息
│   │   └── 支付方式选择
│   ├── CartSummary
│   └── 导航按钮
│
├── payment/stripe/page.tsx
│   └── EmbeddedCheckout
│
├── payment/paypal/page.tsx
│   └── PayPalButtons
│
└── order-confirmation/page.tsx
    ├── 订单信息
    ├── 商品列表
    └── 导航按钮
```

---

## 状态管理 (State Management)

### 购物车状态 (Cart State)

```typescript
interface CartState {
  items: CartItem[];
  
  // Actions
  addItem(item, quantity?) → void
  removeItem(productId) → void
  updateQuantity(productId, qty) → void
  clearCart() → void
  
  // Selectors
  totalCents() → number
  itemCount() → number
}

// 存储位置: LocalStorage
// 键名: "petnexus-cart"
// 库: Zustand
```

### 服务器状态 (Server State)

```typescript
// 订单状态
interface Order {
  id: string
  status: OrderStatus  // PENDING, PAID, FULFILLED, etc.
  totalCents: number
  items: OrderItem[]
}

// 支付状态
interface PaymentState {
  stripeIntentId?: string
  paypalOrderId?: string
}
```

---

## 错误处理 (Error Handling)

```
用户操作
   │
   ▼
输入验证 (Zod)
   │
   ├─ 成功 ──► 继续
   │
   └─ 失败 ──► 显示错误提示
                 │
                 └─ 用户重新输入

API 调用
   │
   ├─ 200 ──► 成功处理
   ├─ 400 ──► 数据错误 (显示提示)
   ├─ 404 ──► 资源未找到
   ├─ 500 ──► 服务器错误 (显示提示)
   │
   └─ Error ──► 网络错误 (显示提示)
```

---

## 安全层 (Security Layers)

```
┌─────────────────────────────────────────┐
│        输入验证 (Input Validation)       │
│  • Zod Schema 验证                      │
│  • 类型检查                             │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│    业务逻辑验证 (Business Logic)        │
│  • 库存检查                             │
│  • 价格验证                             │
│  • 权限检查                             │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│      数据库验证 (Database Level)        │
│  • 关键约束                             │
│  • 外键关系                             │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│      外部服务验证 (External APIs)       │
│  • Stripe/PayPal 验证                   │
│  • Webhook 签名                         │
└─────────────────────────────────────────┘
```

---

## 性能优化 (Performance)

```
┌──────────────────────────────────────┐
│      前端缓存 (Frontend Caching)      │
├──────────────────────────────────────┤
│  • React Query (API 缓存)            │
│  • LocalStorage (购物车)             │
│  • Zustand (状态管理)                │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│      后端优化 (Backend)              │
├──────────────────────────────────────┤
│  • API 速率限制                      │
│  • 数据库索引                        │
│  • Lazy Loading                      │
│  • 分页查询                          │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│      传输优化 (Transmission)         │
├──────────────────────────────────────┤
│  • gzip 压缩                         │
│  • CDN (图片)                        │
│  • 代码分割                          │
└──────────────────────────────────────┘
```

---

## 部署架构 (Deployment)

```
┌─────────────────────────────────────────┐
│          CDN (Vercel)                   │
│  • 静态资源                             │
│  • 图片优化                             │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│      Next.js 应用 (Vercel)              │
│  • SSR/SSG                              │
│  • API Routes                           │
│  • 中间件                               │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│     PostgreSQL 数据库                   │
│  (Heroku Postgres / Railway)            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│    支付网关 (Stripe / PayPal)           │
│  • 支付处理                             │
│  • Webhook 回调                         │
└─────────────────────────────────────────┘
```

---

## 扩展性 (Scalability)

为了支持更大的规模，可以考虑：

```
1. 数据库优化
   • 添加缓存层 (Redis)
   • 数据库分片
   • 只读副本

2. 应用层扩展
   • 水平扩展 (多个实例)
   • 负载均衡
   • 消息队列 (订单处理)

3. API 优化
   • GraphQL (替代 REST)
   • 速率限制
   • 版本控制

4. 存储优化
   • 文件存储 (S3)
   • CDN 集成
   • 图片优化
```

---

## 总结

PetNexus 购物系统采用**现代全栈架构**：

✅ **前端**: React + Next.js + Tailwind  
✅ **状态管理**: Zustand (客户端) + Zustand (服务器状态)  
✅ **后端**: Next.js API Routes  
✅ **数据库**: PostgreSQL + Prisma ORM  
✅ **支付**: Stripe + PayPal  
✅ **部署**: Vercel (推荐)  

该架构具有**高可用性**、**可扩展性**和**安全性**。

---

**架构设计完成！🏗️**

