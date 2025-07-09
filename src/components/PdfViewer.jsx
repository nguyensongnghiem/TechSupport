import React, { useState, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { IconButton, Typography, Input, Button } from "@material-tailwind/react";
import {
  FaSearchMinus,
  FaSearchPlus,
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt, // Icon cho nút mở tab mới
} from "react-icons/fa";

// Cấu hình worker cho react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function PdfViewer({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [gotoPageInput, setGotoPageInput] = useState("");

  useEffect(() => {
    setScale(1.0);
    setGotoPageInput("");
    setCurrentPageNum(1);
  }, [pdfUrl]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setCurrentPageNum(1);
  }

  const zoomOut = useCallback(() => setScale((s) => Math.max(s - 0.2, 0.4)), []);
  const zoomIn = useCallback(() => setScale((s) => Math.min(s + 0.2, 3.0)), []);

  const goToNextPage = useCallback(() => {
    if (currentPageNum < numPages) {
      const nextPage = currentPageNum + 1;
      setCurrentPageNum(nextPage);
      const pageElement = document.getElementById(`pdf-page-${nextPage}`);
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [currentPageNum, numPages]);

  const goToPrevPage = useCallback(() => {
    if (currentPageNum > 1) {
      const prevPage = currentPageNum - 1;
      setCurrentPageNum(prevPage);
      const pageElement = document.getElementById(`pdf-page-${prevPage}`);
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [currentPageNum]);

  const handleGoToPage = useCallback(() => {
    const page = parseInt(gotoPageInput, 10);
    if (page > 0 && page <= numPages) {
      setCurrentPageNum(page);
      const pageElement = document.getElementById(`pdf-page-${page}`);
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setGotoPageInput("");
    } else {
      alert(`Vui lòng nhập số trang hợp lệ từ 1 đến ${numPages || "?"}.`);
    }
  }, [gotoPageInput, numPages]);

  const handlePageScroll = useCallback(() => {
    const pdfContainer = document.querySelector('.custom-scrollbar');
    if (!pdfContainer) return;

    const pages = pdfContainer.querySelectorAll('[id^="pdf-page-"]');
    if (!pages.length) return;

    let currentVisiblePage = currentPageNum;
    let maxVisibleHeight = 0;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const rect = page.getBoundingClientRect();
      const containerRect = pdfContainer.getBoundingClientRect();

      const visibleTop = Math.max(rect.top, containerRect.top);
      const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
      const visibleHeight = visibleBottom - visibleTop;

      if (visibleHeight > 0 && visibleHeight > maxVisibleHeight) {
        currentVisiblePage = i + 1;
        maxVisibleHeight = visibleHeight;
      }
    }

    if (currentVisiblePage !== currentPageNum) {
      setCurrentPageNum(currentVisiblePage);
    }
  }, [currentPageNum]);

  useEffect(() => {
    const pdfContainer = document.querySelector('.custom-scrollbar');
    if (pdfContainer) {
      pdfContainer.addEventListener('scroll', handlePageScroll);
      handlePageScroll();
      return () => {
        pdfContainer.removeEventListener('scroll', handlePageScroll);
      };
    }
  }, [handlePageScroll]);


  const handleOpenInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Thanh điều khiển PDF */}
      <div className="flex flex-wrap justify-between items-center gap-2 px-2 py-1 md:px-4 md:py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        
        {/* Phần điều khiển Zoom */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 whitespace-nowrap">
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={zoomOut}
            className="rounded-full"
            disabled={scale <= 0.4}
          >
            <FaSearchMinus size={14} />
          </IconButton>
          <Typography
            variant="small"
            color="blue-gray"
            className="font-medium min-w-[50px] text-center text-xs sm:text-sm"
          >
            {(scale * 100).toFixed(0)}%
          </Typography>
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={zoomIn}
            className="rounded-full"
            disabled={scale >= 3.0}
          >
            <FaSearchPlus size={14} />
          </IconButton>
        </div>

        {/* Phần điều hướng trang và input "Đi đến trang" */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 whitespace-nowrap justify-center">
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={goToPrevPage}
            className="rounded-full"
            disabled={currentPageNum <= 1}
          >
            <FaChevronLeft size={14} />
          </IconButton>

          {/* Input "Trang" và hiển thị tổng số trang */}
          <div className="flex items-center gap-0.5">
            <Input
              type="number"
              label="Trang"
              value={gotoPageInput === "" ? currentPageNum : gotoPageInput}
              onChange={(e) => setGotoPageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGoToPage();
              }}
              className="min-w-[60px] max-w-[80px] flex-grow !py-1 !text-sm"
              containerProps={{ className: "min-w-[60px] max-w-[80px] flex-grow h-auto" }}
            />
            <Typography
                variant="small"
                color="blue-gray"
                className="font-medium flex-shrink-0 text-xs sm:text-sm"
            >
                /{numPages || '?'}
            </Typography>
          </div>
          
          <Button
            size="sm"
            color="gray"
            variant="filled"
            onClick={handleGoToPage}
            className="rounded-md !px-2 !py-1 text-xs" // Giảm kích thước font trên mobile
            disabled={!gotoPageInput || !numPages || parseInt(gotoPageInput, 10) > numPages || parseInt(gotoPageInput, 10) < 1}
          >
            Đến
          </Button>
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={goToNextPage}
            className="rounded-full"
            disabled={currentPageNum >= numPages}
          >
            <FaChevronRight size={14} />
          </IconButton>
        </div>

        {/* Nút "Mở trong tab mới" (chỉ là IconButton nhỏ gọn) */}
        {pdfUrl && (
          <IconButton
            size="sm" // Kích thước nhỏ
            color="blue"
            variant="text" // Dạng text để tinh tế hơn
            onClick={handleOpenInNewTab}
            className="rounded-full hidden sm:inline-flex" // Ẩn trên mobile, chỉ hiển thị trên sm trở lên
            title="Mở trong tab mới" // Thêm tooltip
          >
            <FaExternalLinkAlt size={14} />
          </IconButton>
        )}
      </div>

      {/* Vùng hiển thị PDF có thanh cuộn riêng */}
      <div className="flex-grow overflow-y-auto bg-gray-100 flex flex-col items-center p-4 gap-4 custom-scrollbar">
        {pdfUrl ? (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => console.error("Lỗi khi tải PDF:", error)}
            className="w-full flex flex-col items-center"
          >
            {numPages &&
              Array.from(new Array(numPages), (el, index) => (
                <div
                  key={`pdf-page-${index + 1}`}
                  id={`pdf-page-${index + 1}`}
                  className="mb-4 shadow-lg"
                >
                  <Page
                    pageNumber={index + 1}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    scale={scale}
                    className="mx-auto"
                  />
                </div>
              ))}
          </Document>
        ) : (
          <div className="flex items-center justify-center h-full w-full text-center text-gray-500">
            <Typography variant="lead">Vui lòng chọn một tài liệu để xem.</Typography>
          </div>
        )}
      </div>
    </div>
  );
}

export default PdfViewer;