import atlasMessages from "./messages-atlas.json";
import uiMessages from "./messages-ui.json";
import {
  LOCALE_UPSTREAM_DOCS,
  type Locale,
  localePath,
} from "./i18n";

export type TrackFilter = "all" | "A" | "B";

type LocalePack = (typeof uiMessages)["zh-Hans"];
type AtlasPack = (typeof atlasMessages)["zh-Hans"];
type UiStrings = LocalePack["ui"];

function prefixPath(locale: Locale, path: string): string {
  if (path.startsWith("#")) return path;
  return localePath(locale, path);
}

function mapPaths<T extends Record<string, unknown>>(
  locale: Locale,
  item: T
): T {
  const out: Record<string, unknown> = { ...item };

  const asHref = (value: unknown) =>
    typeof value === "string" && value.startsWith("/docs")
      ? prefixPath(locale, value)
      : undefined;

  const fromDoc = asHref(out.doc);
  const fromPath = asHref(out.path);
  if (fromDoc) {
    out.href = fromDoc;
    delete out.doc;
  } else if (fromPath) {
    out.href = fromPath;
    delete out.path;
  }

  if (typeof out.docHref === "string" && out.docHref.startsWith("/docs")) {
    out.docHref = prefixPath(locale, out.docHref);
  }
  if (Array.isArray(out.steps)) {
    out.steps = out.steps.map((s) =>
      mapPaths(locale, s as Record<string, unknown>)
    );
  }
  if (out.cta && typeof out.cta === "object") {
    out.cta = mapPaths(locale, out.cta as Record<string, unknown>);
  }
  if (Array.isArray(out.exercises)) {
    out.exercises = out.exercises.map((s) =>
      mapPaths(locale, s as Record<string, unknown>)
    );
  }
  if (Array.isArray(out.resources)) {
    out.resources = out.resources.map((s) =>
      mapPaths(locale, s as Record<string, unknown>)
    );
  }
  return out as T;
}

export function getUi(locale: Locale): UiStrings {
  return uiMessages[locale].ui;
}

export function getLocalePack(locale: Locale): LocalePack {
  return uiMessages[locale];
}

export function getAtlas(locale: Locale) {
  const pack = getLocalePack(locale);
  const atlas = atlasMessages[locale] as AtlasPack;

  return {
    site: {
      ...pack.site,
      upstreamDocs: LOCALE_UPSTREAM_DOCS[locale],
    },
    ui: pack.ui,
    nav: pack.nav,
    stats: pack.stats,
    tracks: atlas.tracks.map((t) =>
      mapPaths(locale, t as Record<string, unknown>)
    ),
    roles: atlas.roles.map((r) =>
      mapPaths(locale, r as Record<string, unknown>)
    ),
    layers: atlas.layers,
    stages: atlas.stages.map((s) =>
      mapPaths(locale, {
        ...s,
        docHref: (s as { doc?: string }).doc,
      } as Record<string, unknown>)
    ),
    steps: atlas.steps,
    resources: atlas.resources.map((r) =>
      mapPaths(locale, r as Record<string, unknown>)
    ),
    budget: atlas.budget,
  };
}

export type AtlasData = ReturnType<typeof getAtlas>;
