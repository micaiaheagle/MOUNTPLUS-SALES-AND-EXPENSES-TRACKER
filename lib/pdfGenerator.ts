import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

// Define types for the generator
export type DocumentType = 'INVOICE' | 'QUOTE' | 'RECEIPT' | 'JOB CARD' | 'STATEMENT';

export interface DocumentItem {
    description: string;
    quantity: number | string;
    price: number | string;
    total: number | string;
}

export interface DocumentData {
    id: string; // e.g. "009"
    date: Date;
    dueDate?: Date;
    customerName: string;
    customerAddress?: string;
    customerPhone?: string;
    customerEmail?: string;
    items: DocumentItem[];
    subtotal?: number;
    tax?: number;
    total: number;
    paymentMethod?: string;
    type: DocumentType;
    currency?: string;
}

const COMPANY_INFO = {
    name: "Mount Plus",
    address: [
        "L. TAKAWIRA & J. TONGOGARA",
        "THE PROPERTY CENTRE 2ND FLOOR",
        "SUITE (OPPOSITE TOWERBLOCK)",
        "BULAWAYO"
    ],
    phone: "+263 77 123 4567", // Placeholder, should be updated if user provides
    email: "info@mountplus.co.zw" // Placeholder
};

const COLORS = {
    primary: '#2E7D32', // Green for headers
    secondary: '#000000',
    accent: '#EF4444', // Red for numbers
    text: '#1F2937',
    lightGray: '#F3F4F6',
    white: '#FFFFFF'
};

export const generateDocumentPDF = (data: DocumentData) => {
    const doc = new jsPDF();

    // -- Header Section --
    // Logo Placeholder (Ideally we'd load the image, for now using text styled as logo)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("MOUNT", 20, 20);
    doc.setTextColor(COLORS.primary);
    doc.text("+PLUS", 65, 20);

    doc.setFontSize(8);
    doc.setTextColor(COLORS.primary);
    doc.text("MAKING DREAMS POSSIBLE", 20, 25);

    // Company Address
    doc.setFontSize(8);
    doc.setTextColor(COLORS.text);
    doc.setFont("helvetica", "normal");
    let yPos = 35;
    COMPANY_INFO.address.forEach(line => {
        doc.text(line, 20, yPos);
        yPos += 4;
    });

    // Document Title (Top Right)
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text(data.type, 190, 20, { align: "right" });

    // -- Info Box (Date/Payment Method) --
    // Resembling the box in the visual
    const boxTop = 30;
    const boxLeft = 140;
    const boxWidth = 55;
    const boxHeight = 16;

    doc.setDrawColor(100);
    doc.rect(boxLeft, boxTop, boxWidth, boxHeight);
    doc.line(boxLeft, boxTop + (boxHeight / 2), boxLeft + boxWidth, boxTop + (boxHeight / 2)); // Middle line

    doc.setFontSize(10);
    doc.setTextColor(COLORS.text);

    // Date Label & Value
    doc.text("DATE", 100, boxTop + 6);
    doc.text(format(new Date(data.date), 'dd/MM/yyyy'), boxLeft + (boxWidth / 2), boxTop + 6, { align: "center" });

    // Payment Method Label & Value
    doc.text("PAYMENT METHOD", 100, boxTop + 14);
    doc.setTextColor(COLORS.accent);
    doc.text(data.paymentMethod || "CASH", boxLeft + (boxWidth / 2), boxTop + 14, { align: "center" });

    // -- Document Number --
    doc.setFontSize(14);
    doc.setTextColor(COLORS.accent);
    doc.text(`No.${data.id}`, 20, 60);

    // -- From / To --
    doc.setFontSize(10);
    doc.setTextColor(COLORS.text);

    doc.text(`From: ${COMPANY_INFO.name}`, 20, 70);
    doc.text(`To: ${data.customerName}`, 120, 70);

    // -- Table --
    const tableTop = 80;

    const tableHeaders = [
        { content: 'DESCRIPTION', styles: { halign: 'left' } },
        { content: 'QUANTITY', styles: { halign: 'center' } },
        { content: 'UNIT PRICE', styles: { halign: 'right' } },
        { content: 'TOTAL', styles: { halign: 'right' } }
    ];

    const tableBody = data.items.map(item => [
        item.description,
        item.quantity.toString(),
        Number(item.price).toFixed(2),
        Number(item.total).toFixed(2)
    ]);

    // Fill empty rows to make it look like the sheet (optional, but requested style has grid)
    // Let's ensure at least 10 rows
    while (tableBody.length < 10) {
        tableBody.push(['', '', '', '']);
    }

    autoTable(doc, {
        startY: tableTop,
        head: [tableHeaders] as any[],
        body: tableBody as any[],
        theme: 'grid',
        headStyles: {
            fillColor: COLORS.primary, // Green Header
            textColor: COLORS.white,
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: {
            textColor: COLORS.text,
            fontSize: 10,
            lineColor: [200, 200, 200]
        },
        columnStyles: {
            0: { cellWidth: 80 }, // Description
            1: { cellWidth: 30, halign: 'center' }, // Qty
            2: { cellWidth: 40, halign: 'right' }, // Price
            3: { cellWidth: 40, halign: 'right' }  // Total
        },
        styles: {
            lineColor: [100, 100, 100],
            lineWidth: 0.1
        }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // -- Footer / Totals --
    doc.setFontSize(12);
    doc.setTextColor(COLORS.text);
    doc.text("Total Due", 120, finalY);

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Black bold for total
    doc.setFont("helvetica", "bold");
    const currencySymbol = data.currency === 'ZIG' ? 'ZiG' : data.currency === 'ZAR' ? 'R' : '$';
    doc.text(`${currencySymbol}${Number(data.total).toFixed(2)}`, 160, finalY);

    // Underline for Total
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(150, finalY + 2, 190, finalY + 2); // Solid line
    // doc.setLineDash([1, 1], 0);
    doc.line(150, finalY + 4, 190, finalY + 4); // Dotted line underneath? Text description says signature line.

    // -- Branding at Bottom --
    const pageHeight = doc.internal.pageSize.height;

    // Large Watermark-like Logo (Text for now)
    doc.setTextColor(230, 230, 230); // Very light grey
    doc.setFontSize(60);
    doc.text("MOUNT+PLUS", 105, pageHeight - 50, { align: "center" });

    // Signature Section
    doc.setDrawColor(0);
    // doc.setLineDash([1, 1], 0); // Removed to fix type error
    doc.line(20, pageHeight - 30, 80, pageHeight - 30); // Signature line
    doc.line(140, pageHeight - 30, 190, pageHeight - 30); // Signature line 2

    doc.setFontSize(10);
    doc.setTextColor(COLORS.text);
    doc.text("David Sithole", 20, pageHeight - 25);
    doc.text("IT Manager", 20, pageHeight - 20);

    doc.text("Signature", 165, pageHeight - 25, { align: "center" });

    // Thank you message box
    doc.setDrawColor(150);
    doc.rect(20, pageHeight - 15, 170, 8);
    doc.setFontSize(10);
    doc.setTextColor(COLORS.text);
    doc.text("THANK YOU FOR YOUR SUPPORT", 105, pageHeight - 10, { align: "center" });

    // Save PDF
    doc.save(`${data.type.toLowerCase()}_${data.id}.pdf`);
};
