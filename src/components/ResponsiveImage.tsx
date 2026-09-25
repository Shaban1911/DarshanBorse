/**
 * Serves AVIF -> WebP -> JPEG from the pre-generated variants in src/assets.
 *
 * Variants follow the convention `<name>-<width>.<ext>`; Vite resolves and
 * content-hashes each one via import.meta.glob, so nothing here needs updating
 * when a new width is added — drop the file in and it joins the srcset.
 */

type UrlMap = Record<string, string>;

const avifFiles = import.meta.glob<string>("../assets/*.avif", {
  eager: true,
  query: "?url",
  import: "default",
}) as UrlMap;
const webpFiles = import.meta.glob<string>("../assets/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as UrlMap;
const jpegFiles = import.meta.glob<string>("../assets/*.jpeg", {
  eager: true,
  query: "?url",
  import: "default",
}) as UrlMap;
const pngFiles = import.meta.glob<string>("../assets/*.png", {
  eager: true,
  query: "?url",
  import: "default",
}) as UrlMap;

/** "../assets/darshan-portrait-700.avif" -> { base: "darshan-portrait", width: 700 } */
function parse(path: string) {
  const file = path.split("/").pop() ?? "";
  const stem = file.replace(/\.[a-z0-9]+$/i, "");
  const match = stem.match(/^(.*)-(\d+)$/);
  return match ? { base: match[1]!, width: Number(match[2]) } : { base: stem, width: 0 };
}

function srcSet(files: UrlMap, name: string) {
  return Object.entries(files)
    .map(([path, url]) => ({ ...parse(path), url }))
    .filter((v) => v.base === name && v.width > 0)
    .sort((a, b) => a.width - b.width)
    .map((v) => `${v.url} ${v.width}w`)
    .join(", ");
}

export interface ResponsiveImageProps {
  /** Asset stem, e.g. "darshan-portrait". */
  name: string;
  alt: string;
  /** Intrinsic dimensions of the source, so the box is reserved before load. */
  width: number;
  height: number;
  /** Maps viewport width to rendered width — keep in step with the CSS. */
  sizes: string;
  className?: string;
  /** Render-blocking hero image: loads eagerly AND at high fetch priority. */
  priority?: boolean;
  /** Load eagerly without competing with the LCP image. */
  eager?: boolean;
}

export function ResponsiveImage({
  name,
  alt,
  width,
  height,
  sizes,
  className,
  priority = false,
  eager = false,
}: ResponsiveImageProps) {
  const avif = srcSet(avifFiles, name);
  const webp = srcSet(webpFiles, name);
  // cut-outs need transparency, so a PNG source wins over a JPEG one
  const fallback = pngFiles[`../assets/${name}.png`] ?? jpegFiles[`../assets/${name}.jpeg`];

  return (
    <picture>
      {avif ? <source type="image/avif" srcSet={avif} sizes={sizes} /> : null}
      {webp ? <source type="image/webp" srcSet={webp} sizes={sizes} /> : null}
      <img
        src={fallback}
        alt={alt}
        width={width}
        height={height}
        className={className}
        decoding="async"
        loading={priority || eager ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}
