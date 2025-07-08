import React from 'react';
import { Select, Option } from "@material-tailwind/react";

function PdfDropdown({ pdfs, onSelectPdf }) {
  const handleChange = (value) => {
    if (value) {
      onSelectPdf(value);
    }
  };

  return (
    <Select
      label="Chọn tài liệu..."
      onChange={handleChange}
      animate={{
        mount: {
          y: 0
        },
        unmount: {
          y: 25
        },
      }}
    >
      {pdfs.map((pdf) => (
        <Option key={pdf.url} value={pdf.url}>
          {pdf.name}
        </Option>
      ))}
    </Select>
  );
}

export default PdfDropdown;
