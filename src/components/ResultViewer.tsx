import { useState, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Download } from 'lucide-react';

interface ResultViewerProps {
  content: string;
  outputMode: 'markdown' | 'html';
  inputTokens: number;
  outputTokens: number;
}

export default function ResultViewer({ content, outputMode, inputTokens, outputTokens }: ResultViewerProps) {
  const [rendered, setRendered] = useState<string>('');

  useEffect(() => {
    if (!content) {
      setRendered('');
      return;
    }

    const processContent = async () => {
      let html = '';
      if (outputMode === 'markdown') {
        html = await marked.parse(content);
      } else {
        html = content;
      }
      
      const cleanHtml = DOMPurify.sanitize(html, {
        ADD_TAGS: ['style'], // Cho phép the style de render CSS neu co
        FORCE_BODY: true,
        USE_PROFILES: { html: true, mathMl: true, svg: true }
      });
      setRendered(cleanHtml);
      
      // Trigger MathJax typeset sau khi render
      setTimeout(() => {
        if (typeof window !== 'undefined' && (window as any).MathJax && (window as any).MathJax.typesetPromise) {
          (window as any).MathJax.typesetPromise().catch((err: any) => console.error('MathJax error:', err));
        }
      }, 200);
    };

    processContent();
  }, [content, outputMode]);

  if (!content) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    alert('Đã copy nội dung gốc vào Clipboard!');
  };

  const downloadMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ket_qua_ocr.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden mt-6 print-expand">
      <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-800/50 print-hidden flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-slate-200">Kết quả ({outputMode.toUpperCase()})</h3>
        <div className="flex items-center gap-2 sm:gap-4 text-xs flex-wrap">
          <span className="text-slate-400 hidden sm:inline">Input: <span className="text-sky-400 font-mono">{inputTokens}</span> tokens</span>
          <span className="text-slate-400 hidden sm:inline">Output: <span className="text-emerald-400 font-mono">{outputTokens}</span> tokens</span>
          <button 
            onClick={copyToClipboard}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
          >
            Copy Raw
          </button>
          <button 
            onClick={downloadMarkdown}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded flex items-center gap-1 transition-colors shadow-sm"
          >
            <Download size={14} /> Tải .MD
          </button>
          <button 
            onClick={downloadPDF}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded flex items-center gap-1 transition-colors shadow-sm"
          >
            <Download size={14} /> In PDF
          </button>
        </div>
      </div>
      
      <div className="p-4 md:p-6 overflow-auto max-h-[70vh] print-expand bg-white text-slate-900 rounded-b-xl">
        <div 
          className={`max-w-none break-words custom-result-content ${outputMode === 'markdown' ? 'prose prose-slate' : ''}`}
          dangerouslySetInnerHTML={{ __html: rendered }}
        />
      </div>
    </div>
  );
}
