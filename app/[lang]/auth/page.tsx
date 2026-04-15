import { AuthForm } from "@/components/auth/auth-form";

export default function AuthPage() {
  return (
    <section
      className="relative overflow-hidden rounded-md border border-border/60 p-4 md:p-6"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(8, 18, 20, 0.62), rgba(8, 18, 20, 0.4)), url('/images/mylene2401-chihuahua-9297673_1920.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="grid gap-6">
        <div className="rounded-md border border-white/40 bg-white/30 p-6 text-white shadow-sm backdrop-blur-md">
          <h1 className="text-2xl font-semibold">账号中心</h1>
          <p className="mt-2 text-sm text-white/90">支持邮箱注册与登录，登录状态通过 HttpOnly Cookie 维持。</p>
        </div>
        <AuthForm />
      </div>
    </section>
  );
}
