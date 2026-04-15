"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  status: string;
  totalCents: number;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    unitCents: number;
    product: {
      name: Record<string, string>;
    };
  }>;
}

async function fetchUserOrders(userId: string) {
  const response = await fetch(`/api/users/orders?userId=${userId}`);
  if (!response.ok) throw new Error("Failed to fetch orders");
  return (await response.json()) as { data: Order[] };
}

export function OrderHistory({ userId, lang }: { userId: string; lang: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userOrders", userId],
    queryFn: () => fetchUserOrders(userId),
  });

  const translations = {
    en: {
      title: "Order History",
      noOrders: "No orders yet",
      orderId: "Order ID",
      status: "Status",
      total: "Total",
      items: "Items",
      date: "Date",
      view: "View Details",
      loading: "Loading orders...",
      error: "Failed to load orders",
    },
    "zh-CN": {
      title: "订单历史",
      noOrders: "暂无订单",
      orderId: "订单ID",
      status: "状态",
      total: "总计",
      items: "商品数",
      date: "日期",
      view: "查看详情",
      loading: "加载中...",
      error: "加载失败",
    },
  };

  const t = translations[lang as keyof typeof translations] || translations.en;

  if (isLoading) return <p className="text-muted-foreground">{t.loading}</p>;
  if (isError) return <p className="text-destructive">{t.error}</p>;
  if (!data?.data || data.data.length === 0) {
    return (
      <div className="rounded-lg border border-border/70 bg-white p-6 text-center shadow-sm">
        <p className="text-muted-foreground">{t.noOrders}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t.title}</h2>
      {data.data.map((order) => (
        <div
          key={order.id}
          className="rounded-lg border border-border/70 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">{t.orderId}</p>
                  <p className="font-mono text-sm">{order.id.slice(0, 8)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">{t.status}</p>
                  <p className="capitalize text-sm font-medium">{order.status}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">{t.total}</p>
                  <p className="font-bold">${(order.totalCents / 100).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">{t.date}</p>
                  <p className="text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <Link href={`/${lang}/order-confirmation?orderId=${order.id}`}>
              <Button variant="outline" size="sm">
                {t.view}
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

