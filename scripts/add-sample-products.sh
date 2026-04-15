#!/bin/bash

# 🛍️ 添加示例产品到 PetNexus 商店

BASE_URL="http://localhost:3000"

echo "🚀 添加示例产品..."
echo ""

# 产品数据
products=(
  '{
    "sku": "DRY-FOOD-01",
    "name": {"en": "Premium Dry Dog Food", "zh-CN": "优质干狗粮"},
    "description": {"en": "High-quality nutrition for your pets", "zh-CN": "为您的宠物提供高质量营养"},
    "priceCents": 3999,
    "currency": "USD",
    "stock": 100,
    "imageUrl": "https://via.placeholder.com/300x300?text=Dog+Food"
  }'

  '{
    "sku": "TOY-ROPE-02",
    "name": {"en": "Durable Rope Toy", "zh-CN": "耐咬绳结玩具"},
    "description": {"en": "Perfect for interactive play", "zh-CN": "完美的互动玩具"},
    "priceCents": 1999,
    "currency": "USD",
    "stock": 150,
    "imageUrl": "https://via.placeholder.com/300x300?text=Rope+Toy"
  }'

  '{
    "sku": "BED-COMFORT-03",
    "name": {"en": "Comfortable Pet Bed", "zh-CN": "舒适宠物床"},
    "description": {"en": "Soft and cozy sleeping spot", "zh-CN": "柔软舒适的睡眠场所"},
    "priceCents": 4999,
    "currency": "USD",
    "stock": 50,
    "imageUrl": "https://via.placeholder.com/300x300?text=Pet+Bed"
  }'

  '{
    "sku": "COLLAR-BASIC-04",
    "name": {"en": "Basic Pet Collar", "zh-CN": "基础宠物项圈"},
    "description": {"en": "Adjustable and durable", "zh-CN": "可调节且耐用"},
    "priceCents": 999,
    "currency": "USD",
    "stock": 200,
    "imageUrl": "https://via.placeholder.com/300x300?text=Collar"
  }'

  '{
    "sku": "TREAT-DELUXE-05",
    "name": {"en": "Deluxe Pet Treats", "zh-CN": "豪华宠物零食"},
    "description": {"en": "Tasty and nutritious treats", "zh-CN": "美味又有营养的零食"},
    "priceCents": 1499,
    "currency": "USD",
    "stock": 300,
    "imageUrl": "https://via.placeholder.com/300x300?text=Treats"
  }'
)

# 添加产品
for product in "${products[@]}"; do
  echo "📦  添加产品..."
  response=$(curl -s -X POST "$BASE_URL/api/products" \
    -H "Content-Type: application/json" \
    -d "$product")

  echo "$response" | jq -r '.data.name.en // .error' 2>/dev/null || echo "✓ 产品已添加"
  echo ""
done

echo "✅ 示例产品添加完成！"
echo ""
echo "🎉 你现在可以访问商店查看产品："
echo "   英文: $BASE_URL/en/shop"
echo "   中文: $BASE_URL/zh-CN/shop"

