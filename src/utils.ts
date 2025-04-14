import DocAuth from '@nutrient-sdk/document-authoring';

export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const convertDocxToPdf = async (doc: Blob) => {
  const docAuthSystem = await DocAuth.createDocAuthSystem();
  const loadedDoc = await docAuthSystem.importDOCX(doc);
  const convertedDoc = await loadedDoc.exportPDF();

  // Adding this as well since using array directly from exportPDF has not worked
  const convertedDocBlob = new Blob([convertedDoc], {
    type: 'application/pdf',
  });

  const convertedDocArrayBuffer = await blobToBase64(convertedDocBlob);

  return convertedDocArrayBuffer;
};
