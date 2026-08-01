import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportMemoryBookPDF = async (data) => {
  // Create hidden printable element
  const printElem = document.createElement('div');
  printElem.style.position = 'fixed';
  printElem.style.left = '-9999px';
  printElem.style.top = '0';
  printElem.style.width = '800px';
  printElem.style.background = '#ffffff';
  printElem.style.color = '#1e1b4b';
  printElem.style.fontFamily = 'Georgia, serif';
  printElem.style.padding = '40px';

  printElem.innerHTML = `
    <div style="text-align: center; border-bottom: 3px double #e11d48; padding-bottom: 20px; margin-bottom: 30px;">
      <h1 style="font-size: 36px; color: #e11d48; margin: 0;">${data.names.coupleTitle}</h1>
      <p style="font-size: 16px; color: #64748b; font-style: italic; margin-top: 5px;">Girlfriend's Day Official Memory Book</p>
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="font-size: 22px; color: #9f1239; border-bottom: 1px solid #fda4af; padding-bottom: 5px;">❤️ Our Love Letters</h2>
      ${data.letters
        .map(
          (l) => `
        <div style="margin-bottom: 15px; background: #fff1f2; padding: 15px; border-radius: 8px;">
          <h3 style="font-size: 16px; color: #be123c; margin: 0 0 5px 0;">${l.title}</h3>
          <p style="font-size: 13px; color: #334155; line-height: 1.5; white-space: pre-line;">${l.content}</p>
        </div>
      `
        )
        .join('')}
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="font-size: 22px; color: #9f1239; border-bottom: 1px solid #fda4af; padding-bottom: 5px;">📍 Love Map Memory Spots</h2>
      <ul style="list-style: none; padding: 0;">
        ${data.mapPins
          .map(
            (p) => `
          <li style="margin-bottom: 10px; border-left: 3px solid #f43f5e; padding-left: 10px;">
            <strong>${p.title} (${p.category})</strong> - <em>${p.location}</em><br/>
            <span style="font-size: 13px; color: #475569;">"${p.story}"</span>
          </li>
        `
          )
          .join('')}
      </ul>
    </div>

    <div style="margin-bottom: 30px;">
      <h2 style="font-size: 22px; color: #9f1239; border-bottom: 1px solid #fda4af; padding-bottom: 5px;">✨ Bucket List & Dreams</h2>
      <ul style="padding-left: 20px; line-height: 1.8;">
        ${data.bucketList
          .map(
            (b) => `
          <li style="font-size: 14px;">
            ${b.completed ? '✅ [COMPLETED]' : '⏳ [DREAM]'} <strong>${b.title}</strong> (${b.category})
          </li>
        `
          )
          .join('')}
      </ul>
    </div>

    <div style="text-align: center; margin-top: 50px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">
      Created with infinite love by ${data.names.partner1} for ${data.names.partner2} ❤️
    </div>
  `;

  document.body.appendChild(printElem);

  try {
    const canvas = await html2canvas(printElem, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${data.names.partner1}_and_${data.names.partner2}_Memory_Book.pdf`);
  } catch (err) {
    console.error('PDF Generation Error:', err);
  } finally {
    document.body.removeChild(printElem);
  }
};
