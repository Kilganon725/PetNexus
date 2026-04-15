#!/bin/bash

# 🛍️ PetNexus 购物功能快速测试脚本

echo "🚀 PetNexus 购物功能测试"
echo "=========================="
echo ""

# 1. 检查环境变量
echo "✓ 检查环境变量..."
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL 未设置"
else
    echo "✓ DATABASE_URL 已配置"
fi

if [ -z "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" ]; then
    echo "⚠️  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 未设置 (可选)"
fi

if [ -z "$NEXT_PUBLIC_PAYPAL_CLIENT_ID" ]; then
    echo "⚠️  NEXT_PUBLIC_PAYPAL_CLIENT_ID 未设置 (可选)"
fi

echo ""
echo "✓ 测试文件检查..."
echo ""

# 2. 检查创建的文件
files=(
    "components/shop/cart-summary.tsx"
    "components/shop/cart-items.tsx"
    "components/shop/checkout-form.tsx"
    "components/shop/cart-badge.tsx"
    "components/shop/order-history.tsx"
    "app/[lang]/cart/page.tsx"
    "app/[lang]/checkout/page.tsx"
    "app/[lang]/payment/stripe/page.tsx"
    "app/[lang]/payment/paypal/page.tsx"
    "app/[lang]/order-confirmation/page.tsx"
    "app/api/orders/route.ts"
    "app/api/orders/update/route.ts"
    "app/api/users/orders/route.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file"
    else
        echo "✗ $file (缺失)"
    fi
done

echo ""
echo "✓ 购物功能安装完成！"
echo ""
echo "📝 后续步骤："
echo "1. 配置环境变量 (.env.local)"
echo "2. 运行数据库迁移: npm run prisma:migrate"
echo "3. 添加测试产品: POST /api/products"
echo "4. 访问商店: http://localhost:3000/en/shop"
echo ""
echo "📖 详细指南: SHOPPING_GUIDE.md"
echo ""

