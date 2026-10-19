import PDFDocument from 'pdfkit';

/**
 * Generate Authentic Airbnb Official Booking Invoice & Confirmation PDF Buffer
 * Matching real airbnb.com / airbnb.co.in confirmation & receipt layout
 * 
 * @param {Object} booking 
 * @returns {Promise<Buffer>}
 */
export function generateBookingInvoicePDF(booking) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 48, bottom: 48, left: 52, right: 52 },
        info: {
          Title: `Airbnb Customer Receipt - ${booking.booking_code || 'Booking'}`,
          Author: 'Airbnb, Inc.',
          Subject: 'Official Customer Receipt and Travel Itinerary',
          Keywords: 'Airbnb, Receipt, Invoice, Booking Confirmation'
        }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Authentic Airbnb Palette
      const brandRed = '#FF385C';
      const black = '#222222';
      const grayLight = '#717171';
      const grayBorder = '#DDDDDD';
      const softBg = '#F7F7F7';
      const greenPaid = '#008A05';

      // --- 1. TOP HEADER ---
      // Real Airbnb Bélo Path
      doc.save();
      doc.translate(52, 48);
      doc.scale(0.8);
      doc
        .path('M16 1c2.008 0 3.463.963 4.751 3.269l.533.993c2.428 4.604 5.385 10.428 6.438 12.875 1.188 2.76 1.778 5.161 1.778 7.238 0 3.738-2.887 6.625-6.625 6.625-2.478 0-4.636-1.285-5.875-3.328-1.239 2.043-3.397 3.328-5.875 3.328-3.738 0-6.625-2.887-6.625-6.625 0-2.077.59-4.478 1.778-7.238 1.053-2.447 4.01-8.271 6.438-12.875l.533-.993C10.537 1.963 11.992 1 16 1zm0 3c-2.446 0-3.411 1.042-4.484 2.969l-.534.993c-2.396 4.545-5.327 10.32-6.368 12.739-1.04 2.417-1.614 4.582-1.614 6.424 0 2.222 1.778 4 4 4 1.838 0 3.407-1.218 3.876-2.991l.124-.551c.362-1.849 1.488-5.382 5-5.382s4.638 3.533 5 5.382l.124.551c.469 1.773 2.038 2.991 3.876 2.991 2.222 0 4-1.778 4-4 0-1.842-.574-4.007-1.614-6.424-1.041-2.419-3.972-8.194-6.368-12.739l-.534-.993C19.411 5.042 18.446 4 16 4zm0 14c-1.657 0-3 1.343-3 3 0 1.258.775 2.336 1.874 2.766l.376.119.375-.119c1.099-.43 1.875-1.508 1.875-2.766 0-1.657-1.343-3-3-3z')
        .fill(brandRed);
      doc.restore();

      // Top Right Document Type
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor(black)
        .text('CUSTOMER RECEIPT & ITINERARY', 250, 52, { align: 'right' })
        .fontSize(9)
        .font('Helvetica')
        .fillColor(grayLight)
        .text(`Receipt date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`, 250, 68, { align: 'right' });

      // Subtle Divider
      doc
        .moveTo(52, 92)
        .lineTo(543, 92)
        .strokeColor(grayBorder)
        .lineWidth(1)
        .stroke();

      // --- 2. HERO GREETING & CONFIRMATION ---
      const guestFirstName = (booking.guest_name || 'Guest').split(' ')[0];
      const code = booking.booking_code || 'BK-CONFIRMED';
      
      doc
        .fontSize(22)
        .font('Helvetica-Bold')
        .fillColor(black)
        .text(`You're going to ${booking.location?.split(',')[0] || 'Jaipur'}, ${guestFirstName}!`, 52, 110);

      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor(grayLight)
        .text('Your reservation is confirmed. Show this receipt or give your confirmation code when you arrive.', 52, 138);

      // --- 3. CONFIRMATION CODE CALLOUT BOX ---
      const calloutY = 162;
      doc
        .roundedRect(52, calloutY, 491, 56, 8)
        .fillColor(softBg)
        .strokeColor(grayBorder)
        .lineWidth(1)
        .fillAndStroke();

      // Left code column
      doc
        .fontSize(8.5)
        .font('Helvetica-Bold')
        .fillColor(grayLight)
        .text('CONFIRMATION CODE', 70, calloutY + 12);

      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor(black)
        .text(code, 70, calloutY + 26);

      // Right status pill
      doc
        .fontSize(8.5)
        .font('Helvetica-Bold')
        .fillColor(grayLight)
        .text('BOOKING STATUS', 370, calloutY + 12);

      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor(greenPaid)
        .text('● CONFIRMED & PAID', 370, calloutY + 28);

      // --- 4. RESERVATION DETAILS (Airbnb Clean Table) ---
      const resY = 236;
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .fillColor(black)
        .text('Reservation details', 52, resY);

      // Detail card frame
      const detailCardY = resY + 18;
      doc
        .roundedRect(52, detailCardY, 491, 130, 8)
        .strokeColor(grayBorder)
        .lineWidth(1)
        .stroke();

      // Listing Title & Package
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .fillColor(black)
        .text(booking.listing_title || 'Tailored Service & Experience', 70, detailCardY + 14, { width: 455 });

      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor(brandRed)
        .text(`Selected Package: ${booking.package_title || 'Standard Experience'}`, 70, detailCardY + 30);

      // Micro line inside card
      doc
        .moveTo(70, detailCardY + 46)
        .lineTo(523, detailCardY + 46)
        .strokeColor(grayBorder)
        .lineWidth(0.5)
        .stroke();

      const rawDate = booking.booking_date || booking.check_in || new Date();
      const formattedDate = new Date(rawDate).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      // 4 clean columns
      const colY = detailCardY + 56;
      
      // Col 1: Date
      doc.fontSize(8).font('Helvetica-Bold').fillColor(grayLight).text('DATE', 70, colY);
      doc.fontSize(9.5).font('Helvetica-Bold').fillColor(black).text(formattedDate, 70, colY + 14, { width: 100 });

      // Col 2: Time
      doc.fontSize(8).font('Helvetica-Bold').fillColor(grayLight).text('TIME', 180, colY);
      doc.fontSize(9.5).font('Helvetica-Bold').fillColor(black).text(booking.booking_time || '10:00 am', 180, colY + 14);

      // Col 3: Guests
      const guests = booking.guests_count || 1;
      doc.fontSize(8).font('Helvetica-Bold').fillColor(grayLight).text('GUESTS', 280, colY);
      doc.fontSize(9.5).font('Helvetica-Bold').fillColor(black).text(`${guests} guest${guests > 1 ? 's' : ''}`, 280, colY + 14);

      // Col 4: Host
      doc.fontSize(8).font('Helvetica-Bold').fillColor(grayLight).text('HOSTED BY', 390, colY);
      doc.fontSize(9.5).font('Helvetica-Bold').fillColor(black).text(booking.host_name || 'Host', 390, colY + 14, { width: 130 });

      // Location row at bottom of card
      doc
        .fontSize(8.5)
        .font('Helvetica-Bold')
        .fillColor(grayLight)
        .text('MEETING / STARTING LOCATION:', 70, detailCardY + 98, { continued: true })
        .font('Helvetica')
        .fillColor(black)
        .text(`  ${booking.location || 'Jaipur, Rajasthan, India'}`);

      // --- 5. RECEIPT & PAYMENT BREAKDOWN ---
      const payY = 388;
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .fillColor(black)
        .text('Payment breakdown', 52, payY);

      // Table container
      const payBoxY = payY + 18;
      doc
        .roundedRect(52, payBoxY, 491, 148, 8)
        .strokeColor(grayBorder)
        .lineWidth(1)
        .stroke();

      const totalNum = Number(booking.total_amount || 0);

      // Row 1: Item
      doc
        .fontSize(9.5)
        .font('Helvetica')
        .fillColor(black)
        .text(`${booking.package_title || 'Service Booking'} (${guests} guest${guests > 1 ? 's' : ''})`, 70, payBoxY + 16)
        .font('Helvetica-Bold')
        .text(`₹${totalNum.toLocaleString('en-IN')}`, 430, payBoxY + 16, { align: 'right', width: 93 });

      // Row 2: Service fee
      doc
        .fontSize(9.5)
        .font('Helvetica')
        .fillColor(grayLight)
        .text('Airbnb service fee & applicable taxes', 70, payBoxY + 36)
        .fillColor(black)
        .text('₹0', 430, payBoxY + 36, { align: 'right', width: 93 });

      // Divider in table
      doc
        .moveTo(70, payBoxY + 56)
        .lineTo(523, payBoxY + 56)
        .strokeColor(grayBorder)
        .lineWidth(0.5)
        .stroke();

      // Row 3: Total Paid
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor(black)
        .text('Total (INR)', 70, payBoxY + 68)
        .fontSize(12)
        .fillColor(black)
        .text(`₹${totalNum.toLocaleString('en-IN')}`, 430, payBoxY + 67, { align: 'right', width: 93 });

      // Divider in table
      doc
        .moveTo(70, payBoxY + 92)
        .lineTo(523, payBoxY + 92)
        .strokeColor(grayBorder)
        .lineWidth(0.5)
        .stroke();

      // Row 4: Payment details & Razorpay info
      doc
        .fontSize(8.5)
        .font('Helvetica')
        .fillColor(grayLight)
        .text('Payment method: Razorpay Secured Gateway (UPI / Card / NetBanking)', 70, payBoxY + 104)
        .text(`Razorpay Payment ID: ${booking.razorpay_payment_id || 'pay_online_verified'}`, 70, payBoxY + 118)
        .font('Helvetica-Bold')
        .fillColor(greenPaid)
        .text('STATUS: FULLY PAID', 410, payBoxY + 111, { align: 'right', width: 113 });

      // --- 6. CANCELLATION & AIRCOVER SECTION ---
      const airCoverY = 556;
      doc
        .roundedRect(52, airCoverY, 491, 56, 8)
        .fillColor('#F9FAFB')
        .strokeColor(grayBorder)
        .lineWidth(1)
        .fillAndStroke();

      doc
        .fontSize(9.5)
        .font('Helvetica-Bold')
        .fillColor(brandRed)
        .text('air', 70, airCoverY + 12, { continued: true })
        .fillColor(black)
        .text('cover', { continued: true })
        .font('Helvetica')
        .fillColor(grayLight)
        .text('  protection included with every booking.', { align: 'left' });

      doc
        .fontSize(8.5)
        .font('Helvetica')
        .fillColor(grayLight)
        .text('Free cancellation up to 24 hours before start time. If anything goes wrong, we’ll help make it right with booking protection and 24/7 customer support.', 70, airCoverY + 28, { width: 455 });

      // --- 7. FOOTER SECTION ---
      const footY = 645;
      doc
        .moveTo(52, footY)
        .lineTo(543, footY)
        .strokeColor(grayBorder)
        .lineWidth(0.8)
        .stroke();

      doc
        .fontSize(8)
        .font('Helvetica-Bold')
        .fillColor(black)
        .text('Airbnb Ireland UC', 52, footY + 14);

      doc
        .fontSize(7.5)
        .font('Helvetica')
        .fillColor(grayLight)
        .text('The Watermarque Building, South Lotts Road, Ringsend, Dublin 4, Ireland  |  VAT number: IE 9827384L', 52, footY + 26)
        .text('Questions or concerns? Contact Airbnb Customer Support at www.airbnb.co.in/help', 52, footY + 38);

      doc
        .fontSize(7.5)
        .font('Helvetica')
        .fillColor(grayLight)
        .text(`Reference: ${code}`, 430, footY + 14, { align: 'right', width: 113 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
