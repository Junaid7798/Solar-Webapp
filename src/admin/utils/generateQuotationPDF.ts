import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';

interface QuotationData {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCity: string;
  customerAddress?: string;
  systemSize: number;
  panelCount: number;
  panelBrand: string;
  inverterBrand: string;
  batteryIncluded: boolean;
  batterySpecs?: string;
  baseCost: number;
  centralSubsidy: number;
  stateSubsidy: number;
  finalCost: number;
  monthlySavings: number;
  annualSavings: number;
  paybackYears: number;
  warrantyPanels: string;
  warrantyInverter: string;
  warrantyInstallation: string;
  validDays: number;
}

export const generateQuotationPDF = async (data: QuotationData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const skyDeep = [13, 27, 42]; // #0D1B2A
  const sun = [255, 179, 71]; // #FFB347
  
  // Header
  doc.setFillColor(...(skyDeep as [number, number, number]));
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('SOLAR QUOTATION', pageWidth - 20, 25, { align: 'right' });
  
  doc.setFontSize(18);
  doc.setTextColor(...(sun as [number, number, number]));
  doc.text('SolarEdge Pro', 20, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text('Maharashtra Solar Specialists', 20, 28);
  
  // Info Row
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.text(`Quote ID: ${data.id}`, 20, 50);
  doc.text(`Date: ${data.date}`, pageWidth / 2, 50, { align: 'center' });
  doc.text(`Valid For: ${data.validDays} Days`, pageWidth - 20, 50, { align: 'right' });
  
  // Customer Section
  doc.setFillColor(245, 247, 252);
  doc.rect(20, 60, pageWidth - 40, 35, 'F');
  
  doc.setTextColor(...(skyDeep as [number, number, number]));
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PREPARED FOR', 25, 70);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(data.customerName, 25, 80);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`${data.customerCity}, Maharashtra`, 25, 87);
  doc.text(`Phone: ${data.customerPhone} | Email: ${data.customerEmail || 'N/A'}`, pageWidth - 25, 80, { align: 'right' });

  // System Specs Table
  autoTable(doc, {
    startY: 105,
    head: [['SYSTEM SPECIFICATION', 'DETAILS']],
    body: [
      ['System Size', `${data.systemSize} kW`],
      ['Solar Panels', `${data.panelCount} x ${data.panelBrand}`],
      ['Inverter', data.inverterBrand],
      ['Battery Storage', data.batteryIncluded ? data.batterySpecs : 'Not Included'],
    ],
    theme: 'striped',
    headStyles: { fillColor: skyDeep as any, textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } }
  });

  // Cost Breakdown Table
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [['COST BREAKDOWN', 'AMOUNT (INR)']],
    body: [
      ['Base System Cost', `Rs. ${data.baseCost.toLocaleString()}`],
      ['Central Subsidy (PM Surya Ghar)', `- Rs. ${data.centralSubsidy.toLocaleString()}`],
      ['State Subsidy (MEDA)', `- Rs. ${data.stateSubsidy.toLocaleString()}`],
      [{ content: 'YOUR FINAL COST', styles: { fontStyle: 'bold', textColor: skyDeep as any } }, { content: `Rs. ${data.finalCost.toLocaleString()}`, styles: { fontStyle: 'bold', textColor: [0, 150, 0] } }],
    ],
    theme: 'grid',
    headStyles: { fillColor: skyDeep as any, textColor: [255, 255, 255] },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: { 1: { halign: 'right' } }
  });

  // Savings Section
  const savingsY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...(skyDeep as [number, number, number]));
  doc.text('YOUR SAVINGS ESTIMATE', 20, savingsY);
  
  autoTable(doc, {
    startY: savingsY + 5,
    body: [
      ['Monthly Savings', `Rs. ${data.monthlySavings.toLocaleString()}`, 'Annual Savings', `Rs. ${data.annualSavings.toLocaleString()}`],
      ['Payback Period', `${data.paybackYears} Years`, '25 Year Savings', `Rs. ${(data.annualSavings * 25).toLocaleString()}`],
    ],
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: { 0: { fontStyle: 'bold' }, 2: { fontStyle: 'bold' } }
  });

  // Warranty Section
  const warrantyY = (doc as any).lastAutoTable.finalY + 10;
  autoTable(doc, {
    startY: warrantyY,
    head: [['WARRANTY & TERMS']],
    body: [
      [`Panels: ${data.warrantyPanels}`],
      [`Inverter: ${data.warrantyInverter}`],
      [`Installation: ${data.warrantyInstallation}`],
    ],
    theme: 'plain',
    headStyles: { fontStyle: 'bold', textColor: skyDeep as any },
    styles: { fontSize: 9, cellPadding: 2 }
  });

  // QR Code & Footer
  const footerY = 260;
  try {
    const qrDataUrl = await QRCode.toDataURL(`https://wa.me/918237655610?text=I%20am%20interested%20in%20Quote%20${data.id}`);
    doc.addImage(qrDataUrl, 'PNG', pageWidth - 45, footerY - 25, 25, 25);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Scan to Chat', pageWidth - 32.5, footerY + 5, { align: 'center' });
  } catch (err) {
    console.error('QR Code generation failed', err);
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...(sun as [number, number, number]));
  doc.text('Suraj Sabka Hai — Apna Haq Lo', 20, footerY);
  
  doc.setDrawColor(200, 200, 200);
  doc.line(20, footerY + 15, 70, footerY + 15);
  doc.line(pageWidth - 70, footerY + 15, pageWidth - 20, footerY + 15);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 150, 150);
  doc.text('Authorized Signature', 45, footerY + 20, { align: 'center' });
  doc.text('Company Stamp', pageWidth - 45, footerY + 20, { align: 'center' });

  return doc;
};
