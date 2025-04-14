import { ChangeEvent } from 'react';
import { buttonBaseStyle, labelBaseStyle } from './constants';

export const PdfActionPanel: React.FC<{
  activeTab: string;
  handlePdfFileSelection: (event: ChangeEvent<HTMLInputElement>) => void;
  handleExportInstantJson: () => Promise<void>;
  handleConvertToDocX: () => Promise<void>;
  handleExportXFDF: () => Promise<void>;
  handleImportXFDF: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleImportComments: () => void;
}> = ({
  activeTab,
  handlePdfFileSelection,
  handleExportInstantJson,
  handleConvertToDocX,
  handleExportXFDF,
  handleImportXFDF,
  handleImportComments,
}) => {
  return (
    <>
      {/* Tab switching buttons */}

      {/* PDF Controls */}
      {activeTab === 'PDF' && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px' }}>
          <label
            style={{
              ...labelBaseStyle,
              backgroundColor: '#fc917a',
              color: '#fff',
              width: '100px',
            }}
          >
            Load PDF
            <input type='file' accept='.pdf,.docx' style={{ display: 'none' }} onChange={handlePdfFileSelection} />
          </label>

          <button
            style={{
              ...buttonBaseStyle,
              backgroundColor: '#82ad8c',
              color: '#fff',
            }}
            onClick={handleExportInstantJson}
          >
            Export Instant JSON
          </button>

          <button
            style={{
              ...buttonBaseStyle,
              backgroundColor: '#eaf74c',
            }}
            onClick={handleConvertToDocX}
          >
            Convert to Docx
          </button>

          <button
            style={{
              ...buttonBaseStyle,
              backgroundColor: '#25edd8',
            }}
            onClick={handleExportXFDF}
          >
            Export XFDF
          </button>

          <label
            style={{
              ...labelBaseStyle,
              backgroundColor: '#dbed25',
              width: '150px',
            }}
          >
            <input type='file' accept='.txt' style={{ display: 'none' }} onChange={handleImportXFDF} />
            Import XFDF
          </label>

          <button
            style={{
              ...buttonBaseStyle,
              backgroundColor: '#ce6bff',
              color: '#fff',
            }}
            onClick={handleImportComments}
          >
            Load Instant JSON
          </button>
        </div>
      )}
    </>
  );
};
