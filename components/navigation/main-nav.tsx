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
    <nav className="flex flex-wrap gap-2">
      {navItems.map((item) => (
        <Link
          key={item.key}
          href={`/${lang}${item.href}`}
          className="rounded-md border border-border px-3 py-1 text-sm hover:bg-muted"
        >
          {dictionary[item.key] ?? item.key}
        </Link>
      ))}
      <Link
        href={`/${lang}/admin/languages`}
        className="rounded-md border border-border px-3 py-1 text-sm hover:bg-muted"
      >
        Admin
      </Link>
    </nav>
  );
}
