import { ChangeEvent, useState } from 'react';
import { labelBaseStyle } from './constants';
import { DocxDiffViewer } from './DocxDiffViewer';

export const CompareDocxViewer = () => {
  const [docxFileBlob1, setDocxFileBlob1] = useState<Blob | null>(null);
  const [docxFileBlob2, setDocxFileBlob2] = useState<Blob | null>(null);

  const handlePdfFileSelection1 = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDocxFileBlob1(file);
    }
  };

  const handlePdfFileSelection2 = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDocxFileBlob2(file);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <label
          style={{
            ...labelBaseStyle,
            backgroundColor: '#fc917a',
            color: '#fff',
            width: '100px',
          }}
        >
          Load DOCX 1
          <input type='file' accept='.docx' style={{ display: 'none' }} onChange={handlePdfFileSelection1} />
        </label>
        <label
          style={{
            ...labelBaseStyle,
            backgroundColor: '#5e2d96',
            color: '#fff',
            width: '100px',
          }}
        >
          Load DOCX 2
          <input type='file' accept='.docx' style={{ display: 'none' }} onChange={handlePdfFileSelection2} />
        </label>
      </div>

      <div
        style={{
          border: '1px solid #bfbcbc',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {docxFileBlob1 && <div>PDF 1: {docxFileBlob1?.name}</div>}
        {docxFileBlob2 && <div>PDF 2: {docxFileBlob2?.name}</div>}
      </div>
      {docxFileBlob1 && docxFileBlob2 && <DocxDiffViewer diffDocs={{ doc1: docxFileBlob1, doc2: docxFileBlob2 }} />}
    </div>
  );
};
