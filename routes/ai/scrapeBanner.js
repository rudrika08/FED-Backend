const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

async function scrapeMediumBanner(url) {
  console.log("🌐 Opening page:", url);

  const browser = await puppeteer.launch({
    headless: "new", // ✅ Headless but with real behavior
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

    // 🕰️ Wait for images to render
    await page.waitForSelector("img", { timeout: 20000 });

    const imageSrcs = await page.$$eval("img", imgs =>
      imgs.map(img => img.src).filter(src => src && src.includes("https://miro.medium.com"))
    );

    console.log("🖼️ All <img> src values:");
    imageSrcs.forEach((src, i) => console.log(`  ${i + 1}: ${src}`));

    const banner = imageSrcs.find(
      src =>
        src.includes("resize:fit") &&
        !src.includes("da:true") &&
        !src.includes("resize:fill:")
    );

    if (banner) {
      console.log("✅ Picked banner image:", banner);
    } else {
      console.warn("⚠️ No suitable banner image found.");
    }

    await browser.close();
    return banner || "";
  } catch (error) {
    console.error("❌ Error scraping:", error);
    await browser.close();
    return "";
  }
}

// 🎯 CLI support
if (require.main === module) {
  const url = process.argv[2];
  if (!url) {
    console.error("⚠️ Please provide a Medium blog URL.");
    process.exit(1);
  }

  scrapeMediumBanner(url);
}

module.exports = { scrapeMediumBanner };
