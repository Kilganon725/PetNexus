# 🛍️ PetNexus 购物功能完整指南

## 功能概览

PetNexus 现在拥有完整的电商购物系统，包括：

✅ **产品展示** - 产品网格列表  
✅ **购物车** - 添加/删除/编辑商品数量  
✅ **结账流程** - 收货地址和支付方式选择  
✅ **支付集成** - Stripe 和 PayPal 支付  
✅ **订单管理** - 订单确认和历史记录  

---

## 📂 文件结构

### 页面 (Pages)
```
app/[lang]/
├── shop/              # 商品列表页
├── cart/              # 购物车页
├── checkout/          # 结账页
├── payment/
│   ├── stripe/        # Stripe 支付页
│   └── paypal/        # PayPal 支付页
└── order-confirmation/ # 订单确认页
```

### 组件 (Components)
```
components/shop/
├── product-grid.tsx       # 产品列表
├── cart-items.tsx         # 购物车商品列表
├── cart-summary.tsx       # 购物车总结
├── cart-badge.tsx         # 购物车徽章（可在导航栏使用）
├── checkout-form.tsx      # 结账表单
└── order-history.tsx      # 订单历史
```

### API 路由
```
app/api/
├── products/              # 获取产品列表
├── orders/                # 创建和获取订单
│   └── update/            # 更新订单状态
├── users/
│   └── orders/            # 获取用户订单
└── payments/
    ├── stripe-intent/     # 创建 Stripe PaymentIntent
    └── paypal-order/      # 创建 PayPal 订单
```

---

## 🚀 使用流程

### 1. 访问商店
```
访问: /{lang}/shop
- 浏览所有产品
- 点击"Add to cart"添加商品
- 购物车徽章显示商品数量
```

### 2. 查看购物车
```
访问: /{lang}/cart
- 查看所有购物车商品
- 编辑数量（增加/减少）
- 删除商品
- 查看总价（包含税费和运费）
- 点击"Proceed to Checkout"
```

### 3. 结账
```
访问: /{lang}/checkout
- 填写配送地址
- 输入个人信息（邮箱、姓名）
- 选择支付方式（Stripe 或 PayPal）
- 点击"Proceed to Payment"
```

### 4. 支付
```
Stripe: /{lang}/payment/stripe
- 使用 Stripe Embedded Checkout
- 支持多种支付方式

PayPal: /{lang}/payment/paypal
- 使用 PayPal 按钮
- 快速支付体验
```

### 5. 订单确认
```
访问: /{lang}/order-confirmation
- 显示订单ID和总金额
- 列出所有订单商品
- 提供继续购物或返回首页选项
```

---

## 📊 数据模型

### Product (产品)
```typescript
{
  id: string
  sku: string (唯一)
  name: Record<string, string>        // 多语言
  description?: Record<string, string>
  priceCents: number
  currency: string
  stock: number
  imageUrl?: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Order (订单)
```typescript
{
  id: string
  userId: string (可选)
  status: OrderStatus         // PENDING, PAID, FULFILLED, etc.
  totalCents: number
  currency: string
  stripeIntentId?: string
  paypalOrderId?: string
  createdAt: DateTime
  updatedAt: DateTime
  items: OrderItem[]
}
```

### OrderItem (订单项)
```typescript
{
  id: string
  orderId: string
  productId: string
  quantity: number
  unitCents: number
  createdAt: DateTime
}
```

---

## 🛒 购物车存储 (Zustand)

购物车使用 Zustand 状态管理，数据持久化到 LocalStorage：

```typescript
// 使用示例
import { useCartStore } from "@/stores/cart-store";

const items = useCartStore((state) => state.items);
const totalCents = useCartStore((state) => state.totalCents);
const itemCount = useCartStore((state) => state.itemCount);

// 添加商品
useCartStore.getState().addItem({ 
  productId: "123", 
  name: "Product Name", 
  priceCents: 2999 
});

// 删除商品
useCartStore.getState().removeItem("123");

// 更新数量
useCartStore.getState().updateQuantity("123", 5);

// 清空购物车
useCartStore.getState().clearCart();
```

---

## 💳 支付集成

### Stripe
需要配置环境变量：
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
```

API: `POST /api/payments/stripe-intent`
- 请求: `{ amount: 2999, currency: "usd" }`
- 返回: `{ clientSecret: "pi_..." }`

### PayPal
需要配置环境变量：
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

API: `POST /api/payments/paypal-order`
- 请求: `{ amount: "29.99", currency: "USD" }`
- 返回: `{ id: "...", status: "CREATED" }`

---

## 📋 API 端点

### 获取产品列表
```
GET /api/products
返回: { data: Product[] }
```

### 创建订单
```
POST /api/orders
请求体:
{
  items: [{ productId, quantity, unitCents }],
  totalCents: number,
  email: string,
  name: string,
  address: string,
  city: string,
  postalCode: string,
  country: string,
  paymentMethod: "stripe" | "paypal"
}
返回: { orderId, totalCents, items }
```

### 获取订单
```
GET /api/orders?orderId={orderId}
返回: { data: Order }
```

### 更新订单状态
```
PATCH /api/orders/update
请求体:
{
  orderId: string,
  status: OrderStatus,
  stripeIntentId?: string,
  paypalOrderId?: string
}
返回: { data: Order }
```

### 获取用户订单
```
GET /api/users/orders?userId={userId}
返回: { data: Order[] }
```

---

## 🎨 多语言支持

所有组件都支持多语言（英文、中文等）：

```typescript
const translations = {
  en: { key: "English text" },
  "zh-CN": { key: "中文文本" }
};

const t = translations[lang as keyof typeof translations] || translations.en;
```

---

## 💰 定价计算

### 购物车总价
```
小计 = Σ(商品价格 × 数量)
税费 = 小计 × 10%
运费 = $5.00
总计 = 小计 + 税费 + 运费
```

---

## 🔒 安全特性

- ✅ 表单验证（Zod）
- ✅ 订单创建在服务器端
- ✅ 支付敏感信息处理
- ✅ CORS 和安全头

---

## 🐛 常见问题

### Q: 如何添加新产品？
A: 使用 `POST /api/products` 端点或直接通过 Prisma Studio 添加。

### Q: 购物车数据在哪里存储？
A: 购物车数据存储在浏览器的 LocalStorage 中，使用 Zustand 管理。

### Q: 如何处理支付失败？
A: 支付失败时会显示错误消息，用户可以返回结账页面重试。

### Q: 是否支持优惠券？
A: 目前不支持，但可以通过修改 `CartSummary` 组件添加优惠券功能。

---

## 📝 后续改进建议

- [ ] 添加优惠券/促销码支持
- [ ] 实现库存管理和预警
- [ ] 添加订单追踪功能
- [ ] 实现退货/退款流程
- [ ] 添加评价/评论系统
- [ ] 优化支付流程和安全性
- [ ] 添加购物车持久化到数据库
- [ ] 实现推荐产品系统

---

## 📞 技术支持

如有问题，请检查：
1. 环境变量配置
2. 数据库连接
3. 支付提供商密钥
4. 浏览器控制台错误

---

**祝你购物愉快！🎉**

