import { useEffect, useRef } from 'react';
import PSPDFKit from '@nutrient-sdk/viewer';
import { convertDocxToPdf } from './utils';

// PDF Diff viewer driven by Nutrient API's
export const DocxDiffViewer = ({
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

  useEffect(() => {
    // Create a new div element
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.height = '100vh';

    if (containerRef.current) {
      // Append the new div to the DOM
      containerRef.current.appendChild(container);
    }

    const init = async () => {
      const documentABuffer = await convertDocxToPdf(diffDocs.doc1);
      const documentBBuffer = await convertDocxToPdf(diffDocs.doc2);

      try {
        await PSPDFKit.loadTextComparison({
          container,
          baseUrl: `${window.location.protocol}//${window.location.host}/${import.meta.env.BASE_URL}`,
          documentA: documentABuffer,
          documentB: documentBBuffer,
          comparisonSidebarConfig: {
            openByDefault: false,
            diffColors: {
              deletionColor: new PSPDFKit.Color({ r: 255, g: 192, b: 203 }),
              insertionColor: new PSPDFKit.Color({ r: 200, g: 255, b: 200 }),
            },
          },
        });
      } catch (error) {
        console.error('Error initializing document', error);
      }
    };

    init();

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      PSPDFKit && PSPDFKit.unload(container);

      // Remove the container element
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  // This div element will render the document to the DOM.
  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} className={className} />;
};
