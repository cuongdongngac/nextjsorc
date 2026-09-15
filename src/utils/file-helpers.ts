export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Trả về full data URI hoặc chỉ base64? 
      // OpenRouter / OpenAI hỗ trợ URL định dạng `data:image/jpeg;base64,...` hoặc `data:application/pdf;base64,...`
      // Chúng ta sẽ giữ nguyên `data:mime/type;base64,...`
      resolve(result);
    };
    reader.onerror = (error) => reject(error);
  });
};
