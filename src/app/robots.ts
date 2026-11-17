import type { MetadataRoute } from "next";
import { SITE } from "@/lib/schema";

export const dynamic = "force-static";

/* Every crawler may read everything: the site exists to be found.

   The AI crawlers are also named one by one, although "*" already lets
   them in. Naming them puts the intent on record — this site wants to be
   read by search engines AND by the assistants people now ask for a
   recommendation — and keeps them in if a default changes somewhere. A
   crawler that finds its own name reads only its own group, so that group
   allows everything too. */
const AI_CRAWLERS = [
  "GPTBot", // OpenAI
  "OAI-SearchBot", // ChatGPT search
  "ChatGPT-User", // pages a ChatGPT user asks it to open
  "ClaudeBot", // Anthropic
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot", // Perplexity
  "Perplexity-User",
  "Google-Extended", // Gemini (a token, not a crawler: Googlebot fetches)
  "Applebot", // Siri, Spotlight, Apple Intelligence
  "Applebot-Extended",
  "bingbot", // Bing — also the index behind ChatGPT search and Copilot
  "DuckAssistBot", // DuckDuckGo's AI answers
  "Amazonbot", // Alexa
  "meta-externalagent", // Meta AI
  "MistralAI-User", // Le Chat
  "CCBot", // Common Crawl, which many models learn from
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
