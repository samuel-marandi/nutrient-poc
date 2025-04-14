import { useEffect, useRef } from 'react';
import DocAuth, { DocAuthSystem, BlobInput, DocAuthEditor } from '@nutrient-sdk/document-authoring';

const DocxEditor = ({
  docSrc,
  setNutrientDocEditorInstance,
}: {
  docSrc: string | File | ArrayBuffer | Blob | BlobInput;
  setNutrientDocEditorInstance: (instance: DocAuthEditor) => void;
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let docAuthSystem: DocAuthSystem | null = null;

    const initializeEditor = async () => {
      if (!editorRef.current) return;

      try {
        // Initialize the DocAuth system
        docAuthSystem = await DocAuth.createDocAuthSystem();

        // Create a new document
        const document = await docAuthSystem.createDocumentFromPlaintext('');

        // Create the editor and attach it to the DOM element
        const editorInstance = await docAuthSystem.createEditor(editorRef.current as HTMLElement, { document });

        setNutrientDocEditorInstance(editorInstance);

        if (docSrc) {
          // Convert the Docx File to Doc Json
          const docJson = await docAuthSystem?.importDOCX(docSrc as BlobInput);

          // Load it in the current document
          await editorInstance?.setCurrentDocument(docJson);
        }

        // setDocumentEditorInstance(editorInstance);
      } catch (error) {
        console.error('Error initializing the document editor:', error);
      }
    };

    initializeEditor();

    // Cleanup function to dispose of resources when the component unmounts
    return () => {
      if (docAuthSystem) {
        docAuthSystem.destroy();
      }
    };
  }, [docSrc, setNutrientDocEditorInstance]);

  return (
    <div
      id='editor'
      ref={editorRef}
      style={{
        height: 'calc(100vh - 110px)',
        width: '100%',
        position: 'relative',
      }}
    />
  );
};

export default DocxEditor;
