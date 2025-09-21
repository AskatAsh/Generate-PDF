import { generatePDF } from './pdfUtils.js';

let concurrent = 0;
const MAX_CONCURRENT = 5;

export default async function handler(req, res) {
  const origin = req.headers.origin || '*';

  // Universal CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // ---- Handle OPTIONS preflight ----
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // ---- Handle GET request (root) ----
  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({ message: 'PDF server is running. Use POST /generate-pdf.' }),
      { status: 200, headers: corsHeaders }
    );
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  // ---- Parse JSON body ----
  let body;
  try {
    body = await req.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const { html } = body;
  if (!html) {
    return new Response(JSON.stringify({ error: 'HTML content is required' }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  if (concurrent >= MAX_CONCURRENT) {
    return new Response(JSON.stringify({ error: 'Server busy. Try again later.' }), {
      status: 429,
      headers: corsHeaders,
    });
  }

  concurrent++;
  try {
    const pdfBuffer = await generatePDF(html);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'PDF generation failed', details: err.message }),
      { status: 500, headers: corsHeaders }
    );
  } finally {
    concurrent--;
  }
}
