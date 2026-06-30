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
      return { success: false, error: "Failed to fetch website. Status: " + response.status };
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
