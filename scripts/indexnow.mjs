/* ════════════════════════════════════════════════════════════════════════
   IndexNow ping — run by the deploy workflow after each deploy.

   Tells the IndexNow search engines (Bing, Yandex, Seznam, Naver, Yep)
   every URL in the live sitemap, so new and changed pages are crawled in
   hours instead of weeks. Bing's index is also the one behind ChatGPT
   search and Copilot.

   The key is public by design: IndexNow proves the site is ours by fetching
   it from public/<key>.txt. It runs after the deploy job, so the sitemap
   and the key file it points at are already live.

   It never fails the workflow: a ping that does not go through costs
   nothing, and the next deploy sends the list again.
   ════════════════════════════════════════════════════════════════════════ */

const SITE = "https://muffinbytelabs.com";
const KEY = "09d8636ab91637c33324b8bbb54b3ca1";

try {
  const xml = await (await fetch(`${SITE}/sitemap.xml`, { cache: "no-store" })).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (urls.length === 0) throw new Error("no URLs in the live sitemap");

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE).host,
      key: KEY,
      keyLocation: `${SITE}/${KEY}.txt`,
      urlList: urls,
    }),
  });
  /* 200 = accepted, 202 = accepted while the key is checked */
  console.log(`IndexNow: HTTP ${res.status} for ${urls.length} URLs`);
} catch (err) {
  console.log(`IndexNow ping skipped: ${err instanceof Error ? err.message : err}`);
}
