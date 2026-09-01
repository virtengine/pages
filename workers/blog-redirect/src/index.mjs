const DESTINATION_ORIGIN = "https://virtengine.com";

export function destinationFor(sourceUrl) {
  const source = new URL(sourceUrl);
  const path = source.pathname;
  let destinationPath;

  if (path === "/" || path === "") {
    destinationPath = "/blog";
  } else if (/^\/(?:rss|feed)(?:\/|\.xml)?$/i.test(path)) {
    destinationPath = "/blog/rss.xml";
  } else if (/^\/page\/?(\d+)\/?$/i.test(path)) {
    const page = Number(path.match(/^\/page\/?(\d+)\/?$/i)?.[1]);
    destinationPath = page <= 1 ? "/blog/archive" : `/blog/archive/page/${page}`;
  } else if (/^\/(?:content\/images|images)\//i.test(path)) {
    destinationPath = `/blog-assets${path}`;
  } else if (/^\/(?:tag|author)\//i.test(path)) {
    destinationPath = "/blog/archive";
  } else if (path === "/robots.txt") {
    destinationPath = "/robots.txt";
  } else {
    const legacyPath = path.replace(/^\/+|\/+$/g, "");
    destinationPath = legacyPath ? `/blog/${legacyPath}` : "/blog";
  }

  const destination = new URL(destinationPath, DESTINATION_ORIGIN);
  destination.search = source.search;
  return destination;
}

export default {
  fetch(request) {
    return Response.redirect(destinationFor(request.url), 301);
  },
};
