import * as pdfjsLib from 'pdfjs-dist';

// Cấu hình worker cho pdf.js (Dùng CDN để tránh lỗi build của Next.js với Web Workers)
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export const convertPdfToImages = async (file: File): Promise<string[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  const images: string[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 }); // Tăng scale để ảnh rõ nét (giúp OCR tốt hơn)
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) throw new Error("Không thể tạo canvas context");

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    // @ts-ignore
    await page.render(renderContext).promise;
    
    // Nén nhẹ ảnh thành JPEG để giảm tải dung lượng gửi API
    const base64Image = canvas.toDataURL('image/jpeg', 0.8); 
    images.push(base64Image);
  }

  return images;
};
