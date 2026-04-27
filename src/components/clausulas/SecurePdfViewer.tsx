'use client';

import { useEffect, useRef, useState } from 'react';

const pdfSrc = '/Clausulas_membrete_2026.pdf';

type PdfPage = {
  getViewport: (options: { scale: number }) => { width: number; height: number };
  render: (options: {
    canvasContext: CanvasRenderingContext2D;
    viewport: { width: number; height: number };
  }) => { promise: Promise<void>; cancel: () => void };
};

type PdfDocument = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPage>;
  destroy: () => Promise<void>;
};

export default function SecurePdfViewer() {
  const pagesRef = useRef<HTMLDivElement>(null);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const showNotice = () => {
      setNoticeVisible(true);
      window.setTimeout(() => setNoticeVisible(false), 1800);
    };

    const preventContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      showNotice();
    };

    const preventShortcuts = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const blocked =
        key === 'printscreen' ||
        ((event.ctrlKey || event.metaKey) && ['s', 'p', 'u'].includes(key)) ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && ['i', 'j', 'c'].includes(key));

      if (!blocked) {
        return;
      }

      event.preventDefault();
      showNotice();
    };

    window.addEventListener('contextmenu', preventContextMenu);
    window.addEventListener('keydown', preventShortcuts);

    return () => {
      window.removeEventListener('contextmenu', preventContextMenu);
      window.removeEventListener('keydown', preventShortcuts);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let activePdf: PdfDocument | null = null;

    const renderPdf = async () => {
      const pagesContainer = pagesRef.current;

      if (!pagesContainer) {
        return;
      }

      setIsLoading(true);
      setHasError(false);
      pagesContainer.replaceChildren();

      try {
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

        const loadingTask = pdfjsLib.getDocument({ url: pdfSrc });
        const pdf = (await loadingTask.promise) as unknown as PdfDocument;
        activePdf = pdf;

        if (cancelled) {
          await pdf.destroy();
          return;
        }

        const availableWidth = Math.max(280, pagesContainer.clientWidth - 32);

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (cancelled) {
            break;
          }

          const page = await pdf.getPage(pageNumber);
          const baseViewport = page.getViewport({ scale: 1 });
          const scale = Math.min(1.45, availableWidth / baseViewport.width);
          const viewport = page.getViewport({ scale });
          const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

          const pageShell = document.createElement('div');
          pageShell.className =
            'mx-auto mb-6 overflow-hidden rounded-xl border border-border bg-white shadow-lg shadow-primary/5';

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if (!context) {
            throw new Error('No se pudo preparar el visor del documento.');
          }

          canvas.width = Math.floor(viewport.width * pixelRatio);
          canvas.height = Math.floor(viewport.height * pixelRatio);
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;
          canvas.style.maxWidth = '100%';
          canvas.style.display = 'block';
          canvas.setAttribute('aria-label', `Página ${pageNumber}`);

          context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          pageShell.appendChild(canvas);
          pagesContainer.appendChild(pageShell);

          await page.render({ canvasContext: context, viewport }).promise;
        }

        if (!cancelled) {
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    renderPdf();

    return () => {
      cancelled = true;
      pagesRef.current?.replaceChildren();
      void activePdf?.destroy();
    };
  }, []);

  return (
    <>
      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-primary/10"
        onContextMenu={(event) => event.preventDefault()}
        onCopy={(event) => event.preventDefault()}
        onCut={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
      >
        <div className="flex items-center justify-between border-b border-border bg-[#3C60A2] px-4 py-3 sm:px-6">
          <p className="text-sm font-medium uppercase tracking-wide text-white">
            Documento oficial
          </p>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
            2026
          </span>
        </div>

        <div className="h-[72vh] min-h-[560px] overflow-y-auto bg-[#f6f4f2] px-3 py-5 sm:px-5">
          {isLoading && (
            <div className="flex h-full min-h-[420px] items-center justify-center text-center">
              <div>
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                <p className="text-sm font-medium text-primary">Cargando documento...</p>
              </div>
            </div>
          )}

          {hasError && (
            <div className="flex h-full min-h-[420px] items-center justify-center text-center">
              <div className="max-w-md rounded-xl border border-primary/20 bg-white px-5 py-4 text-primary shadow-lg">
                No se pudo cargar el documento en este momento.
              </div>
            </div>
          )}

          <div
            ref={pagesRef}
            className={isLoading || hasError ? 'hidden select-none' : 'select-none'}
            aria-label="Cláusulas Jardines del Renacer 2026"
          />
        </div>

        {noticeVisible && (
          <div className="pointer-events-none absolute inset-x-4 top-20 mx-auto max-w-sm rounded-xl border border-primary/20 bg-white/95 px-4 py-3 text-center text-sm font-medium text-primary shadow-lg">
            Acción no disponible en esta vista.
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }

          body::before {
            content: 'Documento protegido';
            visibility: visible !important;
            display: flex;
            min-height: 100vh;
            align-items: center;
            justify-content: center;
            color: #3c60a2;
            font-family: Inter, Arial, sans-serif;
            font-size: 22px;
            font-weight: 600;
          }
        }
      `}</style>
    </>
  );
}
