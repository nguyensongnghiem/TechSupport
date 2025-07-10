import React, { useState } from "react";
import { Input, Typography } from "@material-tailwind/react";
import { FaFilePdf } from "react-icons/fa";

function PdfList({ pdfs, onSelectPdf, selectedPdfUrl }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPdfs = pdfs.filter((pdf) =>
    pdf.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col py-2">
      {/* Tìm kiếm */}
      <div className="mb-4">

      <Input
        type="text"
        label="Tìm kiếm tài liệu..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}        
        color="blue-gray"
        size="md"
      />
</div>
      {/* Danh sách PDF */}
      <div className="w-full flex-1 overflow-y-auto space-y-3 custom-scrollbar">
        {filteredPdfs.length > 0 ? (
          filteredPdfs.map((pdf) => {
            const isSelected = selectedPdfUrl === pdf.url;
            return (
              <div
                key={pdf.url}
                onClick={() => onSelectPdf(pdf.url)}
                className={`cursor-pointer flex items-start gap-3 p-3 rounded-lg border 
                            transition duration-200 ease-in-out shadow-sm 
                            hover:bg-blue-50 hover:text-blue-700
                            ${isSelected ? "bg-blue-100 border-blue-500" : "bg-white border-gray-200"}`}
              >
                <FaFilePdf className="text-gray-600 text-lg mt-1" />
                <Typography
                  variant="paragraph"
                  color="blue-gray"
                  className="font-medium"
                >
                  {pdf.name}
                </Typography>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-4">
            <Typography variant="paragraph">Không tìm thấy tài liệu nào.</Typography>
          </div>
        )}
      </div>
    </div>
  );
}

export default PdfList;
