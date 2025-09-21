export const invoiceHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: Roboto, sans-serif; margin: 0; padding: 0; background: #fff; color: #333; }
    .invoice { max-width: 800px; margin: 40px auto; padding: 40px; background: #fff; position: relative; border: 1px solid #ddd; box-shadow: 0 0 6px rgba(0,0,0,.1); }
    .invoice::before { content: ""; background: url(https://i.etsystatic.com/19903187/r/il/4132f5/3687039736/il_fullxfull.3687039736_1pps.jpg) no-repeat center; background-size: 400px; opacity: .1; position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
    .invoice * { position: relative; z-index: 1; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
    header h1 { font-size: 28px; font-weight: 700; }
    .company-details { text-align: right; }
    .company-details h2 { margin: 0; font-size: 18px; font-weight: 500; }
    .details { margin-bottom: 30px; display: flex; justify-content: space-between; }
    .details .client, .details .invoice-info { width: 48%; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    table td, table th { padding: 12px; border: 1px solid #ddd; text-align: left; }
    table th { background: #f4f4f4; font-weight: 500; }
    .totals { display: flex; justify-content: flex-end; }
    .totals table { width: 300px; }
    .totals td { text-align: right; }
    footer { text-align: center; margin-top: 40px; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="invoice">
    <header>
      <h1>INVOICE</h1>
      <div class="company-details">
        <h2>Your Company</h2>
        <p>123 Street, City</p>
        <p>Email: info@company.com</p>
        <p>Phone: +123 456 7890</p>
      </div>
    </header>
    <section class="details">
      <div class="client">
        <h3>Bill To:</h3>
        <p>Client Name</p>
        <p>456 Another Street</p>
        <p>City, Country</p>
        <p>Email: client@email.com</p>
      </div>
      <div class="invoice-info">
        <h3>Invoice Details:</h3>
        <p><strong>Invoice #:</strong>001</p>
        <p><strong>Date:</strong>Sept 18, 2025</p>
        <p><strong>Due Date:</strong>Sept 25, 2025</p>
      </div>
    </section>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Web Design Services</td>
          <td>10</td>
          <td>$50</td>
          <td>$500</td>
        </tr>
        <tr>
          <td>Hosting (1 year)</td>
          <td>1</td>
          <td>$100</td>
          <td>$100</td>
        </tr>
      </tbody>
    </table>
    <div class="totals">
      <table>
        <tr>
          <td>Subtotal:</td>
          <td>$600</td>
        </tr>
        <tr>
          <td>Tax (10%):</td>
          <td>$60</td>
        </tr>
        <tr>
          <th>Grand Total:</th>
          <th>$660</th>
        </tr>
      </table>
    </div>
    <footer>
      <p>Thank you for your business!</p>
    </footer>
  </div>
</body>
</html>
`;
