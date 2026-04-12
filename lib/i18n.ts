import { prisma } from "@/lib/prisma";

type TranslationValues = Record<string, string>;

const fallbackMessages: Record<string, TranslationValues> = {
  "nav.dashboard": {
    "zh-CN": "总览",
    en: "Dashboard",
    fr: "Tableau de bord",
  },
  "nav.pets": {
    "zh-CN": "宠物",
    en: "Pets",
    fr: "Animaux",
  },
  "nav.shop": {
    "zh-CN": "商城",
    en: "Shop",
    fr: "Boutique",
  },
  "nav.designer": {
    "zh-CN": "狗牌设计",
    en: "Tag Designer",
    fr: "Conception de Médaille",
  },
  "nav.membership": {
    "zh-CN": "会员",
    en: "Membership",
    fr: "Abonnement",
  },
  "home.title": {
    "zh-CN": "宠物综合服务平台",
    en: "Pet Service Platform",
    fr: "Plateforme de Services pour Animaux",
  },
  "home.subtitle": {
    "zh-CN": "统一管理宠物档案、购物、狗牌定制与会员订阅。",
    en: "Manage pets, shopping, tag customization, and subscriptions in one place.",
    fr: "Gerez les animaux, achats, medailles et abonnements en un seul endroit.",
  },
};

const defaultLang = process.env.NEXT_PUBLIC_DEFAULT_LANG ?? "en";

export async function getEnabledLanguages() {
  if (!process.env.DATABASE_URL) {
    return [
      { code: "zh-CN", name: "中文", isDefault: false },
      { code: "en", name: "English", isDefault: true },
      { code: "fr", name: "Français", isDefault: false },
    ];
  }

  try {
    const languages = await prisma.language.findMany({
      where: { isEnabled: true },
      orderBy: { createdAt: "asc" },
    });
    if (!languages.length) {
      return [
        { code: "zh-CN", name: "中文", isDefault: false },
        { code: "en", name: "English", isDefault: true },
        { code: "fr", name: "Français", isDefault: false },
      ];
    }
    return languages;
  } catch {
    return [
      { code: "zh-CN", name: "中文", isDefault: false },
      { code: "en", name: "English", isDefault: true },
      { code: "fr", name: "Français", isDefault: false },
    ];
  }
}

export async function getDefaultLanguage() {
  if (!process.env.DATABASE_URL) {
    return defaultLang;
  }

  try {
    const language = await prisma.language.findFirst({
      where: { isDefault: true, isEnabled: true },
    });
    return language?.code ?? defaultLang;
  } catch {
    return defaultLang;
  }
}

export async function getDictionary(lang: string) {
  if (!process.env.DATABASE_URL) {
    const dictionary: Record<string, string> = {};
    for (const [key, values] of Object.entries(fallbackMessages)) {
      dictionary[key] = values[lang] ?? values[defaultLang] ?? Object.values(values)[0] ?? key;
    }
    return dictionary;
  }

  let rows: Array<{ key: string; values: unknown }> = [];
  try {
    rows = await prisma.translation.findMany();
  } catch {
    rows = [];
  }
  const dictionary: Record<string, string> = {};

  for (const [key, values] of Object.entries(fallbackMessages)) {
    dictionary[key] = values[lang] ?? values[defaultLang] ?? Object.values(values)[0] ?? key;
  }

  for (const row of rows) {
    const values = row.values as TranslationValues;
    dictionary[row.key] =
      values?.[lang] ?? values?.[defaultLang] ?? Object.values(values ?? {})[0] ?? row.key;
  }

  return dictionary;
}

export function translate(dictionary: Record<string, string>, key: string, fallback?: string) {
  return dictionary[key] ?? fallback ?? key;
}
