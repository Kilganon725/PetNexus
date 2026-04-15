"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { translate } from "@/lib/i18n";

const slides = [
  "/images/mohann-dog-7651002_1920.jpg",
  "/images/ray_shrewsberry-border-collie-9587596_1920.jpg",
  "/images/ray_shrewsberry-border-collie-9596199_1920.jpg",
  "/images/ray_shrewsberry-border-collie-9596749_1920.jpg",
];

export function HeroCarousel({
  lang,
  dictionary,
}: {
  lang: string;
  dictionary: Record<string, string>;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-md border border-border/70 px-6 py-12 text-white md:px-8 md:py-16">
      {slides.map((slide, slideIndex) => (
        <div
          key={slide}
          className={`absolute inset-0 transition-opacity duration-700 ${slideIndex === index ? "opacity-100" : "opacity-0"}`}
          style={{
            backgroundImage: `linear-gradient(to right, rgba(6,24,20,0.82), rgba(6,24,20,0.36)), url('${slide}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      <div className="relative z-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Smart Operations</p>
        <h2 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">{translate(dictionary, "home.title")}</h2>
        <p className="mt-3 text-sm text-white/90 md:text-base">{translate(dictionary, "home.subtitle")}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/${lang}/pets`} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            进入宠物中心
          </Link>
          <Link href={`/${lang}/shop`} className="rounded-md bg-white/90 px-4 py-2 text-sm font-semibold text-black">
            立即购物
          </Link>
        </div>
      </div>

      <div className="relative z-10 mt-6 flex items-center gap-2">
        {slides.map((slide, slideIndex) => (
          <button
            key={slide}
            type="button"
            aria-label={`Go to slide ${slideIndex + 1}`}
            onClick={() => setIndex(slideIndex)}
            className={`h-2.5 w-7 rounded-full transition ${slideIndex === index ? "bg-white" : "bg-white/45 hover:bg-white/70"}`}
          />
        ))}
      </div>
    </div>
  );
}
