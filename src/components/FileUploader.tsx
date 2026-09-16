import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export default function FileUploader({ onFileSelect, selectedFile }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSelect(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const validateAndSelect = (file: File) => {
    if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
      onFileSelect(file);
    } else {
      alert('Vui lòng chọn định dạng PDF hoặc ảnh (JPG, PNG).');
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
        isDragging ? 'border-sky-500 bg-sky-500/10' : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800'
      }`}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="application/pdf,image/png,image/jpeg,image/webp" 
        className="hidden" 
      />
      
      {selectedFile ? (
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-sky-500/20 rounded-full text-sky-400 relative">
            <FileIcon size={32} />
            <button 
              onClick={clearFile}
              className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600"
            >
              <X size={14} />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">{selectedFile.name}</p>
            <p className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-3 text-slate-400">
          <UploadCloud size={48} className="text-slate-500 mb-2" />
          <p className="text-sm font-medium text-slate-300">Nhấn hoặc kéo thả tài liệu vào đây</p>
          <p className="text-xs">Hỗ trợ định dạng: PDF, JPG, PNG (nên dùng bản đã cắt sẵn phần cần thiết).</p>
        </div>
      )}
    </div>
  );
}
