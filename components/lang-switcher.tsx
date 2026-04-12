"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Language = {
  code: string;
  name: string;
};

export function LanguageSwitcher({
  currentLang,
  languages,
}: {
  currentLang: string;
  languages: Language[];
}) {
  const pathname = usePathname();
  const pathWithoutLang = pathname.replace(/^\/[^/]+/, "") || "/";

  return (
    <div className="flex flex-wrap gap-2">
      {languages.map((language) => (
        <Link
          key={language.code}
          href={`/${language.code}${pathWithoutLang === "/" ? "" : pathWithoutLang}`}
          className={`rounded-md border px-3 py-1 text-sm ${
            language.code === currentLang ? "bg-primary text-primary-foreground" : "bg-background"
          }`}
        >
          {language.name}
        </Link>
      ))}
    </div>
  );
}
