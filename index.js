import { generatePDF } from './pdfUtils.js';

let concurrent = 0;
const MAX_CONCURRENT = 5;

export default async function handler(req, res) {
  const origin = req.headers.origin || '*';

  // Always set CORS headers
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ message: 'PDF server running. Use POST /generate-pdf.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Parse JSON body (Vercel Node supports req.body directly if JSON sent correctly)
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
}
