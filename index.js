import cors from 'cors';
import crypto from 'crypto';
import express from 'express';
import PQueue from 'p-queue';
import { generatePDF } from './pdfUtils.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Use p-queue for concurrency handling
const queue = new PQueue({ concurrency: 5 });

// In-memory cache for repeated PDFs
const pdfCache = new Map();
function getCacheKey(html) {
  return crypto.createHash('md5').update(html).digest('hex');
}

app.options('/generate-pdf', (req, res) => res.sendStatus(204));

app.get('/', (req, res) => {
  res.status(200).json({ message: "PDF Generator is running..." })
})

app.post('/generate-pdf', async (req, res) => {
  const { html, useCache = true } = req.body;
  if (!html) return res.status(400).json({ error: 'HTML content is required' });

  const key = getCacheKey(html);

  if (useCache && pdfCache.has(key)) {
    return res.setHeader('Content-Type', 'application/pdf'), res.send(pdfCache.get(key));
  }

  try {
    const pdfBuffer = await queue.add(() => generatePDF(html));

    // Cache the PDF for future requests
    if (useCache) pdfCache.set(key, pdfBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: 'PDF generation failed', details: err.message });
  }
});

// app.post('/generate-pdf', async (req, res) => {
//   const { html } = req.body;
//   if (!html) return res.status(400).json({ error: 'HTML content is required' });

//   try {
//     const pdfBuffer = await queue.add(() => generatePDF(html));
//     res.setHeader('Content-Type', 'application/pdf');
//     res.send(pdfBuffer);
//   } catch (err) {
//     res.status(500).json({ error: 'PDF generation failed', details: err.message });
//   } finally {
//   }
// });

// Only listen when running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

// Export as Vercel serverless function
export default app;