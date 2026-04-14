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
  { key: "nav.auth", href: "/auth" },
];

export function MainNav({
  lang,
  dictionary,
}: {
  lang: string;
  dictionary: Record<string, string>;
}) {
  return (
    <nav className="flex flex-wrap gap-2">
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
    </nav>
  );
}
