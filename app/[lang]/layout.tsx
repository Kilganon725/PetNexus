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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6">
      <header className="flex flex-col gap-4 rounded-md border p-4">
        <MainNav lang={params.lang} dictionary={dictionary} />
        <LanguageSwitcher currentLang={params.lang} languages={languages} />
      </header>
      <main className="flex flex-col gap-6">{children}</main>
    </div>
  );
}
