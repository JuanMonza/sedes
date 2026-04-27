'use client';

import { useEffect, useState } from 'react';

const pdfSrc = '/Clausulas_membrete_2026.pdf#toolbar=0&navpanes=0&scrollbar=1&view=FitH';

export default function SecurePdfViewer() {
  const [noticeVisible, setNoticeVisible] = useState(false);

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

        <iframe
          title="Cláusulas Jardines del Renacer 2026"
          src={pdfSrc}
          className="block h-[72vh] min-h-[560px] w-full bg-white"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

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
