import { useEffect, useRef } from 'react';
import PSPDFKit, { Instance } from '@nutrient-sdk/viewer';

export const PDFViewerV2 = ({
  document,
  setPdfViewerInstance,
}: {
  document: Blob;
  header: Blob;
  setPdfViewerInstance: (instance: Instance) => void;
  metaDataFormat?: 'JSON' | 'STRING' | null;
  xfdfString?: string | null;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const toolbarItems = PSPDFKit.defaultToolbarItems
    // @ts-expect-error - PSPDFKit types are not up to date
    .concat({ type: 'comment' }) // Add comment tool.
    .filter((item) => item.type !== 'note'); // Remove note tool.

  useEffect(() => {
    const container = containerRef.current;
    let cleanup = () => {};

    const initializeViewer = async () => {
      const NutrientViewer = (await import('@nutrient-sdk/viewer')).default;

      // Ensure there's only one NutrientViewer instance.
      NutrientViewer.unload(container);

      if (container && NutrientViewer && document.type === 'application/pdf') {
        // Convert document Blob to ArrayBuffer.
        const arrayBuffer = await document.arrayBuffer();
        NutrientViewer.load({
          container,
          document: arrayBuffer,
          // Base URL tells the SDK where to load the assets from.
          baseUrl: `${window.location.protocol}//${window.location.host}/${import.meta.env.PUBLIC_URL ?? ''}`,
        }).then((instance) => {
          setPdfViewerInstance(instance);
          instance.setToolbarItems(toolbarItems);
        });
      }

      if (container && NutrientViewer && document.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await document.arrayBuffer();
        NutrientViewer.convertToPDF({
          container,
          document: arrayBuffer,
          // Passing license key generates the error,
          // licenseKey: '',
          baseUrl: `${window.location.protocol}//${window.location.host}/${import.meta.env.PUBLIC_URL ?? ''}`,
        }).then((arrayBuffer) => {
          console.log('PDF', arrayBuffer);
          NutrientViewer.load({
            container,
            document: arrayBuffer,
            baseUrl: `${window.location.protocol}//${window.location.host}/${import.meta.env.PUBLIC_URL ?? ''}`,
          });
        });
      }

      // Set up cleanup to unload the viewer when the component unmounts.
      cleanup = () => {
        NutrientViewer.unload(container);
      };
    };

    initializeViewer();

    return cleanup;
  }, [document, setPdfViewerInstance, toolbarItems]);

  return <div ref={containerRef} style={{ width: '100%', height: 'calc(100vh - 110px)' }} />;
};
