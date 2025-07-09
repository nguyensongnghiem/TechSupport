import React, { useState } from "react";
import PdfList from "../components/PdfList";
import PdfViewer from "../components/PdfViewer";
import PdfDropdown from "../components/PdfDropdown";
import { Card, CardBody, Typography } from "@material-tailwind/react";

import { FaBookOpen, FaFilePdf, FaList } from "react-icons/fa"; // Đảm bảo đã cài đặt react-icons

function PdfViewerPage() {
  const [selectedPdf, setSelectedPdf] = useState(null);

  const pdfs = [
    { name: "Sample PDF 1", url: "/docs/sample1.pdf" },
    { name: "Sample PDF 2", url: "/docs/sample2.pdf" },
    { name: "BGP PDF", url: "/docs/bgp.pdf" },
    // Thêm các PDF khác nếu cần
  ];

  const handleSelectPdf = (pdfUrl) => {
    setSelectedPdf(pdfUrl);
  };

  return (
    // Đảm bảo phần tử gốc của trang có chiều cao cố định
    // `h-screen` là 100% chiều cao viewport, nó rất phù hợp ở đây.
    // Nếu bạn có header/footer ngoài cùng, có thể cần điều chỉnh `h-screen` thành `h-[calc(100vh - header_height)]`
    <div className="min-h-screen flex flex-col p-4 bg-gray-100 h-screen">
      {/* Tiêu đề trang (ẩn trên mobile, hiển thị trên màn hình lớn) */}
      {/* Thêm class 'hidden' để ẩn mặc định trên mobile, và 'lg:block' để hiển thị trên màn hình lớn */}
      <Typography
        variant="h4"
        color="blue-gray"
        className="mb-4 text-xl lg:text-xl font-bold items-center gap-2 flex-shrink-0 hidden lg:flex"
      >
        <FaBookOpen className="text-blue-500 text-xl" />
        Tra cứu Tài liệu Kỹ thuật
      </Typography>

      {/* Dropdown cho mobile (chỉ hiển thị trên mobile) */}
      {/* Thêm class 'lg:hidden' để ẩn trên màn hình lớn */}
      <div className="block lg:hidden mb-6 z-10 flex-shrink-0">
        <PdfDropdown pdfs={pdfs} onSelectPdf={handleSelectPdf} />
      </div>

      {/* Vùng nội dung chính: Chiếm hết không gian còn lại và là container flex */}
      {/* Thay vì grid-cols-1 trên mobile, giờ chỉ có viewer, và sidebar ẩn */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Danh mục tài liệu (ẩn trên mobile, hiển thị trên desktop) */}
        {/* Giữ nguyên hidden lg:block để ẩn trên mobile */}
        <Card className="shadow-lg border border-gray-200 h-full max-h-[80vh] lg:max-h-full lg:col-span-1 flex-col hidden lg:flex">
          <CardBody className="p-4 flex flex-col h-full overflow-hidden">
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-4 text-xl font-semibold flex items-center gap-2"
            >
              <FaList className="text-blue-500" />
              Danh mục tài liệu
            </Typography>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <PdfList pdfs={pdfs} onSelectPdf={handleSelectPdf} selectedPdfUrl={selectedPdf} />
              {/* Thêm selectedPdfUrl vào PdfList để highlight mục đang chọn */}
            </div>
          </CardBody>
        </Card>

        {/* Viewer: Cần h-full để PdfViewer nhận đủ chiều cao */}
        <Card className="shadow-lg border border-gray-200 w-full min-h-[60vh] lg:min-h-0 h-full lg:col-span-3 flex flex-col">
          {/* CardBody cũng phải có h-full và flex-col để chia không gian cho PdfViewer */}
          <CardBody className="p-0 w-full flex-1 flex flex-col h-full">
            {selectedPdf ? (
              // PdfViewer cần h-full để chiếm hết không gian còn lại từ CardBody
              <PdfViewer pdfUrl={selectedPdf} />
            ) : (
              <div className="flex items-center justify-center h-full bg-blue-50 text-blue-700 p-4 rounded-lg flex-col gap-4">
                <FaBookOpen className="text-blue-400 text-6xl" />
                <Typography variant="lead" className="text-center text-lg lg:text-xl font-medium">
                  Vui lòng chọn một tài liệu từ {
                    // Hiển thị văn bản phù hợp với mobile/desktop
                    window.innerWidth < 1024 ? "danh sách thả xuống" : "danh mục bên trái"
                  } để xem.
                </Typography>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default PdfViewerPage;