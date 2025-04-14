import { useEffect, useRef } from 'react';
import PSPDFKit, { Instance } from '@nutrient-sdk/viewer';
import DEFAULT_ANNOTATION_JSON from './assets/instant_json_contents.json';

// const xfdfString2 = `<?xml version="1.0" encoding="UTF-8"?>
// <xfdf xml:space="preserve" xmlns="http://ns.adobe.com/xfdf/"><annots><link actiontype="URI" color="#000000" date="D:20241204170051Z" flags="print" name="dec3bd6b-8ca3-827f-6b4f-5afda99203a2" page="0" rect="92.000000,390.000000,175.000000,401.000000" subject="Annotation" target="https://products.office.com/en-us/word" width="0.000000"/>
// <link actiontype="URI" color="#000000" date="D:20241204165940Z" flags="print" name="ecbe5a00-3ded-6c4c-1e56-516991ef206d" page="0" rect="92.000000,390.000000,175.000000,401.000000" subject="Annotation" target="https://products.office.com/en-us/word" width="0.000000"/>
// <link actiontype="URI" color="#000000" date="D:20241204165845Z" flags="print" name="34d6da27-65dc-df8b-7005-5f291102c5ee" page="0" rect="92.000000,390.000000,175.000000,401.000000" subject="Annotation" target="https://products.office.com/en-us/word" width="0.000000"/>
// <highlight color="#FCEE7C" coords="253.806351,590.261536,537.533386,590.261536,253.806351,578.521790,537.533386,578.521790,57.141449,575.762207,362.515961,575.762207,57.141449,564.021973,362.515961,564.021973" creationdate="D:20250120114547Z" date="D:20250120114551Z" flags="print" name="01JJ1RGYZCRGSXRSS3RH8AMJ0A" page="0" pspdf-blend-mode="multiply" rect="57.141449,564.021973,537.533386,590.261536" title="" width="0.000000"><contents>PPPP</contents>
// <contents-richtext><p>PPPP</p></contents-richtext>
// </highlight>
// <text color="#FCED8C" creationdate="D:20250120114551Z" date="D:20250120114555Z" flags="print" icon="Note" page="0" rect="57.141449,564.021973,57.141449,564.021973" style="solid" title="" width="1.000000"><contents>LLLL</contents>
// <contents-richtext><p>LLLL</p></contents-richtext>
// </text>
// <popup creationdate="D:20250120114555Z" date="D:20250120114555Z" page="0" rect="57.141449,364.021973,257.141449,564.021973" style="solid" width="1.000000"/>
// </annots>
// <ids modified="F87C5FFB0A7C690A30FE52BCFCAE8941" original="F87C5FFB0A7C690A30FE52BCFCAE8941"/>
// </xfdf>`;

export const PDFViewer = ({
  document,
  header,
  setPdfViewerInstance,
  metaDataFormat,
  xfdfString,
}: {
  document: Blob;
  header: Blob;
  setPdfViewerInstance: (instance: Instance) => void;
  metaDataFormat: 'JSON' | 'STRING' | null;
  xfdfString: string | null;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  console.log(metaDataFormat);

  const toolbarItems = PSPDFKit.defaultToolbarItems
    // @ts-expect-error - PSPDFKit types are not up to date
    .concat({ type: 'comment' }) // Add comment tool.
    .filter((item) => item.type !== 'note'); // Remove note tool.

  console.log({ metaDataFormat });

  const loadMetaData = () => {
    if (metaDataFormat === 'JSON') {
      return {
        instantJSON: DEFAULT_ANNOTATION_JSON,
      };
    }

    if (metaDataFormat === 'STRING') {
      return {
        XFDF: xfdfString,
      };
    }

    return {};
  };

  useEffect(() => {
    const container = containerRef.current; // This `useRef` instance will render the PDF.

    if (!container) {
      console.error('Container not found');
      return;
    }

    const init = async () => {
      // PSPDFKit = await import("pspdfkit")

      PSPDFKit.unload(container); // Ensure that there's only one PSPDFKit instance.

      const documentBlobObjectUrl = URL.createObjectURL(document);

      // @ts-expect-error, @ts-expect-error -- PSPDFKit types are not up to date
      await PSPDFKit.load({
        // Container where PSPDFKit should be mounted.
        container,
        // The document to open.
        document: documentBlobObjectUrl,
        // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
        baseUrl: `${window.location.protocol}//${window.location.host}/${import.meta.env.BASE_URL}`,

        toolbarItems,

        ...loadMetaData(),

        // headless: true,
      }).then(async (instance) => {
        URL.revokeObjectURL(documentBlobObjectUrl);

        // const totalPages = instance.totalPageCount;

        // for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
        //   const pageInfo = instance.pageInfoForIndex(pageIndex);

        //   const headerAttachmentId = await instance.createAttachment(header);

        //   const headerAnnotation = new PSPDFKit.Annotations.ImageAnnotation({
        //     pageIndex: pageIndex,
        //     contentType: 'image/png', // Adjust this based on your image type
        //     imageAttachmentId: headerAttachmentId,
        //     boundingBox: new PSPDFKit.Geometry.Rect({
        //       left: pageInfo?.width - 250,
        //       top: 20,
        //       width: 200,
        //       height: 30, // Adjust the height as needed
        //     }),
        //   });

        //   const textAnnotation = new PSPDFKit.Annotations.TextAnnotation({
        //     pageIndex: 0,
        //     text: { format: 'plain', value: 'Welcome to\nPSPDFKit' },
        //     font: 'Helvetica',
        //     isBold: true,
        //     horizontalAlign: 'center',
        //     boundingBox: new PSPDFKit.Geometry.Rect({ left: 80, top: 200, width: 500, height: 200 }),
        //     fontColor: PSPDFKit.Color.RED,
        //   });

        //   await instance.create([headerAnnotation, textAnnotation]);
        // }

        setPdfViewerInstance(instance);
      });
    };

    init();

    return () => {
      if (PSPDFKit) {
        PSPDFKit.unload(container);
      }
    };
  }, [document, header, metaDataFormat, xfdfString]);

  // This div element will render the document to the DOM.
  return <div ref={containerRef} style={{ width: '100%', height: 'calc(100vh - 110px)' }} />;
};

// height: '100vh'
