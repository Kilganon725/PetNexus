"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type Mode = "login" | "register";

type AuthUser = {
  id: string;
  email: string;
  name: string | null;
};

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);

  const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          ...(mode === "register" ? { name } : {}),
        }),
      });

      const data = (await response.json()) as { error?: string; user?: AuthUser };
      if (!response.ok) {
        setError(data.error ?? "Request failed");
        return;
      }

      setUser(data.user ?? null);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <div className="grid gap-4 rounded-md border border-border/70 bg-white p-5 shadow-sm">
      <div className="flex gap-2">
        <button
          type="button"
          className={`rounded-md px-3 py-2 text-sm font-semibold ${mode === "login" ? "bg-primary text-primary-foreground" : "border border-border"}`}
          onClick={() => setMode("login")}
        >
          登录
        </button>
        <button
          type="button"
          className={`rounded-md px-3 py-2 text-sm font-semibold ${mode === "register" ? "bg-primary text-primary-foreground" : "border border-border"}`}
          onClick={() => setMode("register")}
        >
          注册
        </button>
      </div>

      <form onSubmit={submit} className="grid gap-3">
        {mode === "register" ? (
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="昵称（可选）"
            className="rounded-md border border-input px-3 py-2 text-sm"
          />
        ) : null}

        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="邮箱"
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={mode === "register" ? "密码（至少8位）" : "密码"}
          className="rounded-md border border-input px-3 py-2 text-sm"
        />

        <Button type="submit" disabled={loading}>
          {loading ? "提交中..." : mode === "login" ? "登录" : "创建账号"}
        </Button>
      </form>

      {error ? <p className="text-sm text-secondary">{error}</p> : null}
      {user ? (
        <div className="rounded-md border border-border bg-muted p-3 text-sm">
          <p>当前登录：{user.name || user.email}</p>
          <button type="button" className="mt-2 rounded-md border border-border px-3 py-1.5 text-xs font-semibold" onClick={logout}>
            退出登录
          </button>
        </div>
      ) : null}
    </div>
  );
}
