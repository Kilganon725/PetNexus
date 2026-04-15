"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const languageOptions: Array<{ code: string; nativeName: string }> = [
  { code: "zh-CN", nativeName: "中文" },
  { code: "en", nativeName: "English" },
  { code: "fr", nativeName: "Français" },
  { code: "de", nativeName: "Deutsch" },
  { code: "ru", nativeName: "Русский" },
  { code: "ar", nativeName: "العربية" },
];

export function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const pathname = usePathname();
  const pathWithoutLang = pathname.replace(/^\/[^/]+/, "") || "/";
  const currentLanguage = languageOptions.find((language) => language.code === currentLang) ?? languageOptions[1];

  return (
    <div className="group relative">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md border border-border bg-white/80 px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm transition hover:bg-white"
      >
        语言
        <span className="text-xs font-medium text-muted-foreground">{currentLanguage.nativeName}</span>
      </button>

      <div className="invisible absolute right-0 top-full z-20 mt-2 w-40 rounded-md border border-border bg-white p-1 opacity-0 shadow-md transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        {languageOptions.map((language) => (
          <Link
            key={language.code}
            href={`/${language.code}${pathWithoutLang === "/" ? "" : pathWithoutLang}`}
            className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
              language.code === currentLang
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted"
            }`}
          >
            {language.nativeName}
          </Link>
        ))}
      </div>
    </div>
  );
}
