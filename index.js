import cors from 'cors';
import express from 'express';
import { generatePDF } from './pdfUtils.js';

const app = express();
app.use(cors()); // works here!
app.use(express.json({ limit: '5mb' }));

let concurrent = 0;
const MAX_CONCURRENT = 5;

app.options('/generate-pdf', (req, res) => res.sendStatus(204));

app.post('/generate-pdf', async (req, res) => {
  const { html } = req.body;
  if (!html) return res.status(400).json({ error: 'HTML content is required' });

  if (concurrent >= MAX_CONCURRENT) {
    return res.status(429).json({ error: 'Server busy. Try again later.' });
  }

  concurrent++;
  try {
    const pdfBuffer = await generatePDF(html);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: 'PDF generation failed', details: err.message });
  } finally {
    concurrent--;
  }
});

// Export as Vercel serverless function
export default app;
