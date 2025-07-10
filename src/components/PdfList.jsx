import React, { useState } from "react";
import { Input, Button, List, ListItem, Typography } from "@material-tailwind/react";
import { FaFilePdf, FaChevronRight } from "react-icons/fa"; // Import các icon cần thiết

function PdfList({ pdfs, onSelectPdf }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPdfs = pdfs.filter((pdf) =>
    pdf.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col py-2"> {/* Đảm bảo component chiếm hết chiều cao */}
      {/* Ô tìm kiếm */}
      <Input
        type="text"
        label="Tìm kiếm tài liệu..." // Nhãn rõ ràng hơn
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6" // Khoảng cách dưới
        color="blue-gray" // Màu sắc cho input
        size="md" // Kích thước input lớn hơn
      />

      {/* Danh sách tài liệu */}
      <List className="w-full flex-1 py-2 overflow-y-auto custom-scrollbar"> {/* Thay đổi max-h thành flex-1 để chiếm hết không gian còn lại */}
        {filteredPdfs.length > 0 ? (
          filteredPdfs.map((pdf) => (
            <ListItem
              key={pdf.url}
              // Bỏ variant="text" và color="gray" để tùy chỉnh bằng Tailwind
              className="w-full text-left normal-case flex items-center justify-between py-2 mb-2 
                         bg-white rounded-lg shadow-sm cursor-pointer border border-gray-200
                         hover:bg-blue-50 hover:text-blue-700 transition duration-200 ease-in-out" // Hiệu ứng hover và bo tròn nhẹ
              onClick={() => onSelectPdf(pdf.url)}
            >
              <div className="flex items-center gap-3">
                <FaFilePdf className="text-gray-600 text-lg" /> {/* Icon PDF nổi bật */}
                <Typography variant="paragraph" color="blue-gray" className="font-medium">
                  {pdf.name}
                </Typography>
              </div>
              <FaChevronRight className="text-gray-400 text-sm" /> {/* Icon mũi tên chỉ dẫn */}
            </ListItem>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            <Typography variant="paragraph">Không tìm thấy tài liệu nào.</Typography>
          </div>
        )}
      </List>
    </div>
  );
}

export default PdfList;