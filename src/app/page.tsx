"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SettingsModal from '@/components/SettingsModal';
import FileUploader from '@/components/FileUploader';
import ResultViewer from '@/components/ResultViewer';
import { fileToBase64 } from '@/utils/file-helpers';
import { processDocumentWithOpenRouter, OcrResult } from '@/utils/openrouter';
import { OutputMode } from '@/utils/prompts';
import { Loader2 } from 'lucide-react';

import { convertPdfToImages } from '@/utils/pdf-to-images';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('google/gemini-3.5-flash');
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputMode, setOutputMode] = useState<OutputMode>('markdown');
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<OcrResult | null>(null);

  // Load settings from local storage
  useEffect(() => {
    const savedKey = localStorage.getItem('openrouter_key');
    const savedModel = localStorage.getItem('openrouter_model');
    if (savedKey) setApiKey(savedKey);
    if (savedModel) setModel(savedModel);
  }, []);

  // Save settings to local storage when they change
  const handleSaveSettings = (newKey: string, newModel: string) => {
    setApiKey(newKey);
    setModel(newModel);
    
    if (newKey) {
      localStorage.setItem('openrouter_key', newKey);
    } else {
      localStorage.removeItem('openrouter_key');
    }
    
    localStorage.setItem('openrouter_model', newModel);
  };

  const handleProcess = async () => {
    if (!apiKey) {
      setError('Vui lòng cấu hình OpenRouter API Key trước khi thực hiện.');
      setIsSettingsOpen(true);
      return;
    }

    if (!selectedFile) {
      setError('Vui lòng chọn hoặc kéo thả một tệp tài liệu.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setResult(null);

    try {
      let fileDataUris: string[] = [];
      
      if (selectedFile.type === 'application/pdf') {
        fileDataUris = await convertPdfToImages(selectedFile);
      } else {
        const base64DataUri = await fileToBase64(selectedFile);
        fileDataUris = [base64DataUri];
      }

      // 2. Gọi OpenRouter API
      const output = await processDocumentWithOpenRouter(apiKey, model, fileDataUris, outputMode, additionalPrompt);

      setResult(output);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi gọi API.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearKey = () => {
    setApiKey('');
    localStorage.removeItem('openrouter_key');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="print-hidden">
        <Header 
          hasApiKey={!!apiKey} 
          onOpenSettings={() => setIsSettingsOpen(true)} 
          onClearKey={handleClearKey}
        />
      </div>

      <div className="print-hidden">
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)}
          apiKey={apiKey}
          model={model}
          onSave={handleSaveSettings}
        />
      </div>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Khu vực thông báo lỗi */}
        {error && (
          <div className="print-hidden mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="print-hidden bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-6 shadow-xl mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Trích xuất văn bản & Bố cục</h2>
          
          <FileUploader 
            selectedFile={selectedFile} 
            onFileSelect={setSelectedFile} 
          />

          <div className="mt-6 border-t border-slate-800 pt-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Chỉ thị bổ sung (Tùy chọn):
            </label>
            <textarea
              value={additionalPrompt}
              onChange={(e) => setAdditionalPrompt(e.target.value)}
              placeholder="VD: Bỏ qua ghi chú bằng bút đỏ, dịch toàn bộ sang tiếng Anh, trình bày dưới dạng bảng 2 cột..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 min-h-[80px] resize-y"
            />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-6">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-sm font-medium text-slate-400">Kiểu xuất:</span>
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setOutputMode('html')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${outputMode === 'html' ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Bảo toàn (HTML)
                </button>
                <button
                  onClick={() => setOutputMode('markdown')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${outputMode === 'markdown' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Tối giản (Markdown)
                </button>
              </div>
            </div>

            <button
              onClick={handleProcess}
              disabled={isProcessing || !selectedFile}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
            >
              {isProcessing ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Đang xử lý...
                  </div>
                </div>
              ) : (
                'Bắt đầu OCR'
              )}
            </button>
          </div>
          
          {isProcessing && (
             <div className="mt-4 text-center text-xs text-slate-500 animate-pulse print-hidden">
               Quá trình này có thể mất từ 15-60 giây tùy thuộc vào độ dài của tài liệu...
             </div>
          )}
        </div>

        {/* Khu vực hiển thị kết quả */}
        {result && (
          <ResultViewer 
            content={result.content} 
            outputMode={outputMode}
            inputTokens={result.inputTokens}
            outputTokens={result.outputTokens}
          />
        )}
      </main>
    </div>
  );
}
