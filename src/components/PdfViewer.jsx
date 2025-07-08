import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function PdfViewer({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const goToPrevPage = () =>
    setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  
  const goToNextPage = () =>
    setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));

  return (
    <div className="pdf-viewer-container">
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
        <button className="btn btn-dark rounded-0 shadow-sm" onClick={goToPrevPage} disabled={pageNumber <= 1}>
          Previous
        </button>
        <span>
          Page {pageNumber} of {numPages}
        </span>
        <button className="btn btn-dark rounded-0 shadow-sm" onClick={goToNextPage} disabled={pageNumber >= numPages}>
          Next
        </button>
      </div>
      <div className="pdf-document-container" style={{ overflow: 'auto', maxHeight: '80vh' }}>
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={console.error}
        >
          <Page pageNumber={pageNumber} renderTextLayer={true} renderAnnotationLayer={true} />
        </Document>
      </div>
    </div>
  );
}

export default PdfViewer;
