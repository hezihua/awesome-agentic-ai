"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getAtlas, type TrackFilter } from "@/lib/atlas";
import type { Locale } from "@/lib/i18n";

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-sm font-medium text-[var(--accent)]">{children}</p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display mb-3 text-3xl font-semibold tracking-tight text-[var(--fg)] sm:text-[2.35rem]">
      {children}
    </h2>
  );
}

function SectionLead({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-2xl text-[17px] leading-relaxed text-[var(--muted)]">
      {children}
    </p>
  );
}

export function AtlasHome({ locale }: { locale: Locale }) {
  const data = getAtlas(locale);
  const { site, ui, stats, tracks, roles, layers, stages, steps, resources, budget } =
    data;

  const [filter, setFilter] = useState<TrackFilter>("all");
  const [openId, setOpenId] = useState<string | null>("0");
  const [activeLayer, setActiveLayer] = useState(0);

  const visibleStages = useMemo(() => {
    if (filter === "all") return stages;
    if (filter === "A") {
      return stages.filter(
        (s) =>
          (s as { track?: string }).track === "shared" &&
          !["3", "4", "6", "7"].includes((s as { id: string }).id)
      );
    }
    return stages;
  }, [filter, stages]);

  return (
    <div>
      <section className="relative overflow-hidden atlas-grid">
        <div className="relative mx-auto flex min-h-[88svh] max-w-6xl flex-col justify-center px-5 pb-20 pt-28 sm:px-8">
          <p className="animate-fade-up hud-chip mb-6 w-fit">
            {ui.heroBadge.replace("{version}", site.version)}
          </p>

          <h1 className="animate-fade-up-delay font-display max-w-3xl text-5xl font-semibold leading-[1.08] tracking-tight text-[var(--fg)] sm:text-6xl">
            {site.name}
          </h1>
          <p className="animate-fade-up-delay mt-3 text-xl text-[var(--accent)] sm:text-2xl">
            {site.tagline}
          </p>
          <p className="animate-fade-up-delay-2 mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--muted)]">
            {site.description}
          </p>

          <div className="animate-fade-up-delay-2 mt-8 flex flex-wrap items-center gap-3">
            <a href="#stages" className="btn-primary">
              {ui.startLearning}
              <span aria-hidden>→</span>
            </a>
            <a href="#tracks" className="btn-ghost">
              {ui.chooseTrack}
            </a>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-4"
              >
                <div className="font-display text-3xl font-semibold text-[var(--fg)]">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-[var(--muted)]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="tracks"
        className="scroll-mt-20 border-t border-[var(--line)] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionEyebrow>{ui.tracksEyebrow}</SectionEyebrow>
          <SectionTitle>{ui.tracksTitle}</SectionTitle>
          <SectionLead>{ui.tracksLead}</SectionLead>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {tracks.map((track) => {
              const t = track as {
                id: string;
                name: string;
                duration: string;
                description: string;
                tags: string[];
                steps?: Array<{
                  code: string;
                  title: string;
                  description: string;
                  href: string;
                }>;
                cta?: { label: string; href: string };
              };
              return (
                <article key={t.id} className="panel p-6 sm:p-7">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-[var(--muted)]">
                        Track {t.id}
                      </p>
                      <h3 className="mt-1 font-display text-2xl font-semibold text-[var(--fg)]">
                        {t.name.replace(/^Track [AB] — /, "")}
                      </h3>
                    </div>
                    <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
                      {t.duration}
                    </span>
                  </div>
                  <p className="text-[15px] leading-relaxed text-[var(--muted)]">
                    {t.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {t.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-[var(--bg)] px-2.5 py-1 text-xs text-[var(--muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {t.steps && (
                    <ol className="mt-6 space-y-2 border-t border-[var(--line)] pt-5">
                      {t.steps.map((step, i) => (
                        <li key={step.code}>
                          <Link
                            href={step.href}
                            className="group flex items-start gap-3 rounded-lg px-2 py-2 transition hover:bg-[var(--nav-hover)]"
                          >
                            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent)]">
                              {i + 1}
                            </span>
                            <span>
                              <span className="block text-sm font-medium text-[var(--fg)] group-hover:text-[var(--accent)]">
                                {step.code} · {step.title}
                              </span>
                              <span className="block text-xs text-[var(--faint)]">
                                {step.description}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  )}

                  {t.cta && (
                    <Link
                      href={t.cta.href}
                      className="mt-6 inline-flex text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
                    >
                      {t.cta.label} →
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="roles"
        className="scroll-mt-20 border-t border-[var(--line)] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionEyebrow>{ui.rolesEyebrow}</SectionEyebrow>
          <SectionTitle>{ui.rolesTitle}</SectionTitle>
          <SectionLead>{ui.rolesLead}</SectionLead>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => {
              const r = role as {
                icon: string;
                title: string;
                description: string;
                path: string;
                href: string;
              };
              return (
                <Link
                  key={r.title}
                  href={r.href}
                  className="group rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] transition hover:border-[var(--accent-border)]"
                >
                  <div className="text-2xl">{r.icon}</div>
                  <h3 className="mt-3 text-lg font-semibold text-[var(--fg)] group-hover:text-[var(--accent)]">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {r.description}
                  </p>
                  <p className="mt-4 text-xs font-medium text-[var(--accent)]">
                    {r.path}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="layers"
        className="scroll-mt-20 border-t border-[var(--line)] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionEyebrow>{ui.layersEyebrow}</SectionEyebrow>
          <SectionTitle>{ui.layersTitle}</SectionTitle>
          <SectionLead>{ui.layersLead}</SectionLead>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-2">
              {layers.map((layer, idx) => {
                const active = idx === activeLayer;
                return (
                  <button
                    key={layer.name}
                    type="button"
                    onClick={() => setActiveLayer(idx)}
                    className={`w-full rounded-xl border px-4 py-3.5 text-left transition ${
                      active
                        ? "border-[var(--accent-border)] bg-[var(--accent-soft)]"
                        : "border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-[var(--fg)]">
                        {layer.name}
                      </span>
                      <span className="text-xs text-[var(--faint)]">
                        {layer.stage}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      {layer.kind}
                    </p>
                  </button>
                );
              })}
            </div>
            <div className="panel p-6 sm:p-7">
              <p className="text-sm text-[var(--accent)]">
                {layers[activeLayer].stage}
              </p>
              <h3 className="font-display mt-2 text-2xl font-semibold text-[var(--fg)]">
                {layers[activeLayer].name}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--muted)]">
                {layers[activeLayer].description}
              </p>
              <Link
                href={
                  (stages.find((s) => (s as { id: string }).id === "7") as { docHref?: string })
                    ?.docHref || "#"
                }
                className="mt-6 inline-flex text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
              >
                {ui.layerHint}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="stages"
        className="scroll-mt-20 border-t border-[var(--line)] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionEyebrow>{ui.stagesEyebrow}</SectionEyebrow>
          <SectionTitle>{ui.stagesTitle}</SectionTitle>
          <SectionLead>{ui.stagesLead}</SectionLead>

          <div className="mt-8 flex flex-wrap gap-2">
            {(
              [
                { id: "all" as const, label: ui.filterAll, count: 9 },
                { id: "A" as const, label: ui.filterA, count: 6 },
                { id: "B" as const, label: ui.filterB, count: 9 },
              ]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  filter === tab.id
                    ? "border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg)]"
                }`}
              >
                {tab.label}
                <span className="ml-1.5 opacity-70">{tab.count}</span>
              </button>
            ))}
          </div>

          {filter !== "all" && (
            <div className="mt-5 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-sm text-[var(--muted)]">
              <p className="font-medium text-[var(--fg)]">
                {filter === "A" ? ui.trackABlurb : ui.trackBBlurb}
              </p>
              <p className="mt-1.5 leading-relaxed">
                {filter === "A" ? ui.trackADesc : ui.trackBDesc}
              </p>
            </div>
          )}

          <div className="mt-6 space-y-3">
            {visibleStages.map((stage) => {
              const s = stage as {
                id: string;
                number: string;
                title: string;
                duration: string;
                badge?: string;
                learn: string;
                do?: string;
                docHref: string;
                exercises?: Array<{
                  id: string;
                  title: string;
                  description: string;
                  tags: string[];
                  href?: string;
                  highlight?: boolean;
                }>;
                resources?: Array<{
                  title: string;
                  description: string;
                  href: string;
                }>;
              };
              const open = openId === s.id;
              return (
                <div
                  key={s.id}
                  className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : s.id)}
                    className="flex w-full items-start gap-4 px-5 py-4 text-left"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent)]">
                      {s.number}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-[var(--fg)]">
                        {s.title}
                      </span>
                      <span className="mt-1 block text-xs text-[var(--faint)]">
                        {s.duration}
                        {s.badge ? ` · ${s.badge}` : ""}
                      </span>
                    </span>
                    <span className="text-[var(--faint)]">{open ? "▾" : "▸"}</span>
                  </button>

                  {open && (
                    <div className="border-t border-[var(--line)] px-5 pb-5 pt-4">
                      <p className="text-sm leading-relaxed text-[var(--muted)]">
                        <span className="font-medium text-[var(--fg)]">
                          {ui.learnLabel}
                        </span>
                        {s.learn}
                      </p>
                      {s.do && (
                        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                          <span className="font-medium text-[var(--fg)]">
                            {ui.doLabel}
                          </span>
                          {s.do}
                        </p>
                      )}

                      {s.exercises && s.exercises.length > 0 && (
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          {s.exercises.map((ex) => (
                            <Link
                              key={ex.id}
                              href={ex.href || s.docHref}
                              className="rounded-lg border border-[var(--line)] bg-[var(--bg)] p-3.5 transition hover:border-[var(--accent-border)]"
                            >
                              <div className="flex items-center gap-2">
                                {ex.highlight && (
                                  <span className="text-[10px] text-[var(--warn)]">
                                    ★
                                  </span>
                                )}
                                <span className="text-sm font-medium text-[var(--fg)]">
                                  {ex.title}
                                </span>
                              </div>
                              <p className="mt-1.5 text-xs leading-relaxed text-[var(--faint)]">
                                {ex.description}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {ex.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded bg-[var(--surface)] px-1.5 py-0.5 text-[10px] text-[var(--muted)]"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {s.resources && s.resources.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {s.resources.map((r) => (
                            <Link
                              key={r.href}
                              href={r.href}
                              className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--muted)] hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
                            >
                              {r.title}
                              <span className="ml-1.5 text-[var(--faint)]">
                                {r.description}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}

                      <Link
                        href={s.docHref}
                        className="mt-4 inline-flex text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
                      >
                        {ui.viewDoc}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="workflow"
        className="scroll-mt-20 border-t border-[var(--line)] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionEyebrow>{ui.workflowEyebrow}</SectionEyebrow>
          <SectionTitle>{ui.workflowTitle}</SectionTitle>
          <SectionLead>{ui.workflowLead}</SectionLead>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <li
                key={step.n}
                className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5"
              >
                <div className="font-display text-2xl font-semibold text-[var(--accent)]">
                  {step.n}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-[var(--fg)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="resources"
        className="scroll-mt-20 border-t border-[var(--line)] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionEyebrow>{ui.resourcesEyebrow}</SectionEyebrow>
          <SectionTitle>{ui.resourcesTitle}</SectionTitle>
          <SectionLead>{ui.resourcesLead}</SectionLead>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((card) => {
              const c = card as {
                icon: string;
                title: string;
                description: string;
                meta: string;
                href: string;
              };
              return (
                <Link
                  key={c.href}
                  href={c.href}
                  className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 transition hover:border-[var(--accent-border)]"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{c.icon}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--fg)]">
                        {c.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                        {c.description}
                      </p>
                      <p className="mt-2 text-[11px] text-[var(--accent)]">
                        {c.meta}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="budget"
        className="scroll-mt-20 border-t border-[var(--line)] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionEyebrow>{ui.budgetEyebrow}</SectionEyebrow>
          <SectionTitle>{ui.budgetTitle}</SectionTitle>
          <SectionLead>{ui.budgetLead}</SectionLead>

          <div className="mt-8 overflow-hidden rounded-xl border border-[var(--line)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--table-head)] text-[var(--fg-soft)]">
                <tr>
                  <th className="px-5 py-3 font-semibold">{ui.budgetColPlan}</th>
                  <th className="px-5 py-3 font-semibold">
                    {ui.budgetColDetail}
                  </th>
                  <th className="px-5 py-3 font-semibold">{ui.budgetColCost}</th>
                </tr>
              </thead>
              <tbody>
                {budget.map((row) => (
                  <tr
                    key={row.plan}
                    className={`border-t border-[var(--line)] ${
                      row.highlight
                        ? "bg-[var(--accent-soft)]"
                        : "bg-[var(--surface)]"
                    }`}
                  >
                    <td className="px-5 py-4 font-medium text-[var(--fg)]">
                      {row.plan}
                    </td>
                    <td className="px-5 py-4 text-[var(--muted)]">
                      {row.detail}
                    </td>
                    <td className="px-5 py-4 font-medium text-[var(--accent)]">
                      {row.cost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-[var(--faint)]">{ui.budgetHint}</p>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] py-12">
        <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
          <p className="font-display text-xl font-semibold text-[var(--fg)]">
            {site.name}
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {ui.basedOn}{" "}
            <a
              href={site.upstream}
              className="text-[var(--accent)] hover:text-[var(--accent-hover)]"
              target="_blank"
              rel="noreferrer"
            >
              awesome-agentic-ai-zh
            </a>{" "}
            {ui.footerNote.replace("{license}", site.license)}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--faint)]">
            <Link
              href={`/${locale}/docs/README`}
              className="hover:text-[var(--accent)]"
            >
              README
            </Link>
            <Link
              href={`/${locale}/docs/PROGRESS`}
              className="hover:text-[var(--accent)]"
            >
              {ui.progress}
            </Link>
            <Link
              href={`/${locale}/docs/CAPSTONE`}
              className="hover:text-[var(--accent)]"
            >
              Capstone
            </Link>
            <Link
              href={`/${locale}/docs/ROADMAP`}
              className="hover:text-[var(--accent)]"
            >
              {ui.roadmap}
            </Link>
            <a
              href={site.upstreamDocs}
              className="hover:text-[var(--accent)]"
              target="_blank"
              rel="noreferrer"
            >
              {ui.upstreamDocs}
            </a>
          </div>
          <p className="mt-6 text-xs text-[var(--faint)]">{ui.footerLegal}</p>
        </div>
      </footer>
    </div>
  );
}
