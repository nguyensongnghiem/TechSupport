import React, { useState, useEffect } from "react"; // Thêm useEffect
import PdfList from "../components/PdfList";
import PdfViewer from "../components/PdfViewer";
import PdfDropdown from "../components/PdfDropdown";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import Header from "../components/Header";

import { FaBookOpen, FaFilePdf, FaList } from "react-icons/fa";

// Định nghĩa URL gốc của API của bạn
const API_BASE_URL = "https://digithub.io.vn:3001";

function PdfViewerPage() {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfs, setPdfs] = useState([]); // State mới để lưu danh sách PDF từ API
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái tải
  const [error, setError] = useState(null); // State để quản lý lỗi

  // Sử dụng useEffect để gọi API khi component được mount
  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/files`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const filenames = await response.json(); // Lấy danh sách tên file

        // Chuyển đổi danh sách tên file thành định dạng { name: "...", url: "..." }
        // URL sẽ trỏ trực tiếp đến API tải file
        const formattedPdfs = filenames.map((name) => ({
          name: name,
          url: `${API_BASE_URL}/files/${encodeURIComponent(name)}`, // Mã hóa tên file cho URL
        }));
        setPdfs(formattedPdfs);
      } catch (err) {
        setError("Không thể tải danh sách tài liệu: " + err.message);
        console.error("Lỗi khi fetch danh sách PDF:", err);
      } finally {
        setLoading(false); // Dù thành công hay thất bại, đặt loading thành false
      }
    };

    fetchPdfs();
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy một lần khi component mount

  const handleSelectPdf = (pdfUrl) => {
    setSelectedPdf(pdfUrl);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-200">
        <Typography variant="h5" color="blue-gray">
          Đang tải tài liệu...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-red-100 text-red-800">
        <Typography variant="h5" color="red">
          Lỗi: {error}
        </Typography>
        <Typography variant="paragraph" className="mt-2">
          Vui lòng kiểm tra lại kết nối mạng hoặc trạng thái của API server.
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-col px-4 p-6 bg-gray-200 h-[calc(100vh-57px)] justify-center ">
        <Typography
          variant="h5"
          color="blue-gray"
          className="my-4 text-lg lg:text-xl font-bold items-center gap-2 flex-shrink-0 block hidden lg:flex"
        >
          <FaBookOpen className="text-blue-900 text-lg" />
          Tra cứu Tài liệu Kỹ thuật
        </Typography>

        <div className="block lg:hidden mb-6 z-10 flex-shrink-0">
          <PdfDropdown pdfs={pdfs} onSelectPdf={handleSelectPdf} />
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          <Card className="shadow-lg border border-gray-200 h-full min-h-[57vh] lg:col-span-1 flex-col block hidden lg:flex">
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
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border border-gray-200 w-full min-h-[60vh] lg:min-h-0 h-full lg:col-span-3 flex flex-col">
            <CardBody className="p-0 w-full flex-1 flex flex-col h-full rounded-lg overflow-hidden">
              {selectedPdf ? (
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
                    <span className="text-blue-900 inline lg:hidden">
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
