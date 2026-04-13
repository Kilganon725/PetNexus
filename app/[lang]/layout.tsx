import type { ReactNode } from "react";

import { LanguageSwitcher } from "@/components/lang-switcher";
import { MainNav } from "@/components/navigation/main-nav";
import { getDictionary, getEnabledLanguages } from "@/lib/i18n";

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { lang: string };
}) {
  const languages = await getEnabledLanguages();
  const dictionary = await getDictionary(params.lang);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-5 md:py-8">
      <header className="flex flex-col gap-4 rounded-md border border-border/70 bg-white/75 p-4 shadow-sm backdrop-blur md:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">PetNexus</p>
            <h1 className="text-lg font-semibold">Global Pet Service Platform</h1>
          </div>
          <LanguageSwitcher currentLang={params.lang} languages={languages} />
        </div>
        <MainNav lang={params.lang} dictionary={dictionary} />
      </header>
      <main className="flex flex-col gap-8 pb-6">{children}</main>
    </div>
  );
}
