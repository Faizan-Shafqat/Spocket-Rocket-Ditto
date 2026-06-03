const url = process.argv[2];
if (!url) {
  console.error("usage: node scripts/fetch-brad-page.js <url>");
  process.exit(1);
}
fetch(url)
  .then((r) => r.text())
  .then((page) => {
    const i = page.indexOf("sr-hero-01");
    console.log("len", page.length);
    console.log("widget", page.includes("custom widget definition not found"));
    console.log("sr-hero", page.includes("sr-hero-01"));
    console.log("DITTO", page.includes("DITTO"));
    console.log("Virtual Admin", page.includes("Virtual Admin"));
    console.log("Hero title", page.includes("Hero title"));
    if (i >= 0) console.log("snippet", page.slice(i, i + 1200));
  });
