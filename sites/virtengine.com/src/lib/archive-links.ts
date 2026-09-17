/** Repair known migration defects without rewriting the historical source text. */
export function repairArchiveLinks(html: string): string {
  const aliases: Record<string,string> = {'getting-started-atharva-storage-in-VirtEngine':'getting-started-atharva-storage-in-megamafrica'};
  return html
    .replace(/<img\b[^>]*src="(?:\/blog-assets)?\/content\/images\/2015\/07\/megam_baremetal_docker-1.png"[^>]*>/g, '<span class="archive-note">[Image unavailable in the original archive]</span>')
    .replace(/href="\/blog\/\d{4}\/\d{2}\/\d{2}\/([^"#]+)"/g, (_, slug) => `href="/blog/${aliases[slug] || slug}"`)
    .replace(/href="(mesos\.apache\.org|hadoop\.apache\.org|spark\.apache\.org|nsq\.io|www\.playframework\.com|scala-lang\.org)"/g, 'href="https://$1"')
    .replace(/src="\/content\/images\//g, 'src="/blog-assets/content/images/')
    .replace(/<a\b[^>]*href="\/cdn-cgi\/l\/email-protection[^\"]*"[^>]*>.*?<\/a>/gs, '<span>[email address unavailable in archive]</span>')
    .replace(/<a\b[^>]*href="#\s*"[^>]*>(.*?)<\/a>/gs, '$1')
    .replace(/<img\b[^>]*src="#\s*"[^>]*>/g, '<span class="archive-note">[Image unavailable in the original archive]</span>');
}
