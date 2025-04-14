import { useEffect, useState, ChangeEvent } from 'react';
import DocxEditor from './DocxEditor';
import DocAuth, { DocAuthEditor } from '@nutrient-sdk/document-authoring';
import { Instance } from '@nutrient-sdk/viewer';
import { CompareViewer } from './CompareViewer';

import { PdfActionPanel } from './PdfActionPanel';
import { DocxActionPanel } from './DocxActionPanel';
import { CompareDocxViewer } from './CompareDocxViewer';
import { PDFViewerV2 } from './PDFViewerV2';
import { downloadBlob } from './utils';
import { MainActionPanel } from './MainActionPanel';

const App = () => {
  const [activeTab, setActiveTab] = useState<'PDF' | 'DOCX' | 'COMPARE_PDF' | 'COMPARE_DOCX'>('PDF');
  const [pdfFileBlob, setPdfFileBlob] = useState<Blob | null>(null);
  const [docFileBlob, setDocFileBlob] = useState<Blob | null>(null);
  const [docxEditorInstance, setDocxEditorInstance] = useState<DocAuthEditor | null>(null);
  const [pdfViewerInstance, setPdfViewerInstance] = useState<Instance | null>(null);
  const [logoBlob, setLogoBlob] = useState<Blob | null>(null);

  const [metaDataFormat, setMetaDataFormat] = useState<'JSON' | 'STRING' | null>(null);
  const [xfdfString, setXfdfString] = useState<string | null>(null);

  // =============== PDF TAB HANDLERS ===============
  const handlePdfFileSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFileBlob(file);
    }
  };

  const handleExportInstantJson = async () => {
    if (!pdfViewerInstance) return;
    const pdfInstantJson = await pdfViewerInstance.exportInstantJSON();

    // Convert to string, then to blob, then download
    const jsonString = JSON.stringify(pdfInstantJson);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadBlob(blob, 'instant_json_contents.json');
  };

  const handleConvertToDocX = async () => {
    if (!pdfViewerInstance) return;
    const docBuffer = await pdfViewerInstance.exportOffice({ format: 'docx' });

    if (docBuffer) {
      const blob = new Blob([docBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      downloadBlob(blob, 'converted_pdf.docx');
    }
  };

  const handleExportXFDF = async () => {
    if (!pdfViewerInstance) return;
    const pdfXfdf = await pdfViewerInstance.exportXFDF();
    if (pdfXfdf) {
      const blob = new Blob([pdfXfdf], { type: 'text/plain' });
      downloadBlob(blob, 'xfdf_contents.txt');
    }
  };

  const handleImportXFDF = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setXfdfString(text);
    };
    reader.readAsText(file);

    setMetaDataFormat('STRING');
  };

  const handleImportComments = () => {
    setMetaDataFormat('JSON');
    setXfdfString(null);
  };

  // =============== DOCX TAB HANDLERS ===============
  const handleDocFileSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    // console.log('handleDocFileSelection');
    const file = event.target.files?.[0];
    try {
      if (file && docxEditorInstance) {
        const docJson = await docxEditorInstance.docAuthSystem()?.importDOCX(file);
        if (docJson) {
          await docxEditorInstance.setCurrentDocument(docJson);
        }
        setDocFileBlob(file);
      }
    } catch (error) {
      console.error('Error loading DOCX file:', error);
    }
  };

  const handleExportWithTemplate = async () => {
    if (!docxEditorInstance) return;
    const currentDoc = await docxEditorInstance.currentDocument();
    if (!currentDoc) return;

    const pdfDoc = await currentDoc.exportPDF();
    if (pdfDoc) {
      const pdfBlob = new Blob([pdfDoc], { type: 'application/pdf' });
      setPdfFileBlob(pdfBlob);
      setActiveTab('PDF');
    }
  };

  // (Stubbed) - Implementation for PDF with image if needed
  const handleExportPdfWithImage = () => {
    // Add your logic for adding an image to PDF, etc.
  };

  const handleLoadAndConvertToPDF = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const docAuthSystem = await DocAuth.createDocAuthSystem();
    const docJson = await docAuthSystem.importDOCX(file);

    if (docJson) {
      const pdfArrayBuffer = await docJson.exportPDF();
      const pdfBlob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
      downloadBlob(pdfBlob, 'converted.pdf');
    }
  };

  // =============== LOGO LOADING ===============
  useEffect(() => {
    const loadLogoAsBlob = async () => {
      try {
        const response = await fetch('/coverself_logo.png');
        if (!response.ok) throw new Error('Network response was not ok.');
        let blob = await response.blob();
        blob = new Blob([blob], { type: 'image/png' });
        setLogoBlob(blob);
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    loadLogoAsBlob();
  }, []);

  return (
    <div style={{ border: '1px solid #bfbcbc' }}>
      {/* 
        We render the PDF action panel and the DOCX action panel, 
        but each checks the activeTab internally before showing content.
      */}
      <MainActionPanel activeTab={activeTab} setActiveTab={setActiveTab} />
      <PdfActionPanel
        activeTab={activeTab}
        handlePdfFileSelection={handlePdfFileSelection}
        handleExportInstantJson={handleExportInstantJson}
        handleConvertToDocX={handleConvertToDocX}
        handleExportXFDF={handleExportXFDF}
        handleImportXFDF={handleImportXFDF}
        handleImportComments={handleImportComments}
      />

      <DocxActionPanel
        activeTab={activeTab}
        handleDocFileSelection={handleDocFileSelection}
        handleExportWithTemplate={handleExportWithTemplate}
        handleExportPdfWithImage={handleExportPdfWithImage}
        handleLoadAndConvertToPDF={handleLoadAndConvertToPDF}
      />

      {/* 
        Render the viewers/editors based on which tab is active and what file blob is loaded.
      */}
      {activeTab === 'PDF' && pdfFileBlob && logoBlob && (
        <PDFViewerV2
          document={pdfFileBlob}
          header={logoBlob}
          setPdfViewerInstance={setPdfViewerInstance}
          metaDataFormat={metaDataFormat}
          xfdfString={xfdfString}
        />
      )}
      {activeTab === 'DOCX' && <DocxEditor docSrc={docFileBlob as Blob} setNutrientDocEditorInstance={setDocxEditorInstance} />}
      {activeTab === 'COMPARE_PDF' && <CompareViewer />}
      {activeTab === 'COMPARE_DOCX' && <CompareDocxViewer />}
    </div>
  );
};

export default App;
// Utility function to handle downloading a Blob
