import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer';
import puppeteerCore from "puppeteer-core";

let browser;

export async function initBrowser() {
    const isServerless = !!process.env.AWS_REGION;
    browser = await (isServerless ? puppeteerCore : puppeteer).launch({
        args: isServerless ? chromium.args : [],
        defaultViewport: chromium.defaultViewport,
        executablePath: isServerless
            ? await chromium.executablePath()
            : undefined,
        headless: isServerless
            ? chromium.headless
            : 'new',
        ignoreHTTPSErrors: true,
    });
}

export async function generatePDF(html) {
    console.log("🚀 Launching Chromium...");
    if (!browser) await initBrowser(); // fallback
    const page = await browser.newPage();

    try {
        // const isServerless = !!process.env.AWS_REGION;

        // const executablePath =
        //     (await chromium.executablePath()) ||
        //     puppeteer.executablePath(); // fallback for local dev

        // const browser = await puppeteer.launch({
        //     args: chromium.args,
        //     defaultViewport: chromium.defaultViewport,
        //     executablePath,
        //     headless: chromium.headless,
        //     ignoreHTTPSErrors: true,
        // });

        // const page = await browser.newPage();

        console.log("⏳ Setting HTML content...");
        await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 }); // 30s timeout

        console.log("🖨 Generating PDF...");
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            scale: 0.95,
        });
        console.log("✅ PDF generated successfully");
        return pdfBuffer;

    } catch (err) {
        console.error("❌ Puppeteer error:", err);
        throw err; // re-throw to return 500 to client
    } finally {
        await page.close();
        // if (browser) await browser.close();
    }
}

// Optional: close browser on server shutdown
process.on('exit', () => browser?.close());
process.on('SIGINT', () => browser?.close());
process.on('SIGTERM', () => browser?.close());
