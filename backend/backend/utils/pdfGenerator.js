const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate order receipt PDF
const generateOrderReceipt = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const filename = `receipt-${order._id}-${Date.now()}.pdf`;
      const filepath = path.join(__dirname, '../uploads', filename);

      doc.pipe(fs.createWriteStream(filepath));

      // Header
      doc.fontSize(20).text('SnapTech Electronics', 50, 50);
      doc.fontSize(10).text('Your Electronics Destination', 50, 75);
      
      // Receipt title
      doc.fontSize(16).text('PURCHASE RECEIPT', 50, 120);
      
      // Order details
      doc.fontSize(12).text(`Order ID: ${order._id}`, 50, 150);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 170);
      doc.text(`Status: ${order.orderStatus}`, 50, 190);
      
      // Customer details
      doc.text('BILLING INFORMATION:', 50, 220);
      doc.fontSize(10)
        .text(`Name: ${order.shippingAddress.fullName}`, 50, 240)
        .text(`Address: ${order.shippingAddress.address}`, 50, 255)
        .text(`City: ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`, 50, 270)
        .text(`Phone: ${order.shippingAddress.phone}`, 50, 285);

      // Items table header
      let yPosition = 320;
      doc.fontSize(12).text('ITEMS:', 50, yPosition);
      yPosition += 20;
      
      doc.fontSize(10)
        .text('Item', 50, yPosition)
        .text('Qty', 300, yPosition)
        .text('Price', 350, yPosition)
        .text('Total', 450, yPosition);
      
      yPosition += 15;
      doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
      yPosition += 10;

      // Items
      order.orderItems.forEach(item => {
        doc.text(item.name, 50, yPosition, { width: 240 })
          .text(item.quantity.toString(), 300, yPosition)
          .text(`₹${item.price}`, 350, yPosition)
          .text(`₹${(item.price * item.quantity).toFixed(2)}`, 450, yPosition);
        yPosition += 20;
      });

      // Totals
      yPosition += 10;
      doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
      yPosition += 15;
      
      const subtotal = order.totalPrice - order.taxPrice - order.shippingPrice;
      
      doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 350, yPosition);
      yPosition += 15;
      doc.text(`Tax: ₹${order.taxPrice.toFixed(2)}`, 350, yPosition);
      yPosition += 15;
      doc.text(`Shipping: ₹${order.shippingPrice.toFixed(2)}`, 350, yPosition);
      yPosition += 15;
      doc.fontSize(12).text(`Total: ₹${order.totalPrice.toFixed(2)}`, 350, yPosition);

      // Payment method
      yPosition += 30;
      doc.fontSize(10).text(`Payment Method: ${order.paymentMethod}`, 50, yPosition);
      if (order.isPaid) {
        doc.text(`Paid on: ${new Date(order.paidAt).toLocaleDateString()}`, 50, yPosition + 15);
      }

      // Footer
      yPosition += 50;
      doc.text('Thank you for shopping with SnapTech!', 50, yPosition);
      doc.text('For support, contact: support@snaptech.com', 50, yPosition + 15);

      doc.end();

      doc.on('end', () => {
        resolve(`/uploads/${filename}`);
      });

    } catch (error) {
      reject(error);
    }
  });
};

// Generate admin sales report PDF
const generateSalesReport = async (orders, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const filename = `sales-report-${Date.now()}.pdf`;
      const filepath = path.join(__dirname, '../uploads', filename);

      doc.pipe(fs.createWriteStream(filepath));

      // Header
      doc.fontSize(20).text('SnapTech Electronics', 50, 50);
      doc.fontSize(16).text('Sales Report', 50, 80);
      
      // Date range
      doc.fontSize(12).text(`Period: ${startDate} to ${endDate}`, 50, 110);

      // Summary statistics
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      let yPosition = 140;
      doc.text(`Total Orders: ${totalOrders}`, 50, yPosition);
      yPosition += 20;
      doc.text(`Total Revenue: ₹${totalRevenue.toFixed(2)}`, 50, yPosition);
      yPosition += 20;
      doc.text(`Average Order Value: ₹${avgOrderValue.toFixed(2)}`, 50, yPosition);

      // Orders table
      yPosition += 40;
      doc.fontSize(12).text('ORDER DETAILS:', 50, yPosition);
      yPosition += 20;

      doc.fontSize(10)
        .text('Order ID', 50, yPosition)
        .text('Customer', 150, yPosition)
        .text('Date', 250, yPosition)
        .text('Status', 350, yPosition)
        .text('Amount', 450, yPosition);
      
      yPosition += 15;
      doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
      yPosition += 10;

      orders.forEach(order => {
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }
        
        doc.text(order._id.toString().substr(-8), 50, yPosition)
          .text(order.shippingAddress.fullName, 150, yPosition, { width: 90 })
          .text(new Date(order.createdAt).toLocaleDateString(), 250, yPosition)
          .text(order.orderStatus, 350, yPosition)
          .text(`₹${order.totalPrice.toFixed(2)}`, 450, yPosition);
        yPosition += 15;
      });

      doc.end();

      doc.on('end', () => {
        resolve(`/uploads/${filename}`);
      });

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateOrderReceipt,
  generateSalesReport,
};
