import React, { useState, useEffect } from "react";
import PdfViewerIframe from "../components/PdfViewerIframe";
import PdfList from "../components/PdfList";
import PdfDropdown from "../components/PdfDropdown";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import Header from "../components/Header";

import { FaBookOpen, FaFilePdf, FaList } from "react-icons/fa";

// Định nghĩa URL gốc của API của bạn
// Đảm bảo cổng và domain này khớp với server Node.js của bạn (cổng 3002).
const API_BASE_URL = "https://digithub.io.vn:3002/api"; 

function PdfViewerPage() {
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [pdfs, setPdfs] = useState([]); // Danh sách PDF (chỉ cần tên file)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State để lưu trữ tên file PDF đang được chọn
  const [currentSelectedPdfName, setCurrentSelectedPdfName] = useState(null);

  // 1. Fetch danh sách tên file PDF ban đầu
  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        // Gọi API để lấy danh sách tên file từ server Node.js của bạn
        // Endpoint: https://digithub.io.vn:3002/api/files
        const response = await fetch(`${API_BASE_URL}/files`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const filenames = await response.json();

        // Chỉ lưu tên file vào state `pdfs`.
        // URL sẽ được fetch riêng khi một file được chọn.
        const formattedPdfs = filenames.map((name) => ({
          name: name,
          // Ở đây, chúng ta không cần tạo URL trực tiếp của file.
          // Chúng ta chỉ cần tên file để truyền cho `handleSelectPdf`.
          // Có thể đặt một giá trị placeholder hoặc bỏ qua trường url ở đây
          // nếu PdfList và PdfDropdown không yêu cầu nó để hiển thị.
          // Để nhất quán với cấu trúc cũ, vẫn có thể để url nhưng nó sẽ được cập nhật sau.
          url: null // Sẽ được cập nhật khi fetch URL thực sự
        }));
        setPdfs(formattedPdfs);
      } catch (err) {
        setError("Không thể tải danh sách tài liệu: " + err.message);
        console.error("Lỗi khi fetch danh sách PDF:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPdfs();
  }, []);

  // 2. Fetch URL của PDF khi một file được chọn từ danh sách
  useEffect(() => {
    const fetchPdfUrl = async () => {
      if (!currentSelectedPdfName) {
        setSelectedPdfUrl(null); // Reset nếu không có tên file nào được chọn
        return;
      }

      setLoading(true); // Đặt loading khi đang fetch URL PDF
      setError(null);
      setSelectedPdfUrl(null); // Xóa URL cũ

      try {
        // Mã hóa tên file trước khi truyền vào URL
        const encodedFilename = encodeURIComponent(currentSelectedPdfName);
        // Gọi API để lấy URL của file PDF
        // Endpoint: https://digithub.io.vn:3002/api/pdf-url/:filename
        const response = await fetch(`${API_BASE_URL}/pdf-url/${encodedFilename}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const pdfPublicUrl = data.url; // Lấy URL từ response JSON

        if (!pdfPublicUrl) {
          throw new Error("API không trả về URL PDF hợp lệ.");
        }

        setSelectedPdfUrl(pdfPublicUrl); // Cập nhật state để hiển thị PDF

      } catch (err) {
        console.error("Lỗi khi fetch URL PDF:", err);
        setError("Không thể tải đường dẫn tài liệu: " + err.message);
      } finally {
        setLoading(false); // Dù thành công hay thất bại, đặt loading thành false
      }
    };

    fetchPdfUrl();
  }, [currentSelectedPdfName, API_BASE_URL]); // Chạy lại khi currentSelectedPdfName thay đổi

  // Hàm này sẽ được gọi từ PdfList hoặc PdfDropdown
  // Nó nhận vào tên file PDF được chọn (chứ không phải URL)
  const handleSelectPdf = (pdfName) => {
    setCurrentSelectedPdfName(pdfName); // Lưu tên file vào state
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

      <div className="flex flex-col px-4 p-6 bg-gray-100 h-[calc(100vh-57px)] justify-center ">
        {/* <Typography
          variant="h5"
          color="blue-gray"
          className="my-4 text-lg lg:text-xl font-bold items-center gap-2 flex-shrink-0 block hidden lg:flex"
        >
          <FaBookOpen className="text-blue-900 text-lg" />
          Tra cứu Tài liệu Kỹ thuật
        </Typography> */}

        <div className="block lg:hidden mb-6 z-10 flex-shrink-0">
          {/* Truyền danh sách PDF (chỉ tên file) và hàm chọn PDF */}
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
                Tra cứu tài liệu sửa chữa
              </Typography>
              <div className="flex-1 overflow-y-auto custom-scrollbar h-full">
                {/* Truyền danh sách PDF (chỉ tên file) và hàm chọn PDF */}
                <PdfList
                  pdfs={pdfs}
                  onSelectPdf={handleSelectPdf}
                  // Cần truyền tên file hiện tại để PdfList làm nổi bật
                  selectedPdfName={currentSelectedPdfName} 
                />
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-lg border border-gray-200 w-full min-h-[60vh] lg:min-h-0 h-full lg:col-span-3 flex flex-col">
            <CardBody className="p-0 w-full flex-1 flex flex-col h-full rounded-xl overflow-hidden">
              {/* Hiển thị loading hoặc error nếu đang trong quá trình fetch URL */}
              {loading && !selectedPdfUrl ? ( // Chỉ hiện loading nếu chưa có URL và đang tải
                <div className="flex items-center justify-center h-full text-gray-600">Đang tải tài liệu...</div>
              ) : error ? (
                <div className="flex items-center justify-center h-full text-red-600">{error}</div>
              ) : selectedPdfUrl ? (
                <PdfViewerIframe pdfUrl={selectedPdfUrl} />
              ) : (
                <div className="flex items-center justify-center h-full bg-blue-100 text-blue-700 p-4 rounded-lg flex-col gap-4">
                  <FaBookOpen className="text-6xl" />
                  <Typography
                    variant="lead"
                    className="text-center text-lg lg:text-xl font-medium"
                  >
                    Chọn một tài liệu từ{" "}
                    <span className="hidden lg:inline">
                      danh mục bên trái
                    </span>
                    <span className="inline lg:hidden">
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