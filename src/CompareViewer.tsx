import { ChangeEvent, useState } from 'react';
import { labelBaseStyle } from './constants';
import { DiffViewerV2 } from './DiffViewerV2';

export const CompareViewer = () => {
  const [pdfFileBlob1, setPdfFileBlob1] = useState<Blob | null>(null);
  const [pdfFileBlob2, setPdfFileBlob2] = useState<Blob | null>(null);

  const handlePdfFileSelection1 = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFileBlob1(file);
    }
  };

  const handlePdfFileSelection2 = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFileBlob2(file);
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
          Load PDF 1
          <input type='file' accept='.pdf' style={{ display: 'none' }} onChange={handlePdfFileSelection1} />
        </label>
        <label
          style={{
            ...labelBaseStyle,
            backgroundColor: '#5e2d96',
            color: '#fff',
            width: '100px',
          }}
        >
          Load PDF 2
          <input type='file' accept='.pdf' style={{ display: 'none' }} onChange={handlePdfFileSelection2} />
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
        {pdfFileBlob1 && <div>PDF 1: {pdfFileBlob1?.name}</div>}
        {pdfFileBlob2 && <div>PDF 2: {pdfFileBlob2?.name}</div>}
      </div>
      {pdfFileBlob1 && pdfFileBlob2 && <DiffViewerV2 diffDocs={{ doc1: pdfFileBlob1, doc2: pdfFileBlob2 }} />}
    </div>
  );
};
