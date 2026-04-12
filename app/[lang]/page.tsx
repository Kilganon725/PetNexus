import Link from "next/link";

import { translate, getDictionary } from "@/lib/i18n";

export default async function DashboardPage({ params }: { params: { lang: string } }) {
  const dictionary = await getDictionary(params.lang);

  return (
    <section className="grid gap-4">
      <div className="rounded-md border p-6">
        <h1 className="text-2xl font-semibold">{translate(dictionary, "home.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{translate(dictionary, "home.subtitle")}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Link href={`/${params.lang}/pets`} className="rounded-md border p-4 hover:bg-muted">
          {translate(dictionary, "nav.pets")}
        </Link>
        <Link href={`/${params.lang}/shop`} className="rounded-md border p-4 hover:bg-muted">
          {translate(dictionary, "nav.shop")}
        </Link>
        <Link href={`/${params.lang}/designer`} className="rounded-md border p-4 hover:bg-muted">
          {translate(dictionary, "nav.designer")}
        </Link>
        <Link href={`/${params.lang}/membership`} className="rounded-md border p-4 hover:bg-muted">
          {translate(dictionary, "nav.membership")}
        </Link>
      </div>
    </section>
  );
}
