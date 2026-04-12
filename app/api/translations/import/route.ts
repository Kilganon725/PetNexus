import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type InputTranslation = {
  key: string;
  context?: string;
  values: Record<string, string>;
};

function parseCsv(content: string): InputTranslation[] {
  const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((header) => header.replace(/^"|"$/g, ""));
  const languageHeaders = headers.slice(2);

  return lines.slice(1).map((line) => {
    const cells = line
      .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
      .map((cell) => cell.replace(/^"|"$/g, "").replace(/""/g, "\""));

    const values: Record<string, string> = {};
    languageHeaders.forEach((lang, index) => {
      values[lang] = cells[index + 2] ?? "";
    });

    return {
      key: cells[0] ?? "",
      context: cells[1] || undefined,
      values,
    };
  });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let rows: InputTranslation[] = [];

  if (contentType.includes("application/json")) {
    const body = (await request.json()) as { data?: InputTranslation[] };
    rows = body.data ?? [];
  } else {
    const body = await request.text();
    rows = parseCsv(body);
  }

  const validRows = rows.filter((row) => row.key && Object.keys(row.values).length > 0);

  await prisma.$transaction(
    validRows.map((row) =>
      prisma.translation.upsert({
        where: { key: row.key },
        create: {
          key: row.key,
          context: row.context,
          values: row.values,
        },
        update: {
          context: row.context,
          values: row.values,
        },
      }),
    ),
  );

  return NextResponse.json({ imported: validRows.length });
}
