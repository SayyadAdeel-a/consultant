import { cn } from "@/lib/utilities";

/**
 * Renders JSON-LD structured data. Server Components pass a `schema` object;
 * the payload is embedded safely for React to escape.
 */
export function JsonLd({ schema }: { schema: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
      className={cn("sr-only")}
    />
  );
}
