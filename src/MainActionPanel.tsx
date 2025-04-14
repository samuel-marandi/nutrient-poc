import { tabButtonBaseStyle } from './constants';
export const MainActionPanel: React.FC<{
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<'PDF' | 'DOCX' | 'COMPARE_PDF' | 'COMPARE_DOCX'>>;
}> = ({ activeTab, setActiveTab }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', border: '1px solid #bfbcbc' }}>
      <button
        style={{
          ...tabButtonBaseStyle,
          backgroundColor: activeTab === 'PDF' ? '#bfbcbc' : '#fff',
        }}
        onClick={() => setActiveTab('PDF')}
      >
        PDF
      </button>
      <button
        style={{
          ...tabButtonBaseStyle,
          backgroundColor: activeTab === 'COMPARE_PDF' ? '#bfbcbc' : '#fff',
        }}
        onClick={() => setActiveTab('COMPARE_PDF')}
      >
        COMPARE PDF
      </button>
      <button
        style={{
          ...tabButtonBaseStyle,
          backgroundColor: activeTab === 'DOCX' ? '#bfbcbc' : '#fff',
        }}
        onClick={() => setActiveTab('DOCX')}
      >
        DOCX
      </button>
      <button
        style={{
          ...tabButtonBaseStyle,
          backgroundColor: activeTab === 'COMPARE_DOCX' ? '#bfbcbc' : '#fff',
        }}
        onClick={() => setActiveTab('COMPARE_DOCX')}
      >
        COMPARE DOCX
      </button>
    </div>
  );
};
