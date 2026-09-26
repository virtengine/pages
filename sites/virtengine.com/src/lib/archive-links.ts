/** Repair known migration defects without rewriting the historical source text. */
export function repairArchiveLinks(html: string): string {
  const aliases: Record<string,string> = {'getting-started-atharva-storage-in-VirtEngine':'getting-started-atharva-storage-in-megamafrica'};
  return html
    .replace(/<img\b[^>]*src="(?:\/blog-assets)?\/content\/images\/2015\/07\/megam_baremetal_docker-1.png"[^>]*>/g, '<span class="archive-note">[Image unavailable in the original archive]</span>')
    .replace(/href="\/blog\/\d{4}\/\d{2}\/\d{2}\/([^"#]+)"/g, (_, slug) => `href="/blog/${aliases[slug] || slug}"`)
    .replace(/href="(mesos\.apache\.org|hadoop\.apache\.org|spark\.apache\.org|nsq\.io|www\.playframework\.com|scala-lang\.org)"/g, 'href="https://$1"')
    .replace(/src="\/content\/images\//g, 'src="/blog-assets/content/images/')
    .replace(/<a\b[^>]*href="#\s*"[^>]*>.*?<\/a>/gs, '$1')
    /* Cloudflare's email obfuscation cannot decode on a static build, so these
       anchors ship as dead links and pick up the light-theme link colour on the
       dark code plates (2.85:1). Label them like the rest of the archive. */
    .replace(/<a\b[^>]*href="\/cdn-cgi\/l\/email-protection[^"]*"[^>]*>.*?<\/a>/gs, '<span>[email address unavailable in archive]</span>')
    /* An anchor whose only child was a stripped image: the migration left it
       empty, so it renders as a focusable link with no accessible name. Keep the
       "image unavailable" note, drop the link. */
    .replace(/<a\b[^>]*>\s*<img\b[^>]*src="#\s*"[^>]*>\s*<\/a>/gs, '<span class="archive-note">[Image unavailable in the original archive]</span>')
    .replace(/<img\b[^>]*src="#\s*"[^>]*>/g, '<span class="archive-note">[Image unavailable in the original archive]</span>')
    .replace(/<a\b[^>]*>\s*<\/a>/gs, '');
}

/**
 * Horizontally scrolling code blocks must be reachable by keyboard, not just by
 * pointer (WCAG 2.1.1). Applies to every post body, archive or current.
 */
export function makeCodeBlocksFocusable(html: string): string {
  return html.replace(/<pre(?![^>]*\btabindex=)/g, '<pre tabindex="0"');
}
