import assert from "node:assert/strict";
import test from "node:test";
import worker, { destinationFor } from "../src/index.mjs";

const cases = [
  ["https://blog.virtengine.com/", "https://virtengine.com/blog"],
  ["https://blog.virtengine.com/page2/", "https://virtengine.com/blog/archive/page/2"],
  ["https://blog.virtengine.com/page/13/", "https://virtengine.com/blog/archive/page/13"],
  ["https://blog.virtengine.com/rss/", "https://virtengine.com/blog/rss.xml"],
  ["https://blog.virtengine.com/content/images/2015/09/cloud.png", "https://virtengine.com/blog-assets/content/images/2015/09/cloud.png"],
  ["https://blog.virtengine.com/a-historic-post/?ref=old", "https://virtengine.com/blog/a-historic-post?ref=old"],
];

for (const [source, destination] of cases) {
  test(`${source} redirects to its Astro equivalent`, () => {
    assert.equal(destinationFor(source).href, destination);
  });
}

test("the Worker returns a permanent redirect", async () => {
  const response = await worker.fetch(new Request("https://blog.virtengine.com/example/"));
  assert.equal(response.status, 301);
  assert.equal(response.headers.get("location"), "https://virtengine.com/blog/example");
});
