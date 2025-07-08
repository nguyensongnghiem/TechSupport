import React, { useState, useEffect } from 'react';
import PdfList from './PdfList';
import PdfViewer from './PdfViewer';
import PdfDropdown from './PdfDropdown';
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";

function PdfViewerPage() {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const pdfs = [
    { name: 'Sample PDF 1', url: '/sample1.pdf' },
    { name: 'Sample PDF 2', url: '/sample2.pdf' },
    { name: 'BGP PDF', url: '/bgp.pdf' },
  ];

  const handleSelectPdf = (pdfUrl) => {
    setSelectedPdf(pdfUrl);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <Typography variant="h1" color="gray" className="text-center mb-8">
        Trình xem tài liệu kỹ thuật
      </Typography>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/4 px-4 mb-8">
          <Card className="shadow-lg h-full border border-gray-200 rounded-none">
            <CardHeader color="black" className="p-4 rounded-none">
              <Typography variant="h2" color="white">
                Danh mục tài liệu kỹ thuật
              </Typography>
            </CardHeader>
            <CardBody className="p-4">
              {isMobile ? (
                <PdfDropdown pdfs={pdfs} onSelectPdf={handleSelectPdf} />
              ) : (
                <PdfList pdfs={pdfs} onSelectPdf={handleSelectPdf} />
              )}
            </CardBody>
          </Card>
        </div>
        <div className="w-full md:w-3/4 px-4 mb-8">
          <Card className="shadow-lg h-full border border-gray-200 rounded-none">
            <CardHeader color="gray" className="p-4 rounded-none">
              <Typography variant="h2" color="white">
                Nội dung tài liệu
              </Typography>
            </CardHeader>
            <CardBody className="p-0" style={{ minHeight: '600px' }}>
              {selectedPdf ? (
                <PdfViewer pdfUrl={selectedPdf} />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                  <Typography variant="lead">
                    Vui lòng chọn một tài liệu từ danh mục để xem.
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