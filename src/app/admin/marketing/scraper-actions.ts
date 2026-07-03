"use server";

export async function scrapeEmailAction(url: string): Promise<{ success: boolean; emails?: string[]; error?: string }> {
  try {
    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
      },
      next: { revalidate: 0 } 
    });

    if (!response.ok) {
      const statusMessages: Record<number, string> = {
        403: "Access denied (403) — This website blocks automated scrapers.",
        404: "Page not found (404) — The URL doesn't exist. Please double-check it.",
        429: "Too many requests (429) — This website is rate-limiting access. Try again in a few minutes.",
        500: "Server error (500) — This website is experiencing issues. Try again later.",
        521: "Website offline (521) — The server is down or unreachable via Cloudflare.",
        522: "Connection timed out (522) — The website took too long to respond.",
        523: "Origin unreachable (523) — Cloudflare cannot connect to this website's server.",
        524: "Connection timed out (524) — The website is too slow to respond.",
        525: "SSL handshake failed (525) — This website has an SSL certificate issue.",
        526: "Invalid SSL certificate (526) — This website's SSL certificate is expired or misconfigured. Try another URL.",
      };
      const friendly = statusMessages[response.status] ?? `Failed to fetch website. Status: ${response.status}`;
      return { success: false, error: friendly };
    }

    const html = await response.text();
    
    // Regex to match email addresses. Includes common domains and characters.
    // Ensure we don't match image file names like something@2x.png
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const rawMatches = html.match(emailRegex) || [];
    
    // Filter out false positives like .png, .jpg, .webp, .svg
    const filteredMatches = rawMatches.filter(email => {
      const lower = email.toLowerCase();
      if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".webp") || lower.endsWith(".svg") || lower.endsWith(".gif") || lower.includes("sentry")) {
        return false;
      }
      return true;
    });

    // Remove duplicates
    const uniqueEmails = Array.from(new Set(filteredMatches.map(e => e.toLowerCase())));

    if (uniqueEmails.length === 0) {
      return { success: true, emails: [], error: "No emails found on the page." };
    }

    return { success: true, emails: uniqueEmails };
  } catch (err: unknown) {
    console.error("Scraper Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to scrape website." };
  }
}
