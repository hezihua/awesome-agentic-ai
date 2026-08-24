"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";

export default function TableOfContents({
  items,
  title = "本页目录",
}: {
  items: TocItem[];
  title?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="sticky top-0 h-screen overflow-y-auto py-16 no-scrollbar">
      <div className="px-2">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--faint)]">
          {title}
        </div>
        <nav>
          <ul className="flex flex-col gap-0.5 border-l border-[var(--line)]">
            {items.map((item) => {
              const isActive = activeId === item.id;
              const isH2 = item.depth === 2;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(item.id);
                      if (!el) return;
                      const y =
                        el.getBoundingClientRect().top + window.scrollY - 72;
                      window.scrollTo({ top: y, behavior: "smooth" });
                      history.replaceState(null, "", `#${item.id}`);
                      setActiveId(item.id);
                    }}
                    className={`block border-l-2 py-1.5 leading-snug transition-all ${
                      isH2
                        ? "pl-3 text-sm text-[var(--fg-soft)]"
                        : "pl-6 text-[13px] text-[var(--faint)]"
                    } ${
                      isActive
                        ? "-ml-px border-[var(--accent)] text-[var(--accent)]"
                        : "border-transparent hover:text-[var(--fg)]"
                    }`}
                  >
                    <span className="line-clamp-2 block">{item.text}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
