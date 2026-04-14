import { AuthForm } from "@/components/auth/auth-form";

export default function AuthPage() {
  return (
    <section className="grid gap-6">
      <div className="rounded-md border border-border/70 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">账号中心</h1>
        <p className="mt-2 text-sm text-muted-foreground">支持邮箱注册与登录，登录状态通过 HttpOnly Cookie 维持。</p>
      </div>
      <AuthForm />
    </section>
  );
}
