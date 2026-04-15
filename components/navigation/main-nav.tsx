import Link from "next/link";

type NavItem = {
  key: string;
  href: string;
};

const navItems: NavItem[] = [
  { key: "nav.dashboard", href: "" },
  { key: "nav.pets", href: "/pets" },
  { key: "nav.shop", href: "/shop" },
  { key: "nav.designer", href: "/designer" },
  { key: "nav.membership", href: "/membership" },
];

export function MainNav({
  lang,
  dictionary,
}: {
  lang: string;
  dictionary: Record<string, string>;
}) {
  return (
    <nav className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={`/${lang}${item.href}`}
            className="rounded-md border border-transparent bg-white/70 px-3 py-1.5 text-sm font-medium shadow-sm transition hover:border-border hover:bg-white"
          >
            {dictionary[item.key] ?? item.key}
          </Link>
        ))}
        <Link
          href={`/${lang}/admin/languages`}
          className="rounded-md border border-transparent bg-white/70 px-3 py-1.5 text-sm font-medium shadow-sm transition hover:border-border hover:bg-white"
        >
          Admin
        </Link>
      </div>

      <div className="ml-auto">
        <Link
          href={`/${lang}/auth`}
          className="rounded-md border border-border bg-white px-3 py-1.5 text-sm font-semibold shadow-sm transition hover:bg-white/90"
        >
          {dictionary["nav.auth"] ?? "登录/注册"}
        </Link>
      </div>
    </nav>
  );
}
