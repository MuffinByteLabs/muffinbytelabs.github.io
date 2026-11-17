import { llmsFullTxt } from "@/lib/llms";

/* /llms-full.txt — the whole site as one Markdown file for AI assistants:
   every service, project and answer, and the full text of every Field
   Note. Written at build time; the content lives in src/lib/llms.ts. */

export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
