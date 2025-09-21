import { generatePDF } from './pdfUtils.js';

let concurrent = 0;
const MAX_CONCURRENT = 5; // adjust concurrency limit

// List of allowed origins (you can customize)
// Universal CORS headers
const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow all origins for testing
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

export default async function handler(req, res) {
    // -------------------------------
    // Handle CORS preflight request
    // -------------------------------
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        // CORS preflight
        return res.status(204).end();
    }
    // -------------------------------
    // Handle GET request (root domain)
    // -------------------------------
    if (req.method === 'GET') {
        return res.json({ message: 'PDF generation server is running. Use POST /generate-pdf to generate PDFs.' });
    }

    // -------------------------------
    // Only POST is allowed for PDF generation
    // -------------------------------
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST for PDF generation.' });
    }

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
