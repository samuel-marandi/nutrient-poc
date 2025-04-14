import { useEffect, useRef } from 'react';
import PSPDFKit from '@nutrient-sdk/viewer';

// PDF Diff viewer driven by Nutrient API's
export const DiffViewer = ({
  className,
  diffDocs,
}: {
  className?: string;
  diffDocs: {
    doc1: Blob;
    doc2: Blob;
  };
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // const convertDocxToPdf = async (doc: Blob) => {
  //   const docAuthSystem = await DocAuth.createDocAuthSystem();
  //   const loadedDoc = await docAuthSystem.importDOCX(doc);
  //   const covertedDoc = await loadedDoc.exportPDF();
  //   return covertedDoc;
  // };

  useEffect(() => {
    const container = containerRef.current; // This `useRef` instance will render the PDF.

    if (!container) {
      console.error('Container not found');
      return;
    }

    const init = async () => {
      // const documentA = await convertDocxToPdf(diffDocs.doc1);
      // const documentB = await convertDocxToPdf(diffDocs.doc2);
      const docA = new Uint8Array(await diffDocs.doc1.arrayBuffer()).buffer;
      const docB = new Uint8Array(await diffDocs.doc2.arrayBuffer()).buffer;

      PSPDFKit.unload(container); // Ensure that there's only one PSPDFKit instance.

      if (!docA || !docB) return;

      // const originalDocument = new PSPDFKit.DocumentDescriptor({
      //   filePath: docA, // Your ArrayBuffer for the first document
      //   pageIndexes: [0], // Specify which pages to compare
      // });

      // const changedDocument = new PSPDFKit.DocumentDescriptor({
      //   filePath: docB, // Your ArrayBuffer for the second document
      //   pageIndexes: [0], // Specify which pages to compare
      // });

      const blobToBase64 = (blob: Blob): Promise<string> =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

      const docABase64 = await blobToBase64(diffDocs.doc1);
      const docBBase64 = await blobToBase64(diffDocs.doc2);
      try {
        await PSPDFKit.loadTextComparison({
          container,
          baseUrl: `${window.location.protocol}//${window.location.host}/${import.meta.env.BASE_URL}`,
          documentA: docABase64,
          documentB: docBBase64,
          // comparisonSidebarConfig: {
          // diffColors: {
          //   deletionColor: new PSPDFKit.Color({ r: 255, g: 218, b: 185 }),
          //   insertionColor: new PSPDFKit.Color({ r: 200, g: 255, b: 200 }),
          // },
          // },
        });
      } catch (e) {
        console.error('Error at init', e);
      }
    };

    init();

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      PSPDFKit && PSPDFKit.unload(container);
    };
  }, [diffDocs.doc1, diffDocs.doc2]);

  // This div element will render the document to the DOM.
  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} className={className} />;
};

// PSPDFKit.load({
//   container: "#pspdfkit",
//   document: "source.docx",
//   headless: true,
//   licenseKey: "YOUR_LICENSE_KEY"
// }).then((instance) => {
//   instance.exportPDF()
//     .then(function (buffer) {
//       const blob = new Blob([buffer], { type: "application/pdf" });
//       const objectUrl = window.URL.createObjectURL(blob);
//       downloadPdf(objectUrl);
//       window.URL.revokeObjectURL(objectUrl);
//     });
// });

// function downloadPdf(blob) {
//   const a = document.createElement("a");
//   a.href = blob;
//   a.style.display = "none";
//   a.download = "output.pdf";
//   a.setAttribute("download", "output.pdf");
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
// }

// instance.exportPDF({
//   outputFormat: {
//     conformance: PSPDFKit.Conformance.PDFA_4F
//   }
// })
