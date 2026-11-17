import { llmsTxt } from "@/lib/llms";

/* /llms.txt — a short Markdown guide to the site for AI assistants
   (llmstxt.org). Written at build time from the site's own data; the
   content lives in src/lib/llms.ts. */

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
