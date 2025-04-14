import { ChangeEvent } from 'react';
import { buttonBaseStyle, labelBaseStyle } from './constants';

export const DocxActionPanel: React.FC<{
  activeTab: string;
  handleDocFileSelection: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleExportWithTemplate: () => Promise<void>;
  handleExportPdfWithImage: () => void; // stub
  handleLoadAndConvertToPDF: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
}> = ({ activeTab, handleDocFileSelection, handleExportWithTemplate, handleExportPdfWithImage, handleLoadAndConvertToPDF }) => {
  return (
    <>
      {/* Tab switching buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', border: '1px solid #bfbcbc' }}>{/*  */}</div>

      {/* DOCX Controls */}
      {activeTab === 'DOCX' && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px' }}>
          <label
            style={{
              ...labelBaseStyle,
              backgroundColor: '#007bff',
              color: '#fff',
              width: '100px',
            }}
          >
            Load Docx
            <input type='file' accept='.docx' style={{ display: 'none' }} onChange={handleDocFileSelection} />
          </label>

          <button
            style={{
              ...buttonBaseStyle,
              backgroundColor: '#c9d928',
              color: '#fff',
              width: '200px',
            }}
            onClick={handleExportWithTemplate}
          >
            View With Template
          </button>

          <button
            style={{
              ...buttonBaseStyle,
              backgroundColor: '#c99fff',
              color: '#fff',
              width: '200px',
            }}
            onClick={handleExportPdfWithImage}
          >
            Export PDF with image
          </button>

          <label
            style={{
              ...labelBaseStyle,
              backgroundColor: 'maroon',
              color: '#fff',
              width: '200px',
            }}
          >
            Load And Convert to PDF Doc
            <input type='file' accept='.docx' style={{ display: 'none' }} onChange={handleLoadAndConvertToPDF} />
          </label>
        </div>
      )}
    </>
  );
};
