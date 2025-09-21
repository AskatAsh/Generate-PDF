import cors from 'cors';
import express from 'express';
import { generatePDF } from './pdfUtils.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

let concurrent = 0;
const MAX_CONCURRENT = 5;

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
    console.error(err);
    res.status(500).json({ error: 'PDF generation failed', details: err.message });
  } finally {
    concurrent--;
  }
});

app.get('/', (req, res) => {
  res.send({ message: 'PDF server running locally' });
});

app.listen(PORT, () => {
  console.log(`✅ Local server running at http://localhost:${PORT}`);
});
