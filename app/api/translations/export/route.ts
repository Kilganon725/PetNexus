import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

function toCsv(rows: Array<{ key: string; context: string | null; values: Record<string, string> }>) {
  const languageSet = new Set<string>();
  rows.forEach((row) => Object.keys(row.values).forEach((lang) => languageSet.add(lang)));
  const languages = [...languageSet];
  const headers = ["key", "context", ...languages];
  const lines = [headers.join(",")];

  for (const row of rows) {
    const values = [row.key, row.context ?? "", ...languages.map((lang) => row.values[lang] ?? "")];
    lines.push(values.map((value) => `"${value.replace(/"/g, "\"\"")}"`).join(","));
  }

  return lines.join("\n");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "json";

  const rows = await prisma.translation.findMany({
    orderBy: { createdAt: "asc" },
  });

  const normalizedRows = rows.map((row) => ({
    key: row.key,
    context: row.context,
    values: (row.values as Record<string, string>) ?? {},
  }));

  if (format === "csv") {
    const csv = toCsv(normalizedRows);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=translations.csv",
      },
    });
  }

  return NextResponse.json({ data: normalizedRows });
}
