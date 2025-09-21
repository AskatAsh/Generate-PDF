import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export async function generatePDF(html) {
  let browser;
  try {
    console.log("🚀 Launching Chromium...");
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    console.log("⏳ Setting HTML content...");
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 10000 }); // 10s timeout

    console.log("🖨 Generating PDF...");
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await page.close();
    console.log("✅ PDF generated successfully");
    return pdfBuffer;

  } catch (err) {
    console.error("❌ Puppeteer error:", err);
    throw err; // re-throw to return 500 to client
  } finally {
    if (browser) await browser.close();
  }
}
