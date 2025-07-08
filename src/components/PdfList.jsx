import React, { useState } from 'react';
import { Input, Button } from "@material-tailwind/react";

function PdfList({ pdfs, onSelectPdf }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPdfs = pdfs.filter(pdf =>
    pdf.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Input
        type="text"
        label="Search by name..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div>
        {filteredPdfs.map((pdf) => (
          <Button
            key={pdf.url}
            variant="text"
            color="gray"
            className="w-full text-left normal-case rounded-none"
            onClick={() => onSelectPdf(pdf.url)}
          >
            {pdf.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default PdfList;
