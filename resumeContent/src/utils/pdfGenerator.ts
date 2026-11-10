// PDF capture of the résumé. The print class tightens layout for a two-page A4 file.
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// The download captures the live resume. Sleek is the work theme. Retro (play) must not land in the file.
function presentSleek(el: HTMLElement): () => void {
  const body = document.body;
  const bodyHadPlay = body.classList.contains('play');
  const bodyHadWork = body.classList.contains('work');
  const elHadPlay = el.classList.contains('play');
  const elHadWork = el.classList.contains('work');

  body.classList.remove('play');
  body.classList.add('work');
  el.classList.remove('play');
  el.classList.add('work');

  return () => {
    body.classList.toggle('play', bodyHadPlay);
    body.classList.toggle('work', bodyHadWork);
    el.classList.toggle('play', elHadPlay);
    el.classList.toggle('work', elHadWork);
  };
}

const JPEG_QUALITY = 0.88;
/** Balance sharpness vs file size (1 = fastest/smallest, 2 = heavier). */
const CANVAS_SCALE = 1.45;
/** Whitespace above the content on every page after the first. */
const CONTINUATION_TOP_MM = 16;

/**
 * Renders the on-screen `.resume-container` to a multi-page A4 PDF.
 * Uses the live element (not an off-screen clone) so layout, fonts, and CSS match the page.
 */
export async function generateResumePdfFromDom(filename: string): Promise<void> {
  const el = document.querySelector('.resume-container') as HTMLElement | null;
  if (!el) return;

  const btn = el.querySelector('.download-button') as HTMLElement | null;
  const prevVisibility = btn?.style.visibility ?? '';
  const prevPointer = btn?.style.pointerEvents ?? '';
  if (btn) {
    btn.style.visibility = 'hidden';
    btn.style.pointerEvents = 'none';
  }

  await document.fonts?.ready?.catch?.(() => undefined);

  const prevWidth = el.style.width;
  const prevMaxWidth = el.style.maxWidth;
  // Screen layout stays as authored. Sleek classes, the print class, and the fixed width apply only for capture.
  const restoreTheme = presentSleek(el);
  el.classList.add('resume-print');
  el.style.maxWidth = '794px';
  el.style.width = '794px';

  try {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

    const w = Math.max(el.scrollWidth, el.offsetWidth);
    const h = Math.max(el.scrollHeight, el.offsetHeight);

    const canvas = await html2canvas(el, {
      scale: CANVAS_SCALE,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: w,
      height: h,
      windowWidth: w,
      windowHeight: h,
      x: 0,
      y: 0,
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidthMm = pdf.internal.pageSize.getWidth();
    const pageHeightMm = pdf.internal.pageSize.getHeight();

    // Full image scaled to page width.
    const imgWidthMm = pageWidthMm;

    // mm/px is uniform when the image is scaled to page width
    const pxPerMm = canvas.width / pageWidthMm;
    let yPx = 0;
    let pageIndex = 0;

    while (yPx < canvas.height - 0.5) {
      const topMm = pageIndex === 0 ? 0 : CONTINUATION_TOP_MM;
      const sliceBudgetPx = (pageHeightMm - topMm) * pxPerMm;
      const slicePx = Math.min(sliceBudgetPx, canvas.height - yPx);
      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = Math.ceil(slicePx);
      const ctx = sliceCanvas.getContext('2d');
      if (!ctx) break;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
      ctx.drawImage(
        canvas,
        0,
        yPx,
        canvas.width,
        slicePx,
        0,
        0,
        canvas.width,
        slicePx,
      );

      const sliceData = sliceCanvas.toDataURL('image/jpeg', JPEG_QUALITY);
      const sliceHeightMm = slicePx / pxPerMm;

      if (pageIndex > 0) pdf.addPage();
      pdf.addImage(sliceData, 'JPEG', 0, topMm, imgWidthMm, sliceHeightMm);

      yPx += slicePx;
      pageIndex++;
    }

    pdf.save(filename);
  } catch (e) {
    console.error('PDF generation failed:', e);
  } finally {
    el.classList.remove('resume-print');
    restoreTheme();
    el.style.width = prevWidth;
    el.style.maxWidth = prevMaxWidth;
    if (btn) {
      btn.style.visibility = prevVisibility;
      btn.style.pointerEvents = prevPointer;
    }
  }
}

export default generateResumePdfFromDom;
