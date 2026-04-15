# 🛍️ PetNexus 购物功能 - 快速参考卡片

## 📋 文件快速导航

### 🔗 核心路由
```
商店          /[lang]/shop
购物车        /[lang]/cart
结账          /[lang]/checkout
支付 (Stripe) /[lang]/payment/stripe
支付 (PayPal) /[lang]/payment/paypal
订单确认      /[lang]/order-confirmation
```

### 🎨 主要组件
```
ProductGrid           → 产品列表展示
CartItems             → 购物车商品列表
CartSummary           → 购物车价格汇总
CheckoutForm          → 结账表单
CartBadge             → 购物车徽章
OrderHistory          → 订单历史
```

### 🔌 API 端点
```
GET    /api/products
POST   /api/products
POST   /api/orders
GET    /api/orders?orderId=...
PATCH  /api/orders/update
GET    /api/users/orders?userId=...
POST   /api/payments/stripe-intent
POST   /api/payments/paypal-order
```

---

## ⚙️ 状态管理

### Zustand Store (cart-store.ts)
```typescript
// 添加商品
useCartStore.getState().addItem({
  productId: "123",
  name: "Product",
  priceCents: 2999
})

// 移除商品
useCartStore.getState().removeItem("123")

// 更新数量
useCartStore.getState().updateQuantity("123", 5)

// 清空购物车
useCartStore.getState().clearCart()

// 获取总价
useCartStore.getState().totalCents() // 返回数字 (美分)

// 获取商品数量
useCartStore.getState().itemCount() // 返回数字
```

---

## 🔐 环境变量

```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# 数据库
DATABASE_URL=postgresql://...
```

---

## 📦 数据模型

### Product
```typescript
{
  id: string
  sku: string (唯一)
  name: { en: string, "zh-CN": string }
  description?: { en: string, "zh-CN": string }
  priceCents: number
  currency: string
  stock: number
  imageUrl?: string
}
```

### Order
```typescript
{
  id: string
  userId?: string
  status: "PENDING" | "PAID" | "FULFILLED" | "REFUNDED" | "CANCELED"
  totalCents: number
  currency: string
  stripeIntentId?: string
  paypalOrderId?: string
  items: OrderItem[]
  createdAt: Date
}
```

### CartItem
```typescript
{
  productId: string
  name: string
  priceCents: number
  quantity: number
}
```

---

## 💻 常用代码片段

### 1. 在组件中使用购物车

```typescript
import { useCartStore } from "@/stores/cart-store";

export function MyComponent() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const totalCents = useCartStore((state) => state.totalCents);

  return (
    <div>
      <p>商品数: {items.length}</p>
      <p>总价: ${(totalCents() / 100).toFixed(2)}</p>
      <button onClick={() => addItem({ ... })}>
        添加
      </button>
    </div>
  );
}
```

### 2. 创建订单

```typescript
const response = await fetch("/api/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    items: [{ productId: "123", quantity: 2, unitCents: 2999 }],
    totalCents: 5998,
    email: "user@example.com",
    name: "John Doe",
    address: "123 Main St",
    city: "City",
    postalCode: "12345",
    country: "Country",
    paymentMethod: "stripe"
  })
});
```

### 3. 获取订单

```typescript
const response = await fetch(`/api/orders?orderId=${orderId}`);
const { data: order } = await response.json();
```

### 4. 更新订单状态

```typescript
const response = await fetch("/api/orders/update", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    orderId: "order-123",
    status: "PAID",
    stripeIntentId: "pi_..."
  })
});
```

### 5. 创建 Stripe Payment Intent

```typescript
const response = await fetch("/api/payments/stripe-intent", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    amount: 5998,
    currency: "usd"
  })
});
const { clientSecret } = await response.json();
```

---

## 🎨 多语言文本

### 添加新语言

```typescript
const translations = {
  en: {
    title: "Shopping Cart",
    total: "Total",
  },
  "zh-CN": {
    title: "购物车",
    total: "总计",
  },
  // 添加新语言
  "fr": {
    title: "Panier",
    total: "Total",
  },
};

const t = translations[lang as keyof typeof translations] || translations.en;
```

---

## 🔍 调试技巧

### 1. 检查购物车数据
```javascript
// 在浏览器控制台中
localStorage.getItem("petnexus-cart")
```

### 2. 查看 API 响应
```typescript
// 添加日志
const response = await fetch("/api/orders");
console.log("Response:", await response.clone().json());
```

### 3. 检查 Prisma 数据
```bash
npm run prisma:studio
```

### 4. 检查 Redux DevTools (Zustand)
```typescript
// 使用 Zustand devtools 中间件 (可选)
import { devtools } from "zustand/middleware";
```

---

## 📱 响应式设计断点

```tailwind
移动设备:  < 768px (default)
平板:      768px - 1024px (md:)
桌面:      > 1024px (lg:)
```

示例:
```jsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* 响应式布局 */}
</div>
```

---

## ⚡ 性能优化

### 1. 使用 React Query 缓存
```typescript
const { data } = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
  staleTime: 5 * 60 * 1000 // 5分钟
});
```

### 2. 避免不必要的重新渲染
```typescript
// 使用选择器而不是获取整个状态
const items = useCartStore((state) => state.items);
```

### 3. 使用 useMemo
```typescript
const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);
```

---

## 🧪 测试常用命令

```bash
# 运行测试
npm test

# 运行具体测试
npm test -- shopping.test.ts

# 查看覆盖率
npm test -- --coverage

# 生成验证报告
bash VERIFICATION_REPORT.sh

# 测试 API
bash test-shopping.sh

# 添加示例数据
bash scripts/add-sample-products.sh
```

---

## 🚨 常见错误解决

| 错误 | 解决方案 |
|------|--------|
| DATABASE_URL not found | 检查 `.env.local` 是否配置 |
| Stripe key invalid | 确保使用测试密钥，不是生产密钥 |
| PayPal auth failed | 检查 Client ID 和 Secret |
| Order creation failed | 检查数据库连接和订单数据格式 |
| Payment failed | 检查支付提供商配置和测试卡号 |

---

## 📚 文件大小参考

```
cart-summary.tsx       80 行   (汇总信息)
cart-items.tsx        106 行   (项目列表)
checkout-form.tsx     214 行   (结账表单)
orders/route.ts       127 行   (订单 API)
SHOPPING_GUIDE.md     339 行   (使用指南)
ARCHITECTURE.md       425 行   (架构设计)

总计               > 3200 行
```

---

## 🔄 完整流程

```
1. 用户浏览 /shop
2. ProductGrid 加载产品列表 (GET /api/products)
3. 用户点击 "Add to cart"
4. 商品添加到 Zustand store
5. CartBadge 更新显示商品数量
6. 用户进入 /cart
7. CartItems 显示购物车内容
8. 用户点击 "Proceed to Checkout"
9. 进入 /checkout
10. CheckoutForm 收集用户信息
11. 创建订单 (POST /api/orders)
12. 获取支付意图 (POST /api/payments/...)
13. 清空购物车
14. 重定向到支付页面
15. 用户完成支付
16. 显示订单确认页面
17. 用户可查看订单历史
```

---

## 💡 快速技巧

```typescript
// 格式化价格
const formatted = (priceCents: number) => 
  `$${(priceCents / 100).toFixed(2)}`;

// 获取多语言文本
const getText = (obj: Record<string, string>, lang: string) =>
  obj[lang] ?? obj.en ?? Object.values(obj)[0];

// 验证邮箱
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// 计算税费
const calcTax = (amount: number, rate: number = 0.1) =>
  Math.round(amount * rate);

// 延迟函数
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
```

---

## 📞 快速查询

**我怎样...？**

- **...添加商品到购物车？**
  → 查看 `components/shop/product-grid.tsx`

- **...显示购物车？**
  → 访问 `/[lang]/cart`

- **...创建订单？**
  → 查看 `app/api/orders/route.ts`

- **...处理支付？**
  → 查看 `app/[lang]/payment/` 文件夹

- **...获取用户订单？**
  → 使用 `GET /api/users/orders?userId=...`

- **...添加新语言？**
  → 在 translations 对象中添加新键

- **...修改税费计算？**
  → 编辑 `components/shop/cart-summary.tsx`

- **...扩展产品字段？**
  → 修改 `prisma/schema.prisma` 中的 Product 模型

---

## ✨ 下一步

1. ✅ 完成环境变量配置
2. ✅ 运行数据库迁移
3. ✅ 添加示例产品
4. ✅ 启动开发服务器
5. ✅ 测试购物流程
6. ✅ 配置支付网关
7. ✅ 部署到生产环境

---

**编制日期**: 2026年4月16日  
**快速参考版本**: 1.0  
**最后更新**: 2026年4月16日

---

**祝你开发顺利！🚀**

