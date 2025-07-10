import React, { useState } from "react";
import PdfList from "../components/PdfList";
import PdfViewer from "../components/PdfViewer";
import PdfDropdown from "../components/PdfDropdown";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import Header from "../components/Header";

import { FaBookOpen, FaFilePdf, FaList } from "react-icons/fa"; // Đảm bảo đã cài đặt react-icons

function PdfViewerPage() {
  const [selectedPdf, setSelectedPdf] = useState(null);

  const pdfs = [
    {
      name: "31 Days to Overcome Your Fear of Shooting Street Photography copy.pdf",
      url: "/docs/31 Days to Overcome Your Fear of Shooting Street Photography copy.pdf",
    },
    {
      name: "31 Days to Overcome Your Fear of Shooting Street Photography.pdf",
      url: "/docs/31 Days to Overcome Your Fear of Shooting Street Photography.pdf",
    },
    {
      name: "100 Photography Tips For Beginners by Eric Kim copy.pdf",
      url: "/docs/100 Photography Tips For Beginners by Eric Kim copy.pdf",
    },
    {
      name: "100 Photography Tips For Beginners by Eric Kim.pdf",
      url: "/docs/100 Photography Tips For Beginners by Eric Kim.pdf",
    },
    { name: "bgp copy.pdf", url: "/docs/bgp copy.pdf" },
    { name: "bgp.pdf", url: "/docs/bgp.pdf" },
    {
      name: "How to Overcome Photographer's Block - Eric Kim copy.pdf",
      url: "/docs/How to Overcome Photographer's Block - Eric Kim copy.pdf",
    },
    {
      name: "How to Overcome Photographer's Block - Eric Kim.pdf",
      url: "/docs/How to Overcome Photographer's Block - Eric Kim.pdf",
    },
    {
      name: "Monochrome Manual copy.pdf",
      url: "/docs/Monochrome Manual copy.pdf",
    },
    { name: "Monochrome Manual.pdf", url: "/docs/Monochrome Manual.pdf" },
    { name: "sample1 copy.pdf", url: "/docs/sample1 copy.pdf" },
    { name: "sample1.pdf", url: "/docs/sample1.pdf" },
    { name: "sample2 copy.pdf", url: "/docs/sample2 copy.pdf" },
    { name: "sample2.pdf", url: "/docs/sample2.pdf" },
    {
      name: "Street Photography 101 copy.pdf",
      url: "/docs/Street Photography 101 copy.pdf",
    },
    {
      name: "Street Photography 101.pdf",
      url: "/docs/Street Photography 101.pdf",
    },
    {
      name: "Street Photography 102 copy.pdf",
      url: "/docs/Street Photography 102 copy.pdf",
    },
    {
      name: "Street Photography 102.pdf",
      url: "/docs/Street Photography 102.pdf",
    },
    {
      name: "Street Photography Contact Sheets copy.pdf",
      url: "/docs/Street Photography Contact Sheets copy.pdf",
    },
    {
      name: "Street Photography Contact Sheets.pdf",
      url: "/docs/Street Photography Contact Sheets.pdf",
    },
    {
      name: "The Social Media Blackbook for Photographers copy.pdf",
      url: "/docs/The Social Media Blackbook for Photographers copy.pdf",
    },
    {
      name: "The Social Media Blackbook for Photographers.pdf",
      url: "/docs/The Social Media Blackbook for Photographers.pdf",
    },
    {
      name: "The Street Photography Composition Manual copy.pdf",
      url: "/docs/The Street Photography Composition Manual copy.pdf",
    },
    {
      name: "The Street Photography Composition Manual.pdf",
      url: "/docs/The Street Photography Composition Manual.pdf",
    },
    {
      name: "The Street Portrait Manual - Small copy.pdf",
      url: "/docs/The Street Portrait Manual - Small copy.pdf",
    },
    {
      name: "The Street Portrait Manual - Small.pdf",
      url: "/docs/The Street Portrait Manual - Small.pdf",
    },
    {
      name: "Zen in the Art of Street Photography copy.pdf",
      url: "/docs/Zen in the Art of Street Photography copy.pdf",
    },
    {
      name: "Zen in the Art of Street Photography.pdf",
      url: "/docs/Zen in the Art of Street Photography.pdf",
    },
    // Thêm các PDF khác nếu cần
  ];

  const handleSelectPdf = (pdfUrl) => {
    setSelectedPdf(pdfUrl);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header> </Header>

      <div className=" flex flex-col px-4 py-6 bg-gray-200 h-[calc(100vh-57px)] justify-center ">
        {/* Tiêu đề trang (ẩn trên mobile, hiển thị trên màn hình lớn) */}
        {/* Thêm class 'hidden' để ẩn mặc định trên mobile, và 'lg:block' để hiển thị trên màn hình lớn */}
        <Typography
          variant="h5"
          color="blue-gray"
          className="my-4 text-lg lg:text-xl font-bold items-center gap-2 flex-shrink-0 hidden md:flex"
        >
          <FaBookOpen className="text-blue-900 text-lg" />
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
          <Card className="shadow-lg border border-gray-200 h-full min-h-[60vh]  lg:col-span-1 flex-col hidden lg:flex">
            <CardBody className="p-4 flex flex-col h-full overflow-hidden">
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-4 text-lg font-semibold flex items-center gap-2 overflow-y-auto"
              >
                <FaList className="text-blue-900" />
                Danh mục tài liệu
              </Typography>
              <div className="flex-1 overflow-y-auto custom-scrollbar h-full">
                <PdfList
                  pdfs={pdfs}
                  onSelectPdf={handleSelectPdf}
                  selectedPdfUrl={selectedPdf}
                />
                {/* Thêm selectedPdfUrl vào PdfList để highlight mục đang chọn */}
              </div>
            </CardBody>
          </Card>

          {/* Viewer: Cần h-full để PdfViewer nhận đủ chiều cao */}
          <Card className="shadow-lg border border-gray-200 w-full min-h-[60vh] lg:min-h-0 h-full lg:col-span-3 flex flex-col">
            {/* CardBody cũng phải có h-full và flex-col để chia không gian cho PdfViewer */}
            <CardBody className="p-0 w-full flex-1 flex flex-col h-full rounded-lg overflow-hidden">
              {selectedPdf ? (
                // PdfViewer cần h-full để chiếm hết không gian còn lại từ CardBody
                <PdfViewer pdfUrl={selectedPdf} />
              ) : (
                <div className="flex items-center justify-center h-full bg-blue-50 text-blue-700 p-4 rounded-lg flex-col gap-4">
                  <FaBookOpen className="text-blue-900 text-6xl" />
                  <Typography
                    variant="lead"
                    className="text-center text-lg lg:text-xl font-medium text-blue-900"
                  >
                    Vui lòng chọn một tài liệu từ{" "}
                    <span className="text-blue-900 hidden lg:inline">
                      danh mục bên trái
                    </span>
                    <span className="text-blue-900 lg:hidden">
                      danh sách thả xuống
                    </span>{" "}
                    để xem.
                  </Typography>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PdfViewerPage;
