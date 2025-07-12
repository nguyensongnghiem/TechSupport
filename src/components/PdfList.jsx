import React, { useState } from "react";
import { Input, Typography, Tooltip } from "@material-tailwind/react"; // <-- Import Tooltip
import { FaFilePdf } from "react-icons/fa";

function PdfList({ pdfs, onSelectPdf, selectedPdfName }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPdfs = pdfs.filter((pdf) =>
    pdf.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col py-2">
      <div className="mb-4">
        <Input
          type="text"
          label="Tìm kiếm tài liệu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          color="blue-gray"
          size="md"
          className="focus:ring-blue-500 focus:border-blue-500" // Thêm hiệu ứng focus
        />
      </div>
      <div className="w-full flex-1 overflow-y-auto space-y-3 custom-scrollbar">
        {filteredPdfs.length > 0 ? (
          filteredPdfs.map((pdf) => {
            const isSelected = selectedPdfName === pdf.name;
            // Xóa đuôi ".pdf" khỏi tên hiển thị
            const displayName = pdf.name.replace(/\.pdf$/i, '');

            return (
              // Sử dụng Tooltip để hiển thị tên đầy đủ khi hover
              <Tooltip content={pdf.name} placement="right" key={pdf.name}>
                <div
                  onClick={() => onSelectPdf(pdf.name)}
                  className={`cursor-pointer flex items-start gap-3 p-3 rounded-lg border
                                transition duration-200 ease-in-out shadow-md
                                hover:bg-blue-50 hover:text-blue-700
                                ${isSelected ? "bg-blue-100 border-blue-500 text-blue-900" : "bg-white border-gray-200 text-gray-800"}`}
                >
                  <FaFilePdf className={`text-lg mt-1 flex-shrink-0 ${isSelected ? "text-blue-600" : "text-gray-600"}`} />
                  <Typography
                    variant="paragraph"
                    // Giới hạn 2 dòng, ẩn phần còn lại, thêm ellipsis
                    className="font-medium line-clamp-2" // <-- Sử dụng line-clamp-2
                  >
                    {displayName}
                  </Typography>
                </div>
              </Tooltip>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-4">
            <Typography variant="paragraph">
              Không tìm thấy tài liệu nào phù hợp.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}

export default PdfList;