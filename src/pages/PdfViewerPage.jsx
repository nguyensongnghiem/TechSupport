import React, { useState } from "react";
import PdfList from "../components/PdfList";
import PdfViewer from "../components/PdfViewer";
import PdfDropdown from "../components/PdfDropdown";
import { Card, CardBody, Typography } from "@material-tailwind/react";

import { FaBookOpen, FaFilePdf } from "react-icons/fa";

function PdfViewerPage() {
  const [selectedPdf, setSelectedPdf] = useState(null);

  const pdfs = [
    { name: "Sample PDF 1", url: "/docs/sample1.pdf" },
    { name: "Sample PDF 2", url: "/docs/sample2.pdf" },
    { name: "BGP PDF", url: "/docs/bgp.pdf" },
  ];

  const handleSelectPdf = (pdfUrl) => {
    setSelectedPdf(pdfUrl);
  };

  return (
    // Đảm bảo phần tử gốc của trang có chiều cao cố định
    // `h-screen` là 100% chiều cao viewport, nó rất phù hợp ở đây.
    // Nếu bạn có header/footer ngoài cùng, có thể cần điều chỉnh `h-screen` thành `h-[calc(100vh - header_height)]`
    <div className="min-h-screen flex flex-col p-4 lg:p-8 bg-gray-100 h-screen">
      {/* Tiêu đề trang (luôn hiển thị, không bị co lại) */}
      <Typography
        variant="h3"
        color="blue-gray"
        className="text-center mb-6 lg:mb-8 text-2xl lg:text-3xl font-bold flex items-center justify-center gap-3 flex-shrink-0"
      >
        <FaBookOpen className="text-blue-500 text-3xl lg:text-4xl" />
        Tra cứu Tài liệu Kỹ thuật
      </Typography>

      {/* Dropdown cho mobile (luôn hiển thị, không bị co lại) */}
      <div className="block lg:hidden mb-6 z-10 flex-shrink-0">
        <PdfDropdown pdfs={pdfs} onSelectPdf={handleSelectPdf} />
      </div>

      {/* Vùng nội dung chính: Chiếm hết không gian còn lại và là container flex */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 h-full"> {/* h-full để truyền chiều cao xuống */}
        {/* Danh mục tài liệu (ẩn trên mobile, hiển thị trên desktop) */}
        <Card className="shadow-lg border border-gray-200 h-full max-h-[80vh] lg:max-h-full lg:col-span-1 flex flex-col hidden lg:block">
          <CardBody className="p-4 flex flex-col h-full overflow-hidden">
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-4 text-xl font-semibold flex items-center gap-2"
            >
              <FaFilePdf className="text-red-500" />
              Danh mục tài liệu
            </Typography>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <PdfList pdfs={pdfs} onSelectPdf={handleSelectPdf} />
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
                  Vui lòng chọn một tài liệu từ danh mục để xem.
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