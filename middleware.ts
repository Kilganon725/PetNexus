import { NextRequest, NextResponse } from "next/server";

const defaultLang = process.env.NEXT_PUBLIC_DEFAULT_LANG ?? "en";

function detectPreferredLanguage(request: NextRequest) {
  const cookieLang = request.cookies.get("lang")?.value;
  if (cookieLang) return cookieLang;

  const header = request.headers.get("accept-language");
  if (!header) return defaultLang;

  const candidate = header
    .split(",")
    .map((entry) => entry.split(";")[0]?.trim())
    .find(Boolean);

  return candidate || defaultLang;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/") {
    const lang = detectPreferredLanguage(request);
    return NextResponse.redirect(new URL(`/${lang}`, request.url));
  }

  const segments = pathname.split("/");
  const lang = segments[1];

  if (lang && !["api", "_next"].includes(lang) && !pathname.includes(".")) {
    const response = NextResponse.next();
    response.cookies.set("lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
