import cors from 'cors';
import express from 'express';
import PQueue from 'p-queue';
import puppeteer from 'puppeteer';

const app = express();
const PORT = 5000;

// cors configuration
app.use(cors())

// Middleware to parse JSON request bodies
app.use(express.json({ limit: '5mb' }));
const queue = new PQueue({ concurrency: 10 }); // only 10 PDF jobs at a time

// -------------------------------
// Launch Puppeteer once (on server start)
// -------------------------------

let browser;

async function initBrowser() {
    if (!browser) {
        console.log("🚀 Launching Puppeteer...");
        // browser = await puppeteer.launch({
        //     headless: "new"
        // })
        browser = await puppeteer.launch({
            headless: "new"
        })
    }
    return browser;
}

// -------------------------------
// API endpoint to generate PDF
// -------------------------------

app.post("/generate-pdf", async (req, res) => {
    const { html } = req.body; // frontend sends HTML string


    if (!html) {
        return res.status(400).json({ error: "HTML content is required" });
    }

    try {

        await queue.add(async () => {
            const browserInstance = await initBrowser();
            const page = await browserInstance.newPage();

            try {
                // Inject HTML
                await page.setContent(html, { waitUntil: "networkidle0" });

                // Generate PDF buffer
                const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

                // Send PDF as download
                // res.set({
                //     "Content-Type": "application/pdf",
                //     "Content-Disposition": "attachment; filename=template.pdf",
                // });
                res.send(pdfBuffer);
            } finally {
                // Always close page to free memory
                await page.close();
            }
        })

    } catch (error) {
        console.error("❌ PDF generation failed:", error);

        // If browser crashed, reset it for next request
        browser = null;

        res.status(500).json({ success: false, message: "Failed to generate PDF", error: error });
    }
})

app.get('/', (req, res) => {
    res.send({ message: "Pdf-generate server is running..." });
})

// app.listen(PORT, async () => {
//   await initBrowser(); // launch browser when server starts
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });

// -------------------------------
// Start server after initializing browser
// -------------------------------
const startServer = async () => {
  try {
    await initBrowser(); // make sure browser is ready
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to launch Puppeteer:", err);
    process.exit(1); // stop server if browser cannot start
  }
};

startServer();

// -------------------------------
// Graceful shutdown
// -------------------------------
process.on("SIGINT", async () => {
    console.log("\n🛑 Shutting down server...");
    if (browser) await browser.close();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log("\n🛑 Server terminated");
    if (browser) await browser.close();
    process.exit(0);
});