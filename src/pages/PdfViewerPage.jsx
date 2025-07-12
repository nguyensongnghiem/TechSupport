import React, { useState, useEffect } from "react";
import PdfViewerIframe from "../components/PdfViewerIframe";
import PdfList from "../components/PdfList";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import Header from "../components/Header";

import { FaBookOpen, FaList } from "react-icons/fa";

const API_BASE_URL = "https://digithub.io.vn:3002/api";

function PdfViewerPage() {
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSelectedPdfName, setCurrentSelectedPdfName] = useState(null);

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/files`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const filenames = await response.json();
        const formattedPdfs = filenames.map((name) => ({ name, url: null }));
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

  useEffect(() => {
    const fetchPdfUrl = async () => {
      const isMobile = window.innerWidth < 1024;
      if (!currentSelectedPdfName || isMobile) {
        setSelectedPdfUrl(null);
        return;
      }

      setLoading(true);
      setError(null);
      setSelectedPdfUrl(null);

      try {
        const encodedFilename = encodeURIComponent(currentSelectedPdfName);
        const response = await fetch(
          `${API_BASE_URL}/pdf-url/${encodedFilename}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (!data.url) throw new Error("API không trả về URL PDF hợp lệ.");
        setSelectedPdfUrl(data.url);
      } catch (err) {
        console.error("Lỗi khi fetch URL PDF:", err);
        setError("Không thể tải đường dẫn tài liệu: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPdfUrl();
  }, [currentSelectedPdfName]);

  const handleSelectPdf = async (pdfName) => {
    setCurrentSelectedPdfName(pdfName);
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      try {
        const encodedFilename = encodeURIComponent(pdfName);
        const response = await fetch(
          `${API_BASE_URL}/pdf-url/${encodedFilename}`
        );
        if (!response.ok) throw new Error("Không thể lấy URL PDF");
        const data = await response.json();
        if (data.url) window.open(data.url, "_blank");
        else throw new Error("URL không hợp lệ");
      } catch (err) {
        console.error("Lỗi khi mở PDF trên mobile:", err);
        setError("Không thể mở tài liệu: " + err.message);
      }
    }
  };

  if (loading && !selectedPdfUrl) {
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
      <div className="flex flex-col px-4 p-6 bg-gray-100 h-[calc(100vh-57px)] justify-center">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* ✅ Hiển thị PdfList toàn màn hình ở mobile */}
         <Card className="shadow-lg border border-gray-200 h-full min-h-[57vh] lg:col-span-1 flex-col">
  <CardBody className="p-4 flex flex-col h-full overflow-hidden">

    {/* Logo nằm bên trái, nhỏ vừa và có padding dưới */}
    <div className="flex items-center justify-start mb-4">
      <img
        src="/images/logo text library.png"
        alt="CraneIQ logo"
        className="h-12 w-auto object-contain" // chiều cao 6, giữ nguyên tỉ lệ
      />
    </div>

    <div className="flex-1 overflow-y-auto custom-scrollbar h-full">
      <PdfList
        pdfs={pdfs}
        onSelectPdf={handleSelectPdf}
        selectedPdfName={currentSelectedPdfName}
      />
    </div>
    
  </CardBody>
</Card>

          {/* ✅ Chỉ hiển thị PdfViewerIframe trên desktop */}
          <Card className="hidden lg:flex shadow-lg border border-gray-200 w-full h-full lg:col-span-3 flex-col">
            <CardBody className="p-0 w-full flex-1 flex flex-col h-full rounded-xl overflow-hidden">
              {!selectedPdfUrl ? (
                <div className="flex items-center justify-center h-full bg-white text-blue-700 p-4 rounded-lg flex-col gap-4">
                  <img
                    src="/images/abc.jpg"
                    alt="haha"
                    className="w-2/3 h-auto object-cover object-center mb-4"
                  />
                
                </div>
              ) : (
                <PdfViewerIframe pdfUrl={selectedPdfUrl} />
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PdfViewerPage;
