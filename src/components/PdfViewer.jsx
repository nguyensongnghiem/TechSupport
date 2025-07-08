import React, { useState, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { IconButton, Typography, Input, Button } from "@material-tailwind/react";
import {
  FaSearchMinus,
  FaSearchPlus,
  FaSearch,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

// Cấu hình worker cho react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function PdfViewer({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.0);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [gotoPageInput, setGotoPageInput] = useState("");

  useEffect(() => {
    setScale(1.0);
    setSearchTerm("");
    setSearchResults([]);
    setCurrentMatchIndex(-1);
    setIsSearching(false);
    setGotoPageInput("");
  }, [pdfUrl]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const zoomOut = useCallback(() => setScale((s) => Math.max(s - 0.2, 0.4)), []);
  const zoomIn = useCallback(() => setScale((s) => Math.min(s + 0.2, 3.0)), []);

  const handleGoToPage = () => {
    const page = parseInt(gotoPageInput, 10);
    if (page > 0 && page <= numPages) {
      const pageElement = document.getElementById(`pdf-page-${page}`);
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setGotoPageInput("");
    } else {
      alert(`Vui lòng nhập số trang hợp lệ từ 1 đến ${numPages || "?"}.`);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setCurrentMatchIndex(-1);
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    setCurrentMatchIndex(-1);

    let foundResults = [];
    for (let i = 1; i <= numPages; i++) {
      if (
        `Content on page ${i} with ${searchTerm}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) {
        foundResults.push({ page: i, match: `match on page ${i}` });
        if (foundResults.length >= 5) break;
      }
    }

    if (foundResults.length > 0) {
      setSearchResults(foundResults);
      setCurrentMatchIndex(0);
      const pageElement = document.getElementById(
        `pdf-page-${foundResults[0].page}`
      );
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      alert("Không tìm thấy kết quả nào.");
    }
    setIsSearching(false);
  };

  const goToNextMatch = () => {
    if (searchResults.length > 0) {
      const nextIndex = (currentMatchIndex + 1) % searchResults.length;
      setCurrentMatchIndex(nextIndex);
      const pageElement = document.getElementById(
        `pdf-page-${searchResults[nextIndex].page}`
      );
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const goToPrevMatch = () => {
    if (searchResults.length > 0) {
      const prevIndex =
        (currentMatchIndex - 1 + searchResults.length) % searchResults.length;
      setCurrentMatchIndex(prevIndex);
      const pageElement = document.getElementById(
        `pdf-page-${searchResults[prevIndex].page}`
      );
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setCurrentMatchIndex(-1);
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Thanh điều khiển PDF */}
      {/* Sử dụng justify-end trên màn hình nhỏ để các nút dồn về một phía nếu bị vỡ dòng */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-between items-center gap-3 px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        {/* Phần điều khiển Zoom (giữ nguyên) */}
        <div className="flex items-center gap-2 order-1">
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={zoomOut}
            className="rounded-full"
            disabled={scale <= 0.4}
          >
            <FaSearchMinus className="text-lg" />
          </IconButton>
          <Typography
            variant="small"
            color="blue-gray"
            className="font-medium min-w-[70px] text-center"
          >
            Zoom: {(scale * 100).toFixed(0)}%
          </Typography>
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={zoomIn}
            className="rounded-full"
            disabled={scale >= 3.0}
          >
            <FaSearchPlus className="text-lg" />
          </IconButton>
        </div>

        {/* Phần input tìm kiếm và điều hướng kết quả */}
        {/* Đặt order-3 trên mobile, order-2 trên sm trở lên */}
        <div className="flex items-center gap-2 w-full sm:w-auto order-3 sm:order-2">
          <Input
            type="text"
            label="Tìm kiếm trong PDF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="flex-grow min-w-[120px] max-w-[250px] md:max-w-[300px]" // Điều chỉnh min/max width
            containerProps={{ className: "min-w-[120px] sm:min-w-[150px] flex-grow" }} // Quan trọng: flex-grow ở đây
          />
          {searchTerm && (
            <IconButton
              size="sm"
              color="gray"
              variant="text"
              onClick={clearSearch}
              className="rounded-full"
            >
              <FaTimes />
            </IconButton>
          )}
          <Button
            size="sm"
            color="blue"
            onClick={handleSearch}
            className="rounded-md"
            disabled={isSearching}
          >
            {isSearching ? "Đang tìm..." : <FaSearch className="text-sm" />}
          </Button>

          {searchResults.length > 0 && (
            <>
              <IconButton
                size="sm"
                color="blue-gray"
                variant="text"
                onClick={goToPrevMatch}
                className="rounded-full"
              >
                <FaChevronLeft />
              </IconButton>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-medium min-w-[50px] text-center"
              >
                {currentMatchIndex + 1} / {searchResults.length}
              </Typography>
              <IconButton
                size="sm"
                color="blue-gray"
                variant="text"
                onClick={goToNextMatch}
                className="rounded-full"
              >
                <FaChevronRight />
              </IconButton>
            </>
          )}
        </div>

        {/* Phần nhảy trang bằng input */}
        {/* Đặt order-2 trên mobile, order-3 trên sm trở lên */}
        <div className="flex items-center gap-2 order-2 sm:order-3 w-full sm:w-auto justify-center sm:justify-end"> {/* Thêm justify-center/end */}
          <Input
            type="number"
            label="Trang" // Rút gọn nhãn
            value={gotoPageInput}
            onChange={(e) => setGotoPageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGoToPage();
            }}
            className="min-w-[70px] max-w-[100px] flex-grow" // Giảm min-width, thêm max-width, flex-grow
            containerProps={{ className: "min-w-[70px] max-w-[100px] flex-grow" }}
          />
          <Button
            size="sm"
            color="light-blue"
            onClick={handleGoToPage}
            className="rounded-md"
            disabled={!gotoPageInput || !numPages}
          >
            Đi
          </Button>
        </div>
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
                  key={`page_${index + 1}`}
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